"use client";

import { SketchFilters } from "@/components/sketch";
import { HeroSection } from "@/features/city-builder/components/hero-section";
import { FeaturesGrid } from "@/features/city-builder/components/features-grid";
import { HowItWorks } from "@/features/city-builder/components/how-it-works";
import { AiResearch } from "@/features/city-builder/components/ai-research";
import { Architecture } from "@/features/city-builder/components/architecture";
import { GetStarted } from "@/features/city-builder/components/get-started";
import { CitiesBuilt } from "@/features/city-builder/components/cities-built";
import { BuilderFooter } from "@/features/city-builder/components/builder-footer";

export function CityBuilderPage() {
  return (
    <div id="city-builders" className="min-h-screen">
      <SketchFilters />

      <div className="flex flex-col gap-16 py-8">
        <HeroSection />
        <FeaturesGrid />
        <HowItWorks />
        <AiResearch />
        <Architecture />
        <GetStarted />
        <CitiesBuilt />
        <BuilderFooter />
      </div>
    </div>
  );
}
