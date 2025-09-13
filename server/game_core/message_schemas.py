from enum import Enum
from typing import Literal, Union

from pydantic import BaseModel

from .game_models import RoomModel


class MessageType(str, Enum):
    CREATE_ROOM = 'create_room'
    ROOM_CREATED = 'room_created'
    JOIN_ROOM = 'join_room'
    ROOM_JOINED = 'room_joined'
    ROOM_UPDATE = 'room_update'
    START_GAME = 'start_game'
    GAME_STARTED = 'game_started'
    ERROR = 'error'


PlayerId = str
PlayerName = str
RoomID = str


class ErrorResponse(BaseModel):
    """Standard error response schema."""

    type: Literal[MessageType.ERROR] = MessageType.ERROR
    error: str


class CreateRoomRequest(BaseModel):
    """Request for creating a new room."""

    type: Literal[MessageType.CREATE_ROOM] = MessageType.CREATE_ROOM

    # Name of the player creating the room
    player_name: PlayerName


class CreateRoomResponse(BaseModel):
    """Response sent after creating a new room."""

    type: Literal[MessageType.ROOM_CREATED] = MessageType.ROOM_CREATED

    room: RoomModel


class JoinRoomRequest(BaseModel):
    """Request for joining an existing room."""

    type: Literal[MessageType.JOIN_ROOM] = MessageType.JOIN_ROOM

    # ID of the room to join
    room_id: RoomID
    # Name of the player joining the room
    player_name: PlayerName


class JoinRoomResponse(BaseModel):
    """Response sent after joining a room."""

    type: Literal[MessageType.ROOM_JOINED] = MessageType.ROOM_JOINED

    room: RoomModel


class RoomUpdateNotification(BaseModel):
    """Message sent when there is an update on the room."""

    type: Literal[MessageType.ROOM_UPDATE] = MessageType.ROOM_UPDATE

    room: RoomModel


class StartGameRequest(BaseModel):
    """Request to start the game."""

    type: Literal[MessageType.START_GAME] = MessageType.START_GAME


class StartGameResponse(BaseModel):
    """Response sent after starting the game."""

    type: Literal[MessageType.GAME_STARTED] = MessageType.GAME_STARTED


RequestMessage = Union[
    CreateRoomRequest,
    JoinRoomRequest,
    StartGameRequest,
]

ResponseMessage = Union[
    ErrorResponse,
    CreateRoomResponse,
    JoinRoomResponse,
    RoomUpdateNotification,
    StartGameResponse,
]

REQUEST_TYPE_MAP: dict[MessageType, type[RequestMessage]] = {
    MessageType.CREATE_ROOM: CreateRoomRequest,
    MessageType.JOIN_ROOM: JoinRoomRequest,
    MessageType.START_GAME: StartGameRequest,
}
