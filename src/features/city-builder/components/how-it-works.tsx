import { SketchHeading, SketchCard } from "@/components/sketch";

const STEPS = [
  {
    num: "01",
    title: "Fork the Template",
    desc: "One-click fork on GitHub. You get the entire codebase — Next.js app, database schema, sketch UI library, API routes, and deployment config.",
    icon: "🍴",
  },
  {
    num: "02",
    title: "Let AI Research Your City",
    desc: "Download the CITY-BUILDER.md skill file, load it into Claude, and say \"I want to build a mini-app for [your city].\" The AI interviews you, researches your city, and generates all the config files you need.",
    icon: "🤖",
  },
  {
    num: "03",
    title: "Deploy",
    desc: "Push to Vercel, connect your Postgres database, paste in your env vars, seed the data, and you're live. The whole process fits in a single session.",
    icon: "🚀",
  },
];

export function HowItWorks() {
  return (
    <section>
      <SketchHeading level={2} className="text-[var(--primary-navy)] text-center mb-2">
        How It Works
      </SketchHeading>
      <p className="t-serif-body text-sm text-center mb-8 opacity-70">
        Three steps from zero to a live city app
      </p>

      <div className="flex flex-col gap-4">
        {STEPS.map((step, i) => (
          <SketchCard key={step.num} padding="md">
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[var(--primary-navy)] text-white flex items-center justify-center t-sans font-bold text-xs">
                {step.num}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="t-sans font-bold text-sm uppercase tracking-wider text-[var(--primary-navy)] mb-1">
                  <span className="mr-2">{step.icon}</span>
                  {step.title}
                </h3>
                <p className="t-serif-body text-sm leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
            {i < STEPS.length - 1 && (
              <div className="flex justify-center mt-3">
                <div className="w-px h-4 bg-[var(--border-gray)]" />
              </div>
            )}
          </SketchCard>
        ))}
      </div>

      <p className="t-serif-body text-xs text-center mt-4 italic opacity-60">
        Developers can skip step 2 and configure manually — it&apos;s just one
        config file.
      </p>
    </section>
  );
}
