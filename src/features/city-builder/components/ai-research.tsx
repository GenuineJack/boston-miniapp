import { SketchHeading } from "@/components/sketch";

const RESEARCH_ITEMS = [
  { text: "50+ local spots with addresses, coordinates, and descriptions", emoji: "📍" },
  { text: "Neighborhood map with boundaries and character descriptions", emoji: "🗺" },
  { text: "Local news RSS feeds (newspapers, radio, hyperlocal blogs)", emoji: "📰" },
  { text: "Transit API integration — or graceful fallback if none exists", emoji: "🚇" },
  { text: "Sports teams, leagues, and seasons", emoji: "⚾" },
  { text: "Seasonal events and recurring happenings with dates", emoji: "🎉" },
  { text: "City editorial voice for the daily dispatch", emoji: "✍️" },
  { text: "Color theme scraped from your city's .gov website CSS", emoji: "🎨" },
  { text: "Complete deployment configuration and environment setup", emoji: "⚙️" },
];

export function AiResearch() {
  return (
    <section>
      <SketchHeading level={2} className="text-[var(--primary-navy)] text-center mb-2">
        What the AI Builds For You
      </SketchHeading>
      <p className="t-serif-body text-sm text-center mb-8 opacity-70">
        Load the skill doc into Claude — it handles the research
      </p>

      <div className="border-2 border-[var(--border-gray)] rounded-sm p-5">
        <div className="flex flex-col gap-3">
          {RESEARCH_ITEMS.map((item) => (
            <div key={item.text} className="flex items-start gap-3">
              <span className="text-lg flex-shrink-0 mt-0.5">{item.emoji}</span>
              <div className="flex items-start gap-2 flex-1 min-w-0">
                <span className="text-[var(--primary-blue)] font-bold text-sm mt-0.5 flex-shrink-0">
                  ✓
                </span>
                <p className="t-serif-body text-sm leading-relaxed">{item.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 pt-4 border-t border-[var(--border-gray)]">
          <p className="t-sans text-xs text-center text-[var(--text-secondary)] uppercase tracking-wider font-bold">
            One config file. That&apos;s all you change.
          </p>
        </div>
      </div>
    </section>
  );
}
