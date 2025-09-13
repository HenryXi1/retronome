from enum import Enum
from typing import Literal, Union

from pydantic import BaseModel

from .types import PlayerName, RoomId


class RequestType(str, Enum):
    CREATE_ROOM = 'create_room'
    JOIN_ROOM = 'join_room'
    START_GAME = 'start_game'


class CreateRoomRequestMessage(BaseModel):
    type: Literal[RequestType.CREATE_ROOM]
    player_name: PlayerName


class JoinRoomRequestMessage(BaseModel):
    type: Literal[RequestType.JOIN_ROOM]
    room_id: RoomId
    player_name: PlayerName


class StartGameRequestMessage(BaseModel):
    type: Literal[RequestType.START_GAME]


RequestMessage = Union[
    CreateRoomRequestMessage,
    JoinRoomRequestMessage,
    StartGameRequestMessage,
]

REQUEST_TYPE_MESSAGE_MAP: dict[RequestType, type[RequestMessage]] = {
    RequestType.CREATE_ROOM: CreateRoomRequestMessage,
    RequestType.JOIN_ROOM: JoinRoomRequestMessage,
    RequestType.START_GAME: StartGameRequestMessage,
}
