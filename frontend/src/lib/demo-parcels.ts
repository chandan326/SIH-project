export type MapParcel = {
  parcel_uid: string;
  state: string;
  district: string;
  tehsil: string;
  village: string;
  survey_number: string;
  khasra_number: string;
  land_use: string;
  centroid_lat: number;
  centroid_lng: number;
  geometry_geojson: { type: "Polygon"; coordinates: number[][][] };
  area_sq_m: number;
  perimeter_m: number;
  is_geometry_valid: boolean;
  source_dataset: string;
  dataset_version: string;
  consistency_score: number;
  verification_status: string;
};

const regions = [
  ["Maharashtra", "Pune", "Haveli", "Wagholi", 18.5789, 73.9785, "MH-PUN"],
  ["Uttar Pradesh", "Lucknow", "Bakshi Ka Talab", "Chandpur", 26.985, 80.952, "UP-LKO"],
  ["Karnataka", "Bengaluru Rural", "Devanahalli", "Avathi", 13.25, 77.71, "KA-BLR"],
  ["Rajasthan", "Jaipur", "Sanganer", "Watika", 26.78, 75.82, "RJ-JPR"],
] as const;

export const demoParcels: MapParcel[] = regions.flatMap((region, regionIndex) => {
  const [state, district, tehsil, village, baseLat, baseLng, prefix] = region;
  return Array.from({ length: 18 }, (_, index) => {
    const row = Math.floor(index / 6);
    const column = index % 6;
    const lat = baseLat + row * 0.00225;
    const lng = baseLng + column * 0.00225;
    const halfLat = 0.00078 + (index % 3) * 0.00004;
    const halfLng = 0.00082 + (index % 2) * 0.00005;
    const coordinates = [[
      [lng - halfLng, lat - halfLat],
      [lng + halfLng, lat - halfLat * 0.92],
      [lng + halfLng * 0.96, lat + halfLat],
      [lng - halfLng * 1.03, lat + halfLat * 0.95],
      [lng - halfLng, lat - halfLat],
    ]];
    const sequence = regionIndex * 18 + index + 1;
    const valid = sequence % 9 !== 0;
    return {
      parcel_uid: `BV-${prefix}-${String(sequence).padStart(5, "0")}`,
      state,
      district,
      tehsil,
      village,
      survey_number: `${110 + row}/${column + 1}`,
      khasra_number: `KH-${220 + sequence}`,
      land_use: sequence % 3 === 0 ? "Residential" : "Agricultural",
      centroid_lat: lat,
      centroid_lng: lng,
      geometry_geojson: { type: "Polygon", coordinates },
      area_sq_m: Math.round(28000 + (sequence % 11) * 1730),
      perimeter_m: Math.round(680 + (sequence % 8) * 37),
      is_geometry_valid: valid,
      source_dataset: "synthetic_cadastral_demo",
      dataset_version: "demo-2026.08",
      consistency_score: valid ? 88 + (sequence % 11) : 54,
      verification_status: valid ? "VERIFIED" : "REVIEW_REQUIRED",
    };
  });
});
