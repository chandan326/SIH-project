from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_, and_

from app.core.database import get_db
from app.core.exceptions import ParcelNotFoundException, BhoomiVerifyException
from app.models.parcel import Parcel
from app.models.record_of_rights import RecordOfRights
from app.models.registration_record import RegistrationRecord
from app.models.mutation_record import MutationRecord
from app.models.encumbrance import Encumbrance
from app.models.court_case import CourtCase
from app.schemas.parcel import (
    ParcelOut,
    ParcelDetailOut,
    RecordSummary,
    SpatialAnalysis,
    ParcelSplitRequest,
    ParcelSplitResult,
)
from app.services.verification_service import VerificationEngine
from app.services.spatial_service import SpatialService
from app.utils.gis_units import convert_land_area

router = APIRouter(prefix="/parcels", tags=["Parcels"])


@router.get("", response_model=List[ParcelOut])
async def list_parcels(
    query: Optional[str] = None,
    state: Optional[str] = None,
    district: Optional[str] = None,
    tehsil: Optional[str] = None,
    village: Optional[str] = None,
    land_use: Optional[str] = None,
    bbox: Optional[str] = Query(None, description="min_lng,min_lat,max_lng,max_lat"),
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=500),
    db: AsyncSession = Depends(get_db),
):
    stmt = select(Parcel)

    filters = []
    if query:
        q_pattern = f"%{query}%"
        filters.append(
            or_(
                Parcel.parcel_uid.ilike(q_pattern),
                Parcel.survey_number.ilike(q_pattern),
                Parcel.khasra_number.ilike(q_pattern),
                Parcel.plot_number.ilike(q_pattern),
                Parcel.khata_number.ilike(q_pattern),
                Parcel.village.ilike(q_pattern),
                Parcel.tehsil.ilike(q_pattern),
            )
        )

    if state:
        filters.append(Parcel.state == state)
    if district:
        filters.append(Parcel.district == district)
    if tehsil:
        filters.append(Parcel.tehsil == tehsil)
    if village:
        filters.append(Parcel.village == village)
    if land_use:
        filters.append(Parcel.land_use == land_use)

    if bbox:
        try:
            parts = [float(x.strip()) for x in bbox.split(",")]
            if len(parts) == 4:
                min_lng, min_lat, max_lng, max_lat = parts
                filters.append(
                    and_(
                        Parcel.bbox_xmax >= min_lng,
                        Parcel.bbox_xmin <= max_lng,
                        Parcel.bbox_ymax >= min_lat,
                        Parcel.bbox_ymin <= max_lat,
                    )
                )
        except Exception:
            pass

    if filters:
        stmt = stmt.where(and_(*filters))

    stmt = stmt.offset((page - 1) * limit).limit(limit)
    res = await db.execute(stmt)
    return res.scalars().all()


@router.get("/{parcel_uid}", response_model=ParcelDetailOut)
async def get_parcel_detail(parcel_uid: str, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(Parcel).where(Parcel.parcel_uid == parcel_uid))
    parcel = res.scalar_one_or_none()
    if not parcel:
        raise ParcelNotFoundException(parcel_uid)

    # Evaluate Records
    ror_res = await db.execute(select(RecordOfRights).where(RecordOfRights.parcel_uid == parcel_uid))
    ror = ror_res.scalar_one_or_none()

    reg_res = await db.execute(select(RegistrationRecord).where(RegistrationRecord.parcel_uid == parcel_uid))
    reg = reg_res.scalar_one_or_none()

    mut_res = await db.execute(select(MutationRecord).where(MutationRecord.parcel_uid == parcel_uid))
    mut = mut_res.scalar_one_or_none()

    enc_res = await db.execute(select(Encumbrance).where(Encumbrance.parcel_uid == parcel_uid, Encumbrance.status == "ACTIVE"))
    encumbrances = enc_res.scalars().all()

    dispute_res = await db.execute(select(CourtCase).where(CourtCase.parcel_uid == parcel_uid, CourtCase.status.in_(["PENDING", "STAY_ORDER"])))
    disputes = dispute_res.scalars().all()

    # Run Verification Engine for Consistency Score
    engine = VerificationEngine(db)
    verif = await engine.evaluate_parcel(parcel_uid)

    record_summary = RecordSummary(
        ror_found=bool(ror),
        registration_found=bool(reg),
        mutation_status=mut.status if mut else "MISSING",
        encumbrance_status="FOUND" if encumbrances else "NONE",
        dispute_status="FOUND" if disputes else "NONE",
        spatial_match=bool(parcel.is_geometry_valid),
    )

    spatial_analysis = SpatialAnalysis(
        recorded_area_sq_m=ror.area_recorded_sq_m if ror else None,
        calculated_area_sq_m=parcel.area_sq_m,
        area_difference_sq_m=abs(ror.area_recorded_sq_m - parcel.area_sq_m) if ror else None,
        area_difference_percent=round(abs(ror.area_recorded_sq_m - parcel.area_sq_m) / ror.area_recorded_sq_m * 100, 2) if ror and ror.area_recorded_sq_m > 0 else None,
        perimeter_m=parcel.perimeter_m,
        is_geometry_valid=parcel.is_geometry_valid,
    )

    conversions = convert_land_area(parcel.area_sq_m, parcel.state)

    history = []
    if reg:
        history.append({
            "event": "DEED_REGISTRATION",
            "date": reg.registration_date.strftime("%Y-%m-%d"),
            "details": f"Registered document #{reg.document_number} from {reg.seller_demo} to {reg.buyer_demo}.",
        })
    if mut:
        history.append({
            "event": "MUTATION_APPLICATION",
            "date": mut.application_date.strftime("%Y-%m-%d"),
            "details": f"Mutation type: {mut.mutation_type}, Status: {mut.status}",
        })
    for e in encumbrances:
        history.append({
            "event": "ENCUMBRANCE_RECORDED",
            "date": e.date_created.strftime("%Y-%m-%d"),
            "details": f"{e.type} held by {e.holder_bank_demo}.",
        })
    for d in disputes:
        history.append({
            "event": "COURT_CASE_FILED",
            "date": d.filing_date.strftime("%Y-%m-%d"),
            "details": f"{d.case_type} filed in {d.court_name}.",
        })

    return ParcelDetailOut(
        id=str(parcel.id),
        parcel_uid=parcel.parcel_uid,
        state=parcel.state,
        district=parcel.district,
        sub_district=parcel.sub_district,
        tehsil=parcel.tehsil,
        village=parcel.village,
        ward=parcel.ward,
        pincode=parcel.pincode,
        survey_number=parcel.survey_number,
        khasra_number=parcel.khasra_number,
        plot_number=parcel.plot_number,
        khata_number=parcel.khata_number,
        patta_number=parcel.patta_number,
        parcel_type=parcel.parcel_type,
        land_use=parcel.land_use,
        geometry_geojson=parcel.geometry_geojson,
        centroid_lat=parcel.centroid_lat,
        centroid_lng=parcel.centroid_lng,
        bbox_xmin=parcel.bbox_xmin,
        bbox_ymin=parcel.bbox_ymin,
        bbox_xmax=parcel.bbox_xmax,
        bbox_ymax=parcel.bbox_ymax,
        area_sq_m=parcel.area_sq_m,
        perimeter_m=parcel.perimeter_m,
        is_geometry_valid=parcel.is_geometry_valid,
        source_dataset=parcel.source_dataset,
        dataset_version=parcel.dataset_version,
        created_at=parcel.created_at,
        record_summary=record_summary,
        spatial_analysis=spatial_analysis,
        consistency_score=verif["score"],
        verification_status=verif["status"],
        findings=verif["findings"],
        area_conversions=conversions,
        history_events=history,
    )


@router.post("/split", response_model=ParcelSplitResult)
async def split_parcel_demo(request: ParcelSplitRequest, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(Parcel).where(Parcel.parcel_uid == request.parcel_uid))
    parcel = res.scalar_one_or_none()
    if not parcel:
        raise ParcelNotFoundException(request.parcel_uid)

    spatial_service = SpatialService(db)
    try:
        result = spatial_service.split_parcel_subdivision(
            parcel.geometry_geojson, request.split_line_geojson
        )
        result["original_parcel_uid"] = parcel.parcel_uid
        return result
    except Exception as e:
        raise BhoomiVerifyException(
            code="SPLIT_FAILED",
            message=f"Failed to split parcel polygon: {str(e)}"
        )
