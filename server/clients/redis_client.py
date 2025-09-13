import redis

from config import REDIS_HOST, REDIS_PASSWORD, REDIS_PORT

redis_client = redis.Redis(
    host=REDIS_HOST,
    port=REDIS_PORT,
    password=REDIS_PASSWORD,
    decode_responses=True,
)


def get_redis_client():
    return redis_client
