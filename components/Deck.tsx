"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Slide } from "@/lib/types";
import { SlideView } from "./SlideView";
import { DeckNav } from "./DeckNav";
import { Outline } from "./Outline";

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

export function Deck({
  slides,
  initialIndex = 0,
}: {
  slides: Slide[];
  initialIndex?: number;
}) {
  const total = slides.length;
  const [index, setIndex] = useState(initialIndex);
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const [outlineOpen, setOutlineOpen] = useState(false);
  const [ready, setReady] = useState(false);

  const articleStarts = useMemo(() => {
    const starts = new Set<number>();
    let prev = "";
    slides.forEach((s, i) => {
      if (s.article !== prev) starts.add(i);
      prev = s.article;
    });
    return starts;
  }, [slides]);

  // Initialise from ?s=N (1-based) and follow browser back/forward.
  useEffect(() => {
    const read = () => {
      const raw = new URLSearchParams(window.location.search).get("s");
      const n = parseInt(raw ?? "1", 10);
      setIndex(clamp((Number.isNaN(n) ? 1 : n) - 1, 0, total - 1));
    };
    read();
    setReady(true);
    window.addEventListener("popstate", read);
    return () => window.removeEventListener("popstate", read);
  }, [total]);

  // Reflect the current slide in the URL without adding history entries.
  useEffect(() => {
    if (!ready) return;
    const url = new URL(window.location.href);
    url.searchParams.set("s", String(index + 1));
    window.history.replaceState(null, "", url);
  }, [index, ready]);

  const go = useCallback(
    (next: number) => setIndex(clamp(next, 0, total - 1)),
    [total],
  );

  const current = slides[index];
  const isExercise = current.kind === "exercise";
  const isRevealed = revealed.has(current.id);

  const reveal = useCallback(() => {
    setRevealed((r) => {
      if (r.has(current.id)) return r;
      const next = new Set(r);
      next.add(current.id);
      return next;
    });
  }, [current.id]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA")) return;

      switch (e.key) {
        case "ArrowRight":
        case "PageDown":
          e.preventDefault();
          go(index + 1);
          break;
        case " ":
          e.preventDefault();
          if (isExercise && !isRevealed) reveal();
          else go(index + 1);
          break;
        case "ArrowLeft":
        case "PageUp":
          e.preventDefault();
          go(index - 1);
          break;
        case "Home":
          e.preventDefault();
          go(0);
          break;
        case "End":
          e.preventDefault();
          go(total - 1);
          break;
        case "Enter":
          if (isExercise && !isRevealed) {
            e.preventDefault();
            reveal();
          }
          break;
        case "r":
        case "R":
          if (isExercise) reveal();
          break;
        case "o":
        case "O":
          setOutlineOpen((v) => !v);
          break;
        case "Escape":
          setOutlineOpen(false);
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, total, go, isExercise, isRevealed, reveal]);

  const progress = total > 1 ? index / (total - 1) : 0;

  return (
    <div className="flex min-h-dvh flex-col bg-[var(--paper)]">
      {/* Ruler-style progress bar. */}
      <div className="relative h-2 w-full shrink-0 border-b border-[var(--rule)] bg-[var(--panel)]">
        <div
          className="absolute inset-y-0 left-0 bg-[var(--accent)]"
          style={{ width: `${progress * 100}%` }}
        />
        {Array.from(articleStarts).map((i) => (
          <span
            key={i}
            className="absolute top-0 h-full w-px bg-[var(--rule-strong)]"
            style={{ left: `${(i / (total - 1)) * 100}%` }}
          />
        ))}
      </div>

      <header className="flex items-center justify-between gap-4 border-b border-[var(--rule)] px-5 py-3 sm:px-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setOutlineOpen(true)}
            aria-label="Open outline"
            className="mono border border-[var(--rule-strong)] px-2 py-1 text-[0.75rem] text-[var(--ink)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            ☰ Outline
          </button>
          <Link
            href="/"
            className="font-display text-[0.95rem] font-semibold !text-[var(--ink)] no-underline"
          >
            Database Dojo
          </Link>
        </div>
        <p className="eyebrow hidden sm:block">{current.articleLabel}</p>
      </header>

      <main className="flex-1">
        <SlideView slide={current} revealed={isRevealed} onReveal={reveal} />
      </main>

      <DeckNav
        index={index}
        total={total}
        onPrev={() => go(index - 1)}
        onNext={() => go(index + 1)}
        showReveal={isExercise && !isRevealed}
        onReveal={reveal}
      />

      <Outline
        slides={slides}
        currentIndex={index}
        open={outlineOpen}
        onClose={() => setOutlineOpen(false)}
        onJump={go}
      />
    </div>
  );
}
