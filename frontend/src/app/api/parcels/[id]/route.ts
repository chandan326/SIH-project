import { NextRequest, NextResponse } from "next/server";
import { listParcels } from "@/lib/parcels-store";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const parcels = await listParcels(new URLSearchParams({ limit: "500" }));
  const parcel = parcels.find((item) => item.parcel_uid === params.id);
  return parcel ? NextResponse.json(parcel) : NextResponse.json({ detail: "Parcel not found" }, { status: 404 });
}
