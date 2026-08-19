import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, Response
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.core.exceptions import ParcelNotFoundException, BhoomiVerifyException
from app.models.parcel import Parcel
from app.schemas.report import ReportGenerateRequest, ReportOut, ReportVerifyResponse
from app.services.verification_service import VerificationEngine
from app.services.report_service import ReportService, REPORT_REGISTRY

router = APIRouter(prefix="/reports", tags=["Reports & Hash Verification"])


@router.post("/generate", response_model=ReportOut)
async def generate_demo_report(request: ReportGenerateRequest, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(Parcel).where(Parcel.parcel_uid == request.parcel_uid))
    parcel = res.scalar_one_or_none()
    if not parcel:
        raise ParcelNotFoundException(request.parcel_uid)

    engine = VerificationEngine(db)
    verif = await engine.evaluate_parcel(request.parcel_uid)

    report_id = f"BV-DEMO-{datetime.now().year}-{parcel.parcel_uid.replace('BV-', '')}"
    
    parcel_dict = {
        "parcel_uid": parcel.parcel_uid,
        "state": parcel.state,
        "district": parcel.district,
        "tehsil": parcel.tehsil,
        "village": parcel.village,
        "survey_number": parcel.survey_number,
        "khasra_number": parcel.khasra_number,
        "plot_number": parcel.plot_number,
        "khata_number": parcel.khata_number,
        "area_sq_m": parcel.area_sq_m,
        "perimeter_m": parcel.perimeter_m,
        "land_use": parcel.land_use,
        "is_geometry_valid": parcel.is_geometry_valid,
    }

    pdf_bytes = ReportService.generate_pdf_report(report_id, parcel_dict, verif)
    registry_entry = REPORT_REGISTRY.get(report_id, {})

    return ReportOut(
        report_id=report_id,
        parcel_uid=parcel.parcel_uid,
        generated_at=registry_entry.get("generated_at", datetime.now(timezone.utc)),
        verification_status=verif["status"],
        consistency_score=verif["score"],
        hash_sha256=registry_entry.get("hash_sha256", ""),
        download_url=f"/api/v1/reports/{report_id}/download",
        verify_url=f"/api/v1/reports/verify/{report_id}",
    )


@router.get("/{report_id}/download")
async def download_demo_report(report_id: str, db: AsyncSession = Depends(get_db)):
    entry = REPORT_REGISTRY.get(report_id)
    if not entry:
        raise BhoomiVerifyException(
            code="REPORT_NOT_FOUND",
            message="Report ID not found. Please generate a report first."
        )

    res = await db.execute(select(Parcel).where(Parcel.parcel_uid == entry["parcel_uid"]))
    parcel = res.scalar_one_or_none()
    if not parcel:
        raise ParcelNotFoundException(entry["parcel_uid"])

    engine = VerificationEngine(db)
    verif = await engine.evaluate_parcel(parcel.parcel_uid)

    parcel_dict = {
        "parcel_uid": parcel.parcel_uid,
        "state": parcel.state,
        "district": parcel.district,
        "tehsil": parcel.tehsil,
        "village": parcel.village,
        "survey_number": parcel.survey_number,
        "khasra_number": parcel.khasra_number,
        "plot_number": parcel.plot_number,
        "khata_number": parcel.khata_number,
        "area_sq_m": parcel.area_sq_m,
        "perimeter_m": parcel.perimeter_m,
        "land_use": parcel.land_use,
        "is_geometry_valid": parcel.is_geometry_valid,
    }

    pdf_bytes = ReportService.generate_pdf_report(report_id, parcel_dict, verif)

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename={report_id}.pdf"},
    )


@router.get("/verify/{report_id}", response_model=ReportVerifyResponse)
async def verify_report_hash(report_id: str):
    entry = REPORT_REGISTRY.get(report_id)
    if not entry:
        return ReportVerifyResponse(
            report_id=report_id,
            is_valid=False,
            parcel_uid="UNKNOWN",
            generated_at=datetime.now(timezone.utc),
            verification_status="UNVERIFIED",
            consistency_score=0,
            hash_sha256="",
            message="Invalid Report ID. This report record does not exist in the demo registry.",
        )

    return ReportVerifyResponse(
        report_id=report_id,
        is_valid=True,
        parcel_uid=entry["parcel_uid"],
        generated_at=entry["generated_at"],
        verification_status=entry["verification_status"],
        consistency_score=entry["consistency_score"],
        hash_sha256=entry["hash_sha256"],
        message="Demo Report is VALID and verified against cryptographic SHA-256 hash.",
    )
