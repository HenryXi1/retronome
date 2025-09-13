import secrets
import string
from uuid import uuid4

from fastapi import WebSocket
from pydantic import ValidationError
from redis import Redis

from clients.redis_client import get_redis_client
from game_core.game_models import RoomModel
from game_core.message_schemas import (
    REQUEST_TYPE_MAP,
    ErrorResponse,
    MessageType,
    RequestMessage,
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

    async def receive_message(self) -> RequestMessage:
        validated_input = None
        while validated_input is None:
            req = await self.websocket.receive_json()
            msg_type = req.get('type')
            if msg_type not in MessageType._value2member_map_:
                await self.websocket.send_json(
                    ErrorResponse(error='Unknown message type')
                )
                continue

            schema = REQUEST_TYPE_MAP.get(msg_type)
            if schema is None:
                await self.websocket.send_json(
                    ErrorResponse(error='Invalid request type')
                )
                continue

            try:
                validated_input = schema(**req)
            except ValidationError:
                await self.websocket.send_json(
                    ErrorResponse(error='Invalid request format')
                )
                continue

        return validated_input

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
            req = await self.receive_message()

            if req.type == MessageType.CREATE_ROOM:
                self.create_room(req.player_name)
                await self.websocket.send_json(
                    {
                        'type': MessageType.ROOM_CREATED,
                        'room': self.room,
                    }
                )
            elif req.type == MessageType.JOIN_ROOM:
                success = await self.join_room(req.room_id, req.player_name)
                if not success:
                    await self.websocket.send_json(
                        ErrorResponse(error='Room not found')
                    )
                else:
                    await self.websocket.send_json(
                        {
                            'type': MessageType.ROOM_JOINED,
                            'room': self.room,
                        }
                    )
