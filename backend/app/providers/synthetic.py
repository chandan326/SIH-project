from typing import Optional, Dict, Any, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.providers.base import (
    LandRecordProvider,
    RegistrationProvider,
    MutationProvider,
    CadastralProvider,
)
from app.models.record_of_rights import RecordOfRights
from app.models.registration_record import RegistrationRecord
from app.models.mutation_record import MutationRecord
from app.models.parcel import Parcel


class SyntheticLandRecordProvider(
    LandRecordProvider, RegistrationProvider, MutationProvider, CadastralProvider
):
    """Implementation querying the synthetic demonstration database."""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_ror_by_parcel_uid(self, parcel_uid: str) -> Optional[Dict[str, Any]]:
        result = await self.db.execute(
            select(RecordOfRights).where(RecordOfRights.parcel_uid == parcel_uid)
        )
        ror = result.scalar_one_or_none()
        if not ror:
            return None
        return {
            "record_id": ror.record_id,
            "parcel_uid": ror.parcel_uid,
            "holder_name_demo": ror.holder_name_demo,
            "land_use": ror.land_use,
            "area_recorded_sq_m": ror.area_recorded_sq_m,
            "khata_number": ror.khata_number,
            "khasra_survey_number": ror.khasra_survey_number,
            "status": ror.status,
            "last_updated": ror.last_updated.isoformat() if ror.last_updated else None,
        }

    async def search_ror_by_khasra(self, village: str, khasra_number: str) -> List[Dict[str, Any]]:
        result = await self.db.execute(
            select(RecordOfRights).where(RecordOfRights.khasra_survey_number == khasra_number)
        )
        rows = result.scalars().all()
        return [
            {
                "record_id": r.record_id,
                "parcel_uid": r.parcel_uid,
                "holder_name_demo": r.holder_name_demo,
                "area_recorded_sq_m": r.area_recorded_sq_m,
                "khata_number": r.khata_number,
            }
            for r in rows
        ]

    async def get_registration_by_parcel_uid(self, parcel_uid: str) -> Optional[Dict[str, Any]]:
        result = await self.db.execute(
            select(RegistrationRecord).where(RegistrationRecord.parcel_uid == parcel_uid)
        )
        reg = result.scalar_one_or_none()
        if not reg:
            return None
        return {
            "registration_id": reg.registration_id,
            "parcel_uid": reg.parcel_uid,
            "document_number": reg.document_number,
            "registration_date": reg.registration_date.isoformat(),
            "transaction_type": reg.transaction_type,
            "seller_demo": reg.seller_demo,
            "buyer_demo": reg.buyer_demo,
            "registered_area_sq_m": reg.registered_area_sq_m,
            "status": reg.status,
        }

    async def get_mutation_by_parcel_uid(self, parcel_uid: str) -> Optional[Dict[str, Any]]:
        result = await self.db.execute(
            select(MutationRecord).where(MutationRecord.parcel_uid == parcel_uid)
        )
        mut = result.scalar_one_or_none()
        if not mut:
            return None
        return {
            "mutation_id": mut.mutation_id,
            "parcel_uid": mut.parcel_uid,
            "mutation_type": mut.mutation_type,
            "applicant_demo": mut.applicant_demo,
            "application_date": mut.application_date.isoformat(),
            "order_date": mut.order_date.isoformat() if mut.order_date else None,
            "status": mut.status,
            "remarks": mut.remarks,
        }

    async def get_cadastral_geometry(self, parcel_uid: str) -> Optional[Dict[str, Any]]:
        result = await self.db.execute(
            select(Parcel).where(Parcel.parcel_uid == parcel_uid)
        )
        parcel = result.scalar_one_or_none()
        if not parcel:
            return None
        return {
            "parcel_uid": parcel.parcel_uid,
            "geometry_geojson": parcel.geometry_geojson,
            "area_sq_m": parcel.area_sq_m,
            "perimeter_m": parcel.perimeter_m,
            "is_geometry_valid": parcel.is_geometry_valid,
        }
