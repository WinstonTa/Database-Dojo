import type { Slide } from "@/lib/types";

const A = "many-to-many-history" as const;
const L = "Many-to-many with history";

export const manyToManyHistorySlides: Slide[] = [
  {
    id: "mmh-limit",
    article: A,
    articleLabel: L,
    kind: "concept",
    title: "A binary association allows each pair only once",
    body: [
      "A plain UML association between two classes is a set of pairs. Sets do not hold duplicates.",
      "So the same two objects can be linked through that association at most one time. Usually that is exactly right — a student is either in a course or not.",
      "It becomes a problem the moment the enterprise needs the same two things related again and again over time.",
    ],
    diagram: {
      kind: "class-model",
      cols: 2,
      rows: 1,
      entities: [
        { id: "a", name: "Customer", col: 0, row: 0 },
        { id: "b", name: "BookOnShelf", col: 1, row: 0 },
      ],
      associations: [
        { from: "a", to: "b", label: "borrows", fromMult: "*", toMult: "*", accent: "flaw" },
      ],
    },
    diagramCaption: "One borrow per customer–copy pair, ever — too strict for a library.",
  },
  {
    id: "mmh-assoc-class-nope",
    article: A,
    articleLabel: L,
    kind: "concept",
    title: "An association class does not lift the limit",
    body: [
      "It is tempting to reach for an association class again. It does not help here.",
      "An association class only adds attributes to the existing pairs. The set of pairs is still a set — still one entry per pair.",
      "On an order, that means one line per product: you could not sell ten units at a discount and five more at full price on the same order, even when the business genuinely works that way.",
    ],
    aside: {
      label: "The distinction",
      text: "Association class = more to say about each pairing. Event class = the pairing itself can happen many times.",
    },
  },
  {
    id: "mmh-event",
    article: A,
    articleLabel: L,
    kind: "concept",
    title: "Model the event, not the link",
    body: [
      "When the same two objects must relate repeatedly, replace the many-to-many with a class that stands for one occurrence of the relationship.",
      "Each occurrence is its own object with its own identity, so there can be as many as you like between the same two things.",
      "The event usually carries time — a start, an end, a timestamp — which is what tells two occurrences apart.",
    ],
    diagram: {
      kind: "class-model",
      cols: 3,
      rows: 1,
      entities: [
        { id: "cust", name: "Customer", col: 0, row: 0 },
        { id: "loan", name: "Loan", stereotype: "«event»", col: 1, row: 0, accent: "highlight", attributes: ["borrowedOn : date", "dueOn : date", "returnedOn : date"] },
        { id: "copy", name: "BookOnShelf", col: 2, row: 0 },
      ],
      associations: [
        { from: "cust", to: "loan", fromMult: "1", toMult: "0..*" },
        { from: "copy", to: "loan", fromMult: "1", toMult: "0..*" },
      ],
    },
    diagramCaption: "Loan is an event: one row per checkout, dated.",
  },
  {
    id: "mmh-library",
    article: A,
    articleLabel: L,
    kind: "concept",
    title: "The library loan model",
    body: [
      "Four classes. A CatalogEntry is a title. A BookOnShelf is one physical copy of that title. A Customer is a library member. A Loan is a single checkout.",
      "A customer has many loans over time; each loan is by one customer. A copy is loaned many times over its life; each loan is of one copy. Each copy is a copy of one catalog entry.",
      "The many-to-many between customers and copies is gone, replaced by the Loan event that sits between them.",
    ],
    diagram: {
      kind: "class-model",
      cols: 4,
      rows: 1,
      entities: [
        { id: "cust", name: "Customer", col: 0, row: 0, attributes: ["name : string", "memberSince : date"] },
        { id: "loan", name: "Loan", stereotype: "«event»", col: 1, row: 0, accent: "highlight", attributes: ["borrowedOn : date", "dueOn : date", "returnedOn : date"] },
        { id: "copy", name: "BookOnShelf", col: 2, row: 0, attributes: ["barcode : string"] },
        { id: "cat", name: "CatalogEntry", col: 3, row: 0, attributes: ["title : string", "author : string"] },
      ],
      associations: [
        { from: "cust", to: "loan", label: "takes", fromMult: "1", toMult: "0..*" },
        { from: "loan", to: "copy", label: "of", fromMult: "0..*", toMult: "1" },
        { from: "copy", to: "cat", label: "copy of", fromMult: "1..*", toMult: "1" },
      ],
    },
    diagramCaption: "Customer — Loan — BookOnShelf — CatalogEntry.",
  },
  {
    id: "mmh-object-graph",
    article: A,
    articleLabel: L,
    kind: "concept",
    title: "The same book, borrowed twice",
    body: [
      "Ada checks out copy #2 of Harry Potter and the Sorcerer's Stone in March, returns it, and borrows the very same copy again in July.",
      "Two Loan objects, same customer, same copy. A many-to-many association could not represent this. Two distinct events can.",
      "This is the pattern to watch for: whenever the same pair of objects can legitimately relate more than once, reach for an event class.",
    ],
    diagram: {
      kind: "object-graph",
      cols: 3,
      rows: 2,
      nodes: [
        { id: "ada", label: "ada : Customer", col: 0, row: 0, span: 1, lines: ["name = Ada L."] },
        { id: "l1", label: "l-31 : Loan", col: 1, row: 0, lines: ["borrowedOn = Mar 4", "returnedOn = Mar 20"] },
        { id: "l2", label: "l-58 : Loan", col: 1, row: 1, lines: ["borrowedOn = Jul 9", "returnedOn = Jul 22"] },
        { id: "copy", label: "hp1-c2 : BookOnShelf", col: 2, row: 0, span: 1, accent: "highlight", lines: ["barcode = 90042"] },
      ],
      links: [
        { from: "ada", to: "l1" },
        { from: "ada", to: "l2" },
        { from: "l1", to: "copy" },
        { from: "l2", to: "copy" },
      ],
    },
    diagramCaption: "Two loans join the same customer and the same physical copy.",
  },

  // ---- Exercise: Timecards ----
  {
    id: "mmh-ex-timecard",
    article: A,
    articleLabel: L,
    eyebrow: "Exercise · Timecards",
    kind: "exercise",
    title: "Weekly hours on projects",
    scenario: [
      "Employees work across several projects. Each week an employee submits a time card with one line per project and the hours worked on it that week.",
      "The same employee reports on the same project week after week, so the employee–project pairing recurs over time.",
    ],
    tasks: [
      "Identify the classes, including any that represent an occurrence.",
      "Draw the associations with multiplicities in both directions.",
      "Make sure one employee can report on one project many times.",
    ],
    hint: "A single association class between Employee and Project would allow only one line ever. What recurs each week?",
    solution: {
      notes: [
        "Employee and Project are the anchors. A Timecard is one employee's submission for one week.",
        "Each Timecard has many TimecardLines; each line names one project and its hours. TimecardLine is the recurring event that ties an employee's week to a project.",
        "Employee 1 — 0..* Timecard — 1..* TimecardLine, and Project 1 — 0..* TimecardLine.",
      ],
      diagram: {
        kind: "class-model",
        cols: 3,
        rows: 1,
        entities: [
          { id: "emp", name: "Employee", col: 0, row: 0, attributes: ["name : string"] },
          { id: "tc", name: "Timecard", stereotype: "«event»", col: 1, row: 0, attributes: ["weekEnding : date"] },
          { id: "proj", name: "Project", col: 2, row: 0, attributes: ["name : string"] },
        ],
        associations: [
          { from: "emp", to: "tc", label: "submits", fromMult: "1", toMult: "0..*" },
          {
            from: "tc",
            to: "proj",
            label: "reports on",
            fromMult: "0..*",
            toMult: "1..*",
            associationClass: { name: "TimecardLine", attributes: ["hours : decimal"], side: "below" },
          },
        ],
      },
      diagramCaption: "TimecardLine recurs weekly, tying each card to a project.",
    },
  },
];
