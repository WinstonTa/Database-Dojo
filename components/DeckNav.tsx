"use client";

export function DeckNav({
  index,
  total,
  onPrev,
  onNext,
  showReveal,
  onReveal,
}: {
  index: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  showReveal: boolean;
  onReveal: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-t border-[var(--rule)] bg-[var(--paper)] px-5 py-3 sm:px-8">
      <button
        type="button"
        onClick={onPrev}
        disabled={index === 0}
        className="mono border border-[var(--rule-strong)] px-3 py-1.5 text-[0.8rem] text-[var(--ink)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-[var(--rule-strong)] disabled:hover:text-[var(--ink)]"
      >
        ← Prev
      </button>

      <span className="mono text-[0.8rem] tabular-nums text-[var(--graphite)]">
        {String(index + 1).padStart(2, "0")}
        <span className="mx-1 text-[var(--rule-strong)]">/</span>
        {String(total).padStart(2, "0")}
      </span>

      {showReveal ? (
        <button
          type="button"
          onClick={onReveal}
          className="mono border border-[var(--accent)] bg-[var(--accent)] px-3 py-1.5 text-[0.8rem] text-[var(--panel)] transition-opacity hover:opacity-90"
        >
          Reveal solution
        </button>
      ) : (
        <button
          type="button"
          onClick={onNext}
          disabled={index === total - 1}
          className="mono border border-[var(--rule-strong)] px-3 py-1.5 text-[0.8rem] text-[var(--ink)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-[var(--rule-strong)] disabled:hover:text-[var(--ink)]"
        >
          Next →
        </button>
      )}
    </div>
  );
}
