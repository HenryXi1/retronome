from enum import Enum
from typing import Literal, Union

from pydantic import BaseModel

from .game_models import RoomModel


class ResponseType(str, Enum):
    ROOM_CREATED = 'room_created'
    ROOM_JOINED = 'room_joined'
    ROOM_UPDATE = 'room_update'
    GAME_STARTED = 'game_started'
    ERROR = 'error'


class RoomCreatedResponse(BaseModel):
    type: Literal[ResponseType.ROOM_CREATED] = ResponseType.ROOM_CREATED
    room: RoomModel


class RoomJoinedResponse(BaseModel):
    type: Literal[ResponseType.ROOM_JOINED] = ResponseType.ROOM_JOINED
    room: RoomModel


class RoomUpdateResponse(BaseModel):
    type: Literal[ResponseType.ROOM_UPDATE] = ResponseType.ROOM_UPDATE
    room: RoomModel


class GameStartedResponse(BaseModel):
    type: Literal[ResponseType.GAME_STARTED] = ResponseType.GAME_STARTED


class ErrorResponse(BaseModel):
    type: Literal[ResponseType.ERROR] = ResponseType.ERROR
    error: str


ResponseMessage = Union[
    RoomCreatedResponse,
    RoomJoinedResponse,
    RoomUpdateResponse,
    GameStartedResponse,
    ErrorResponse,
]
