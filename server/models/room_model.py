from pydantic import BaseModel

from .types import PlayerId, PlayerName, RoomId


class RoomModel(BaseModel):
    code: RoomId
    player_ids: list[PlayerId]
    player_names: dict[PlayerId, PlayerName]
    host_id: PlayerId
