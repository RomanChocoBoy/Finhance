from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime, timedelta
from typing import Optional

from app.core.database import get_db
from app.core.config import settings
from app.models.user import User as UserModel
from app.schemas.user import User, UserCreate, TokenData

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


class AuthService:
    def __init__(self, db: AsyncSession):
        self.db = db

    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        """Проверить пароль"""
        return pwd_context.verify(plain_password, hashed_password)

    def get_password_hash(self, password: str) -> str:
        """Хешировать пароль"""
        return pwd_context.hash(password)

    async def create_user(self, user_data: UserCreate) -> User:
        """Создать нового пользователя"""
        hashed_password = self.get_password_hash(user_data.password)
        
        db_user = UserModel(
            email=user_data.email,
            username=user_data.username,
            hashed_password=hashed_password
        )
        
        self.db.add(db_user)
        await self.db.commit()
        await self.db.refresh(db_user)
        
        return User.model_validate(db_user)

    async def authenticate_user(self, email: str, password: str) -> Optional[User]:
        """Аутентифицировать пользователя"""
        result = await self.db.execute(
            select(UserModel).where(UserModel.email == email)
        )
        user = result.scalar_one_or_none()
        
        if not user:
            return None
        if not self.verify_password(password, user.hashed_password):
            return None
        
        return User.model_validate(user)

    def create_access_token(self, data: dict, expires_delta: Optional[timedelta] = None) -> str:
        """Создать JWT токен"""
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
        return encoded_jwt

    async def get_current_user(
        self,
        token: str = Depends(oauth2_scheme),
        db: AsyncSession = Depends(get_db)
    ) -> User:
        """Получить текущего пользователя по токену"""
        credentials_exception = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Не удалось проверить учетные данные",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
            email: str = payload.get("sub")
            if email is None:
                raise credentials_exception
            token_data = TokenData(email=email)
        except JWTError:
            raise credentials_exception
        
        result = await db.execute(
            select(UserModel).where(UserModel.email == token_data.email)
        )
        user = result.scalar_one_or_none()
        
        if user is None:
            raise credentials_exception
        
        return User.model_validate(user)
