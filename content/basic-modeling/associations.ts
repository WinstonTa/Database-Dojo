import type { Slide } from "@/lib/types";

const A = "associations" as const;
const L = "Associations";

export const associationsSlides: Slide[] = [
  {
    id: "assoc-isolated",
    article: A,
    articleLabel: L,
    kind: "concept",
    title: "Objects are not islands",
    body: [
      "A Payment class can hold the date, the amount, and the check number. It still is not complete.",
      "The one fact that matters most — who the payment came from — is missing, and it is not a property of the payment itself. It is a link to a different object, a Customer.",
      "Most classes are like this. Their meaning depends on how they connect to other classes.",
    ],
    diagram: {
      kind: "class-model",
      cols: 2,
      rows: 1,
      entities: [
        {
          id: "payment",
          name: "Payment",
          col: 0,
          row: 0,
          attributes: ["paidOn : date", "amount : money", "checkNumber : string"],
        },
        {
          id: "who",
          name: "Customer?",
          col: 1,
          row: 0,
          muted: true,
          accent: "flaw",
        },
      ],
      associations: [
        { from: "payment", to: "who", accent: "flaw", label: "from" },
      ],
    },
    diagramCaption: "\"Which customer paid\" is a missing connection, not a missing column.",
  },
  {
    id: "assoc-what",
    article: A,
    articleLabel: L,
    kind: "concept",
    title: "An association is a connection between classes",
    body: [
      "An association is a line between two classes that says their objects can be related in a particular way.",
      "It is drawn with a verb phrase that reads across the line — \"a customer remits a payment\" — and a small marker showing which direction to read it.",
      "The line records that the relationship is possible. Multiplicity, next, records how many.",
    ],
    diagram: {
      kind: "class-model",
      cols: 2,
      rows: 1,
      entities: [
        { id: "customer", name: "Customer", col: 0, row: 0 },
        { id: "payment", name: "Payment", col: 1, row: 0 },
      ],
      associations: [{ from: "customer", to: "payment", label: "remits" }],
    },
    diagramCaption: "One binary association, read left to right: a customer remits a payment.",
  },
  {
    id: "assoc-multiplicity",
    article: A,
    articleLabel: L,
    kind: "concept",
    title: "Multiplicity: participation and cardinality",
    body: [
      "Each end of an association carries two pieces of information.",
      "Participation is whether the link is required. A 0 in front means optional; a 1 means mandatory. A payment must belong to a customer; a customer need not have made any payments yet.",
      "Cardinality is the maximum count: exactly one (1) or many (*). Together they are written as a range, like 0..* or 1..1.",
    ],
    aside: {
      label: "Reading the ends",
      text: "Customer 1..1 — 0..* Payment: every payment has exactly one customer; every customer has zero or more payments.",
    },
    diagram: {
      kind: "class-model",
      cols: 2,
      rows: 1,
      entities: [
        { id: "customer", name: "Customer", col: 0, row: 0 },
        { id: "payment", name: "Payment", col: 1, row: 0 },
      ],
      associations: [
        {
          from: "customer",
          to: "payment",
          label: "remits",
          fromMult: "1..1",
          toMult: "0..*",
        },
      ],
    },
    diagramCaption: "The same line, now with a multiplicity range at each end.",
  },
  {
    id: "assoc-bothways",
    article: A,
    articleLabel: L,
    kind: "concept",
    title: "Read every association in both directions",
    body: [
      "An association makes two claims at once, and a good design states both as full sentences.",
      "From the customer's side: each customer may remit many payments. From the payment's side: each payment must be remitted by exactly one customer.",
      "Saying both out loud is how you catch a wrong multiplicity before it becomes a wrong table.",
    ],
    aside: {
      label: "Modal verbs help",
      text: "\"May\" signals optional participation; \"must\" signals mandatory. \"Many\" versus \"one\" gives the cardinality.",
    },
    diagram: {
      kind: "class-model",
      cols: 2,
      rows: 1,
      entities: [
        { id: "customer", name: "Customer", col: 0, row: 0 },
        { id: "payment", name: "Payment", col: 1, row: 0 },
      ],
      associations: [
        {
          from: "customer",
          to: "payment",
          label: "remits",
          fromMult: "1..1",
          toMult: "0..*",
        },
      ],
    },
  },
  {
    id: "assoc-parent-child",
    article: A,
    articleLabel: L,
    kind: "concept",
    title: "One-to-many: parent and child",
    body: [
      "When one end is 1 and the other is many, the association is one-to-many.",
      "The single end is the parent; the many end is the child. Here Customer is the parent and Payment is the child.",
      "The words look informal, but the distinction decides where things land when the model becomes relational tables: the child ends up carrying a reference back to its parent.",
    ],
    diagram: {
      kind: "class-model",
      cols: 2,
      rows: 1,
      entities: [
        { id: "customer", name: "Customer", col: 0, row: 0, accent: "highlight" },
        { id: "payment", name: "Payment", col: 1, row: 0 },
      ],
      associations: [
        {
          from: "customer",
          to: "payment",
          label: "remits",
          fromMult: "1",
          toMult: "*",
        },
      ],
    },
    diagramCaption: "Parent (highlighted) on the 1 end; child on the many end.",
  },

  // ---- Exercise: Patients ----
  {
    id: "assoc-ex-patient",
    article: A,
    articleLabel: L,
    eyebrow: "Exercise · Patients",
    kind: "exercise",
    title: "Blood samples at a clinic",
    scenario: [
      "A clinic measures the level of substances — cholesterol, blood alcohol, and so on — in patients' blood.",
      "Each time blood is drawn, the clinic records the date of the sample, which substance was tested, and the level that was found.",
    ],
    tasks: [
      "Name the classes and describe each in one sentence.",
      "Draw the associations and give every end a multiplicity.",
      "Read each association aloud in both directions.",
      "Decide which class the measured level belongs to.",
    ],
    hint: "A single draw can be tested for more than one substance. Where does the level live — on the sample, on the substance, or between them?",
    solution: {
      notes: [
        "Patient — a person under the clinic's care. BloodSample — one draw of blood on one date. Substance — a kind of thing that can be measured, like cholesterol.",
        "Patient 1 — 0..* BloodSample: a patient may have many samples; each sample is from exactly one patient.",
        "A sample can be assayed for several substances, and the level is the result of one assay — so it belongs between BloodSample and Substance, on the association.",
      ],
      diagram: {
        kind: "class-model",
        cols: 3,
        rows: 1,
        entities: [
          {
            id: "patient",
            name: "Patient",
            col: 0,
            row: 0,
            attributes: ["name : string", "dateOfBirth : date"],
          },
          {
            id: "sample",
            name: "BloodSample",
            col: 1,
            row: 0,
            attributes: ["drawnOn : date"],
          },
          {
            id: "substance",
            name: "Substance",
            col: 2,
            row: 0,
            attributes: ["name : string", "unit : string"],
          },
        ],
        associations: [
          {
            from: "patient",
            to: "sample",
            label: "gives",
            fromMult: "1",
            toMult: "0..*",
          },
          {
            from: "sample",
            to: "substance",
            label: "assayed for",
            fromMult: "1..*",
            toMult: "0..*",
            associationClass: { name: "Assay", attributes: ["level : decimal"], side: "below" },
          },
        ],
      },
      diagramCaption: "The measured level sits on the BloodSample–Substance association.",
    },
  },

  // ---- Exercise: Cities / states ----
  {
    id: "assoc-ex-city",
    article: A,
    articleLabel: L,
    eyebrow: "Exercise · Cities and states",
    kind: "exercise",
    title: "Cities and the states they sit in",
    scenario: [
      "Part of a database holds United States cities and states. Every city is in exactly one state.",
      "Two cities can share a name in different states — Texarkana, Texas is not Texarkana, Arkansas — and the model has to keep them apart.",
    ],
    tasks: [
      "Identify the two classes and describe each.",
      "Draw the association with multiplicities on both ends.",
      "Say what makes one city different from another.",
    ],
    hint: "If a city's name is not enough to identify it, what is? The answer shapes how the association is read.",
    solution: {
      notes: [
        "State — one U.S. state or territory. City — one incorporated place, identified by its name together with its state.",
        "State 1 — 0..* City: a state contains many cities; each city belongs to exactly one state.",
        "Because identity depends on the state, City is firmly the child here — it cannot stand alone without its parent state.",
      ],
      diagram: {
        kind: "class-model",
        cols: 2,
        rows: 1,
        entities: [
          {
            id: "state",
            name: "State",
            col: 0,
            row: 0,
            attributes: ["name : string", "abbreviation : string"],
          },
          {
            id: "city",
            name: "City",
            col: 1,
            row: 0,
            attributes: ["name : string", "population : int"],
          },
        ],
        associations: [
          {
            from: "state",
            to: "city",
            label: "contains",
            fromMult: "1",
            toMult: "0..*",
          },
        ],
      },
      diagramCaption: "A plain one-to-many; identity of a City leans on its State.",
    },
  },

  // ---- Exercise: Library books ----
  {
    id: "assoc-ex-book",
    article: A,
    articleLabel: L,
    eyebrow: "Exercise · Library books",
    kind: "exercise",
    title: "Catalog entries, copies, and publishers",
    scenario: [
      "A small library keeps physical books on shelves that patrons borrow. Each title has a catalog entry — the modern version of a card in the old card catalog.",
      "One catalog entry can stand for several identical copies on the shelves. The library also wants real information about publishers, not just a name — a sales contact, a phone number.",
    ],
    tasks: [
      "Identify the classes: catalog entry, physical copy, publisher.",
      "Draw the associations with multiplicities.",
      "Explain why the publisher is its own class rather than an attribute.",
    ],
    hint: "If you would want to store more than one fact about publishers, they have outgrown being a text field.",
    solution: {
      notes: [
        "CatalogEntry — the bibliographic record for one title. BookOnShelf — one physical volume of that title. Publisher — a company the library may need to contact.",
        "Publisher 1 — 0..* CatalogEntry: a publisher issues many titles; each title has one publisher.",
        "CatalogEntry 1 — 1..* BookOnShelf: a title exists because the library owns at least one copy; each copy is a copy of exactly one title.",
        "Publisher is a class because the library keeps several facts about it — the moment you need a phone number as well as a name, it is no longer just an attribute.",
      ],
      diagram: {
        kind: "class-model",
        cols: 3,
        rows: 1,
        entities: [
          {
            id: "publisher",
            name: "Publisher",
            col: 0,
            row: 0,
            attributes: ["name : string", "salesContact : string", "phone : string"],
          },
          {
            id: "catalog",
            name: "CatalogEntry",
            col: 1,
            row: 0,
            attributes: ["title : string", "year : int"],
          },
          {
            id: "copy",
            name: "BookOnShelf",
            col: 2,
            row: 0,
            attributes: ["barcode : string", "condition : string"],
          },
        ],
        associations: [
          {
            from: "publisher",
            to: "catalog",
            label: "issues",
            fromMult: "1",
            toMult: "0..*",
          },
          {
            from: "catalog",
            to: "copy",
            label: "has copy",
            fromMult: "1",
            toMult: "1..*",
          },
        ],
      },
      diagramCaption: "Two one-to-many associations; Publisher earns its own box.",
    },
  },
];
