import { NextRequest, NextResponse } from "next/server";
import { listParcels } from "@/lib/parcels-store";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const parcels = await listParcels(request.nextUrl.searchParams);
  return NextResponse.json(parcels, { headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate=300" } });
}
