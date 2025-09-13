from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import all_routers

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        'http://localhost:3000',
        'http://localhost:5173',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:5173',
    ],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

for router in all_routers:
    app.include_router(router)
