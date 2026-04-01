import { NextResponse } from "next/server";
import { getDispatchForDate } from "@/db/actions/dispatch-actions";

export const dynamic = "force-dynamic";
export const revalidate = 300; // cache 5 minutes

export async function GET() {
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "America/New_York" });
  const row = await getDispatchForDate(today);

  if (!row) {
    return NextResponse.json({ dispatch: null }, { status: 404 });
  }

  try {
    return NextResponse.json({ dispatch: JSON.parse(row.content) });
  } catch {
    return NextResponse.json({ dispatch: null }, { status: 500 });
  }
}
