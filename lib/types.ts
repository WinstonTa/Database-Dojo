// Shared types for the Database Dojo slideshow and its diagrams.

export type ArticleId =
  | "models"
  | "classes"
  | "associations"
  | "object-graphs"
  | "many-to-many"
  | "many-to-many-history";

/* ------------------------------------------------------------------ *
 * Diagram specs — data-driven SVG. One renderer per `kind`.
 * ------------------------------------------------------------------ */

export type DiagramAccent = "default" | "highlight" | "flaw";

/** A UML class box placed on a simple column/row grid. */
export interface ClassEntity {
  id: string;
  name: string;
  /** e.g. "«event»" — shown above the name. */
  stereotype?: string;
  /**
   * Attribute lines, written as they should read (e.g. "firstName : string").
   * A leading "/" marks a derived attribute and is rendered in the highlight color.
   */
  attributes?: string[];
  col: number;
  row: number;
  /** Column span, default 1. */
  span?: number;
  muted?: boolean;
  accent?: DiagramAccent;
}

export interface ClassAssociation {
  from: string;
  to: string;
  /** Verb phrase read from `from` to `to`, e.g. "remits". */
  label?: string;
  fromMult?: string;
  toMult?: string;
  /** An association class hanging off the midpoint via a dashed connector. */
  associationClass?: {
    name: string;
    attributes?: string[];
    /** Which side of the line to place it. Default "above". */
    side?: "above" | "below";
  };
  accent?: DiagramAccent;
}

export interface ClassModelSpec {
  kind: "class-model";
  cols: number;
  rows: number;
  entities: ClassEntity[];
  associations: ClassAssociation[];
}

/** An informal object graph: example instances joined by links. */
export interface ObjectNode {
  id: string;
  /** e.g. "c-101 : Customer" — rendered underlined, UML-style. */
  label: string;
  lines?: string[];
  col: number;
  row: number;
  span?: number;
  accent?: DiagramAccent;
}

export interface ObjectLink {
  from: string;
  to: string;
  label?: string;
  accent?: DiagramAccent;
}

export interface ObjectGraphSpec {
  kind: "object-graph";
  cols: number;
  rows: number;
  nodes: ObjectNode[];
  links: ObjectLink[];
}

/** The single bespoke diagram: the five modeling languages. */
export interface ModelsOverviewSpec {
  kind: "models-overview";
}

export type DiagramSpec = ClassModelSpec | ObjectGraphSpec | ModelsOverviewSpec;

/* ------------------------------------------------------------------ *
 * Slides
 * ------------------------------------------------------------------ */

interface BaseSlide {
  id: string;
  article: ArticleId;
  articleLabel: string;
  /** Small label above the title, e.g. "Exercise · Patients". */
  eyebrow?: string;
  title: string;
}

export interface TitleSlide extends BaseSlide {
  kind: "title";
  lead: string;
  points?: string[];
  /** "open" for the section opener, "recap" for the closer. */
  variant: "open" | "recap";
}

export interface ConceptSlide extends BaseSlide {
  kind: "concept";
  body: string[];
  aside?: { label: string; text: string };
  diagram?: DiagramSpec;
  diagramCaption?: string;
}

export interface ExerciseSlide extends BaseSlide {
  kind: "exercise";
  scenario: string[];
  tasks: string[];
  hint?: string;
  solution: {
    notes: string[];
    diagram: DiagramSpec;
    diagramCaption?: string;
  };
}

export type Slide = TitleSlide | ConceptSlide | ExerciseSlide;

/** Slide augmented with its position, computed once at assembly time. */
export interface DeckSlide {
  slide: Slide;
  index: number;
  total: number;
}
