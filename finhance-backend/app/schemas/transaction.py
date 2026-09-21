from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.models.transaction import TransactionType, TransactionCategory


class TransactionBase(BaseModel):
    amount: float
    type: TransactionType
    category: TransactionCategory
    description: Optional[str] = None
    date: Optional[datetime] = None


class TransactionCreate(TransactionBase):
    pass


class TransactionUpdate(BaseModel):
    amount: Optional[float] = None
    type: Optional[TransactionType] = None
    category: Optional[TransactionCategory] = None
    description: Optional[str] = None
    date: Optional[datetime] = None


class TransactionInDB(TransactionBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class Transaction(TransactionInDB):
    pass


class TransactionSummary(BaseModel):
    total_income: float
    total_expenses: float
    balance: float
    transaction_count: int
