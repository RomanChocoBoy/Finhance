from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional

from app.models.user import User as UserModel
from app.schemas.user import User, UserUpdate


class UserService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_user_by_id(self, user_id: int) -> Optional[User]:
        """Получить пользователя по ID"""
        result = await self.db.execute(
            select(UserModel).where(UserModel.id == user_id)
        )
        user = result.scalar_one_or_none()
        
        if user:
            return User.model_validate(user)
        return None

    async def get_user_by_email(self, email: str) -> Optional[User]:
        """Получить пользователя по email"""
        result = await self.db.execute(
            select(UserModel).where(UserModel.email == email)
        )
        user = result.scalar_one_or_none()
        
        if user:
            return User.model_validate(user)
        return None

    async def update_user(self, user_id: int, user_update: UserUpdate) -> Optional[User]:
        """Обновить пользователя"""
        result = await self.db.execute(
            select(UserModel).where(UserModel.id == user_id)
        )
        user = result.scalar_one_or_none()
        
        if not user:
            return None
        
        update_data = user_update.model_dump(exclude_unset=True)
        
        # Если обновляется пароль, нужно его хешировать
        if "password" in update_data:
            from app.services.auth_service import AuthService
            auth_service = AuthService(self.db)
            update_data["hashed_password"] = auth_service.get_password_hash(update_data.pop("password"))
        
        for field, value in update_data.items():
            setattr(user, field, value)
        
        await self.db.commit()
        await self.db.refresh(user)
        
        return User.model_validate(user)

    async def delete_user(self, user_id: int) -> bool:
        """Удалить пользователя"""
        result = await self.db.execute(
            select(UserModel).where(UserModel.id == user_id)
        )
        user = result.scalar_one_or_none()
        
        if not user:
            return False
        
        await self.db.delete(user)
        await self.db.commit()
        
        return True
