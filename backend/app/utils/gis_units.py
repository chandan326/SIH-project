import math
from typing import Dict, List, Tuple, Any
from app.core.config import settings


def calculate_geodesic_area_sq_m(coordinates: List[Tuple[float, float]]) -> float:
    """
    Computes approximate geodesic area in square meters for a list of (lng, lat) vertices
    using spherical polygon area formula on WGS84 ellipsoid model (R = 6378137m).
    """
    if len(coordinates) < 3:
        return 0.0

    # Ensure closed polygon
    if coordinates[0] != coordinates[-1]:
        coordinates = list(coordinates) + [coordinates[0]]

    radius = 6378137.0  # Earth radius in meters
    area = 0.0

    for i in range(len(coordinates) - 1):
        p1 = coordinates[i]
        p2 = coordinates[i + 1]
        rad_lat1 = math.radians(p1[1])
        rad_lat2 = math.radians(p2[1])
        rad_lng1 = math.radians(p1[0])
        rad_lng2 = math.radians(p2[0])

        area += (rad_lng2 - rad_lng1) * (2 + math.sin(rad_lat1) + math.sin(rad_lat2))

    area = abs(area * (radius * radius) / 2.0)
    return round(area, 2)


def calculate_geodesic_perimeter_m(coordinates: List[Tuple[float, float]]) -> float:
    """Computes total geodesic perimeter length in meters."""
    if len(coordinates) < 2:
        return 0.0

    radius = 6378137.0
    perimeter = 0.0

    for i in range(len(coordinates) - 1):
        p1 = coordinates[i]
        p2 = coordinates[i + 1]

        lat1, lng1 = math.radians(p1[1]), math.radians(p1[0])
        lat2, lng2 = math.radians(p2[1]), math.radians(p2[0])

        dlat = lat2 - lat1
        dlng = lng2 - lng1

        a = math.sin(dlat / 2.0) ** 2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlng / 2.0) ** 2
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        perimeter += radius * c

    return round(perimeter, 2)


def convert_land_area(area_sq_m: float, state: str = "Maharanya") -> Dict[str, Any]:
    """
    Converts area in square meters into standard & regional units based on state configuration.
    """
    sq_ft = round(area_sq_m * 10.7639, 2)
    acres = round(area_sq_m / 4046.86, 4)
    hectares = round(area_sq_m / 10000.0, 4)

    state_units = settings.REGIONAL_UNIT_CONVERSIONS.get(
        state, settings.REGIONAL_UNIT_CONVERSIONS["Maharanya"]
    )

    regional_breakdown = {}
    for unit_name, multiplier in state_units.items():
        regional_breakdown[unit_name] = round(area_sq_m / multiplier, 4)

    return {
        "square_meters": round(area_sq_m, 2),
        "square_feet": sq_ft,
        "acres": acres,
        "hectares": hectares,
        "state_context": state,
        "regional_units": regional_breakdown,
        "disclaimer": f"Regional land unit conversions based on configured standards for state of {state}.",
    }
