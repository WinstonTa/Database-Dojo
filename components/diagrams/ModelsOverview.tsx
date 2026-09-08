// The one bespoke "diagram": the modeling languages a designer moves between.
// Rendered as HTML rather than SVG — it is a labelled list, not a figure.

const ENTRIES: { code: string; name: string; note: string }[] = [
  {
    code: "UML",
    name: "Unified Modeling Language",
    note: "A picture of the enterprise both the client and the developer can read.",
  },
  {
    code: "RM",
    name: "Relational model",
    note: "Codd's set-theory foundation for tables, keys, and constraints.",
  },
  {
    code: "RA",
    name: "Relational algebra",
    note: "A symbolic language for combining and filtering relations.",
  },
  {
    code: "SQL",
    name: "Structured Query Language",
    note: "Declarative: you state the result you want, not the steps to get it.",
  },
  {
    code: "DOC",
    name: "Document model",
    note: "Trades joins for nested documents when reads must be fast and distributed.",
  },
];

export function ModelsOverview() {
  return (
    <ul className="flex w-full flex-col gap-2.5">
      {ENTRIES.map((e) => (
        <li
          key={e.code}
          className="flex items-start gap-3 border border-[var(--rule)] bg-[var(--panel)] p-3"
        >
          <span className="mono mt-0.5 min-w-[3rem] shrink-0 border-r border-[var(--rule)] pr-3 text-[0.7rem] font-semibold tracking-[0.12em] text-[var(--accent)]">
            {e.code}
          </span>
          <span className="flex flex-col">
            <span className="font-display text-[0.95rem] font-semibold leading-tight text-[var(--ink)]">
              {e.name}
            </span>
            <span className="text-[0.85rem] leading-snug text-[var(--graphite)]">
              {e.note}
            </span>
          </span>
        </li>
      ))}
    </ul>
  );
}
