from collections import defaultdict # Auto-creates default values for missing keys
from datetime import datetime, date as date_cls # Parse and normalize dates
from fastapi import APIRouter, Depends # Define routers in a modular way + dependency injection
from sqlalchemy.orm import Session
from .. import models
from ..auth import get_current_user, get_db

router = APIRouter()

# Helper to convert date formats to datetime
def _to_date(d):
    if isinstance(d, str):
        try:
            return datetime.fromisoformat(d)
        except ValueError:
            # fallback: take only date portion
            return datetime.strptime(d[:10], "%Y-%m-%d")
    if isinstance(d, datetime):
        return d
    if isinstance(d, date_cls):
        return datetime.combine(d, datetime.min.time())
    raise ValueError("Unsupported date format for transaction.date")

@router.get("/statistics")
def get_statistics(
    db: Session = Depends(get_db), # Guarantiees the endpoint has a database session
    current_user: models.User = Depends(get_current_user) # Authenticated user object derived from token
):
    # Load the transactions that match this user
    txs = (
        db.query(models.Transaction)
        .filter(models.Transaction.user_id == current_user.id)
        .all()
    )

    balance = 0.0
    monthly_income = defaultdict(float)
    monthly_spending = defaultdict(float)

    by_month = defaultdict(lambda: {
        "income_total": 0.0,
        "spending_total": 0.0,
        "net": 0.0,
        "categories_income": defaultdict(float),
        "categories_spending": defaultdict(float),
    })

    for t in txs:
        dt = _to_date(t.date)
        month = dt.strftime("%Y-%m")
        cat = (t.category or "Uncategorized").strip() # Normalize empty categories
        amt = float(t.amount or 0.0)
        flow = (t.flow or "").upper()

        if flow == "IN":
            balance += amt
            monthly_income[month] += amt
            by_month[month]["income_total"] += amt
            by_month[month]["net"] += amt
            by_month[month]["categories_income"][cat] += amt

        elif flow == "OUT":
            balance -= amt
            monthly_spending[month] += amt
            by_month[month]["spending_total"] += amt
            by_month[month]["net"] -= amt
            by_month[month]["categories_spending"][cat] += amt

    # Convert nested defaultdicts to regular dicts for JSON serialization
    by_month_out = {}
    for m, data in by_month.items():
        by_month_out[m] = {
            "income_total": data["income_total"],
            "spending_total": data["spending_total"],
            "net": data["net"],
            "categories_income": dict(data["categories_income"]),
            "categories_spending": dict(data["categories_spending"]),
        }

    # Months index sorted descending - latest first
    months = sorted(by_month_out.keys(), reverse=True)

    return {
        "balance": balance,
        "months": months,
        "by_month": by_month_out,
        "monthly_income": dict(monthly_income), 
        "monthly_spending": dict(monthly_spending),
    }
