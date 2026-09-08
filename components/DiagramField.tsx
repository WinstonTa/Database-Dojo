import type { ReactNode } from "react";

/** The framed drafting-film field every diagram sits on. */
export function DiagramField({
  children,
  caption,
}: {
  children: ReactNode;
  caption?: string;
}) {
  return (
    <figure className="m-0 flex flex-col">
      <div className="dot-grid flex items-center justify-center overflow-x-auto border border-[var(--rule)] bg-[var(--panel)] p-4 sm:p-6">
        <div className="w-full max-w-full">{children}</div>
      </div>
      {caption && (
        <figcaption className="mono mt-2 text-[0.72rem] leading-snug text-[var(--graphite)]">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
