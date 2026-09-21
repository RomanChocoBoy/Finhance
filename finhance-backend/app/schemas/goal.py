from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.models.goal import GoalStatus


class GoalBase(BaseModel):
    title: str
    description: Optional[str] = None
    target_amount: float
    target_date: Optional[datetime] = None


class GoalCreate(GoalBase):
    pass


class GoalUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    target_amount: Optional[float] = None
    target_date: Optional[datetime] = None
    status: Optional[GoalStatus] = None


class GoalInDB(GoalBase):
    id: int
    user_id: int
    current_amount: float
    status: GoalStatus
    is_achieved: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class Goal(GoalInDB):
    pass


class GoalProgress(BaseModel):
    goal_id: int
    title: str
    current_amount: float
    target_amount: float
    progress_percentage: float
    days_remaining: Optional[int] = None
