from typing import List, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.parcel import Parcel
from app.models.record_of_rights import RecordOfRights
from app.models.registration_record import RegistrationRecord


class DataQualityService:
    """Service to audit synthetic dataset health and flag inconsistencies."""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def run_quality_audit() -> Dict[str, Any]:
        parcels_res = await self.db.execute(select(Parcel))
        parcels = parcels_res.scalars().all()

        missing_reg_count = 0
        area_mismatch_count = 0
        invalid_geom_count = 0

        issues = []
        for p in parcels:
            if not p.is_geometry_valid:
                invalid_geom_count += 1
                issues.append({
                    "severity": "HIGH",
                    "code": "INVALID_GEOMETRY",
                    "parcel_uid": p.parcel_uid,
                    "message": f"Parcel '{p.parcel_uid}' has self-intersecting boundary.",
                })

            reg_res = await self.db.execute(
                select(RegistrationRecord).where(RegistrationRecord.parcel_uid == p.parcel_uid)
            )
            if not reg_res.scalar_one_or_none():
                missing_reg_count += 1

            ror_res = await self.db.execute(
                select(RecordOfRights).where(RecordOfRights.parcel_uid == p.parcel_uid)
            )
            ror = ror_res.scalar_one_or_none()
            if ror:
                diff = abs(ror.area_recorded_sq_m - p.area_sq_m)
                if diff > (0.05 * ror.area_recorded_sq_m):
                    area_mismatch_count += 1
                    issues.append({
                        "severity": "MEDIUM",
                        "code": "AREA_MISMATCH",
                        "parcel_uid": p.parcel_uid,
                        "message": f"RoR recorded area ({ror.area_recorded_sq_m}) differs from GIS area ({p.area_sq_m:.1f}).",
                    })

        return {
            "total_parcels_audited": len(parcels),
            "missing_registrations": missing_reg_count,
            "area_mismatches": area_mismatch_count,
            "invalid_geometries": invalid_geom_count,
            "sample_issues": issues[:20],
        }
