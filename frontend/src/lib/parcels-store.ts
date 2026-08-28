import { Pool } from "pg";
import { demoParcels, MapParcel } from "./demo-parcels";

let pool: Pool | undefined;

function databasePool() {
  if (!process.env.DATABASE_URL) return undefined;
  pool ??= new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : undefined,
    max: 3,
    idleTimeoutMillis: 10_000,
    connectionTimeoutMillis: 4_000,
  });
  return pool;
}

export async function listParcels(filters: URLSearchParams): Promise<MapParcel[]> {
  const db = databasePool();
  if (db) {
    try {
      const result = await db.query<MapParcel>(
        `SELECT parcel_uid, state, district, tehsil, village, survey_number,
                khasra_number, land_use, centroid_lat, centroid_lng,
                geometry_geojson, area_sq_m, perimeter_m, is_geometry_valid,
                source_dataset, dataset_version
         FROM parcels ORDER BY parcel_uid LIMIT 500`
      );
      if (result.rows.length) return filterParcels(result.rows, filters);
    } catch (error) {
      console.error("PostgreSQL parcel query failed; serving demo dataset", error);
    }
  }
  return filterParcels(demoParcels, filters);
}

function filterParcels(parcels: MapParcel[], filters: URLSearchParams) {
  const query = (filters.get("query") || "").toLowerCase();
  const state = filters.get("state") || "";
  const landUse = filters.get("land_use") || "";
  const limit = Math.min(Number(filters.get("limit")) || 200, 500);
  return parcels.filter((parcel) => {
    const matchesQuery = !query || [parcel.parcel_uid, parcel.survey_number, parcel.khasra_number, parcel.village]
      .some((value) => value?.toLowerCase().includes(query));
    return matchesQuery && (!state || parcel.state === state) && (!landUse || parcel.land_use === landUse);
  }).slice(0, limit);
}
