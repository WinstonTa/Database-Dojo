import type { ConceptSlide, ExerciseSlide, Slide, TitleSlide } from "@/lib/types";
import { Diagram } from "./diagrams/Diagram";
import { DiagramField } from "./DiagramField";

export function SlideView({
  slide,
  revealed,
  onReveal,
}: {
  slide: Slide;
  revealed: boolean;
  onReveal: () => void;
}) {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8">
      {slide.kind === "title" && <TitleView slide={slide} />}
      {slide.kind === "concept" && <ConceptView slide={slide} />}
      {slide.kind === "exercise" && (
        <ExerciseView slide={slide} revealed={revealed} onReveal={onReveal} />
      )}
    </div>
  );
}

function Eyebrow({ slide }: { slide: Slide }) {
  return (
    <p className="eyebrow mb-3">
      {slide.eyebrow ?? slide.articleLabel}
    </p>
  );
}

function TitleView({ slide }: { slide: TitleSlide }) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col justify-center">
      <p className="eyebrow mb-4">
        {slide.variant === "open" ? "Basic Modeling" : "Section complete"}
      </p>
      <h1 className="text-[clamp(2.2rem,6vw,3.6rem)] text-[var(--ink)]">
        {slide.title}
      </h1>
      <p className="mt-5 font-body text-[1.15rem] leading-relaxed text-[var(--graphite)]">
        {slide.lead}
      </p>
      {slide.points && slide.points.length > 0 && (
        <ul className="mt-6 flex flex-col gap-2">
          {slide.points.map((p, i) => (
            <li key={i} className="flex gap-3 text-[var(--ink)]">
              <span className="mono mt-1 text-[0.75rem] text-[var(--accent)]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>{p}</span>
            </li>
          ))}
        </ul>
      )}
      <p className="mono mt-10 text-[0.8rem] text-[var(--graphite)]">
        {slide.variant === "open"
          ? "Press → or Space to begin"
          : "Press ← to review, or O for the outline"}
      </p>
    </div>
  );
}

function ProseBlock({ body }: { body: string[] }) {
  return (
    <div className="flex flex-col gap-4">
      {body.map((p, i) => (
        <p key={i} className="font-body text-[1.02rem] leading-relaxed text-[var(--ink)]">
          {p}
        </p>
      ))}
    </div>
  );
}

function ConceptView({ slide }: { slide: ConceptSlide }) {
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-12">
      <div className="flex flex-col">
        <Eyebrow slide={slide} />
        <h2 className="mb-5 text-[clamp(1.6rem,3.4vw,2.3rem)] text-[var(--ink)]">
          {slide.title}
        </h2>
        <ProseBlock body={slide.body} />
        {slide.aside && (
          <aside className="mt-6 border-l-2 border-[var(--accent)] bg-[var(--accent-soft)] px-4 py-3">
            <p className="eyebrow mb-1 !text-[var(--accent)]">{slide.aside.label}</p>
            <p className="font-body text-[0.95rem] leading-relaxed text-[var(--ink)]">
              {slide.aside.text}
            </p>
          </aside>
        )}
      </div>
      {slide.diagram && (
        <div className="lg:pt-1">
          <DiagramField caption={slide.diagramCaption}>
            <Diagram spec={slide.diagram} />
          </DiagramField>
        </div>
      )}
    </div>
  );
}

function ExerciseView({
  slide,
  revealed,
  onReveal,
}: {
  slide: ExerciseSlide;
  revealed: boolean;
  onReveal: () => void;
}) {
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-12">
      <div className="flex flex-col">
        <p className="eyebrow mb-3">{slide.eyebrow ?? `Exercise · ${slide.articleLabel}`}</p>
        <h2 className="mb-5 text-[clamp(1.6rem,3.4vw,2.3rem)] text-[var(--ink)]">
          {slide.title}
        </h2>
        <ProseBlock body={slide.scenario} />

        <p className="eyebrow mb-2 mt-6">Model this</p>
        <ul className="flex flex-col gap-1.5">
          {slide.tasks.map((t, i) => (
            <li key={i} className="flex gap-2.5 text-[0.95rem] text-[var(--ink)]">
              <span aria-hidden className="mono mt-[0.15rem] text-[var(--rule-strong)]">
                ▢
              </span>
              <span>{t}</span>
            </li>
          ))}
        </ul>

        {slide.hint && !revealed && (
          <p className="mt-5 font-body text-[0.9rem] italic leading-relaxed text-[var(--graphite)]">
            Hint — {slide.hint}
          </p>
        )}

        {revealed && (
          <div className="mt-6 border-l-2 border-[var(--highlight)] bg-[var(--highlight-soft)] px-4 py-3">
            <p className="eyebrow mb-2 !text-[var(--highlight)]">One way to model it</p>
            <ul className="flex flex-col gap-2">
              {slide.solution.notes.map((n, i) => (
                <li key={i} className="font-body text-[0.93rem] leading-relaxed text-[var(--ink)]">
                  {n}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="lg:pt-1">
        {revealed ? (
          <DiagramField caption={slide.solution.diagramCaption}>
            <Diagram spec={slide.solution.diagram} />
          </DiagramField>
        ) : (
          <button
            type="button"
            onClick={onReveal}
            className="dot-grid flex min-h-[280px] w-full flex-col items-center justify-center gap-3 border border-dashed border-[var(--rule-strong)] bg-[var(--panel)] p-6 text-center transition-colors hover:border-[var(--accent)]"
          >
            <span className="font-display text-[2.5rem] leading-none text-[var(--rule-strong)]">
              ?
            </span>
            <span className="mono text-[0.8rem] text-[var(--graphite)]">
              Sketch your model, then reveal one solution
            </span>
            <span className="mono mt-1 inline-block border border-[var(--accent)] px-3 py-1 text-[0.75rem] text-[var(--accent)]">
              Reveal — Enter
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
