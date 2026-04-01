"use client";

import { useState, useEffect } from "react";
import { CommunityHappening, BostonGame } from "@/features/boston/types";
import { getCommunityHappenings } from "@/db/actions/boston-actions";
import { WeatherStrip, WeatherCache, WeatherData, fetchWeather, isWeatherCacheFresh } from "@/features/boston/components/weather-strip";
import { SportsRow, SportsCache, fetchAllGames, isSportsCacheFresh, getLocalDateStr } from "@/features/boston/components/sports-row";
import { HappeningsSection } from "@/features/boston/components/happenings-section";
import { NewsSection } from "@/features/boston/components/news-section";
import type { NewsItem } from "@/app/api/news/route";

type Props = {
  onNavigateToNeighborhood: (neighborhoodId: string) => void;
  onOpenSubmit: () => void;
  weatherCache: WeatherCache;
  onWeatherCacheUpdate: (cache: WeatherCache) => void;
  sportsCache: SportsCache;
  onSportsCacheUpdate: (cache: SportsCache) => void;
  newsCache: NewsItem[] | null;
  onNewsCacheUpdate: (items: NewsItem[]) => void;
};

export function TodayTab({
  onNavigateToNeighborhood,
  onOpenSubmit: _onOpenSubmit,
  weatherCache,
  onWeatherCacheUpdate,
  sportsCache,
  onSportsCacheUpdate,
  newsCache,
  onNewsCacheUpdate,
}: Props) {
  const [communityHappenings, setCommunityHappenings] = useState<CommunityHappening[]>([]);
  const [weatherLoading, setWeatherLoading] = useState(!isWeatherCacheFresh(weatherCache));
  const [weatherError, setWeatherError] = useState(false);
  const [sportsLoading, setSportsLoading] = useState(!isSportsCacheFresh(sportsCache));
  const [sportsFailed, setSportsFailed] = useState(false);

  useEffect(() => {
    getCommunityHappenings(20).then((data) => setCommunityHappenings(data as CommunityHappening[]));
  }, []);

  useEffect(() => {
    if (isWeatherCacheFresh(weatherCache)) { setWeatherLoading(false); return; }
    setWeatherLoading(true);
    fetchWeather()
      .then((data) => { onWeatherCacheUpdate({ data, timestamp: Date.now() }); setWeatherLoading(false); })
      .catch(() => { setWeatherError(true); setWeatherLoading(false); });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isSportsCacheFresh(sportsCache)) { setSportsLoading(false); return; }
    setSportsLoading(true);
    fetchAllGames()
      .then((data) => { onSportsCacheUpdate({ data, timestamp: Date.now(), date: getLocalDateStr(new Date()) }); setSportsLoading(false); })
      .catch(() => { setSportsFailed(true); setSportsLoading(false); });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const todayLabel = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  const weatherData: WeatherData | null = weatherCache?.data ?? null;
  const gamesData: BostonGame[] = sportsCache?.data ?? [];

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <WeatherStrip weather={weatherData} loading={weatherLoading} error={weatherError} todayLabel={todayLabel} />
      <div className="flex flex-col pb-6">
        <SportsRow games={gamesData} loading={sportsLoading} fetchFailed={sportsFailed} />
        <NewsSection cachedNews={newsCache} onNewsLoaded={onNewsCacheUpdate} />
        <HappeningsSection onNavigateToNeighborhood={onNavigateToNeighborhood} communityHappenings={communityHappenings} />
      </div>
    </div>
  );
}
