from typing import Optional, List, Dict, Any
from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, Field, field_serializer


class RecordSummary(BaseModel):
    ror_found: bool
    registration_found: bool
    mutation_status: str  # COMPLETE, PENDING, REJECTED, MISSING
    encumbrance_status: str  # NONE, FOUND, UNKNOWN
    dispute_status: str  # NONE, FOUND, UNKNOWN
    spatial_match: bool


class SpatialAnalysis(BaseModel):
    recorded_area_sq_m: Optional[float]
    calculated_area_sq_m: float
    area_difference_sq_m: Optional[float]
    area_difference_percent: Optional[float]
    perimeter_m: float
    is_geometry_valid: bool


class ParcelBase(BaseModel):
    parcel_uid: str
    state: str
    district: str
    sub_district: Optional[str] = None
    tehsil: str
    village: str
    ward: Optional[str] = None
    pincode: Optional[str] = None

    survey_number: Optional[str] = None
    khasra_number: Optional[str] = None
    plot_number: Optional[str] = None
    khata_number: Optional[str] = None
    patta_number: Optional[str] = None

    parcel_type: str = "AGRICULTURAL"
    land_use: str = "Agricultural"


class ParcelOut(ParcelBase):
    id: Any
    geometry_geojson: Dict[str, Any]
    centroid_lat: float
    centroid_lng: float
    bbox_xmin: float
    bbox_ymin: float
    bbox_xmax: float
    bbox_ymax: float
    area_sq_m: float
    perimeter_m: float
    is_geometry_valid: bool
    source_dataset: str
    dataset_version: str
    created_at: datetime

    @field_serializer('id')
    def serialize_id(self, id_val: Any, _info) -> str:
        return str(id_val)

    class Config:
        from_attributes = True


class ParcelDetailOut(ParcelOut):
    record_summary: RecordSummary
    spatial_analysis: SpatialAnalysis
    consistency_score: Optional[int] = None
    verification_status: Optional[str] = None
    findings: List[Dict[str, Any]] = []
    area_conversions: Dict[str, Any] = {}
    history_events: List[Dict[str, Any]] = []


class ParcelSearchFilter(BaseModel):
    query: Optional[str] = None
    state: Optional[str] = None
    district: Optional[str] = None
    tehsil: Optional[str] = None
    village: Optional[str] = None
    land_use: Optional[str] = None
    min_area: Optional[float] = None
    max_area: Optional[float] = None
    bbox: Optional[str] = None  # min_lng,min_lat,max_lng,max_lat
    page: int = Field(default=1, ge=1)
    limit: int = Field(default=50, ge=1, le=500)


class ParcelSplitRequest(BaseModel):
    parcel_uid: str
    split_line_geojson: Dict[str, Any]  # GeoJSON LineString splitting the polygon


class ParcelSplitResult(BaseModel):
    original_parcel_uid: str
    original_area_sq_m: float
    parcel_a_geometry: Dict[str, Any]
    parcel_a_area_sq_m: float
    parcel_b_geometry: Dict[str, Any]
    parcel_b_area_sq_m: float
    total_split_area_sq_m: float
    area_difference_sq_m: float
    disclaimer: str = "Proposed subdivision — not an official cadastral change."
