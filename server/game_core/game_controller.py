import asyncio
from uuid import uuid4

from fastapi import WebSocket
from pydantic import BaseModel, ValidationError

from game_core.file_manager import FileManager
from models.game import GameModel
from models.request_schemas import (
    REQUEST_TYPE_MESSAGE_MAP,
    RequestMessage,
    RequestType,
)
from models.response_schemas import (
    ErrorResponse,
    GameRoundNotification,
    GameSummaryNotification,
    ResponseType,
    RoomCreatedResponse,
    RoomJoinedResponse,
    RoomLeftResponse,
    RoomUpdatedNotification,
)
from models.room import RoomModel

from .redis_manager import RedisManager

ROUND_DURATION = 10  # seconds


class GameController:
    websocket: WebSocket
    redis_manager: RedisManager
    file_manager: FileManager
    _room: RoomModel | None
    _game: GameModel | None
    player_id: str

    def __init__(self, websocket: WebSocket):
        self.websocket = websocket
        self.redis_manager = RedisManager()
        self.file_manager = FileManager()
        self.player_id = str(uuid4())
        self._room = None
        self._game = None

    @property
    def room(self) -> RoomModel:
        if self._room is None:
            raise AttributeError('Room has not been initialized yet')
        return self._room

    @room.setter
    def room(self, value: RoomModel):
        self._room = value

    @property
    def game(self) -> GameModel:
        if self._game is None:
            raise AttributeError('Game has not been initialized yet')
        return self._game

    @game.setter
    def game(self, value: GameModel):
        self._game = value

    async def send_json(self, model: BaseModel):
        await self.websocket.send_json(model.model_dump())

    async def receive_message(self) -> RequestMessage:
        while True:
            req = await self.websocket.receive_json()
            result = await self._validate_request(req)
            if result is not None:
                return result

    async def _validate_request(self, req) -> RequestMessage | None:
        validated_request = None
        try:
            schema = REQUEST_TYPE_MESSAGE_MAP.get(RequestType(req.get('type')))
        except ValidationError:
            await self.send_json(
                ErrorResponse(
                    type=ResponseType.ERROR,
                    error='Invalid request type',
                )
            )
            return None

        if schema is None:
            await self.send_json(
                ErrorResponse(
                    type=ResponseType.ERROR,
                    error='Invalid request payload',
                )
            )
            return None

        validated_request = schema(**req)
        return validated_request

    async def create_room(self, host_player_name: str):
        room = await self.redis_manager.create_room(self.player_id, host_player_name)
        self.room = room
        asyncio.create_task(
            self.redis_manager.subscribe_to_room_events(room.code, self.on_room_update)
        )

    async def join_room(self, room_code: str, player_name: str) -> bool:
        room = await self.redis_manager.add_player_to_room(
            room_code, self.player_id, player_name
        )
        if not room:
            return False
        self.room = room
        asyncio.create_task(
            self.redis_manager.subscribe_to_room_events(room.code, self.on_room_update)
        )
        return True

    async def leave_room(self):
        await self.redis_manager.remove_player_from_room(self.room.code, self.player_id)
        self._room = None

    async def on_room_update(self, room: RoomModel | None) -> None:
        if room is None:
            # TODO: Handle room deletion
            return
        self.room = room
        await self.send_json(
            RoomUpdatedNotification(
                room=self.room,
            )
        )

    async def on_game_update(self, game: GameModel | None) -> None:
        if game is None:
            game_files = await self.file_manager.get_all_files(self.room)
            self._game = None
            await self.send_json(
                GameSummaryNotification(
                    files=game_files,
                )
            )
            return
        self.game = game
        # Find the i-th player after self.player_id, wrapping around
        print(f'Game update: {game}, self.player_id: {self.player_id}')
        player_ids = self.room.player_ids
        idx = player_ids.index(self.player_id)
        author_idx = (idx + game.round - 1) % len(player_ids)
        self.file_author = player_ids[author_idx]
        print(
            f'File author for round {game.round} for player {self.player_id} is {self.file_author}'
        )
        audio_file = await self.file_manager.get_round_file(
            self.room.code, game.round - 1, self.file_author
        )
        await self.send_json(
            GameRoundNotification(
                round_number=game.round,
                audio=audio_file,
            )
        )

    async def start_round_timer(self):
        await asyncio.sleep(ROUND_DURATION)
        await self.redis_manager.next_round(self.room.code)
        if self.game.round < len(self.room.player_ids) - 1:
            asyncio.create_task(self.start_round_timer())
        else:
            await asyncio.sleep(ROUND_DURATION)
            await self.redis_manager.end_game(self.room.code)

    async def run(self):
        while self._room is None:
            req_message = await self.receive_message()

            if req_message.type == RequestType.CREATE_ROOM:
                await self.create_room(req_message.player_name)
                await self.send_json(
                    RoomCreatedResponse(
                        room=self.room,
                    )
                )

            elif req_message.type == RequestType.JOIN_ROOM:
                success = await self.join_room(
                    req_message.room_id,
                    req_message.player_name,
                )
                if not success:
                    await self.send_json(
                        ErrorResponse(
                            error='Room not found',
                        )
                    )
                else:
                    await self.send_json(
                        RoomJoinedResponse(room=self.room, player_id=self.player_id)
                    )

            else:
                await self.send_json(
                    ErrorResponse(
                        error='No room joined yet',
                    )
                )
        asyncio.create_task(
            self.redis_manager.subscribe_to_game_events(
                self.room.code, self.on_game_update
            )
        )

        while True:
            req_message = await self.receive_message()

            if self._game is None:
                if req_message.type == RequestType.START_GAME:
                    if self.player_id != self.room.host_id:
                        await self.send_json(
                            ErrorResponse(
                                error='Only the host can start the game.',
                            )
                        )
                        continue
                    if len(self.room.player_ids) < 2:
                        await self.send_json(
                            ErrorResponse(
                                error='At least 2 players are required to start the game.',
                            )
                        )
                        continue
                    await self.redis_manager.start_game(self.room.code)
                    asyncio.create_task(self.start_round_timer())
                elif req_message.type == RequestType.LEAVE_ROOM:
                    await self.leave_room()
                    await self.send_json(RoomLeftResponse())
                    # Restart
                    return await self.run()
                else:
                    await self.send_json(
                        ErrorResponse(
                            error='Invalid action.',
                        )
                    )

            else:
                if req_message.type == RequestType.UPLOAD_FILE:
                    print(
                        f'Received file upload for round {req_message.round_number} '
                        f'from player {self.player_id}'
                    )
                    await self.file_manager.save_round_file(
                        self.room.code,
                        req_message.round_number,
                        self.player_id,
                        req_message.file_data,
                    )
                else:
                    await self.send_json(
                        ErrorResponse(
                            error='Invalid action.',
                        )
                    )
