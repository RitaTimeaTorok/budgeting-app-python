# Here we define database tables 

from sqlalchemy import Column, Integer, String
from .database import Base

class User(Base):
    __tablename__ = "users"

    # PK - unique identifier for each user
    id = Column(Integer, primary_key=True, index=True)
    # Username - must be unique and not null
    username = Column(String, unique=True, index=True, nullable=False)
    # Hashed password
    hashed_password = Column(String, nullable=False)