from fastapi import APIRouter, WebSocket

from game_core import GameController

router = APIRouter()


@router.websocket('/game/')
async def oneVersusOne(websocket: WebSocket):
    await websocket.accept()
    controller = GameController(websocket)
    try:
        await controller.run()
    except Exception:
        await websocket.close()
