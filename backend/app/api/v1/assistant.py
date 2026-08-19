from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.schemas.assistant import AssistantQueryRequest, AssistantQueryResponse
from app.services.assistant_service import BhoomiAssistantService

router = APIRouter(prefix="/assistant", tags=["Bhoomi Assistant AI"])


@router.post("/chat", response_model=AssistantQueryResponse)
async def chat_with_bhoomi_assistant(
    request: AssistantQueryRequest, db: AsyncSession = Depends(get_db)
):
    service = BhoomiAssistantService(db)
    result = await service.process_query(request.message, request.parcel_context_uid)
    return result
