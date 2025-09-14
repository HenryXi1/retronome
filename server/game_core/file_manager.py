import json
import os
from collections.abc import Awaitable
from typing import Optional

from clients.redis_client import get_redis_client
from game_core import reverse_audio
from models.room_model import RoomModel
from models.types import PlayerId


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
        file_info = self.redis_client.hget(
            f'game:{room_code}:round:{round_number}', player_id
        )

        if isinstance(file_info, Awaitable):
            file_info = await file_info

        if not file_info:
            return None

        file_paths = json.loads(file_info)

        reversed_file = file_paths['reversed']

        with open(reversed_file, 'rb') as f:
            return f.read()

    async def save_round_file(
        self, room_code: str, round_number: int, player_id: str, file_data: bytes
    ) -> None:
        file_path = os.path.join(
            self.storage_path, f'{room_code}_round{round_number}_{player_id}'
        )

        reversed_file_path = file_path + '_reversed'

        with open(file_path + '.webm', 'wb') as f:
            f.write(file_data)

        with open(reversed_file_path + '.webm', 'wb') as f:
            f.write(reverse_audio(file_data))

        file_info = json.dumps(
            {'original': file_path + '.webm', 'reversed': reversed_file_path + '.webm'}
        )

        result = self.redis_client.hset(
            f'game:{room_code}:round:{round_number}', player_id, file_info
        )
        if isinstance(result, Awaitable):
            await result

    async def get_all_files(
        self, room: RoomModel
    ) -> list[list[tuple[PlayerId, bytes, bytes]]]:
        player_idxs = {pid: idx for idx, pid in enumerate(room.player_ids)}
        keys = await self.redis_client.keys(f'game:{room.code}:round:*')
        print(f'Found keys: {keys}')

        def extract_round_num(key):
            import re

            m = re.search(r'round:(\d+)', key)
            return int(m.group(1)) if m else 0

        return []
