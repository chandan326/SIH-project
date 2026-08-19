from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.schemas.verification import VerificationRunRequest, VerificationResultOut
from app.services.verification_service import VerificationEngine

router = APIRouter(prefix="/verification", tags=["Verification Engine"])


@router.post("/run", response_model=VerificationResultOut)
async def run_parcel_verification(
    request: VerificationRunRequest, db: AsyncSession = Depends(get_db)
):
    engine = VerificationEngine(db)
    result = await engine.evaluate_parcel(request.parcel_uid)
    return result
