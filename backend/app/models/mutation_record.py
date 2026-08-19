import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID

from app.core.database import Base


class MutationRecord(Base):
    __tablename__ = "mutation_records"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    parcel_uid = Column(String(100), ForeignKey("parcels.parcel_uid", ondelete="CASCADE"), nullable=False, index=True)
    mutation_id = Column(String(100), unique=True, nullable=False)

    mutation_type = Column(String(100), default="SALE_MUTATION")
    applicant_demo = Column(String(255), nullable=False)
    application_date = Column(DateTime(timezone=True), nullable=False)
    order_date = Column(DateTime(timezone=True), nullable=True)
    status = Column(String(50), default="COMPLETED")  # COMPLETED, PENDING, REJECTED
    remarks = Column(Text, nullable=True)
