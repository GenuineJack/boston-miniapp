import { NextResponse } from "next/server";

export const revalidate = 300; // cache 5 minutes

export async function GET() {
  try {
    const apiKey = process.env.MBTA_API_KEY;
    const baseUrl =
      "https://api-v3.mbta.com/alerts?filter[activity]=BOARD,EXIT&filter[route_type]=0,1&filter[lifecycle]=NEW,ONGOING";
    const url = apiKey ? `${baseUrl}&api_key=${apiKey}` : baseUrl;

    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) {
      return NextResponse.json({ alert: null });
    }

    const data = await res.json();
    const alerts = data.data ?? [];

    if (alerts.length === 0) {
      return NextResponse.json({ alert: null });
    }

    // Pick the highest-severity alert
    const sorted = [...alerts].sort(
      (a: { attributes?: { severity?: number } }, b: { attributes?: { severity?: number } }) =>
        (b.attributes?.severity ?? 0) - (a.attributes?.severity ?? 0),
    );
    const top = sorted[0];

    const header: string = top.attributes?.header ?? "";
    const affectedRoutes: string[] =
      top.relationships?.route?.data?.id
        ? [top.relationships.route.data.id]
        : (top.attributes?.informed_entity ?? [])
            .map((e: { route?: string }) => e.route)
            .filter(Boolean);

    return NextResponse.json({
      alert: {
        text: header,
        routes: [...new Set(affectedRoutes)],
        severity: top.attributes?.severity ?? 1,
      },
    });
  } catch {
    return NextResponse.json({ alert: null });
  }
}
