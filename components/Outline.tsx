"use client";

import { useEffect } from "react";
import type { Slide } from "@/lib/types";

interface Group {
  label: string;
  items: { index: number; title: string; kind: Slide["kind"] }[];
}

function buildGroups(slides: Slide[]): Group[] {
  const groups: Group[] = [];
  slides.forEach((s, index) => {
    const label = s.articleLabel;
    let group = groups[groups.length - 1];
    if (!group || group.label !== label) {
      group = { label, items: [] };
      groups.push(group);
    }
    group.items.push({ index, title: s.title, kind: s.kind });
  });
  return groups;
}

export function Outline({
  slides,
  currentIndex,
  open,
  onClose,
  onJump,
}: {
  slides: Slide[];
  currentIndex: number;
  open: boolean;
  onClose: () => void;
  onJump: (index: number) => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const groups = buildGroups(slides);

  return (
    <>
      <div
        aria-hidden={!open}
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/25 transition-opacity ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        aria-label="Slide outline"
        className={`fixed inset-y-0 left-0 z-50 w-[min(88vw,340px)] overflow-y-auto border-r border-[var(--rule)] bg-[var(--paper)] transition-transform ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-[var(--rule)] px-4 py-3">
          <span className="eyebrow">Outline</span>
          <button
            type="button"
            onClick={onClose}
            className="mono text-[0.8rem] text-[var(--graphite)] hover:text-[var(--ink)]"
          >
            Close ✕
          </button>
        </div>
        <nav className="px-2 py-3">
          {groups.map((group) => (
            <div key={group.label} className="mb-3">
              <p className="eyebrow px-2 py-1 text-[0.66rem]">{group.label}</p>
              <ul>
                {group.items.map((item) => {
                  const active = item.index === currentIndex;
                  return (
                    <li key={item.index}>
                      <button
                        type="button"
                        onClick={() => {
                          onJump(item.index);
                          onClose();
                        }}
                        className={`flex w-full items-baseline gap-2 px-2 py-1.5 text-left text-[0.85rem] leading-snug transition-colors ${
                          active
                            ? "bg-[var(--accent-soft)] text-[var(--accent)]"
                            : "text-[var(--ink)] hover:bg-[var(--panel)]"
                        }`}
                      >
                        <span className="mono shrink-0 text-[0.7rem] text-[var(--rule-strong)]">
                          {String(item.index + 1).padStart(2, "0")}
                        </span>
                        <span>
                          {item.title}
                          {item.kind === "exercise" && (
                            <span className="mono ml-1.5 text-[0.62rem] uppercase tracking-wide text-[var(--highlight)]">
                              ex
                            </span>
                          )}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
