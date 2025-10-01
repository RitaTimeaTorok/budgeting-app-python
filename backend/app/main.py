from io import BytesIO
from fastapi import FastAPI, Depends, HTTPException, UploadFile, status
from fastapi.params import File
import pandas as pd
from sqlalchemy.orm import Session
from . import models, schemas, crud, auth, database
from fastapi.middleware.cors import CORSMiddleware
from .auth import get_current_user

# Create the database tables
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

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

# Dependency to get DB session
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/register", response_model=schemas.UserOut)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    if len(user.password) > 72:
        raise HTTPException(status_code=400, detail="Password too long (max 72 characters)")
    db_user = crud.get_user_by_username(db, username=user.username)
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    return crud.create_user(db, user=user)

@app.post("/login")
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = crud.authenticate_user(db, username=user.username, password=user.password)
    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = auth.generate_token({"sub": db_user.username})
    return {"access_token": token, "token_type": "bearer"}

@app.post("/upload-excel")
async def upload_excel(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    # Basic content-type guard (optional but helpful)
    allowed_types = {
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
    }
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Please upload an .xlsx or .xls file.")

    try:
        # Read bytes and parse with pandas
        raw = await file.read()
        df = pd.read_excel(BytesIO(raw))  # requires openpyxl for .xlsx

        required_cols = ["Date", "Description", "Amount", "Currency", "Category", "Subcategory", "Flow"]
        missing = [c for c in required_cols if c not in df.columns]
        if missing:
            raise HTTPException(status_code=400, detail=f"Missing required columns: {missing}")

        # Insert rows
        for _, row in df.iterrows():
            tx = models.Transaction(
                date=str(row["Date"]),
                description=str(row["Description"]),
                amount=float(row["Amount"]),
                currency=str(row["Currency"]),
                category=str(row["Category"]),
                subcategory=str(row["Subcategory"]),
                flow=str(row["Flow"]),
                user_id=current_user.id,
            )
            db.add(tx)

        db.commit()
        return {"message": "Excel file processed successfully"}
    except HTTPException:
        raise
    except Exception as e:
        # Any unexpected parsing errors become a 400 instead of 500
        raise HTTPException(status_code=400, detail=f"Failed to read Excel: {e}")

@app.get("/transactions")
def get_transactions(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    transactions = db.query(models.Transaction).filter(models.Transaction.user_id == current_user.id).all()
    return [
        {
            "id": t.id,
            "date": t.date,
            "description": t.description,
            "amount": t.amount,
            "currency": t.currency,
            "category": t.category,
            "subcategory": t.subcategory,
            "flow": t.flow,
        }
        for t in transactions
    ]