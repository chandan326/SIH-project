import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID

from app.core.database import Base


class RecordOfRights(Base):
    __tablename__ = "record_of_rights"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    parcel_uid = Column(String(100), ForeignKey("parcels.parcel_uid", ondelete="CASCADE"), nullable=False, index=True)
    record_id = Column(String(100), unique=True, nullable=False)

    holder_name_demo = Column(String(255), nullable=False)
    father_husband_name_demo = Column(String(255), nullable=True)
    land_use = Column(String(100), nullable=False)
    area_recorded_sq_m = Column(Float, nullable=False)
    khata_number = Column(String(100), nullable=False)
    khasra_survey_number = Column(String(100), nullable=False)
    share_fraction = Column(String(50), default="1/1")
    status = Column(String(50), default="ACTIVE")
    last_updated = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
