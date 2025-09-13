from typing import Annotated

from pydantic import constr

PlayerId = str
PlayerName = str
RoomId = Annotated[str, constr(pattern=r'^[A-Z]{4}$')]
