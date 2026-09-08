import type { DiagramAccent, ObjectGraphSpec, ObjectNode } from "@/lib/types";
import { borderPoint, midpoint, rect, type Rect } from "./geometry";

const COL_W = 210;
const ROW_GAP = 74;
const MARGIN = 16;
const HEADER_H = 26;
const LINE_H = 15;
const PAD_Y = 7;
const MIN_ROW_H = 70;

function strokeFor(a?: DiagramAccent): string {
  if (a === "flaw") return "var(--flaw)";
  if (a === "highlight") return "var(--highlight)";
  return "var(--rule-strong)";
}

function nodeHeight(n: ObjectNode): number {
  const lines = n.lines?.length ?? 0;
  return HEADER_H + (lines > 0 ? lines * LINE_H + PAD_Y * 2 : PAD_Y);
}

function ObjectBox({ n, r }: { n: ObjectNode; r: Rect }) {
  const stroke = strokeFor(n.accent);
  const nameFill =
    n.accent === "flaw"
      ? "var(--flaw)"
      : n.accent === "highlight"
        ? "var(--highlight)"
        : "var(--ink)";
  const hasLines = (n.lines?.length ?? 0) > 0;
  return (
    <g>
      <rect
        x={r.x}
        y={r.y}
        width={r.w}
        height={r.h}
        fill="var(--panel)"
        stroke={stroke}
        strokeWidth={1.5}
      />
      <text
        x={r.cx}
        y={r.y + 17}
        textAnchor="middle"
        fontFamily="var(--font-plex-mono)"
        fontSize={11}
        fontWeight={600}
        fill={nameFill}
        textDecoration="underline"
      >
        {n.label}
      </text>
      {hasLines && (
        <>
          <line
            x1={r.x}
            y1={r.y + HEADER_H}
            x2={r.x + r.w}
            y2={r.y + HEADER_H}
            stroke={stroke}
            strokeWidth={1}
          />
          {n.lines!.map((ln, i) => (
            <text
              key={i}
              x={r.x + 9}
              y={r.y + HEADER_H + PAD_Y + 11 + i * LINE_H}
              fontFamily="var(--font-plex-mono)"
              fontSize={9.5}
              fill="var(--graphite)"
            >
              {ln}
            </text>
          ))}
        </>
      )}
    </g>
  );
}

export function ObjectGraphDiagram({ spec }: { spec: ObjectGraphSpec }) {
  const rowHeights: number[] = [];
  for (let r = 0; r < spec.rows; r++) {
    const items = spec.nodes.filter((n) => n.row === r);
    rowHeights[r] = items.length
      ? Math.max(MIN_ROW_H, ...items.map(nodeHeight))
      : MIN_ROW_H;
  }
  const rowY: number[] = [];
  let cursor = MARGIN;
  for (let r = 0; r < spec.rows; r++) {
    rowY[r] = cursor;
    cursor += rowHeights[r] + ROW_GAP;
  }

  const rects = new Map<string, Rect>();
  spec.nodes.forEach((n) => {
    const w = Math.max(
      110,
      n.label.length * 6.4 + 16,
      ...(n.lines ?? []).map((l) => l.length * 5.6 + 18),
    );
    const spanW = (n.span ?? 1) * COL_W;
    const x = MARGIN + n.col * COL_W + (spanW - w) / 2;
    const h = nodeHeight(n);
    const y = rowY[n.row] + (rowHeights[n.row] - h) / 2;
    rects.set(n.id, rect(x, y, w, h));
  });

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  rects.forEach((r) => {
    minX = Math.min(minX, r.x);
    minY = Math.min(minY, r.y);
    maxX = Math.max(maxX, r.x + r.w);
    maxY = Math.max(maxY, r.y + r.h);
  });
  const vbW = maxX - minX + 16;
  const vbH = maxY - minY + 16;
  const vb = `${minX - 8} ${minY - 8} ${vbW} ${vbH}`;

  return (
    <svg
      viewBox={vb}
      width={vbW}
      height={vbH}
      className="mx-auto block h-auto max-h-[56vh] w-auto max-w-full"
      role="img"
      aria-hidden="true"
    >
      {spec.links.map((link, i) => {
        const a = rects.get(link.from)!;
        const b = rects.get(link.to)!;
        const p1 = borderPoint(a, { x: b.cx, y: b.cy });
        const p2 = borderPoint(b, { x: a.cx, y: a.cy });
        const m = midpoint(p1, p2);
        return (
          <g key={i}>
            <line
              x1={p1.x}
              y1={p1.y}
              x2={p2.x}
              y2={p2.y}
              stroke={strokeFor(link.accent)}
              strokeWidth={1.5}
              strokeDasharray={link.accent === "flaw" ? "5 4" : undefined}
            />
            {link.label && (
              <g transform={`translate(${m.x}, ${m.y})`}>
                <rect
                  x={-link.label.length * 3.1 - 6}
                  y={-8}
                  width={link.label.length * 6.2 + 12}
                  height={16}
                  fill="var(--panel)"
                />
                <text
                  textAnchor="middle"
                  y={3}
                  fontFamily="var(--font-plex-mono)"
                  fontSize={9}
                  fill="var(--graphite)"
                >
                  {link.label}
                </text>
              </g>
            )}
          </g>
        );
      })}
      {spec.nodes.map((n) => (
        <ObjectBox key={n.id} n={n} r={rects.get(n.id)!} />
      ))}
    </svg>
  );
}
