from typing import List, Dict, Any, Tuple, Optional
from shapely.geometry import shape, mapping, Polygon, LineString, MultiPolygon
from shapely.ops import split
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.parcel import Parcel
from app.utils.gis_units import calculate_geodesic_area_sq_m, calculate_geodesic_perimeter_m


class SpatialService:
    """Service providing spatial processing, overlap detection, and parcel subdivision."""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_parcels_in_bbox(
        self, min_lng: float, min_lat: float, max_lng: float, max_lat: float, limit: int = 200
    ) -> List[Parcel]:
        stmt = (
            select(Parcel)
            .where(
                Parcel.bbox_xmax >= min_lng,
                Parcel.bbox_xmin <= max_lng,
                Parcel.bbox_ymax >= min_lat,
                Parcel.bbox_ymin <= max_lat,
            )
            .limit(limit)
        )
        result = await self.db.execute(stmt)
        return list(result.scalars().all())

    async def check_spatial_overlap(self, target_parcel: Parcel) -> List[Dict[str, Any]]:
        """Finds overlapping parcels using Shapely intersection logic."""
        target_geom = shape(target_parcel.geometry_geojson)
        
        nearby_parcels = await self.get_parcels_in_bbox(
            target_parcel.bbox_xmin - 0.001,
            target_parcel.bbox_ymin - 0.001,
            target_parcel.bbox_xmax + 0.001,
            target_parcel.bbox_ymax + 0.001,
        )

        overlaps = []
        for other in nearby_parcels:
            if other.parcel_uid == target_parcel.parcel_uid:
                continue
            other_geom = shape(other.geometry_geojson)
            if target_geom.intersects(other_geom):
                intersection = target_geom.intersection(other_geom)
                if not intersection.is_empty and intersection.area > 1e-8:
                    inter_coords = list(intersection.exterior.coords) if hasattr(intersection, "exterior") else []
                    overlap_area_sq_m = calculate_geodesic_area_sq_m(inter_coords) if inter_coords else 0.0
                    overlaps.append({
                        "conflicting_parcel_uid": other.parcel_uid,
                        "survey_number": other.survey_number,
                        "khasra_number": other.khasra_number,
                        "overlap_area_sq_m": overlap_area_sq_m,
                    })

        return overlaps

    def split_parcel_subdivision(
        self, parcel_geojson: Dict[str, Any], split_line_geojson: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Splits a parcel polygon geometry using a divider LineString geometry.
        Returns proposed Parcel A & Parcel B with geodesic area calculations.
        """
        polygon_geom = shape(parcel_geojson)
        line_geom = shape(split_line_geojson)

        if not polygon_geom.is_valid:
            polygon_geom = polygon_geom.buffer(0)

        result_collection = split(polygon_geom, line_geom)
        subpolygons = [g for g in result_collection.geoms if isinstance(g, (Polygon, MultiPolygon))]

        if len(subpolygons) < 2:
            raise ValueError("The provided split line does not divide the parcel into multiple parts.")

        # Pick the two largest pieces
        subpolygons.sort(key=lambda p: p.area, reverse=True)
        geom_a = subpolygons[0]
        geom_b = subpolygons[1]

        coords_a = list(geom_a.exterior.coords)
        coords_b = list(geom_b.exterior.coords)

        area_a = calculate_geodesic_area_sq_m(coords_a)
        area_b = calculate_geodesic_area_sq_m(coords_b)

        orig_coords = list(polygon_geom.exterior.coords) if hasattr(polygon_geom, "exterior") else []
        orig_area = calculate_geodesic_area_sq_m(orig_coords)

        return {
            "original_area_sq_m": orig_area,
            "parcel_a_geometry": mapping(geom_a),
            "parcel_a_area_sq_m": area_a,
            "parcel_b_geometry": mapping(geom_b),
            "parcel_b_area_sq_m": area_b,
            "total_split_area_sq_m": round(area_a + area_b, 2),
            "area_difference_sq_m": round(abs(orig_area - (area_a + area_b)), 2),
            "disclaimer": "Proposed subdivision — not an official cadastral change.",
        }
