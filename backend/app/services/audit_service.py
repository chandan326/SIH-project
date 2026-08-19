from typing import Optional, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.verification import AuditLog


class AuditService:
    """Utility service to record security and operational audit logs."""

    @staticmethod
    async def log_action(
        db: AsyncSession,
        action: str,
        resource: str,
        user_id: Optional[str] = None,
        user_email: Optional[str] = None,
        ip_address: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None,
    ):
        log = AuditLog(
            user_id=user_id if user_id and user_id != "anonymous" else None,
            user_email=user_email,
            action=action,
            resource=resource,
            ip_address=ip_address,
            metadata_json=metadata or {},
        )
        db.add(log)
        await db.flush()
