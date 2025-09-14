import base64
import json
import os
from collections.abc import Awaitable
from typing import Optional

from clients.redis_client import get_redis_client
from models.room import RoomModel
from models.types import B64Data, PlayerId

from .reverse_audio import reverse_audio


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
    ) -> Optional[B64Data]:
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
            file_data = f.read()
            return base64.b64encode(file_data).decode('utf-8')

    async def save_round_file(
        self, room_code: str, round_number: int, player_id: str, base64_data: B64Data
    ) -> None:
        file_data = base64.b64decode(base64_data)
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
    ) -> list[list[tuple[PlayerId, B64Data | None, B64Data | None]]]:
        all_files = [[] for _ in range(len(room.player_ids))]
        for round_num in range(1, len(room.player_ids) + 1):
            content = self.redis_client.hgetall(f'game:{room.code}:round:{round_num}')
            if isinstance(content, Awaitable):
                content = await content
            for i in range(0, len(room.player_ids)):
                player_idx = (round_num + i - 1) % len(room.player_ids)
                player_id = room.player_ids[player_idx]
                file_info = content.get(player_id)
                if file_info:
                    file_paths = json.loads(file_info)
                    with open(file_paths['original'], 'rb') as f:
                        original_data = f.read()
                        original_b64 = base64.b64encode(original_data).decode('utf-8')
                    with open(file_paths['reversed'], 'rb') as f:
                        reversed_data = f.read()
                        reversed_b64 = base64.b64encode(reversed_data).decode('utf-8')
                    all_files[i].append((player_id, original_b64, reversed_b64))
                else:
                    all_files[i].append((player_id, None, None))

        return all_files
