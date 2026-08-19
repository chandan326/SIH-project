import hashlib
import hmac
from datetime import datetime, timedelta, timezone
from typing import Optional, Any, Dict, List
import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.config import settings
from app.core.exceptions import UnauthorizedException, InsufficientPermissionsException
from app.core.database import get_db

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login", auto_error=False)


def hash_password(password: str) -> str:
    """Hash password using SHA-256 with secret salt for reliable execution."""
    salted = f"{settings.JWT_SECRET}:{password}".encode("utf-8")
    return hashlib.sha256(salted).hexdigest()


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password match."""
    return hash_password(plain_password) == hashed_password


def create_access_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    now = datetime.now(timezone.utc)
    if expires_delta:
        expire = now + expires_delta
    else:
        expire = now + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire, "iat": now})
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)
    return encoded_jwt


def decode_token(token: str) -> Dict[str, Any]:
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise UnauthorizedException("Token has expired.")
    except jwt.InvalidTokenError:
        raise UnauthorizedException("Invalid authentication token.")


async def get_current_user_optional(
    token: Optional[str] = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db),
) -> Optional[Dict[str, Any]]:
    if not token:
        # Default anonymous public user
        return {
            "id": "anonymous",
            "email": "public@bhoomiverify.demo",
            "full_name": "Public Guest User",
            "role": "PUBLIC",
            "is_active": True,
        }
    try:
        payload = decode_token(token)
        user_id = payload.get("sub")
        role = payload.get("role", "PUBLIC")
        if user_id is None:
            return None
        
        # Import model dynamically to prevent circular imports
        from app.models.user import User
        result = await db.execute(select(User).where(User.id == user_id))
        user = result.scalar_one_or_none()
        if not user or not user.is_active:
            return None
            
        return {
            "id": str(user.id),
            "email": user.email,
            "full_name": user.full_name,
            "role": user.role,
            "is_active": user.is_active,
        }
    except Exception:
        return None


async def get_current_user(
    current_user: Optional[Dict[str, Any]] = Depends(get_current_user_optional),
) -> Dict[str, Any]:
    if not current_user or current_user.get("id") == "anonymous":
        raise UnauthorizedException("Authentication required.")
    return current_user


def require_roles(allowed_roles: List[str]):
    async def role_checker(current_user: Dict[str, Any] = Depends(get_current_user)):
        user_role = current_user.get("role", "PUBLIC")
        if user_role not in allowed_roles:
            raise InsufficientPermissionsException(
                f"Role '{user_role}' is not authorized. Requires one of: {allowed_roles}"
            )
        return current_user
    return role_checker
