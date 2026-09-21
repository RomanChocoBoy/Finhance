from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_, or_
from sqlalchemy.orm import selectinload
from typing import List, Optional
from datetime import datetime

from app.models.transaction import Transaction as TransactionModel, TransactionType, TransactionCategory
from app.schemas.transaction import Transaction, TransactionCreate, TransactionUpdate, TransactionSummary


class TransactionService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_transaction(self, user_id: int, transaction_data: TransactionCreate) -> Transaction:
        """Создать новую транзакцию"""
        db_transaction = TransactionModel(
            user_id=user_id,
            **transaction_data.model_dump()
        )
        
        self.db.add(db_transaction)
        await self.db.commit()
        await self.db.refresh(db_transaction)
        
        return Transaction.model_validate(db_transaction)

    async def get_user_transactions(
        self,
        user_id: int,
        skip: int = 0,
        limit: int = 100,
        type_filter: Optional[str] = None,
        category_filter: Optional[str] = None,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None
    ) -> List[Transaction]:
        """Получить транзакции пользователя с фильтрацией"""
        query = select(TransactionModel).where(TransactionModel.user_id == user_id)
        
        # Применяем фильтры
        if type_filter:
            query = query.where(TransactionModel.type == type_filter)
        if category_filter:
            query = query.where(TransactionModel.category == category_filter)
        if start_date:
            query = query.where(TransactionModel.date >= start_date)
        if end_date:
            query = query.where(TransactionModel.date <= end_date)
        
        # Сортировка по дате (новые сначала)
        query = query.order_by(TransactionModel.date.desc())
        
        # Пагинация
        query = query.offset(skip).limit(limit)
        
        result = await self.db.execute(query)
        transactions = result.scalars().all()
        
        return [Transaction.model_validate(transaction) for transaction in transactions]

    async def get_transaction(self, transaction_id: int, user_id: int) -> Optional[Transaction]:
        """Получить конкретную транзакцию"""
        result = await self.db.execute(
            select(TransactionModel).where(
                and_(
                    TransactionModel.id == transaction_id,
                    TransactionModel.user_id == user_id
                )
            )
        )
        transaction = result.scalar_one_or_none()
        
        if transaction:
            return Transaction.model_validate(transaction)
        return None

    async def update_transaction(
        self,
        transaction_id: int,
        user_id: int,
        transaction_update: TransactionUpdate
    ) -> Optional[Transaction]:
        """Обновить транзакцию"""
        result = await self.db.execute(
            select(TransactionModel).where(
                and_(
                    TransactionModel.id == transaction_id,
                    TransactionModel.user_id == user_id
                )
            )
        )
        transaction = result.scalar_one_or_none()
        
        if not transaction:
            return None
        
        update_data = transaction_update.model_dump(exclude_unset=True)
        
        for field, value in update_data.items():
            setattr(transaction, field, value)
        
        await self.db.commit()
        await self.db.refresh(transaction)
        
        return Transaction.model_validate(transaction)

    async def delete_transaction(self, transaction_id: int, user_id: int) -> bool:
        """Удалить транзакцию"""
        result = await self.db.execute(
            select(TransactionModel).where(
                and_(
                    TransactionModel.id == transaction_id,
                    TransactionModel.user_id == user_id
                )
            )
        )
        transaction = result.scalar_one_or_none()
        
        if not transaction:
            return False
        
        await self.db.delete(transaction)
        await self.db.commit()
        
        return True

    async def get_transaction_summary(
        self,
        user_id: int,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None
    ) -> TransactionSummary:
        """Получить сводку по транзакциям"""
        query = select(TransactionModel).where(TransactionModel.user_id == user_id)
        
        if start_date:
            query = query.where(TransactionModel.date >= start_date)
        if end_date:
            query = query.where(TransactionModel.date <= end_date)
        
        result = await self.db.execute(query)
        transactions = result.scalars().all()
        
        total_income = sum(
            t.amount for t in transactions 
            if t.type == TransactionType.INCOME
        )
        total_expenses = sum(
            t.amount for t in transactions 
            if t.type == TransactionType.EXPENSE
        )
        balance = total_income - total_expenses
        
        return TransactionSummary(
            total_income=total_income,
            total_expenses=total_expenses,
            balance=balance,
            transaction_count=len(transactions)
        )
