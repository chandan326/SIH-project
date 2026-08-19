import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID

from app.core.database import Base


class Encumbrance(Base):
    __tablename__ = "encumbrances"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    parcel_uid = Column(String(100), ForeignKey("parcels.parcel_uid", ondelete="CASCADE"), nullable=False, index=True)
    encumbrance_id = Column(String(100), unique=True, nullable=False)

    type = Column(String(100), nullable=False)  # MORTGAGE, BANK_LIEN, LEASE, CHARGE
    holder_bank_demo = Column(String(255), nullable=False)
    status = Column(String(50), default="ACTIVE")  # ACTIVE, RELEASED
    date_created = Column(DateTime(timezone=True), nullable=False)
    source_reference = Column(String(255), nullable=True)
    description = Column(Text, nullable=True)
