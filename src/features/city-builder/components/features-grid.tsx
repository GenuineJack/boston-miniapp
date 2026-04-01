import { SketchHeading, SketchCard } from "@/components/sketch";

const FEATURES = [
  {
    emoji: "🗺",
    title: "Explore Tab",
    desc: "Interactive map with community-submitted spots — restaurants, cafes, parks, venues, hidden gems.",
  },
  {
    emoji: "🏘",
    title: "Neighborhoods",
    desc: "Browse your city's distinct areas with descriptions, curated picks, and spot counts.",
  },
  {
    emoji: "☀️",
    title: "Today Tab",
    desc: "Weather, transit alerts, local sports scores, community events, and top news — all live.",
  },
  {
    emoji: "👥",
    title: "Builders Directory",
    desc: "A directory of your city's Farcaster community members and what they're building.",
  },
  {
    emoji: "📰",
    title: "Daily Dispatch",
    desc: "AI-generated daily newsletter with local flavor, sports recaps, and editorial voice.",
  },
  {
    emoji: "📝",
    title: "Community Submissions",
    desc: "Let your community add their favorite spots and events. Moderation built in.",
  },
];

export function FeaturesGrid() {
  return (
    <section>
      <SketchHeading level={2} className="text-[var(--primary-navy)] text-center mb-2">
        What You Get
      </SketchHeading>
      <p className="t-serif-body text-sm text-center mb-8 opacity-70">
        A complete community mini-app — out of the box
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {FEATURES.map((f) => (
          <SketchCard key={f.title} padding="md">
            <div className="text-2xl mb-2">{f.emoji}</div>
            <h3 className="t-sans font-bold text-sm uppercase tracking-wider text-[var(--primary-navy)] mb-1">
              {f.title}
            </h3>
            <p className="t-serif-body text-sm leading-relaxed">{f.desc}</p>
          </SketchCard>
        ))}
      </div>
    </section>
  );
}
