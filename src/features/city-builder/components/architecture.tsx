import { SketchHeading, SketchCard } from "@/components/sketch";

const STACK = [
  { label: "Framework", value: "Next.js 15 + React 19" },
  { label: "Protocol", value: "Farcaster Mini-App SDK" },
  { label: "Database", value: "PostgreSQL via Drizzle ORM" },
  { label: "Hosting", value: "Vercel (or any Node host)" },
  { label: "UI", value: "Sketch component library + Tailwind" },
  { label: "AI", value: "OpenAI for daily dispatch generation" },
  { label: "Transit", value: "Pluggable adapters (MBTA, GTFS, custom, or none)" },
  { label: "State", value: "Jotai + React Query" },
];

export function Architecture() {
  return (
    <section>
      <SketchHeading level={2} className="text-[var(--primary-navy)] text-center mb-2">
        Under the Hood
      </SketchHeading>
      <p className="t-serif-body text-sm text-center mb-8 opacity-70">
        Production-ready stack, fully open source
      </p>

      <SketchCard padding="md">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {STACK.map((item) => (
            <div key={item.label} className="flex flex-col">
              <span className="label-boston text-[var(--text-secondary)]">
                {item.label}
              </span>
              <span className="t-sans text-sm font-semibold text-[var(--primary-navy)]">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </SketchCard>

      <div className="mt-6 flex flex-col gap-3">
        <SketchCard padding="sm">
          <div className="flex items-center gap-3">
            <span className="text-xl">📁</span>
            <div>
              <p className="t-sans text-xs font-bold uppercase tracking-wider text-[var(--primary-navy)]">
                city.config.ts
              </p>
              <p className="t-serif-body text-xs opacity-70">
                Every city-specific value in one file — neighborhoods, feeds, teams, theme, voice
              </p>
            </div>
          </div>
        </SketchCard>

        <SketchCard padding="sm">
          <div className="flex items-center gap-3">
            <span className="text-xl">🗄️</span>
            <div>
              <p className="t-sans text-xs font-bold uppercase tracking-wider text-[var(--primary-navy)]">
                spots_seed.csv
              </p>
              <p className="t-serif-body text-xs opacity-70">
                Your city's initial spots — AI generates 50+ entries with coordinates and descriptions
              </p>
            </div>
          </div>
        </SketchCard>

        <SketchCard padding="sm">
          <div className="flex items-center gap-3">
            <span className="text-xl">🎨</span>
            <div>
              <p className="t-sans text-xs font-bold uppercase tracking-wider text-[var(--primary-navy)]">
                Theme colors
              </p>
              <p className="t-serif-body text-xs opacity-70">
                Scraped from your city&apos;s .gov site and applied across every component
              </p>
            </div>
          </div>
        </SketchCard>
      </div>
    </section>
  );
}
