import { NextRequest, NextResponse } from "next/server";
import { getDispatchForDate, saveDispatch } from "@/db/actions/dispatch-actions";
import { getRecentSpots, getCommunityHappenings } from "@/db/actions/boston-actions";

export const maxDuration = 60;

// ─── Dispatch Content Type (for reference in the prompt) ─────────────────────

const DISPATCH_TYPE_REFERENCE = `
type DispatchContent = {
  date: string;                    // "Wednesday, April 1, 2026"
  banner: {
    weather: string;               // "68°F and sunny"
    transit: string | null;        // "Red Line slow near JFK/UMass" or null
    countdown: string | null;      // "Marathon Monday in 18 days" or null
  };
  intro: string;                   // 2-3 sentences, personality-driven opener
  whatYouMissed: {
    headline: string;              // one punchy sentence
    url: string;                   // link to source
  }[];                             // 3-5 items
  lastNight: {
    team: string;
    result: string;                // "Won 114-99" or "Lost 9-2"
    summary: string;               // 1-2 sentence recap
    url: string;
  }[] | null;                      // null if no games last night
  getAroundToday: string | null;   // one sentence MBTA action item, null if nothing
  tonight: {
    title: string;
    detail: string;
    url?: string;
  }[];                             // 3-4 items
  todaysSpot: {
    name: string;
    neighborhood: string;
    reason: string;                // editorial reason why today
    spotId?: string;               // if it's in the DB, link to it
  };
  onThisDay: string;               // one sentence Boston history fact
  theNumber: {
    number: string;                // e.g. "18"
    context: string;               // one sentence
  };
  weatherWatch?: string;           // only present if weather is newsworthy
  todayIntro?: string;             // one-sentence editorial greeting for the Today tab (separate from newsletter intro)
};`;

const DISPATCH_SYSTEM_PROMPT = `You are the editorial voice of The Boston Dispatch — a daily morning newsletter for people who live in Boston. You write like a Bostonian with strong opinions: specific, dry when appropriate, warm when it matters, never promotional, never generic.

Voice guidelines:
- Morning Brew energy but more local and more opinionated
- You are allowed to be sarcastic, especially about the Red Sox and the MBTA
- Short sentences. No listicles. No bullet points in the prose sections.
- Never say "vibrant," "something for everyone," or "world-class"
- Write like you have a point of view. You do.
- Include specific street names, venue names, neighborhoods when relevant
- Links are important — every news item in whatYouMissed must have a URL. Use the URLs provided in the context data.

You will receive structured data about today in Boston. Use what's relevant. Skip sections with no real content (no games last night = lastNight should be null). Never make things up. If you don't have real URLs for news items, use the source URLs provided.

Output format: You must respond with ONLY valid JSON matching the DispatchContent type. No preamble, no markdown, no explanation. Just the JSON object.

The "todayIntro" field is a single-sentence editorial greeting that appears at the top of the Today tab (separate from the newsletter). It should be timely, opinionated, and reflect what's happening in Boston today — weather, events, sports, or just the vibe. Examples: "Patriots finally have a quarterback and the city can't shut up about it.", "Marathon Monday — hide your car, move your life, enjoy the chaos.", "48 degrees and raining in April. Classic."

${DISPATCH_TYPE_REFERENCE}`;

// ─── Context Gathering ───────────────────────────────────────────────────────

async function fetchWeatherContext() {
  try {
    const res = await fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=42.3601&longitude=-71.0589&current=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min&temperature_unit=fahrenheit&timezone=America%2FNew_York",
      { cache: "no-store" },
    );
    if (!res.ok) return null;
    const json = await res.json();
    return {
      temp: Math.round(json.current.temperature_2m),
      code: json.current.weather_code,
      high: Math.round(json.daily.temperature_2m_max[0]),
      low: Math.round(json.daily.temperature_2m_min[0]),
    };
  } catch {
    return null;
  }
}

async function fetchMbtaAlerts() {
  try {
    const apiKey = process.env.MBTA_API_KEY;
    const baseUrl = "https://api-v3.mbta.com/alerts?filter[activity]=BOARD,EXIT&filter[route_type]=0,1,2&filter[lifecycle]=NEW,ONGOING";
    const url = apiKey ? `${baseUrl}&api_key=${apiKey}` : baseUrl;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return [];
    const json = await res.json();
    return (json.data ?? []).slice(0, 5).map((a: { attributes?: { header?: string } }) => ({
      header: a.attributes?.header ?? "",
    }));
  } catch {
    return [];
  }
}

async function fetchNewsHeadlines() {
  try {
    const feeds = [
      { url: "https://www.universalhub.com/rss.xml", source: "Universal Hub" },
      { url: "https://www.wbur.org/rss/news", source: "WBUR" },
      { url: "https://www.bostonherald.com/feed/", source: "Boston Herald" },
    ];
    const results = await Promise.allSettled(
      feeds.map(async (feed) => {
        const res = await fetch(feed.url, {
          headers: { "User-Agent": "Boston Miniapp/1.0" },
          signal: AbortSignal.timeout(6000),
        });
        if (!res.ok) return [];
        const xml = await res.text();
        const items: { title: string; url: string; source: string }[] = [];
        const matches = xml.matchAll(/<item>([\s\S]*?)<\/item>/g);
        for (const match of matches) {
          const titleMatch = match[1].match(/<title><!\[CDATA\[(.*?)\]\]><\/title>|<title>([^<]*)<\/title>/);
          const linkMatch = match[1].match(/<link>([^<]*)<\/link>/);
          const title = (titleMatch?.[1] ?? titleMatch?.[2] ?? "").trim();
          const url = (linkMatch?.[1] ?? "").trim();
          if (title && url) items.push({ title, url, source: feed.source });
          if (items.length >= 3) break;
        }
        return items;
      }),
    );
    return results
      .filter((r): r is PromiseFulfilledResult<{ title: string; url: string; source: string }[]> => r.status === "fulfilled")
      .flatMap((r) => r.value)
      .slice(0, 8);
  } catch {
    return [];
  }
}

function getWeatherDescription(code: number): string {
  if (code === 0) return "clear skies";
  if (code <= 3) return "partly cloudy";
  if (code === 45 || code === 48) return "foggy";
  if (code >= 51 && code <= 57) return "drizzle";
  if (code >= 61 && code <= 67) return "rain";
  if (code >= 71 && code <= 77) return "snow";
  if (code >= 80 && code <= 82) return "showers";
  if (code >= 95) return "thunderstorms";
  return "overcast";
}

function buildContextMessage(ctx: {
  date: string;
  dayOfWeek: string;
  weather: { temp: number; description: string; high: number } | null;
  mbtaAlerts: { header: string }[];
  newsHeadlines: { title: string; url: string; source: string }[];
  recentSpots: { name: string; neighborhood: string; category: string }[];
  happenings: { title: string; neighborhood: string; description: string }[];
}): string {
  return `
Today is ${ctx.date}, ${ctx.dayOfWeek}.
${ctx.weather ? `Current Boston weather: ${ctx.weather.temp}°F, ${ctx.weather.description}. High of ${ctx.weather.high}°F.` : "Weather data unavailable."}

MBTA alerts right now:
${ctx.mbtaAlerts.length ? ctx.mbtaAlerts.map((a) => `- ${a.header}`).join("\n") : "No active alerts."}

Recent news headlines (last 24hrs):
${ctx.newsHeadlines.length ? ctx.newsHeadlines.map((h) => `- "${h.title}" (${h.source}) — ${h.url}`).join("\n") : "No recent headlines available."}

New spots added to the guide (last 48hrs):
${ctx.recentSpots.length ? ctx.recentSpots.map((s) => `- ${s.name} in ${s.neighborhood} (${s.category})`).join("\n") : "No new spots in the last 48hrs."}

Community happenings today:
${ctx.happenings.length ? ctx.happenings.map((h) => `- ${h.title} in ${h.neighborhood}: ${h.description}`).join("\n") : "No community happenings today."}

Write today's dispatch.
  `.trim();
}

// ─── Route Handler ───────────────────────────────────────────────────────────

async function generateDispatch(authHeader: string | null): Promise<NextResponse> {
  // Verify cron secret
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return generateDispatchCore();
}

async function generateDispatchCore(): Promise<NextResponse> {
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  if (!anthropicKey) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY not configured" }, { status: 500 });
  }

  // Check if already generated today (idempotent)
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "America/New_York" }); // YYYY-MM-DD
  const existing = await getDispatchForDate(today);
  if (existing) {
    return NextResponse.json({ message: "Dispatch already generated for today", date: today });
  }

  // Gather context in parallel
  const [weather, mbtaAlerts, newsHeadlines, recentSpotsRaw, happeningsRaw] = await Promise.all([
    fetchWeatherContext(),
    fetchMbtaAlerts(),
    fetchNewsHeadlines(),
    getRecentSpots(10),
    getCommunityHappenings(10),
  ]);

  const now = new Date();
  const twoDaysAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);
  const recentSpots = (recentSpotsRaw as { name: string; neighborhood: string; category: string; createdAt: Date }[])
    .filter((s) => new Date(s.createdAt) >= twoDaysAgo)
    .map((s) => ({ name: s.name, neighborhood: s.neighborhood, category: s.category }));

  const happenings = (happeningsRaw as { title: string; neighborhood: string; description: string }[])
    .map((h) => ({ title: h.title, neighborhood: h.neighborhood, description: h.description }));

  const dateStr = now.toLocaleDateString("en-US", {
    timeZone: "America/New_York",
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const dayOfWeek = now.toLocaleDateString("en-US", { timeZone: "America/New_York", weekday: "long" });

  const contextMessage = buildContextMessage({
    date: dateStr,
    dayOfWeek,
    weather: weather
      ? { temp: weather.temp, description: getWeatherDescription(weather.code), high: weather.high }
      : null,
    mbtaAlerts,
    newsHeadlines,
    recentSpots,
    happenings,
  });

  // Call Anthropic API
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": anthropicKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2000,
        system: DISPATCH_SYSTEM_PROMPT,
        messages: [{ role: "user", content: contextMessage }],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("[dispatch] Anthropic API error:", err);
      return NextResponse.json({ error: "AI generation failed" }, { status: 500 });
    }

    const data = await response.json();
    const rawContent = data.content?.[0]?.text ?? "";

    // Validate JSON
    try {
      JSON.parse(rawContent);
    } catch {
      console.error("[dispatch] Invalid JSON from AI:", rawContent.slice(0, 200));
      return NextResponse.json({ error: "AI returned invalid JSON" }, { status: 500 });
    }

    await saveDispatch(today, rawContent);

    return NextResponse.json({ message: "Dispatch generated", date: today });
  } catch (err) {
    console.error("[dispatch] Generation failed:", err);
    return NextResponse.json({ error: "Generation failed" }, { status: 500 });
  }
}

// Vercel cron jobs invoke GET requests
export async function GET(request: NextRequest) {
  // If CRON_SECRET is set, verify it. Otherwise allow Vercel cron through.
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return generateDispatchCore();
}

// Admin panel uses POST (always requires auth)
export async function POST(request: NextRequest) {
  return generateDispatch(request.headers.get("authorization"));
}
