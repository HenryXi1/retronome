from pydantic import BaseModel, Field


class RoomModel(BaseModel):
    code: str = Field(..., min_length=4, max_length=4, pattern='^[A-Z]{4}$')
    players: dict[str, str]  # Mapping of player_id to player_name
    host_id: str
