from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from datetime import datetime

from app.core.database import get_db
from app.schemas.goal import Goal, GoalCreate, GoalUpdate, GoalProgress
from app.schemas.user import User
from app.services.goal_service import GoalService
from app.services.auth_service import AuthService

router = APIRouter()


@router.post("/", response_model=Goal)
async def create_goal(
    goal_data: GoalCreate,
    current_user: User = Depends(AuthService.get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Создать новую финансовую цель"""
    goal_service = GoalService(db)
    
    goal = await goal_service.create_goal(
        user_id=current_user.id,
        goal_data=goal_data
    )
    return goal


@router.get("/", response_model=List[Goal])
async def get_goals(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    status_filter: Optional[str] = Query(None),
    current_user: User = Depends(AuthService.get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Получить список целей пользователя"""
    goal_service = GoalService(db)
    
    goals = await goal_service.get_user_goals(
        user_id=current_user.id,
        skip=skip,
        limit=limit,
        status_filter=status_filter
    )
    return goals


@router.get("/progress", response_model=List[GoalProgress])
async def get_goals_progress(
    current_user: User = Depends(AuthService.get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Получить прогресс по всем активным целям"""
    goal_service = GoalService(db)
    
    progress = await goal_service.get_goals_progress(user_id=current_user.id)
    return progress


@router.get("/{goal_id}", response_model=Goal)
async def get_goal(
    goal_id: int,
    current_user: User = Depends(AuthService.get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Получить конкретную цель"""
    goal_service = GoalService(db)
    
    goal = await goal_service.get_goal(
        goal_id=goal_id,
        user_id=current_user.id
    )
    if not goal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Цель не найдена"
        )
    
    return goal


@router.put("/{goal_id}", response_model=Goal)
async def update_goal(
    goal_id: int,
    goal_update: GoalUpdate,
    current_user: User = Depends(AuthService.get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Обновить цель"""
    goal_service = GoalService(db)
    
    goal = await goal_service.update_goal(
        goal_id=goal_id,
        user_id=current_user.id,
        goal_update=goal_update
    )
    if not goal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Цель не найдена"
        )
    
    return goal


@router.post("/{goal_id}/contribute")
async def contribute_to_goal(
    goal_id: int,
    amount: float,
    current_user: User = Depends(AuthService.get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Внести вклад в цель"""
    goal_service = GoalService(db)
    
    success = await goal_service.contribute_to_goal(
        goal_id=goal_id,
        user_id=current_user.id,
        amount=amount
    )
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Цель не найдена"
        )
    
    return {"message": "Вклад успешно внесен"}


@router.delete("/{goal_id}")
async def delete_goal(
    goal_id: int,
    current_user: User = Depends(AuthService.get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Удалить цель"""
    goal_service = GoalService(db)
    
    success = await goal_service.delete_goal(
        goal_id=goal_id,
        user_id=current_user.id
    )
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Цель не найдена"
        )
    
    return {"message": "Цель успешно удалена"}
