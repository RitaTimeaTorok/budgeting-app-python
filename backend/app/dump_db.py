from sqlalchemy.orm import Session
from .database import SessionLocal
from .models import Transaction, User

# Create a new session
db: Session = SessionLocal()

print("Users:")
for user in db.query(User).all():
    print(f"id={user.id}, username={user.username}")

print("\nTransactions:")
for t in db.query(Transaction).all():
    print(f"id={t.id}, date={t.date}, desc={t.description}, amount={t.amount}, currency={t.currency}, category={t.category}, subcategory={t.subcategory}, flow={t.flow}, user_id={t.user_id}")

db.close()
