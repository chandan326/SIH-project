import json
from typing import Tuple, Optional, Dict, Any


def validate_geojson_payload(raw_bytes: bytes) -> Tuple[Optional[Dict[str, Any]], Optional[str]]:
    try:
        data = json.loads(raw_bytes.decode("utf-8"))
        if not isinstance(data, dict):
            return None, "Root element must be a JSON Object."
        
        geo_type = data.get("type")
        if geo_type not in ["FeatureCollection", "Feature", "Polygon", "MultiPolygon"]:
            return None, f"Unsupported GeoJSON type '{geo_type}'."
            
        return data, None
    except Exception as e:
        return None, str(e)
