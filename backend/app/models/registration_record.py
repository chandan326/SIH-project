import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Float, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID

from app.core.database import Base


class RegistrationRecord(Base):
    __tablename__ = "registration_records"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    parcel_uid = Column(String(100), ForeignKey("parcels.parcel_uid", ondelete="CASCADE"), nullable=False, index=True)
    registration_id = Column(String(100), unique=True, nullable=False)
    document_number = Column(String(100), nullable=False)

    registration_date = Column(DateTime(timezone=True), nullable=False)
    transaction_type = Column(String(100), default="SALE_DEED")
    seller_demo = Column(String(255), nullable=False)
    buyer_demo = Column(String(255), nullable=False)
    registered_area_sq_m = Column(Float, nullable=False)
    stamp_duty_paid_demo = Column(Float, default=0.0)
    status = Column(String(50), default="REGISTERED")
