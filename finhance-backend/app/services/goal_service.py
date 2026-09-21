from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from typing import List, Optional
from datetime import datetime, timedelta

from app.models.goal import Goal as GoalModel, GoalStatus
from app.schemas.goal import Goal, GoalCreate, GoalUpdate, GoalProgress


class GoalService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_goal(self, user_id: int, goal_data: GoalCreate) -> Goal:
        """Создать новую финансовую цель"""
        db_goal = GoalModel(
            user_id=user_id,
            **goal_data.model_dump()
        )
        
        self.db.add(db_goal)
        await self.db.commit()
        await self.db.refresh(db_goal)
        
        return Goal.model_validate(db_goal)

    async def get_user_goals(
        self,
        user_id: int,
        skip: int = 0,
        limit: int = 100,
        status_filter: Optional[str] = None
    ) -> List[Goal]:
        """Получить цели пользователя с фильтрацией"""
        query = select(GoalModel).where(GoalModel.user_id == user_id)
        
        if status_filter:
            query = query.where(GoalModel.status == status_filter)
        
        # Сортировка по дате создания (новые сначала)
        query = query.order_by(GoalModel.created_at.desc())
        
        # Пагинация
        query = query.offset(skip).limit(limit)
        
        result = await self.db.execute(query)
        goals = result.scalars().all()
        
        return [Goal.model_validate(goal) for goal in goals]

    async def get_goal(self, goal_id: int, user_id: int) -> Optional[Goal]:
        """Получить конкретную цель"""
        result = await self.db.execute(
            select(GoalModel).where(
                and_(
                    GoalModel.id == goal_id,
                    GoalModel.user_id == user_id
                )
            )
        )
        goal = result.scalar_one_or_none()
        
        if goal:
            return Goal.model_validate(goal)
        return None

    async def update_goal(
        self,
        goal_id: int,
        user_id: int,
        goal_update: GoalUpdate
    ) -> Optional[Goal]:
        """Обновить цель"""
        result = await self.db.execute(
            select(GoalModel).where(
                and_(
                    GoalModel.id == goal_id,
                    GoalModel.user_id == user_id
                )
            )
        )
        goal = result.scalar_one_or_none()
        
        if not goal:
            return None
        
        update_data = goal_update.model_dump(exclude_unset=True)
        
        for field, value in update_data.items():
            setattr(goal, field, value)
        
        # Проверяем, достигнута ли цель
        if goal.current_amount >= goal.target_amount:
            goal.is_achieved = True
            goal.status = GoalStatus.COMPLETED
        
        await self.db.commit()
        await self.db.refresh(goal)
        
        return Goal.model_validate(goal)

    async def contribute_to_goal(self, goal_id: int, user_id: int, amount: float) -> bool:
        """Внести вклад в цель"""
        result = await self.db.execute(
            select(GoalModel).where(
                and_(
                    GoalModel.id == goal_id,
                    GoalModel.user_id == user_id,
                    GoalModel.status == GoalStatus.ACTIVE
                )
            )
        )
        goal = result.scalar_one_or_none()
        
        if not goal:
            return False
        
        goal.current_amount += amount
        
        # Проверяем, достигнута ли цель
        if goal.current_amount >= goal.target_amount:
            goal.is_achieved = True
            goal.status = GoalStatus.COMPLETED
        
        await self.db.commit()
        
        return True

    async def delete_goal(self, goal_id: int, user_id: int) -> bool:
        """Удалить цель"""
        result = await self.db.execute(
            select(GoalModel).where(
                and_(
                    GoalModel.id == goal_id,
                    GoalModel.user_id == user_id
                )
            )
        )
        goal = result.scalar_one_or_none()
        
        if not goal:
            return False
        
        await self.db.delete(goal)
        await self.db.commit()
        
        return True

    async def get_goals_progress(self, user_id: int) -> List[GoalProgress]:
        """Получить прогресс по всем активным целям"""
        result = await self.db.execute(
            select(GoalModel).where(
                and_(
                    GoalModel.user_id == user_id,
                    GoalModel.status == GoalStatus.ACTIVE
                )
            )
        )
        goals = result.scalars().all()
        
        progress_list = []
        for goal in goals:
            progress_percentage = (goal.current_amount / goal.target_amount) * 100
            
            days_remaining = None
            if goal.target_date:
                days_remaining = (goal.target_date - datetime.now()).days
                if days_remaining < 0:
                    days_remaining = 0
            
            progress_list.append(GoalProgress(
                goal_id=goal.id,
                title=goal.title,
                current_amount=goal.current_amount,
                target_amount=goal.target_amount,
                progress_percentage=round(progress_percentage, 2),
                days_remaining=days_remaining
            ))
        
        return progress_list
