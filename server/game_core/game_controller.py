import secrets
import string
from uuid import uuid4

from fastapi import WebSocket
from pydantic import BaseModel, ValidationError
from redis import Redis

from clients.redis_client import get_redis_client

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
)


class GameController:
    websocket: WebSocket
    redis_client: Redis
    _room: RoomModel | None
    player_id: str

    def __init__(self, websocket: WebSocket, redis_client=None):
        self.websocket = websocket
        self.redis_client = redis_client or get_redis_client()
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

    def create_room(self, host_player_name: str):
        # Generate four letter room code
        letters = string.ascii_uppercase
        random_code = ''.join(secrets.choice(letters) for _ in range(4))

        # Check if room code already exists in Redis
        while self.redis_client.exists(f'room:{random_code}'):
            random_code = ''.join(secrets.choice(letters) for _ in range(4))

        self.room = RoomModel(
            code=random_code,
            players={self.player_id: host_player_name},
            host_id=self.player_id,
        )
        self.redis_client.set(
            f'room:{self.room.code}',
            self.room.model_dump_json(),
        )

    async def join_room(self, room_code: str, player_name: str) -> bool:
        room_data = await self.redis_client.get(f'room:{room_code}')
        if not room_data:
            return False

        room_json = room_data.decode('utf-8')
        try:
            room_dict = RoomModel.model_validate_json(room_json)
        except ValidationError:
            return False
        room_dict.players[self.player_id] = player_name
        self.room = room_dict
        self.redis_client.set(
            f'room:{self.room.code}',
            self.room.model_dump_json(),
        )
        return True

    async def run(self):
        while self._room is None:
            req_message = await self.receive_message()

            if req_message.type == RequestType.CREATE_ROOM:
                self.create_room(req_message.player_name)
                await self.send_json(
                    RoomCreatedResponse(
                        room=self.room,
                    )
                )

            elif req_message.type == RequestType.JOIN_ROOM:
                success = self.join_room(
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
