import type { Slide } from "@/lib/types";

const A = "models" as const;
const L = "Models";

export const modelsSlides: Slide[] = [
  {
    id: "models-what",
    article: A,
    articleLabel: L,
    kind: "concept",
    title: "A database is a model of an enterprise",
    body: [
      "An enterprise is whatever real-world activity the software serves — a company, a clinic, a library, a workshop. The database does not try to capture all of it. It captures the slice of reality the organization actually needs to keep track of.",
      "Design is the work of deciding what that slice is: which things matter, which facts about them matter, and how those things are connected. Everything else is deliberately left out.",
      "Before any tables exist, we describe this model in a language precise enough that a client and a developer can look at it and agree it is right.",
    ],
    aside: {
      label: "Keep in mind",
      text: "A model is a simplification chosen on purpose. Leaving detail out is a design decision, not an oversight.",
    },
    diagram: { kind: "models-overview" },
    diagramCaption:
      "The languages a designer moves between, from first sketch to running database.",
  },
  {
    id: "models-uml",
    article: A,
    articleLabel: L,
    kind: "concept",
    title: "UML: the shared picture",
    body: [
      "The Unified Modeling Language grew out of object-oriented software engineering, where teams needed one notation to describe large systems.",
      "For database work we use a small part of it — mainly the class diagram. It is deliberately visual so that someone who knows the business but not the technology can still read it, point at it, and correct it.",
      "The UML model is the contract. Once it is agreed, the relational design and the SQL follow from it.",
    ],
    aside: {
      label: "Why start here",
      text: "Fixing a misunderstanding in a diagram costs minutes. Fixing it after the tables are built and loaded costs weeks.",
    },
  },
  {
    id: "models-relational",
    article: A,
    articleLabel: L,
    kind: "concept",
    title: "The relational model, algebra, and SQL",
    body: [
      "In the early 1970s E. F. Codd proposed organizing data as relations — sets of rows drawn from a formal, mathematical foundation. Nearly every mainstream database since is built on that idea.",
      "Relational algebra is the symbolic language for manipulating those relations: selecting rows, combining tables, projecting columns.",
      "SQL is what designers actually type. It is declarative — you describe the result you want and let the database work out how to produce it, rather than spelling out the steps yourself.",
    ],
    aside: {
      label: "Declarative vs procedural",
      text: "\"Give me every customer in California\" is declarative. A loop that walks each row and tests the state is procedural. SQL is the first kind.",
    },
  },
  {
    id: "models-document",
    article: A,
    articleLabel: L,
    kind: "concept",
    title: "The document model",
    body: [
      "Document databases store data as nested documents rather than flat, linked tables. Related information that a relational design would split across several tables is often kept together in one document.",
      "That trade changes the economics of reads and writes: fetching a whole document is fast and easy to spread across many servers, but the data is less rigidly structured and some consistency guarantees are relaxed.",
      "It is a good fit for high-traffic, fast-changing web data. It is still a model — a chosen simplification — just with different priorities.",
    ],
  },
];
