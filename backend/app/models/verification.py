import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, JSON, Text
from sqlalchemy.dialects.postgresql import UUID

from app.core.database import Base


class VerificationResult(Base):
    __tablename__ = "verifications"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    verification_id = Column(String(100), unique=True, nullable=False, index=True)
    parcel_uid = Column(String(100), ForeignKey("parcels.parcel_uid", ondelete="CASCADE"), nullable=False, index=True)

    status = Column(String(100), nullable=False)  # VERIFIED_IN_DEMO_DATA, NO_REGISTRATION_RECORD_IN_DEMO_DATA, RECORD_MISMATCH, etc.
    score = Column(Integer, nullable=False)  # 0 to 100
    findings_json = Column(JSON, nullable=False)  # List of reasons & score breakdown
    
    engine_version = Column(String(50), default="verification-1.0")
    dataset_version = Column(String(50), default="demo-2026.01")
    rules_version = Column(String(50), default="rules-1.0")

    reviewed_by_user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    reviewer_remarks = Column(Text, nullable=True)
    review_status = Column(String(50), default="UNREVIEWED")  # UNREVIEWED, APPROVED, REJECTED

    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True, index=True)
    user_email = Column(String(255), nullable=True)
    
    action = Column(String(100), nullable=False, index=True)
    resource = Column(String(255), nullable=False)
    ip_address = Column(String(100), nullable=True)
    metadata_json = Column(JSON, nullable=True)

    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), index=True)


class DatasetVersion(Base):
    __tablename__ = "dataset_versions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    version_tag = Column(String(100), unique=True, nullable=False, index=True)
    description = Column(Text, nullable=True)
    checksum = Column(String(255), nullable=False)
    total_parcels = Column(Integer, default=0)
    status = Column(String(50), default="PUBLISHED")  # DRAFT, PUBLISHED, ARCHIVED
    
    uploaded_by = Column(String(255), default="System Seed")
    published_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
