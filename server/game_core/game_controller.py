import asyncio
from uuid import uuid4

from fastapi import WebSocket
from pydantic import BaseModel, ValidationError

from .models.game_models import RoomModel
from .models.request_schemas import (
    REQUEST_TYPE_MESSAGE_MAP,
    RequestMessage,
    RequestType,
)
from .models.response_schemas import (
    ErrorResponse,
    ResponseType,
    RoomCreatedResponse,
    RoomJoinedResponse,
    RoomUpdatedNotification,
)
from .redis_manager import RedisManager


class GameController:
    websocket: WebSocket
    redis_manager: RedisManager
    _room: RoomModel | None
    player_id: str

    def __init__(self, websocket: WebSocket):
        self.websocket = websocket
        self.redis_manager = RedisManager()
        self.player_id = str(uuid4())
        self._room = None

    @property
    def room(self) -> RoomModel:
        if self._room is None:
            raise AttributeError('Room has not been initialized yet')
        return self._room

    @room.setter
    def room(self, value: RoomModel):
        self._room = value

    async def send_json(self, model: BaseModel):
        await self.websocket.send_json(model.model_dump())

    async def receive_message(self) -> RequestMessage:
        while True:
            req = await self.websocket.receive_json()
            result = await self._validate_request(req)
            if result is not None:
                return result

    async def _validate_request(self, req) -> RequestMessage | None:
        validated_request = None
        try:
            schema = REQUEST_TYPE_MESSAGE_MAP.get(RequestType(req.get('type')))
        except ValidationError:
            await self.send_json(
                ErrorResponse(
                    type=ResponseType.ERROR,
                    error='Invalid request type',
                )
            )
            return None

        if schema is None:
            await self.send_json(
                ErrorResponse(
                    type=ResponseType.ERROR,
                    error='Invalid request payload',
                )
            )
            return None

        validated_request = schema(**req)
        return validated_request

    async def create_room(self, host_player_name: str):
        room = await self.redis_manager.create_room(self.player_id, host_player_name)
        self.room = room
        asyncio.create_task(
            self.redis_manager.subscribe_to_room_events(room.code, self.on_room_update)
        )

    async def join_room(self, room_code: str, player_name: str) -> bool:
        room = await self.redis_manager.add_player_to_room(
            room_code, self.player_id, player_name
        )
        if not room:
            return False
        self.room = room
        asyncio.create_task(
            self.redis_manager.subscribe_to_room_events(room.code, self.on_room_update)
        )
        return True

    async def on_room_update(self, room: RoomModel | None) -> None:
        if room is None:
            # TODO: Handle room deletion
            return
        self.room = room
        await self.send_json(
            RoomUpdatedNotification(
                room=self.room,
            )
        )

    async def run(self):
        while self._room is None:
            req_message = await self.receive_message()

            if req_message.type == RequestType.CREATE_ROOM:
                await self.create_room(req_message.player_name)
                await self.send_json(
                    RoomCreatedResponse(
                        room=self.room,
                    )
                )

            elif req_message.type == RequestType.JOIN_ROOM:
                success = await self.join_room(
                    req_message.room_id,
                    req_message.player_name,
                )
                if not success:
                    await self.send_json(
                        ErrorResponse(
                            error='Room not found',
                        )
                    )
                else:
                    await self.send_json(
                        RoomJoinedResponse(
                            room=self.room,
                        )
                    )

            else:
                await self.send_json(
                    ErrorResponse(
                        error='No room joined yet',
                    )
                )
        while True:
            # Keep the connection alive
            await asyncio.sleep(10)
