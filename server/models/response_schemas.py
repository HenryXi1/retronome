from enum import Enum
from typing import Literal, Union

from pydantic import BaseModel

from models.types import PlayerId

from .room_model import RoomModel


class ResponseType(str, Enum):
    ROOM_CREATED = 'room_created'
    ROOM_JOINED = 'room_joined'
    ROOM_UPDATED = 'room_updated'
    ROOM_LEFT = 'room_left'
    GAME_STARTED = 'game_started'
    GAME_ROUND = 'game_round'
    GAME_SUMMARY = 'game_summary'
    ERROR = 'error'


class RoomCreatedResponse(BaseModel):
    type: Literal[ResponseType.ROOM_CREATED] = ResponseType.ROOM_CREATED
    room: RoomModel


class RoomJoinedResponse(BaseModel):
    type: Literal[ResponseType.ROOM_JOINED] = ResponseType.ROOM_JOINED
    room: RoomModel


class RoomUpdatedNotification(BaseModel):
    type: Literal[ResponseType.ROOM_UPDATED] = ResponseType.ROOM_UPDATED
    room: RoomModel


class RoomLeftResponse(BaseModel):
    type: Literal[ResponseType.ROOM_LEFT] = ResponseType.ROOM_LEFT


class GameStartedResponse(BaseModel):
    type: Literal[ResponseType.GAME_STARTED] = ResponseType.GAME_STARTED


class GameRoundNotification(BaseModel):
    type: Literal[ResponseType.GAME_ROUND] = ResponseType.GAME_ROUND
    round_number: int
    audio: str | None  # base64-encoded bytes


class GameSummaryNotification(BaseModel):
    type: Literal[ResponseType.GAME_SUMMARY] = ResponseType.GAME_SUMMARY

    # 2d array of (player_id, original_file, reversed_file),
    # outer array is by starting player, inner array is by round
    files: list[list[tuple[PlayerId, str, str]]]


class ErrorResponse(BaseModel):
    type: Literal[ResponseType.ERROR] = ResponseType.ERROR
    error: str


ResponseMessage = Union[
    RoomCreatedResponse,
    RoomJoinedResponse,
    RoomUpdatedNotification,
    RoomLeftResponse,
    GameStartedResponse,
    GameRoundNotification,
    GameSummaryNotification,
    ErrorResponse,
]
