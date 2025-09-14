from enum import Enum
from typing import Literal, Union

from pydantic import BaseModel

from .types import B64Data, PlayerName, RoomId


class RequestType(str, Enum):
    CREATE_ROOM = 'create_room'
    JOIN_ROOM = 'join_room'
    LEAVE_ROOM = 'leave_room'
    START_GAME = 'start_game'
    UPLOAD_FILE = 'upload_file'


class CreateRoomRequest(BaseModel):
    type: Literal[RequestType.CREATE_ROOM]
    player_name: PlayerName


class JoinRoomRequest(BaseModel):
    type: Literal[RequestType.JOIN_ROOM]
    room_id: RoomId
    player_name: PlayerName


class LeaveRoomRequest(BaseModel):
    type: Literal[RequestType.LEAVE_ROOM]


class StartGameRequest(BaseModel):
    type: Literal[RequestType.START_GAME]


class UploadFileRequest(BaseModel):
    type: Literal[RequestType.UPLOAD_FILE]
    file_data: B64Data
    round_number: int


RequestMessage = Union[
    CreateRoomRequest,
    JoinRoomRequest,
    StartGameRequest,
    UploadFileRequest,
    LeaveRoomRequest,
]

REQUEST_TYPE_MESSAGE_MAP: dict[RequestType, type[RequestMessage]] = {
    RequestType.CREATE_ROOM: CreateRoomRequest,
    RequestType.JOIN_ROOM: JoinRoomRequest,
    RequestType.START_GAME: StartGameRequest,
    RequestType.UPLOAD_FILE: UploadFileRequest,
    RequestType.LEAVE_ROOM: LeaveRoomRequest,
}
