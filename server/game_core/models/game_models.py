from pydantic import BaseModel

from .types import PlayerId, PlayerName, RoomId


class RoomModel(BaseModel):
    code: RoomId
    players: dict[PlayerId, PlayerName]
    host_id: PlayerId
