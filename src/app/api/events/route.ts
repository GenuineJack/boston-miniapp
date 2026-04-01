import { NextResponse } from "next/server";

export const revalidate = 3600; // cache 1 hour

export interface EventItem {
  title: string;
  description: string;
  url: string;
  date: string;
  source: string;
  category: "city" | "arts" | "music" | "community" | "tech";
}

const EVENT_FEEDS: {
  name: string;
  url: string;
  category: EventItem["category"];
}[] = [
  {
    name: "Boston.gov",
    url: "https://www.boston.gov/news.rss",
    category: "city",
  },
  {
    name: "BCA",
    url: "https://bostonarts.org/feed/",
    category: "arts",
  },
  {
    name: "Sound of Boston",
    url: "https://thesoundofboston.com/feed/",
    category: "music",
  },
];

function extractEvents(
  xml: string,
  source: string,
  category: EventItem["category"]
): EventItem[] {
  const items: EventItem[] = [];
  const itemMatches = xml.matchAll(/<item>([\s\S]*?)<\/item>/g);
  for (const match of itemMatches) {
    const raw = match[1];
    const titleMatch = raw.match(
      /<title><!\[CDATA\[(.*?)\]\]><\/title>|<title>([^<]*)<\/title>/
    );
    const linkMatch = raw.match(
      /<link>([^<]*)<\/link>|<guid[^>]*>(https?:\/\/[^<]+)<\/guid>/
    );
    const pubDateMatch = raw.match(/<pubDate>([^<]*)<\/pubDate>/);
    const descMatch = raw.match(
      /<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>|<description>([^<]*)<\/description>/
    );

    const title = (titleMatch?.[1] ?? titleMatch?.[2] ?? "").trim();
    const url = (linkMatch?.[1] ?? linkMatch?.[2] ?? "").trim();
    const date = (pubDateMatch?.[1] ?? "").trim();
    const rawDesc = (descMatch?.[1] ?? descMatch?.[2] ?? "").trim();
    const description = rawDesc.replace(/<[^>]+>/g, "").trim().slice(0, 200);

    if (title && url) {
      items.push({ title, description, url, date, source, category });
    }
  }
  return items.slice(0, 10);
}

export async function GET() {
  const results = await Promise.allSettled(
    EVENT_FEEDS.map(async (feed) => {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 6000);
      try {
        const res = await fetch(feed.url, {
          signal: controller.signal,
          headers: { "User-Agent": "Boston Miniapp/1.0 RSS Reader" },
          next: { revalidate: 3600 },
        });
        clearTimeout(timeout);
        if (!res.ok) return [];
        const xml = await res.text();
        return extractEvents(xml, feed.name, feed.category);
      } catch {
        clearTimeout(timeout);
        return [];
      }
    })
  );

  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;

  const allEvents: EventItem[] = results
    .filter(
      (r): r is PromiseFulfilledResult<EventItem[]> => r.status === "fulfilled"
    )
    .flatMap((r) => r.value)
    .filter((item) => {
      // Filter out stale items older than 30 days
      if (!item.date) return true;
      try {
        return new Date(item.date).getTime() >= thirtyDaysAgo;
      } catch {
        return true;
      }
    })
    .sort((a, b) => {
      try {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } catch {
        return 0;
      }
    })
    .slice(0, 30);

  return NextResponse.json(
    { items: allEvents },
    {
      headers: {
        "Cache-Control": "s-maxage=3600, stale-while-revalidate=1800",
      },
    }
  );
}
