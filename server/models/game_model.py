from pydantic import BaseModel

from .types import RoomId


class GameModel(BaseModel):
    room: RoomId
    round: int = 0
