import secrets
import string
from collections.abc import Awaitable
from typing import Callable, Optional

from clients.redis_client import get_redis_client
from clients.redis_subscriber import get_redis_subscriber

from .models.game_models import RoomModel
from .models.types import RoomId


class RedisManager:
    def __init__(self):
        self.redis_client = get_redis_client()
        self.redis_subscriber = get_redis_subscriber()

    async def room_exists(self, room_code: str) -> bool:
        return await self.redis_client.exists(f'room:{room_code}') > 0

    async def get_room(self, room_code: str) -> Optional[RoomModel]:
        room_data = await self.redis_client.get(f'room:{room_code}')
        if not room_data:
            return None
        if isinstance(room_data, bytes):
            room_json = room_data.decode('utf-8')
        else:
            room_json = room_data
        return RoomModel.model_validate_json(room_json)

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
            players={host_player_id: host_player_name},
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
        room.players[player_id] = player_name
        await self.save_room(room)
        return room

    async def subscribe_to_room_events(
        self,
        room_code: RoomId,
        on_update: Callable[[RoomModel | None], Awaitable[None]],
    ):
        pubsub = self.redis_subscriber.pubsub()
        key = f'room:{room_code}'
        channel = f'__keyspace@0__:{key}'

        await pubsub.subscribe(channel)
        async for message in pubsub.listen():
            if message['type'] == 'message':
                updated_room = await self.get_room(room_code)
                await on_update(updated_room)
