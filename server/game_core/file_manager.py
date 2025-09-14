import os
from collections.abc import Awaitable
from typing import Optional

from clients.redis_client import get_redis_client


class FileManager:
    def __init__(self):
        self.storage_path = os.path.join(
            os.path.dirname(os.path.abspath(__file__)), '..', 'game_files'
        )
        if not os.path.exists(self.storage_path):
            os.makedirs(self.storage_path)

        self.redis_client = get_redis_client()

    async def get_round_file(
        self, room_code: str, round_number: int, player_id: str
    ) -> Optional[bytes]:
        file_path = self.redis_client.hget(
            f'game:{room_code}:round:{round_number}', player_id
        )

        if isinstance(file_path, Awaitable):
            file_path = await file_path

        if not file_path or not os.path.exists(file_path):
            return None

        with open(file_path, 'rb') as f:
            return f.read()

    async def save_round_file(
        self, room_code: str, round_number: int, player_id: str, file_data: bytes
    ) -> None:
        """
        Saves a player's file to disk and stores its path in the Redis Hash for the round.
        """
        file_path = os.path.join(
            self.storage_path, f'{room_code}_round{round_number}_{player_id}'
        )

        with open(file_path, 'wb') as f:
            f.write(file_data)

        # Store the file's path in the Redis Hash as a string.
        result = self.redis_client.hset(
            f'game:{room_code}:round:{round_number}', player_id, file_path
        )
        if isinstance(result, Awaitable):
            await result
