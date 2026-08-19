import hashlib
from typing import List
from fastapi import APIRouter, Depends, UploadFile, File, Form
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.core.database import get_db
from app.core.security import require_roles
from app.models.parcel import Parcel
from app.models.record_of_rights import RecordOfRights
from app.models.registration_record import RegistrationRecord
from app.models.mutation_record import MutationRecord
from app.models.encumbrance import Encumbrance
from app.models.court_case import CourtCase
from app.models.verification import VerificationResult, AuditLog, DatasetVersion
from app.schemas.admin import AnalyticsOverview, AuditLogOut, DatasetUploadResponse
from app.utils.geojson_helper import validate_geojson_payload

router = APIRouter(prefix="/admin", tags=["Admin & Datasets"])


@router.get("/analytics", response_model=AnalyticsOverview)
async def get_analytics_overview(
    current_user: dict = Depends(require_roles(["REVIEWER", "ADMIN", "SUPER_ADMIN"])),
    db: AsyncSession = Depends(get_db),
):
    total_parcels = (await db.execute(select(func.count(Parcel.id)))).scalar() or 0
    total_verifs = (await db.execute(select(func.count(VerificationResult.id)))).scalar() or 0
    
    verified_records = (
        await db.execute(select(func.count(VerificationResult.id)).where(VerificationResult.status == "VERIFIED_IN_DEMO_DATA"))
    ).scalar() or 0

    missing_regs = (
        await db.execute(select(func.count(VerificationResult.id)).where(VerificationResult.status == "NO_REGISTRATION_RECORD_IN_DEMO_DATA"))
    ).scalar() or 0

    record_mismatches = (
        await db.execute(select(func.count(VerificationResult.id)).where(VerificationResult.status == "RECORD_MISMATCH"))
    ).scalar() or 0

    manual_reviews = (
        await db.execute(select(func.count(VerificationResult.id)).where(VerificationResult.status == "MANUAL_REVIEW_REQUIRED"))
    ).scalar() or 0

    pending_muts = (
        await db.execute(select(func.count(MutationRecord.id)).where(MutationRecord.status == "PENDING"))
    ).scalar() or 0

    active_encs = (
        await db.execute(select(func.count(Encumbrance.id)).where(Encumbrance.status == "ACTIVE"))
    ).scalar() or 0

    active_disputes = (
        await db.execute(select(func.count(CourtCase.id)).where(CourtCase.status.in_(["PENDING", "STAY_ORDER"])))
    ).scalar() or 0

    # Group by State
    state_res = await db.execute(select(Parcel.state, func.count(Parcel.id)).group_by(Parcel.state))
    parcels_by_state = {state: count for state, count in state_res.all()}

    # Group by Status
    status_res = await db.execute(select(VerificationResult.status, func.count(VerificationResult.id)).group_by(VerificationResult.status))
    status_counts = {status: count for status, count in status_res.all()}

    return AnalyticsOverview(
        total_parcels=total_parcels,
        verified_records=verified_records,
        missing_registrations=missing_regs,
        record_mismatches=record_mismatches,
        pending_mutations=pending_muts,
        active_encumbrances=active_encs,
        active_disputes=active_disputes,
        manual_reviews_required=manual_reviews,
        parcels_by_state=parcels_by_state,
        verification_status_counts=status_counts,
    )


@router.get("/audit-logs", response_model=List[AuditLogOut])
async def get_audit_logs(
    limit: int = 100,
    current_user: dict = Depends(require_roles(["ADMIN", "SUPER_ADMIN"])),
    db: AsyncSession = Depends(get_db),
):
    res = await db.execute(select(AuditLog).order_by(AuditLog.created_at.desc()).limit(limit))
    return res.scalars().all()


@router.post("/datasets/upload", response_model=DatasetUploadResponse)
async def upload_synthetic_geojson(
    file: UploadFile = File(...),
    version_tag: str = Form(...),
    current_user: dict = Depends(require_roles(["ADMIN", "SUPER_ADMIN"])),
    db: AsyncSession = Depends(get_db),
):
    content = await file.read()
    checksum = hashlib.sha256(content).hexdigest()

    parsed_geojson, error_msg = validate_geojson_payload(content)
    if not parsed_geojson:
        return DatasetUploadResponse(
            version_tag=version_tag,
            total_records_processed=0,
            valid_parcels=0,
            invalid_geometries=1,
            checksum=checksum,
            status="REJECTED",
            message=f"Invalid GeoJSON file format: {error_msg}",
        )

    features = parsed_geojson.get("features", [])
    
    # Register dataset version
    ds_version = DatasetVersion(
        version_tag=version_tag,
        checksum=checksum,
        total_parcels=len(features),
        status="PUBLISHED",
        uploaded_by=current_user.get("email", "Admin"),
    )
    db.add(ds_version)
    await db.commit()

    return DatasetUploadResponse(
        version_tag=version_tag,
        total_records_processed=len(features),
        valid_parcels=len(features),
        invalid_geometries=0,
        checksum=checksum,
        status="PUBLISHED",
        message=f"Successfully validated and registered synthetic dataset '{version_tag}' with {len(features)} parcels.",
    )
