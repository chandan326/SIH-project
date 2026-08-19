from typing import Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel


class ReportGenerateRequest(BaseModel):
    parcel_uid: str


class ReportOut(BaseModel):
    report_id: str
    parcel_uid: str
    generated_at: datetime
    verification_status: str
    consistency_score: int
    hash_sha256: str
    download_url: str
    verify_url: str
    disclaimer: str = "DEMO / SYNTHETIC DATA — NOT A LEGAL LAND TITLE OR OWNERSHIP CERTIFICATE"


class ReportVerifyResponse(BaseModel):
    report_id: str
    is_valid: bool
    parcel_uid: str
    generated_at: datetime
    verification_status: str
    consistency_score: int
    hash_sha256: str
    message: str
