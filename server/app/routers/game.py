from fastapi import APIRouter, WebSocket

from game_core import GameController

router = APIRouter()


@router.websocket('/game/')
async def game(websocket: WebSocket):
    await websocket.accept()
    controller = GameController(websocket)
    try:
        print('New WebSocket connection established')
        await controller.run()
    except Exception as e:
        print(f'WebSocket connection closed with error: {e}')
        await websocket.close()
