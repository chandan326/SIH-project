from typing import List, Dict, Any, Optional
from datetime import datetime
from pydantic import BaseModel


class AnalyticsOverview(BaseModel):
    total_parcels: int
    verified_records: int
    missing_registrations: int
    record_mismatches: int
    pending_mutations: int
    active_encumbrances: int
    active_disputes: int
    manual_reviews_required: int
    parcels_by_state: Dict[str, int]
    verification_status_counts: Dict[str, int]


class AuditLogOut(BaseModel):
    id: str
    user_email: Optional[str]
    action: str
    resource: str
    ip_address: Optional[str]
    metadata_json: Optional[Dict[str, Any]]
    created_at: datetime

    class Config:
        from_attributes = True


class DatasetUploadResponse(BaseModel):
    version_tag: str
    total_records_processed: int
    valid_parcels: int
    invalid_geometries: int
    checksum: str
    status: str
    message: str
