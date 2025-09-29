# Here we define database tables 

from sqlalchemy import Column, Integer, String, Float, Date
from .database import Base

class User(Base):
    __tablename__ = "users"

    # PK - unique identifier for each user
    id = Column(Integer, primary_key=True, index=True)

    username = Column(String, unique=True, index=True, nullable=False)
    
    # Hashed password
    hashed_password = Column(String, nullable=False)

class Transaction(Base):
    __tablename__ = "transactions"

    # PK - unique identifier for each transaction
    id = Column(Integer, primary_key=True, index=True)

    date = Column(String, nullable=False)
    description = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    currency = Column(String, nullable=False)
    category = Column(String, nullable=False)
    subcategory = Column(String, nullable=False)
    flow = Column(String, nullable=False)
    
    # FK - links to User.id
    user_id = Column(Integer, nullable=True) 