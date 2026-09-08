import type { DiagramSpec } from "@/lib/types";
import { ClassModelDiagram } from "./ClassModelDiagram";
import { ObjectGraphDiagram } from "./ObjectGraphDiagram";
import { ModelsOverview } from "./ModelsOverview";

/** Renders any diagram spec. The single entry point used by slides. */
export function Diagram({ spec }: { spec: DiagramSpec }) {
  switch (spec.kind) {
    case "class-model":
      return <ClassModelDiagram spec={spec} />;
    case "object-graph":
      return <ObjectGraphDiagram spec={spec} />;
    case "models-overview":
      return <ModelsOverview />;
  }
}
