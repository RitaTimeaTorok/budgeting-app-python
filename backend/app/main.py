from fastapi import FastAPI
from . import models, database
from fastapi.middleware.cors import CORSMiddleware
from .routes import auth
from .routes import transactions
from .routes import statistics

# Create the database tables
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

app.include_router(auth.router)
app.include_router(transactions.router)
app.include_router(statistics.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)