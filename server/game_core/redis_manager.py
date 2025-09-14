import secrets
import string
from collections.abc import Awaitable
from typing import Callable, Optional

from clients.redis_client import get_redis_client
from models.game_model import GameModel
from models.room_model import RoomModel
from models.types import RoomId


class RedisManager:
    def __init__(self):
        self.redis_client = get_redis_client()
        self._pubsub = None
        self._channel = None

    async def room_exists(self, room_code: str) -> bool:
        return await self.redis_client.exists(f'room:{room_code}') > 0

    async def get_room(self, room_code: str) -> Optional[RoomModel]:
        room_data = await self.redis_client.get(f'room:{room_code}')
        if not room_data:
            return None
        return RoomModel.model_validate_json(room_data)

    async def get_game(self, room_code: str) -> Optional[GameModel]:
        game_data = await self.redis_client.get(f'room:{room_code}:game')
        if not game_data:
            return None
        return GameModel.model_validate_json(game_data)

    async def save_room(self, room: RoomModel):
        await self.redis_client.set(
            f'room:{room.code}',
            room.model_dump_json(),
        )

    async def create_room(
        self, host_player_id: str, host_player_name: str
    ) -> RoomModel:
        letters = string.ascii_uppercase
        while True:
            random_code = ''.join(secrets.choice(letters) for _ in range(4))
            if not await self.room_exists(random_code):
                break
        room = RoomModel(
            code=random_code,
            player_ids=[host_player_id],
            player_names={host_player_id: host_player_name},
            host_id=host_player_id,
        )
        await self.save_room(room)
        return room

    async def add_player_to_room(
        self, room_code: str, player_id: str, player_name: str
    ) -> Optional[RoomModel]:
        room = await self.get_room(room_code)
        if not room:
            return None
        room.player_ids.append(player_id)
        room.player_names[player_id] = player_name
        await self.save_room(room)
        return room

    async def remove_player_from_room(
        self, room_code: str, player_id: str
    ) -> Optional[RoomModel]:
        room = await self.get_room(room_code)
        await self.unsubscribe_from_room_events()
        if not room:
            return None
        if player_id in room.player_ids:
            player_index = room.player_ids.index(player_id)
            del room.player_names[player_id]
            del room.player_ids[player_index]
            # If the player leaving is the host, assign a new host if possible
            if player_id == room.host_id:
                if room.player_ids:
                    room.host_id = room.player_ids[0]
                else:
                    await self.redis_client.delete(f'room:{room_code}')
                    return None
            await self.save_room(room)
        return room

    async def start_game(self, room_code: str) -> None:
        room = await self.get_room(room_code)
        if not room:
            return None
        game = GameModel(
            room=room_code,
            round=1,
        )
        await self.redis_client.set(
            f'room:{room_code}:game',
            game.model_dump_json(),
        )
        return

    async def next_round(self, room_code: str) -> None:
        game = await self.get_game(room_code)
        if not game:
            return None
        game.round += 1
        await self.redis_client.set(
            f'room:{room_code}:game',
            game.model_dump_json(),
        )

    async def subscribe_to_room_events(
        self,
        room_code: RoomId,
        on_update: Callable[[RoomModel | None], Awaitable[None]],
    ):
        self._pubsub = self.redis_client.pubsub()
        key = f'room:{room_code}'
        self._channel = f'__keyspace@0__:{key}'

        await self._pubsub.subscribe(self._channel)
        async for message in self._pubsub.listen():
            if message['type'] == 'message':
                updated_room = await self.get_room(room_code)
                await on_update(updated_room)

    async def unsubscribe_from_room_events(self):
        if self._pubsub and self._channel:
            await self._pubsub.unsubscribe(self._channel)
            await self._pubsub.close()
            self._pubsub = None
            self._channel = None

    async def subscribe_to_game_events(
        self,
        room_code: str,
        on_update: Callable[[GameModel | None], Awaitable[None]],
    ):
        self._pubsub = self.redis_client.pubsub()
        key = f'room:{room_code}:game'
        self._channel = f'__keyspace@0__:{key}'

        await self._pubsub.subscribe(self._channel)
        async for message in self._pubsub.listen():
            if message['type'] == 'message' and message['data'] == 'set':
                updated_game = await self.get_game(room_code)
                await on_update(updated_game)
