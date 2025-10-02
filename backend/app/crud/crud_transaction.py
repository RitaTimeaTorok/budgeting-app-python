from sqlalchemy.orm import Session
from .. import models, schemas
from datetime import datetime

# Get all transactions for a user, newest first
def get_transactions_for_user(db: Session, user_id: int):
    return db.query(models.Transaction).filter(models.Transaction.user_id == user_id).order_by(models.Transaction.date.desc()).all()

# Create a new transaction for a user
def create_transaction(db: Session, user_id: int, transaction: schemas.TransactionCreate):
    db_transaction = models.Transaction(
        user_id=user_id,
        date=datetime.utcnow(),  # Set date automatically
        **transaction.dict()
    )
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    return db_transaction

# Delete a transaction by id (if it belongs to the user)
def delete_transaction(db: Session, transaction_id: int, user_id: int):
    tx = db.query(models.Transaction).filter(
        models.Transaction.id == transaction_id,
        models.Transaction.user_id == user_id
    ).first()
    if not tx:
        return False
    db.delete(tx)
    db.commit()
    return True
