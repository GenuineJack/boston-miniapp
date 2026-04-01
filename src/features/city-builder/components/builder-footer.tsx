export function BuilderFooter() {
  return (
    <footer className="border-t border-[var(--border-gray)] pt-8 pb-12 text-center">
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <a
          href="https://github.com/GenuineJack/boston-miniapp"
          target="_blank"
          rel="noopener noreferrer"
          className="t-sans text-xs font-bold uppercase tracking-wider text-[var(--primary-blue)] hover:underline"
        >
          GitHub
        </a>
        <span className="text-[var(--border-gray)]">·</span>
        <a
          href="https://github.com/GenuineJack/boston-miniapp/blob/main/docs/CITY-BUILDER.md"
          target="_blank"
          rel="noopener noreferrer"
          className="t-sans text-xs font-bold uppercase tracking-wider text-[var(--primary-blue)] hover:underline"
        >
          CITY-BUILDER.md
        </a>
        <span className="text-[var(--border-gray)]">·</span>
        <a
          href="https://warpcast.com/genuinejack"
          target="_blank"
          rel="noopener noreferrer"
          className="t-sans text-xs font-bold uppercase tracking-wider text-[var(--primary-blue)] hover:underline"
        >
          Farcaster
        </a>
      </div>

      <p className="t-serif-body text-xs text-[var(--text-secondary)]">
        Built by{" "}
        <a
          href="https://warpcast.com/genuinejack"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--primary-blue)] hover:underline"
        >
          GenuineJack
        </a>{" "}
        on Farcaster
      </p>

      <p className="t-serif-body text-[10px] text-[var(--text-secondary)] mt-2 opacity-50">
        Open source · Fork it · Make it yours
      </p>
    </footer>
  );
}
