import Link from "next/link";
import { Attribution } from "@/components/Attribution";
import { basicModelingSlides } from "@/content/basic-modeling";

const ARTICLES = [
  { n: "01", name: "Models", note: "The languages a designer works in" },
  { n: "02", name: "Classes & schemas", note: "Naming the things worth recording" },
  { n: "03", name: "Associations", note: "Connections, and how many" },
  { n: "04", name: "Object graphs", note: "Checking a design against reality" },
  { n: "05", name: "Many-to-many", note: "When both ends are 'many'" },
  { n: "06", name: "Many-to-many with history", note: "When a pairing recurs over time" },
];

export default function Home() {
  const count = basicModelingSlides.length;

  return (
    <div className="flex min-h-dvh flex-col bg-[var(--paper)]">
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-5 py-16 sm:px-8">
        <p className="eyebrow mb-6">An interactive study deck</p>

        <h1 className="font-display text-[clamp(2.6rem,9vw,5rem)] leading-[0.95] tracking-[-0.02em] text-[var(--ink)]">
          Database
          <br />
          Dojo
        </h1>

        <p className="mt-6 max-w-xl font-body text-[1.2rem] leading-relaxed text-[var(--graphite)]">
          Database design is the discipline of turning a messy enterprise into a
          precise model. Work through it here the way you would at a drafting
          table — one concept, one diagram, one exercise at a time.
        </p>

        <div className="mt-10">
          <Link
            href="/basics"
            className="mono inline-block border border-[var(--accent)] bg-[var(--accent)] px-5 py-2.5 text-[0.9rem] !text-[var(--panel)] no-underline transition-opacity hover:opacity-90"
          >
            Start — Basic Modeling →
          </Link>
          <p className="mono mt-3 text-[0.78rem] text-[var(--graphite)]">
            {count} slides · ~25 minutes · arrow keys to navigate
          </p>
        </div>

        <ol className="mt-14 grid gap-px overflow-hidden border border-[var(--rule)] bg-[var(--rule)] sm:grid-cols-2">
          {ARTICLES.map((a) => (
            <li
              key={a.n}
              className="flex items-baseline gap-3 bg-[var(--panel)] px-4 py-3"
            >
              <span className="mono text-[0.72rem] text-[var(--accent)]">{a.n}</span>
              <span className="flex flex-col">
                <span className="font-display text-[0.98rem] font-semibold text-[var(--ink)]">
                  {a.name}
                </span>
                <span className="text-[0.84rem] text-[var(--graphite)]">{a.note}</span>
              </span>
            </li>
          ))}
        </ol>
      </main>

      <Attribution />
    </div>
  );
}
