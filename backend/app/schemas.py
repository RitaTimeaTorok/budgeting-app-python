# Here we define data shapes for requests and responses

from pydantic import BaseModel

# Incoming data for registering a user
class UserCreate(BaseModel):
    username: str
    password: str

# Incoming data for logging in
class UserLogin(BaseModel):
    username: str
    password: str

# Outgoing data for user info (without password)
class UserOut(BaseModel):
    id: int
    username: str

    class Config:
        orm_mode = True

class TransactionCreate(BaseModel):
    description: str
    amount: float
    currency: str
    category: str
    subcategory: str = ""
    flow: str