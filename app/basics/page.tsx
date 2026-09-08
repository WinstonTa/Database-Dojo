import { Deck } from "@/components/Deck";
import { basicModelingSlides } from "@/content/basic-modeling";

export default async function BasicsPage({
  searchParams,
}: {
  searchParams: Promise<{ s?: string }>;
}) {
  const { s } = await searchParams;
  const parsed = Number.parseInt(s ?? "1", 10);
  const n = Number.isNaN(parsed) ? 1 : parsed;
  const initialIndex = Math.max(0, Math.min(basicModelingSlides.length - 1, n - 1));

  return <Deck slides={basicModelingSlides} initialIndex={initialIndex} />;
}
