from .game import router as one_versus_one_router
from .reverse import router as items_router
from .test import router as test_router

all_routers = [
    items_router,
    test_router,
    one_versus_one_router,
]
