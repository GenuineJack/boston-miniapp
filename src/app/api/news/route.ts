import { NextResponse } from 'next/server';

const FEEDS = [
  { name: 'Universal Hub', url: 'https://www.universalhub.com/rss.xml', color: '#c8102e' },
  { name: 'WBUR', url: 'https://www.wbur.org/rss/news', color: '#00549f' },
  { name: 'Boston Herald', url: 'https://www.bostonherald.com/feed/', color: '#091f2f' },
  { name: 'Boston Business Journal', url: 'https://feeds.bizjournals.com/bizj_boston', color: '#1a6b3c' },
];

export interface NewsItem {
  title: string;
  link: string;
  source: string;
  sourceColor: string;
  pubDate: string;
  description?: string;
}

function extractItems(xml: string, feedName: string, sourceColor: string): NewsItem[] {
  const items: NewsItem[] = [];
  const itemMatches = xml.matchAll(/<item>([\s\S]*?)<\/item>/g);
  for (const match of itemMatches) {
    const item = match[1];
    const titleMatch = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>|<title>([^<]*)<\/title>/);
    const linkMatch = item.match(/<link>([^<]*)<\/link>|<guid[^>]*>(https?:\/\/[^<]+)<\/guid>/);
    const pubDateMatch = item.match(/<pubDate>([^<]*)<\/pubDate>/);
    const descMatch = item.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>|<description>([^<]*)<\/description>/);
    const title = (titleMatch?.[1] ?? titleMatch?.[2] ?? '').trim();
    const link = (linkMatch?.[1] ?? linkMatch?.[2] ?? '').trim();
    const pubDate = (pubDateMatch?.[1] ?? '').trim();
    const rawDesc = (descMatch?.[1] ?? descMatch?.[2] ?? '').trim();
    const description = rawDesc.replace(/<[^>]+>/g, '').trim().slice(0, 200);
    if (title && link) items.push({ title, link, source: feedName, sourceColor, pubDate, description });
  }
  return items.slice(0, 8);
}

export async function GET() {
  const results = await Promise.allSettled(
    FEEDS.map(async (feed) => {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 6000);
      try {
        const res = await fetch(feed.url, {
          signal: controller.signal,
          headers: { 'User-Agent': 'Boston Miniapp/1.0 RSS Reader' },
          next: { revalidate: 1800 },
        });
        clearTimeout(timeout);
        if (!res.ok) return [];
        const xml = await res.text();
        return extractItems(xml, feed.name, feed.color);
      } catch {
        clearTimeout(timeout);
        return [];
      }
    })
  );

  const allItems: NewsItem[] = results
    .filter((r): r is PromiseFulfilledResult<NewsItem[]> => r.status === 'fulfilled')
    .flatMap((r) => r.value)
    .sort((a, b) => {
      try { return new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime(); }
      catch { return 0; }
    })
    .slice(0, 20);

  return NextResponse.json({ items: allItems }, {
    headers: { 'Cache-Control': 's-maxage=1800, stale-while-revalidate=900' },
  });
}
