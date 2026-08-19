from typing import List, Dict, Any, Optional
from datetime import datetime
from pydantic import BaseModel


class VerificationFinding(BaseModel):
    category: str
    severity: str  # HIGH, MEDIUM, LOW, INFO
    code: str
    message: str
    score_impact: int
    details: Dict[str, Any] = {}


class VerificationRunRequest(BaseModel):
    parcel_uid: str
    force_recalculate: bool = False


class VerificationResultOut(BaseModel):
    verification_id: str
    parcel_uid: str
    status: str
    score: int
    findings: List[VerificationFinding]
    engine_version: str
    dataset_version: str
    rules_version: str
    review_status: str
    reviewer_remarks: Optional[str] = None
    created_at: datetime
    disclaimer: str = (
        "This verification uses synthetic demonstration data and does not establish "
        "legal ownership, title, registration status, or encumbrance of any real property."
    )
