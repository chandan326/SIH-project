from fastapi import APIRouter
from app.schemas.measurement import MeasurementRequest, MeasurementResponse, DistanceRequest
from app.utils.gis_units import (
    calculate_geodesic_area_sq_m,
    calculate_geodesic_perimeter_m,
    convert_land_area,
)

router = APIRouter(prefix="/measurements", tags=["Land Measurements"])


@router.post("/polygon", response_model=MeasurementResponse)
async def measure_polygon_area(request: MeasurementRequest):
    area_sq_m = calculate_geodesic_area_sq_m(request.coordinates)
    perimeter_m = calculate_geodesic_perimeter_m(request.coordinates)
    conversions = convert_land_area(area_sq_m, request.state_context or "Maharanya")

    return MeasurementResponse(
        area_sq_m=area_sq_m,
        perimeter_m=perimeter_m,
        vertices_count=len(request.coordinates),
        coordinates=request.coordinates,
        area_conversions=conversions,
        label="Estimated map measurement",
    )


@router.post("/distance")
async def measure_line_distance(request: DistanceRequest):
    perimeter_m = calculate_geodesic_perimeter_m(request.coordinates)
    return {
        "distance_meters": perimeter_m,
        "distance_km": round(perimeter_m / 1000.0, 3),
        "distance_feet": round(perimeter_m * 3.28084, 2),
        "distance_miles": round(perimeter_m * 0.000621371, 3),
        "label": "Estimated line distance",
    }
