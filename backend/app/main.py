from fastapi import FastAPI # To create the FastAPI app
from . import models, database
from fastapi.middleware.cors import CORSMiddleware # Allow backend to accept requests from the frontend

from .routes import auth
from .routes import transactions
from .routes import statistics

# Create the database tables
models.Base.metadata.create_all(bind=database.engine)

# Create the Fast API application
app = FastAPI()

# Include the routers for different functionalities
app.include_router(auth.router)
app.include_router(transactions.router)
app.include_router(statistics.router)

# Allow frontend to make requests to the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True, # Allow cookies, credentials etc.
    allow_methods=["*"], # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],
)