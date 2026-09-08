import type { Slide } from "@/lib/types";
import { modelsSlides } from "./models";
import { classesSlides } from "./classes";
import { associationsSlides } from "./associations";
import { objectGraphsSlides } from "./object-graphs";
import { manyToManySlides } from "./many-to-many";
import { manyToManyHistorySlides } from "./many-to-many-history";

const openingSlide: Slide = {
  id: "open",
  article: "models",
  articleLabel: "Introduction",
  kind: "title",
  variant: "open",
  title: "Basic Modeling",
  lead: "Before a database has a single table, it has a model — a deliberate picture of the part of the world the software has to keep track of. This section builds that picture in UML, one idea at a time.",
  points: [
    "Classes and schemas — naming the things worth recording",
    "Associations — how those things connect, and how many",
    "Object graphs — checking a design against reality",
    "Many-to-many, with and without history",
  ],
};

const recapSlide: Slide = {
  id: "recap",
  article: "many-to-many-history",
  articleLabel: "Recap",
  kind: "title",
  variant: "recap",
  title: "The modeling toolkit",
  lead: "You now have the moves that most conceptual database design comes down to: describe a class, connect it, count the connection, and check the result with a concrete example.",
  points: [
    "A class is a kind of thing; its attributes are real-world facts about it",
    "Every association is read both ways, with participation and cardinality",
    "Facts about a pairing go on an association class",
    "When a pairing recurs over time, model it as an event",
  ],
};

export const basicModelingSlides: Slide[] = [
  openingSlide,
  ...modelsSlides,
  ...classesSlides,
  ...associationsSlides,
  ...objectGraphsSlides,
  ...manyToManySlides,
  ...manyToManyHistorySlides,
  recapSlide,
];
