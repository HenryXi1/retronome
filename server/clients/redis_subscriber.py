import redis.asyncio as aioredis

from config import REDIS_HOST, REDIS_PASSWORD, REDIS_PORT

redis_client = aioredis.Redis(
    host=REDIS_HOST,
    port=REDIS_PORT,
    password=REDIS_PASSWORD,
    decode_responses=True,
)


def get_redis_subscriber():
    return redis_client
