from sqlalchemy.orm import Session
from . import models, schemas, auth

# Look up a user by username
def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

# Create a new user with hashed password
def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = auth.hash_password(user.password)
    db_user = models.User(username=user.username, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# Check if the username exists and password matches
def authenticate_user(db: Session, username: str, password: str):
    user = get_user_by_username(db, username)
    if user and auth.check_password(password, user.hashed_password):
        return user
    return None