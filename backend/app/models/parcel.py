import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Float, Boolean, DateTime, Text, JSON
from sqlalchemy.dialects.postgresql import UUID

from app.core.config import settings
from app.core.database import Base

if settings.USE_SQLITE:
    GeometryType = Text
else:
    from geoalchemy2 import Geometry
    GeometryType = Geometry(geometry_type="MULTIPOLYGON", srid=4326)


class Parcel(Base):
    __tablename__ = "parcels"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    parcel_uid = Column(String(100), unique=True, nullable=False, index=True)

    # Administrative Hierarchy
    state = Column(String(100), nullable=False, index=True)
    district = Column(String(100), nullable=False, index=True)
    sub_district = Column(String(100), nullable=True)
    tehsil = Column(String(100), nullable=False, index=True)
    village = Column(String(100), nullable=False, index=True)
    ward = Column(String(50), nullable=True)
    pincode = Column(String(20), nullable=True)

    # Land Record Identifiers
    survey_number = Column(String(100), nullable=True, index=True)
    khasra_number = Column(String(100), nullable=True, index=True)
    plot_number = Column(String(100), nullable=True, index=True)
    khata_number = Column(String(100), nullable=True, index=True)
    patta_number = Column(String(100), nullable=True)

    # Classification
    parcel_type = Column(String(50), default="AGRICULTURAL")
    land_use = Column(String(100), default="Agricultural")

    # Spatial Metadata
    geometry = Column(GeometryType, nullable=True)
    geometry_geojson = Column(JSON, nullable=False)
    centroid_lat = Column(Float, nullable=False)
    centroid_lng = Column(Float, nullable=False)
    bbox_xmin = Column(Float, nullable=False)
    bbox_ymin = Column(Float, nullable=False)
    bbox_xmax = Column(Float, nullable=False)
    bbox_ymax = Column(Float, nullable=False)
    
    area_sq_m = Column(Float, nullable=False)
    perimeter_m = Column(Float, nullable=False)
    is_geometry_valid = Column(Boolean, default=True)

    # Data Source & Versioning
    source_dataset = Column(String(100), default="synthetic_demo_v1")
    dataset_version = Column(String(50), default="demo-2026.01")
    
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
