import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID

from app.core.database import Base


class CourtCase(Base):
    __tablename__ = "court_cases"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    parcel_uid = Column(String(100), ForeignKey("parcels.parcel_uid", ondelete="CASCADE"), nullable=False, index=True)
    case_id = Column(String(100), unique=True, nullable=False)

    court_name = Column(String(255), nullable=False)
    case_type = Column(String(100), default="TITLE_DISPUTE")  # TITLE_DISPUTE, BOUNDARY_DISPUTE, INHERITANCE
    status = Column(String(50), default="PENDING")  # PENDING, STAY_ORDER, DISPOSED
    filing_date = Column(DateTime(timezone=True), nullable=False)
    resolution_date = Column(DateTime(timezone=True), nullable=True)
    details = Column(Text, nullable=True)
