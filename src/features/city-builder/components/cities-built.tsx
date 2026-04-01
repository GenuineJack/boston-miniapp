import { SketchHeading, SketchCard } from "@/components/sketch";

export function CitiesBuilt() {
  return (
    <section>
      <SketchHeading level={2} className="text-[var(--primary-navy)] text-center mb-2">
        Cities Built
      </SketchHeading>
      <p className="t-serif-body text-sm text-center mb-8 opacity-70">
        The growing network of city mini-apps on Farcaster
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Boston — flagship */}
        <SketchCard padding="md" className="border-2 border-[var(--primary-blue)]">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">🦞</span>
            <div>
              <h3 className="t-sans font-bold text-base text-[var(--primary-navy)]">
                Boston
              </h3>
              <span className="label-boston text-[var(--primary-blue)] mb-0">
                Flagship
              </span>
            </div>
          </div>
          <p className="t-serif-body text-sm leading-relaxed mb-3">
            The original. 60+ spots, live MBTA alerts, Celtics &amp; Red Sox
            scores, daily dispatch, and a growing builder community.
          </p>
          <div className="flex gap-2 flex-wrap">
            <span className="text-xs bg-[var(--card-bg)] px-2 py-1 rounded-sm t-sans font-semibold text-[var(--body-text)]">
              60+ spots
            </span>
            <span className="text-xs bg-[var(--card-bg)] px-2 py-1 rounded-sm t-sans font-semibold text-[var(--body-text)]">
              5 sports teams
            </span>
            <span className="text-xs bg-[var(--card-bg)] px-2 py-1 rounded-sm t-sans font-semibold text-[var(--body-text)]">
              16 neighborhoods
            </span>
          </div>
        </SketchCard>

        {/* Your city CTA */}
        <SketchCard padding="md" className="border-2 border-dashed border-[var(--border-gray)]">
          <div className="flex flex-col items-center justify-center text-center h-full min-h-[160px]">
            <span className="text-4xl mb-3">🏙️</span>
            <h3 className="t-sans font-bold text-base text-[var(--primary-navy)] mb-1">
              Your City Here
            </h3>
            <p className="t-serif-body text-sm text-[var(--text-secondary)] mb-4">
              Be the first to launch a mini-app for your hometown.
            </p>
            <a
              href="#get-started"
              className="t-sans text-xs font-bold uppercase tracking-wider text-[var(--primary-blue)] hover:underline"
              onClick={(e) => {
                e.preventDefault();
                document
                  .getElementById("get-started")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Get started →
            </a>
          </div>
        </SketchCard>
      </div>
    </section>
  );
}
