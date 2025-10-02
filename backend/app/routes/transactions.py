from fastapi import APIRouter, Depends, HTTPException, UploadFile, status
from sqlalchemy.orm import Session
from .. import models, schemas
from ..auth import get_current_user, get_db
from io import BytesIO
from fastapi.params import File
from ..crud.crud_transaction import get_transactions_for_user, create_transaction, delete_transaction as crud_delete_transaction
import pandas as pd

router = APIRouter()

# Get all transactions for the current user, newest first
@router.get("/transactions")
def get_transactions(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    transactions = get_transactions_for_user(db, current_user.id)
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

# Add a new transaction for the current user
@router.post("/transactions")
def add_transaction(
    transaction: schemas.TransactionCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    return create_transaction(db, current_user.id, transaction)

# Upload Excel and add transactions in bulk
@router.post("/upload-excel")
async def upload_excel(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    if not (file.filename.endswith(".xlsx") or file.filename.endswith(".xls")):
        raise HTTPException(status_code=400, detail="Please upload an .xlsx or .xls file.")
    try:
        raw = await file.read()
        df = pd.read_excel(BytesIO(raw))
        for _, row in df.iterrows():
            transaction = schemas.TransactionCreate(
                date=row["Date"],
                description=str(row["Description"]),
                amount=float(row["Amount"]),
                currency=str(row["Currency"]),
                category=str(row["Category"]),
                subcategory=str(row["Subcategory"]),
                flow=str(row["Flow"]),
            )
            create_transaction(db, current_user.id, transaction)
        return {"message": "Excel file processed successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to read Excel: {e}")

# Delete a transaction by ID for the current user
@router.delete("/transactions/{transaction_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_transaction(
    transaction_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    success = crud_delete_transaction(db, transaction_id, current_user.id)
    if not success:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return