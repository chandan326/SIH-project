from typing import List, Tuple, Dict, Any, Optional
from pydantic import BaseModel


class MeasurementRequest(BaseModel):
    coordinates: List[Tuple[float, float]]  # [(lng, lat), ...]
    state_context: Optional[str] = "Maharanya"


class DistanceRequest(BaseModel):
    coordinates: List[Tuple[float, float]]


class MeasurementResponse(BaseModel):
    area_sq_m: float
    perimeter_m: float
    vertices_count: int
    coordinates: List[Tuple[float, float]]
    area_conversions: Dict[str, Any]
    label: str = "Estimated map measurement"
