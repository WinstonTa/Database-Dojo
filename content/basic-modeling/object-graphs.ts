import type { Slide } from "@/lib/types";

const A = "object-graphs" as const;
const L = "Object graphs";

export const objectGraphsSlides: Slide[] = [
  {
    id: "og-what",
    article: A,
    articleLabel: L,
    kind: "concept",
    title: "An object graph is a spot check",
    body: [
      "A class diagram describes what is allowed. An object graph shows one concrete situation: a handful of real example objects, with lines drawn between the ones that are related.",
      "It is informal and quick to sketch. Its job is to let you see whether the multiplicities you wrote actually match how the business works.",
      "If you cannot draw a believable example that fits the model, the model is wrong.",
    ],
    diagram: {
      kind: "object-graph",
      cols: 2,
      rows: 1,
      nodes: [
        {
          id: "c",
          label: "acme : Customer",
          col: 0,
          row: 0,
          lines: ["name = Acme Co."],
        },
        {
          id: "p",
          label: "p-5001 : Payment",
          col: 1,
          row: 0,
          lines: ["amount = 4,200"],
        },
      ],
      links: [{ from: "c", to: "p", label: "remits" }],
    },
    diagramCaption: "Two example objects and the link between them.",
  },
  {
    id: "og-valid",
    article: A,
    articleLabel: L,
    kind: "concept",
    title: "A graph that fits the model",
    body: [
      "The Customer–Payment model says one customer, many payments. Here is an example that honors it.",
      "Acme has made three payments. Every payment line runs back to exactly one customer. Nothing in the picture breaks the 1..1 and 0..* ends.",
      "This is what \"the model is correct\" looks like: a real case slots in without strain.",
    ],
    diagram: {
      kind: "object-graph",
      cols: 2,
      rows: 3,
      nodes: [
        { id: "c", label: "acme : Customer", col: 0, row: 1, lines: ["name = Acme Co."] },
        { id: "p1", label: "p-5001 : Payment", col: 1, row: 0, lines: ["amount = 4,200"] },
        { id: "p2", label: "p-5002 : Payment", col: 1, row: 1, lines: ["amount = 900"] },
        { id: "p3", label: "p-5003 : Payment", col: 1, row: 2, lines: ["amount = 1,750"] },
      ],
      links: [
        { from: "c", to: "p1" },
        { from: "c", to: "p2" },
        { from: "c", to: "p3" },
      ],
    },
    diagramCaption: "One customer, three payments — each payment tied to just one customer.",
  },
  {
    id: "og-flawed",
    article: A,
    articleLabel: L,
    kind: "concept",
    title: "A graph that does not",
    body: [
      "Now an example that will not fit. Payment p-5002 is linked to two different customers.",
      "The model puts 1..1 on the customer end of the payment link — a payment has exactly one customer. This picture violates that.",
      "The graph and the model disagree. One of them has to change.",
    ],
    diagram: {
      kind: "object-graph",
      cols: 3,
      rows: 2,
      nodes: [
        { id: "c1", label: "acme : Customer", col: 0, row: 0, lines: ["name = Acme Co."] },
        { id: "c2", label: "globex : Customer", col: 0, row: 1, lines: ["name = Globex"] },
        {
          id: "p",
          label: "p-5002 : Payment",
          col: 2,
          row: 0,
          span: 1,
          lines: ["amount = 900"],
          accent: "flaw",
        },
      ],
      links: [
        { from: "c1", to: "p", accent: "flaw" },
        { from: "c2", to: "p", accent: "flaw" },
      ],
    },
    diagramCaption: "One payment, two customers — the 1..1 end is broken.",
  },
  {
    id: "og-resolve",
    article: A,
    articleLabel: L,
    kind: "concept",
    title: "Which one is wrong?",
    body: [
      "When the graph and the model conflict, go back to the enterprise and ask what is actually true.",
      "A payment is written by one customer. The flawed graph is the mistake, not the model — you would simply never see that situation in real business.",
      "Sometimes the answer runs the other way and the model needs loosening. Either way, the object graph is what forced the question into the open.",
    ],
    aside: {
      label: "The habit",
      text: "For each association, sketch one example that fits and one that should not. If the second one looks plausible, revisit the multiplicity.",
    },
    diagram: {
      kind: "object-graph",
      cols: 2,
      rows: 3,
      nodes: [
        { id: "c", label: "acme : Customer", col: 0, row: 1, lines: ["name = Acme Co."] },
        { id: "p1", label: "p-5001 : Payment", col: 1, row: 0 },
        { id: "p2", label: "p-5002 : Payment", col: 1, row: 1 },
        { id: "p3", label: "p-5003 : Payment", col: 1, row: 2 },
      ],
      links: [
        { from: "c", to: "p1" },
        { from: "c", to: "p2" },
        { from: "c", to: "p3" },
      ],
    },
    diagramCaption: "Back to the version the business would actually produce.",
  },
];
