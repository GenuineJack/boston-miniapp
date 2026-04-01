import { SketchHeading } from "@/components/sketch";

export function HeroSection() {
  return (
    <section className="text-center pt-8">
      <div className="text-5xl mb-4">🏙️</div>

      <SketchHeading level={1} underline className="text-[var(--primary-navy)]">
        Build Your City
      </SketchHeading>

      <p className="t-serif-body text-lg mt-4 leading-relaxed max-w-lg mx-auto">
        Everything you need to launch a Farcaster community mini-app for your
        hometown. Fork the template, let AI do the research, and deploy.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
        <a
          href="#get-started"
          className="onboarding-btn-start inline-block text-center"
          onClick={(e) => {
            e.preventDefault();
            document
              .getElementById("get-started")
              ?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          Get Started
        </a>
        <a
          href="https://github.com/GenuineJack/boston-miniapp"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-form-outline inline-flex items-center justify-center px-6 rounded-sm t-sans text-xs font-bold uppercase tracking-widest text-[var(--primary-navy)]"
        >
          View on GitHub ↗
        </a>
      </div>
    </section>
  );
}
