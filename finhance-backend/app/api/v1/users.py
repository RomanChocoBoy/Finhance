from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app.core.database import get_db
from app.schemas.user import User, UserUpdate
from app.services.user_service import UserService
from app.services.auth_service import AuthService

router = APIRouter()


@router.get("/me", response_model=User)
async def get_current_user(
    current_user: User = Depends(AuthService.get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Получить информацию о текущем пользователе"""
    return current_user


@router.put("/me", response_model=User)
async def update_current_user(
    user_update: UserUpdate,
    current_user: User = Depends(AuthService.get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Обновить информацию о текущем пользователе"""
    user_service = UserService(db)
    
    updated_user = await user_service.update_user(current_user.id, user_update)
    if not updated_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Пользователь не найден"
        )
    
    return updated_user


@router.delete("/me")
async def delete_current_user(
    current_user: User = Depends(AuthService.get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Удалить текущего пользователя"""
    user_service = UserService(db)
    
    success = await user_service.delete_user(current_user.id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Пользователь не найден"
        )
    
    return {"message": "Пользователь успешно удален"}
