import type {
  ClassAssociation,
  ClassEntity,
  ClassModelSpec,
  DiagramAccent,
} from "@/lib/types";
import {
  along,
  angleDeg,
  borderPoint,
  midpoint,
  perp,
  rect,
  type Rect,
} from "./geometry";

const COL_W = 188;
const ROW_GAP = 78;
const HEADER_H = 30;
const STEREO_H = 15;
const LINE_H = 17;
const PAD_Y = 8;
const MARGIN = 16;
const MIN_ROW_H = 82;

function strokeFor(a?: DiagramAccent): string {
  if (a === "highlight") return "var(--highlight)";
  if (a === "flaw") return "var(--flaw)";
  return "var(--rule-strong)";
}

function textFor(a?: DiagramAccent): string {
  if (a === "highlight") return "var(--highlight)";
  if (a === "flaw") return "var(--flaw)";
  return "var(--ink)";
}

function boxHeight(e: ClassEntity): number {
  const attrs = e.attributes?.length ?? 0;
  return (
    HEADER_H +
    (e.stereotype ? STEREO_H : 0) +
    (attrs > 0 ? attrs * LINE_H + PAD_Y * 2 : 0)
  );
}

function ClassBox({ e, r }: { e: ClassEntity; r: Rect }) {
  const stroke = strokeFor(e.accent);
  const opacity = e.muted ? 0.55 : 1;
  const headerTop = r.y + (e.stereotype ? STEREO_H : 0);
  const dividerY = headerTop + HEADER_H;
  const hasAttrs = (e.attributes?.length ?? 0) > 0;
  return (
    <g opacity={opacity}>
      <rect
        x={r.x}
        y={r.y}
        width={r.w}
        height={r.h}
        fill="var(--panel)"
        stroke={stroke}
        strokeWidth={1.5}
      />
      {e.stereotype && (
        <text
          x={r.cx}
          y={r.y + 11}
          textAnchor="middle"
          fontFamily="var(--font-plex-mono)"
          fontSize={9.5}
          fill="var(--graphite)"
        >
          {e.stereotype}
        </text>
      )}
      <text
        x={r.cx}
        y={headerTop + 19}
        textAnchor="middle"
        fontFamily="var(--font-plex-mono)"
        fontSize={12.5}
        fontWeight={600}
        fill={textFor(e.accent)}
      >
        {e.name}
      </text>
      {hasAttrs && (
        <>
          <line
            x1={r.x}
            y1={dividerY}
            x2={r.x + r.w}
            y2={dividerY}
            stroke={stroke}
            strokeWidth={1}
          />
          {e.attributes!.map((attr, i) => {
            const derived = attr.trimStart().startsWith("/");
            return (
              <text
                key={i}
                x={r.x + 10}
                y={dividerY + PAD_Y + 12 + i * LINE_H}
                fontFamily="var(--font-plex-mono)"
                fontSize={10.5}
                fill={derived ? "var(--highlight)" : "var(--graphite)"}
              >
                {attr}
              </text>
            );
          })}
        </>
      )}
    </g>
  );
}

function MultiplicityLabel({
  at,
  text,
  dir,
}: {
  at: { x: number; y: number };
  text: string;
  dir: { x: number; y: number };
}) {
  // Nudge the label just off the line, on the side the line is heading.
  const x = at.x + dir.x * 11;
  const y = at.y + dir.y * 11;
  return (
    <text
      x={x}
      y={y + 3.5}
      textAnchor="middle"
      fontFamily="var(--font-plex-mono)"
      fontSize={10}
      fontWeight={500}
      fill="var(--ink)"
    >
      {text}
    </text>
  );
}

export function ClassModelDiagram({ spec }: { spec: ClassModelSpec }) {
  const rowHeights: number[] = [];
  for (let r = 0; r < spec.rows; r++) {
    const items = spec.entities.filter((e) => e.row === r);
    rowHeights[r] = items.length
      ? Math.max(MIN_ROW_H, ...items.map(boxHeight))
      : MIN_ROW_H;
  }
  const rowY: number[] = [];
  let cursor = MARGIN;
  for (let r = 0; r < spec.rows; r++) {
    rowY[r] = cursor;
    cursor += rowHeights[r] + ROW_GAP;
  }
  const width = spec.cols * COL_W + MARGIN * 2;
  const height = cursor - ROW_GAP + MARGIN;

  const rectOf = (e: ClassEntity): Rect => {
    const x = MARGIN + e.col * COL_W + 12;
    const w = (e.span ?? 1) * COL_W - 24;
    const h = boxHeight(e);
    const y = rowY[e.row] + (rowHeights[e.row] - h) / 2;
    return rect(x, y, w, h);
  };

  const rects = new Map<string, Rect>();
  spec.entities.forEach((e) => rects.set(e.id, rectOf(e)));

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-auto w-full"
      role="img"
      aria-hidden="true"
    >
      {spec.associations.map((assoc, i) => (
        <Association
          key={i}
          assoc={assoc}
          from={rects.get(assoc.from)!}
          to={rects.get(assoc.to)!}
        />
      ))}
      {spec.entities.map((e) => (
        <ClassBox key={e.id} e={e} r={rects.get(e.id)!} />
      ))}
    </svg>
  );
}

function Association({
  assoc,
  from,
  to,
}: {
  assoc: ClassAssociation;
  from: Rect;
  to: Rect;
}) {
  const p1 = borderPoint(from, { x: to.cx, y: to.cy });
  const p2 = borderPoint(to, { x: from.cx, y: from.cy });
  const stroke = strokeFor(assoc.accent);
  const dashed = assoc.accent === "flaw";
  const mid = midpoint(p1, p2);
  const n = perp(p1, p2);

  return (
    <g>
      <line
        x1={p1.x}
        y1={p1.y}
        x2={p2.x}
        y2={p2.y}
        stroke={stroke}
        strokeWidth={1.5}
        strokeDasharray={dashed ? "5 4" : undefined}
      />

      {assoc.fromMult && (
        <MultiplicityLabel at={along(p1, p2, 16)} text={assoc.fromMult} dir={n} />
      )}
      {assoc.toMult && (
        <MultiplicityLabel
          at={along(p2, p1, 16)}
          text={assoc.toMult}
          dir={{ x: -n.x, y: -n.y }}
        />
      )}

      {assoc.label && (
        <g transform={`translate(${mid.x}, ${mid.y})`}>
          <rect
            x={-assoc.label.length * 3.4 - 12}
            y={-9}
            width={assoc.label.length * 6.8 + 24}
            height={18}
            fill="var(--panel)"
          />
          <text
            x={-6}
            textAnchor="middle"
            y={3.5}
            fontFamily="var(--font-plex-mono)"
            fontSize={10}
            fill="var(--graphite)"
          >
            {assoc.label}
          </text>
          <path
            d="M 3 -3.6 L 10 0 L 3 3.6 Z"
            transform={`translate(${assoc.label.length * 3.4 + 2}, 0) rotate(${angleDeg(p1, p2)})`}
            fill="var(--graphite)"
          />
        </g>
      )}

      {assoc.associationClass && (
        <AssociationClass assoc={assoc} anchor={mid} normal={n} />
      )}
    </g>
  );
}

function AssociationClass({
  assoc,
  anchor,
  normal,
}: {
  assoc: ClassAssociation;
  anchor: { x: number; y: number };
  normal: { x: number; y: number };
}) {
  const ac = assoc.associationClass!;
  const side = ac.side ?? "above";
  const dist = 62;
  // Prefer a mostly-vertical offset so the class sits clearly above/below.
  const oy = side === "above" ? -dist : dist;
  const cx = anchor.x + normal.x * 8;
  const cy = anchor.y + oy;
  const attrs = ac.attributes ?? [];
  const w = 150;
  const h = HEADER_H + (attrs.length ? attrs.length * LINE_H + PAD_Y * 2 : 0);
  const x = cx - w / 2;
  const y = cy - h / 2;
  const dividerY = y + HEADER_H;
  return (
    <g>
      <line
        x1={anchor.x}
        y1={anchor.y}
        x2={cx}
        y2={side === "above" ? y + h : y}
        stroke="var(--rule-strong)"
        strokeWidth={1.2}
        strokeDasharray="3 3"
      />
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        fill="var(--panel)"
        stroke="var(--highlight)"
        strokeWidth={1.5}
      />
      <text
        x={cx}
        y={y + 19}
        textAnchor="middle"
        fontFamily="var(--font-plex-mono)"
        fontSize={12}
        fontWeight={600}
        fill="var(--ink)"
      >
        {ac.name}
      </text>
      {attrs.length > 0 && (
        <>
          <line
            x1={x}
            y1={dividerY}
            x2={x + w}
            y2={dividerY}
            stroke="var(--highlight)"
            strokeWidth={1}
          />
          {attrs.map((attr, i) => {
            const derived = attr.trimStart().startsWith("/");
            return (
              <text
                key={i}
                x={x + 10}
                y={dividerY + PAD_Y + 12 + i * LINE_H}
                fontFamily="var(--font-plex-mono)"
                fontSize={10.5}
                fill={derived ? "var(--highlight)" : "var(--graphite)"}
              >
                {attr}
              </text>
            );
          })}
        </>
      )}
    </g>
  );
}
