from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from datetime import datetime

from app.core.database import get_db
from app.schemas.transaction import Transaction, TransactionCreate, TransactionUpdate, TransactionSummary
from app.schemas.user import User
from app.services.transaction_service import TransactionService
from app.services.auth_service import AuthService

router = APIRouter()


@router.post("/", response_model=Transaction)
async def create_transaction(
    transaction_data: TransactionCreate,
    current_user: User = Depends(AuthService.get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Создать новую транзакцию"""
    transaction_service = TransactionService(db)
    
    transaction = await transaction_service.create_transaction(
        user_id=current_user.id,
        transaction_data=transaction_data
    )
    return transaction


@router.get("/", response_model=List[Transaction])
async def get_transactions(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    type_filter: Optional[str] = Query(None),
    category_filter: Optional[str] = Query(None),
    start_date: Optional[datetime] = Query(None),
    end_date: Optional[datetime] = Query(None),
    current_user: User = Depends(AuthService.get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Получить список транзакций пользователя"""
    transaction_service = TransactionService(db)
    
    transactions = await transaction_service.get_user_transactions(
        user_id=current_user.id,
        skip=skip,
        limit=limit,
        type_filter=type_filter,
        category_filter=category_filter,
        start_date=start_date,
        end_date=end_date
    )
    return transactions


@router.get("/summary", response_model=TransactionSummary)
async def get_transaction_summary(
    start_date: Optional[datetime] = Query(None),
    end_date: Optional[datetime] = Query(None),
    current_user: User = Depends(AuthService.get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Получить сводку по транзакциям"""
    transaction_service = TransactionService(db)
    
    summary = await transaction_service.get_transaction_summary(
        user_id=current_user.id,
        start_date=start_date,
        end_date=end_date
    )
    return summary


@router.get("/{transaction_id}", response_model=Transaction)
async def get_transaction(
    transaction_id: int,
    current_user: User = Depends(AuthService.get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Получить конкретную транзакцию"""
    transaction_service = TransactionService(db)
    
    transaction = await transaction_service.get_transaction(
        transaction_id=transaction_id,
        user_id=current_user.id
    )
    if not transaction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Транзакция не найдена"
        )
    
    return transaction


@router.put("/{transaction_id}", response_model=Transaction)
async def update_transaction(
    transaction_id: int,
    transaction_update: TransactionUpdate,
    current_user: User = Depends(AuthService.get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Обновить транзакцию"""
    transaction_service = TransactionService(db)
    
    transaction = await transaction_service.update_transaction(
        transaction_id=transaction_id,
        user_id=current_user.id,
        transaction_update=transaction_update
    )
    if not transaction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Транзакция не найдена"
        )
    
    return transaction


@router.delete("/{transaction_id}")
async def delete_transaction(
    transaction_id: int,
    current_user: User = Depends(AuthService.get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Удалить транзакцию"""
    transaction_service = TransactionService(db)
    
    success = await transaction_service.delete_transaction(
        transaction_id=transaction_id,
        user_id=current_user.id
    )
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Транзакция не найдена"
        )
    
    return {"message": "Транзакция успешно удалена"}
