import pytest
from app.utils.gis_units import (
    calculate_geodesic_area_sq_m,
    calculate_geodesic_perimeter_m,
    convert_land_area,
)


def test_geodesic_area_calculation():
    # Square polygon ~ 100m x 100m near equator
    coords = [
        (73.9780, 18.5780),
        (73.9790, 18.5780),
        (73.9790, 18.5790),
        (73.9780, 18.5790),
        (73.9780, 18.5780),
    ]
    area = calculate_geodesic_area_sq_m(coords)
    assert area > 1000.0
    assert area < 20000.0


def test_unit_conversions():
    res = convert_land_area(10000.0, "Maharanya")  # 1 Hectare
    assert res["hectares"] == 1.0
    assert res["acres"] == pytest.approx(2.471, rel=1e-2)
    assert "regional_units" in res
    assert "guntha" in res["regional_units"]
