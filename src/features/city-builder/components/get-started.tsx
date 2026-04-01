import { SketchHeading, SketchCard } from "@/components/sketch";

const API_KEYS = [
  { name: "Neynar API Key", desc: "Farcaster authentication and social features", required: true },
  { name: "Database URL", desc: "PostgreSQL (Vercel Postgres or Supabase)", required: true },
  { name: "OpenAI API Key", desc: "Powers the daily dispatch AI generation", required: true },
  { name: "Transit API Key", desc: "City-specific — MBTA, CTA, BART, etc.", required: false },
];

export function GetStarted() {
  return (
    <section id="get-started">
      <SketchHeading level={2} className="text-[var(--primary-navy)] text-center mb-2">
        Get Started
      </SketchHeading>
      <p className="t-serif-body text-sm text-center mb-8 opacity-70">
        Choose your path
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {/* AI-guided path */}
        <SketchCard padding="md" className="border-2 border-[var(--primary-blue)]">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">🤖</span>
            <span className="label-boston text-[var(--primary-blue)] mb-0">
              Recommended
            </span>
          </div>
          <h3 className="t-sans font-bold text-base text-[var(--primary-navy)] mb-2">
            AI-Guided Setup
          </h3>
          <p className="t-serif-body text-sm leading-relaxed mb-4">
            Download the CITY-BUILDER.md skill file, load it into Claude, and
            tell it your city. The AI interviews you, researches everything, and
            generates your config files.
          </p>
          <a
            href="https://github.com/GenuineJack/boston-miniapp/blob/main/docs/CITY-BUILDER.md"
            target="_blank"
            rel="noopener noreferrer"
            className="onboarding-btn-start inline-block text-center w-full"
          >
            Download CITY-BUILDER.md ↗
          </a>
        </SketchCard>

        {/* Manual path */}
        <SketchCard padding="md">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">🛠</span>
            <span className="label-boston text-[var(--text-secondary)] mb-0">
              For Developers
            </span>
          </div>
          <h3 className="t-sans font-bold text-base text-[var(--primary-navy)] mb-2">
            Manual Setup
          </h3>
          <p className="t-serif-body text-sm leading-relaxed mb-4">
            Fork the repo, edit the config file directly, set up your own seed
            data, and deploy. Full control, no AI required.
          </p>
          <a
            href="https://github.com/GenuineJack/boston-miniapp"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-form-outline inline-flex items-center justify-center w-full h-[44px] rounded-sm t-sans text-xs font-bold uppercase tracking-widest text-[var(--primary-navy)]"
          >
            Fork on GitHub ↗
          </a>
        </SketchCard>
      </div>

      {/* API keys needed */}
      <div className="border-2 border-[var(--border-gray)] rounded-sm p-5">
        <h3 className="label-boston text-[var(--primary-navy)] mb-4">
          API Keys You&apos;ll Need
        </h3>
        <div className="flex flex-col gap-3">
          {API_KEYS.map((key) => (
            <div key={key.name} className="flex items-start gap-3">
              <span
                className={`text-xs font-bold mt-1 flex-shrink-0 ${
                  key.required
                    ? "text-[var(--primary-blue)]"
                    : "text-[var(--text-secondary)]"
                }`}
              >
                {key.required ? "REQUIRED" : "OPTIONAL"}
              </span>
              <div className="flex-1 min-w-0">
                <p className="t-sans text-sm font-semibold text-[var(--primary-navy)]">
                  {key.name}
                </p>
                <p className="t-serif-body text-xs opacity-70">{key.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
