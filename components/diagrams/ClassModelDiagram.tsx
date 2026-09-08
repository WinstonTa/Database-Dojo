import type {
  ClassAssociation,
  ClassEntity,
  ClassModelSpec,
  DiagramAccent,
} from "@/lib/types";
import { along, angleDeg, borderPoint, perp, rect, type Point, type Rect } from "./geometry";

const COL_W = 226;
const BOX_MIN_W = 118;
const ROW_GAP = 92;
const HEADER_H = 30;
const STEREO_H = 15;
const LINE_H = 17;
const PAD_Y = 8;
const MARGIN = 20;
const MIN_ROW_H = 60;
const AC_DIST = 78; // association-class offset from the line
const PARALLEL_GAP = 24; // separation between associations on the same pair

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

function acHeight(attrs: string[]): number {
  return HEADER_H + (attrs.length ? attrs.length * LINE_H + PAD_Y * 2 : 0);
}

function boxWidth(e: ClassEntity): number {
  const nameW = e.name.length * 7.6 + 26;
  const attrW = (e.attributes ?? []).reduce(
    (m, a) => Math.max(m, a.length * 6.15 + 24),
    0,
  );
  const natural = Math.max(BOX_MIN_W, nameW, attrW);
  const cap = (e.span ?? 1) * COL_W - 18;
  return Math.min(natural, cap);
}

interface Bounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

function grow(b: Bounds, r: Rect) {
  b.minX = Math.min(b.minX, r.x);
  b.minY = Math.min(b.minY, r.y);
  b.maxX = Math.max(b.maxX, r.x + r.w);
  b.maxY = Math.max(b.maxY, r.y + r.h);
}

export function ClassModelDiagram({ spec }: { spec: ClassModelSpec }) {
  // Row heights from the tallest box in each row.
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

  const rectOf = (e: ClassEntity): Rect => {
    const spanW = (e.span ?? 1) * COL_W;
    const w = boxWidth(e);
    const x = MARGIN + e.col * COL_W + (spanW - w) / 2;
    const h = boxHeight(e);
    const y = rowY[e.row] + (rowHeights[e.row] - h) / 2;
    return rect(x, y, w, h);
  };

  const rects = new Map<string, Rect>();
  spec.entities.forEach((e) => rects.set(e.id, rectOf(e)));

  // Index associations that share an unordered pair so they can be fanned out.
  const pairSeen = new Map<string, number>();
  const pairTotal = new Map<string, number>();
  spec.associations.forEach((a) => {
    const key = [a.from, a.to].sort().join("|");
    pairTotal.set(key, (pairTotal.get(key) ?? 0) + 1);
  });

  const bounds: Bounds = {
    minX: 0,
    minY: 0,
    maxX: MARGIN + spec.cols * COL_W,
    maxY: cursor - ROW_GAP + MARGIN,
  };
  spec.entities.forEach((e) => grow(bounds, rects.get(e.id)!));

  const drawn = spec.associations.map((assoc, i) => {
    const key = [assoc.from, assoc.to].sort().join("|");
    const total = pairTotal.get(key)!;
    const seen = pairSeen.get(key) ?? 0;
    pairSeen.set(key, seen + 1);
    const offset = (seen - (total - 1) / 2) * PARALLEL_GAP;

    const from = rects.get(assoc.from)!;
    const to = rects.get(assoc.to)!;
    let p1 = borderPoint(from, { x: to.cx, y: to.cy });
    let p2 = borderPoint(to, { x: from.cx, y: from.cy });
    const n = perp(p1, p2);
    if (offset !== 0) {
      p1 = { x: p1.x + n.x * offset, y: p1.y + n.y * offset };
      p2 = { x: p2.x + n.x * offset, y: p2.y + n.y * offset };
    }
    const mid: Point = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };

    let acRect: Rect | null = null;
    if (assoc.associationClass) {
      const attrs = assoc.associationClass.attributes ?? [];
      const h = acHeight(attrs);
      const side = assoc.associationClass.side ?? "above";
      const dir = side === "above" ? -1 : 1;
      const cy = mid.y + dir * (AC_DIST + h / 2);
      acRect = rect(mid.x - 75, cy - h / 2, 150, h);
      grow(bounds, acRect);
    }
    // Allow for multiplicity + verb labels around the line.
    grow(bounds, rect(mid.x - 40, mid.y - 22, 80, 44));

    return { assoc, p1, p2, mid, n, acRect, index: i };
  });

  const vbX = bounds.minX - 6;
  const vbY = bounds.minY - 6;
  const vbW = bounds.maxX - bounds.minX + 12;
  const vbH = bounds.maxY - bounds.minY + 12;

  return (
    <svg
      viewBox={`${vbX} ${vbY} ${vbW} ${vbH}`}
      className="mx-auto h-auto w-full max-w-full"
      style={{ maxHeight: "62vh" }}
      role="img"
      aria-hidden="true"
    >
      {drawn.map((d) => (
        <Association
          key={d.index}
          assoc={d.assoc}
          p1={d.p1}
          p2={d.p2}
          mid={d.mid}
          n={d.n}
          acRect={d.acRect}
        />
      ))}
      {spec.entities.map((e) => (
        <ClassBox key={e.id} e={e} r={rects.get(e.id)!} />
      ))}
    </svg>
  );
}

function ClassBox({ e, r }: { e: ClassEntity; r: Rect }) {
  const stroke = strokeFor(e.accent);
  const opacity = e.muted ? 0.5 : 1;
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
          {e.attributes!.map((attr, i) => (
            <text
              key={i}
              x={r.x + 10}
              y={dividerY + PAD_Y + 12 + i * LINE_H}
              fontFamily="var(--font-plex-mono)"
              fontSize={10.5}
              fill={
                attr.trimStart().startsWith("/")
                  ? "var(--highlight)"
                  : "var(--graphite)"
              }
            >
              {attr}
            </text>
          ))}
        </>
      )}
    </g>
  );
}

function MultiplicityLabel({
  at,
  text,
  push,
}: {
  at: Point;
  text: string;
  push: Point;
}) {
  return (
    <text
      x={at.x + push.x * 12}
      y={at.y + push.y * 12 + 3.5}
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

interface DrawnAssoc {
  assoc: ClassAssociation;
  p1: Point;
  p2: Point;
  mid: Point;
  n: Point;
  acRect: Rect | null;
}

function Association({ assoc, p1, p2, mid, n, acRect }: DrawnAssoc) {
  const stroke = strokeFor(assoc.accent);
  const dashed = assoc.accent === "flaw";
  const labelPos: Point = { x: mid.x - n.x * 15, y: mid.y - n.y * 15 };

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
        <MultiplicityLabel at={along(p1, p2, 15)} text={assoc.fromMult} push={n} />
      )}
      {assoc.toMult && (
        <MultiplicityLabel at={along(p2, p1, 15)} text={assoc.toMult} push={n} />
      )}

      {assoc.label && (
        <g transform={`translate(${labelPos.x}, ${labelPos.y})`}>
          <rect
            x={-assoc.label.length * 3.3 - 5}
            y={-8}
            width={assoc.label.length * 6.6 + 10}
            height={16}
            fill="var(--panel)"
          />
          <text
            textAnchor="middle"
            y={3}
            fontFamily="var(--font-plex-mono)"
            fontSize={9.5}
            fill="var(--graphite)"
          >
            {assoc.label}
          </text>
        </g>
      )}

      {assoc.label && (
        <path
          d="M -4 -3.4 L 3 0 L -4 3.4 Z"
          transform={`translate(${mid.x}, ${mid.y}) rotate(${angleDeg(p1, p2)})`}
          fill="var(--rule-strong)"
        />
      )}

      {acRect && assoc.associationClass && (
        <AssociationClass
          ac={assoc.associationClass}
          anchor={mid}
          box={acRect}
        />
      )}
    </g>
  );
}

function AssociationClass({
  ac,
  anchor,
  box,
}: {
  ac: NonNullable<ClassAssociation["associationClass"]>;
  anchor: Point;
  box: Rect;
}) {
  const attrs = ac.attributes ?? [];
  const dividerY = box.y + HEADER_H;
  const connectorY = anchor.y < box.cy ? box.y : box.y + box.h;
  return (
    <g>
      <line
        x1={anchor.x}
        y1={anchor.y}
        x2={box.cx}
        y2={connectorY}
        stroke="var(--rule-strong)"
        strokeWidth={1.2}
        strokeDasharray="3 3"
      />
      <rect
        x={box.x}
        y={box.y}
        width={box.w}
        height={box.h}
        fill="var(--panel)"
        stroke="var(--highlight)"
        strokeWidth={1.5}
      />
      <text
        x={box.cx}
        y={box.y + 19}
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
            x1={box.x}
            y1={dividerY}
            x2={box.x + box.w}
            y2={dividerY}
            stroke="var(--highlight)"
            strokeWidth={1}
          />
          {attrs.map((attr, i) => (
            <text
              key={i}
              x={box.x + 10}
              y={dividerY + PAD_Y + 12 + i * LINE_H}
              fontFamily="var(--font-plex-mono)"
              fontSize={10.5}
              fill={
                attr.trimStart().startsWith("/")
                  ? "var(--highlight)"
                  : "var(--graphite)"
              }
            >
              {attr}
            </text>
          ))}
        </>
      )}
    </g>
  );
}
