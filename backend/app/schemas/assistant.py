from typing import List, Dict, Any, Optional
from pydantic import BaseModel


class AssistantQueryRequest(BaseModel):
    message: str
    parcel_context_uid: Optional[str] = None


class AssistantQueryResponse(BaseModel):
    reply: str
    suggested_actions: List[str] = []
    source_parcels: List[str] = []
    guardrail_applied: bool = False
