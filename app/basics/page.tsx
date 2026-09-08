import { Suspense } from "react";
import { Deck } from "@/components/Deck";
import { basicModelingSlides } from "@/content/basic-modeling";

export default function BasicsPage() {
  return (
    <Suspense fallback={null}>
      <Deck slides={basicModelingSlides} />
    </Suspense>
  );
}
