import { NextResponse } from "next/server";
import compsData from "@/lib/crexi_comps.json";

export async function GET() {
  return NextResponse.json(compsData);
}
