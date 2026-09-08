import type { Slide } from "@/lib/types";

const A = "classes" as const;
const L = "Classes & schemas";

export const classesSlides: Slide[] = [
  {
    id: "classes-things",
    article: A,
    articleLabel: L,
    kind: "concept",
    title: "Classes model the things that matter",
    body: [
      "A class stands for a kind of thing the enterprise needs to record. In entity-relationship diagrams the same idea is called an entity.",
      "The thing can be physical — a store, a vehicle, a book on a shelf — or it can be abstract, like a payment, a loan, or an appointment. If the business keeps track of it, it can be a class.",
      "Each member of the class is an object: one specific customer, one specific payment.",
    ],
    aside: {
      label: "Test for a class",
      text: "Ask: does the enterprise need to store facts about many of these, and tell one from another? If yes, it is probably a class.",
    },
    diagram: {
      kind: "class-model",
      cols: 3,
      rows: 1,
      entities: [
        { id: "store", name: "Store", col: 0, row: 0 },
        { id: "payment", name: "Payment", col: 1, row: 0 },
        { id: "appt", name: "Appointment", col: 2, row: 0 },
      ],
      associations: [],
    },
    diagramCaption: "Physical or abstract — both are classes if the enterprise tracks them.",
  },
  {
    id: "classes-naming",
    article: A,
    articleLabel: L,
    kind: "concept",
    title: "Name it, then describe it",
    body: [
      "A class name is a singular noun: Customer, not Customers. It names one member of the kind.",
      "The name alone is not enough. Two designers can read \"Customer\" and picture different things — only paying accounts, or also prospects the sales team is chasing.",
      "So every class gets a short description in plain language that settles exactly what counts as a member and what does not. That description is part of the model.",
    ],
    aside: {
      label: "Example",
      text: "Customer — any company we have sold to, or that we believe we might sell to in the future.",
    },
  },
  {
    id: "classes-attributes",
    article: A,
    articleLabel: L,
    kind: "concept",
    title: "Attributes carry real information",
    body: [
      "Attributes are the individual facts recorded about each object: a customer's phone number, credit limit, city.",
      "Include only descriptive attributes — ones that say something true about the thing in the real world. A customer's name describes the customer. A sequential ID number invented purely to make the database run does not, and it is left off the model at this stage.",
      "Each attribute has a data type: text, a number, a date, an amount of money.",
    ],
    aside: {
      label: "Later, not now",
      text: "Surrogate keys and ID columns are added during relational implementation. The conceptual model stays about the business.",
    },
  },
  {
    id: "classes-diagram",
    article: A,
    articleLabel: L,
    kind: "concept",
    title: "The class diagram",
    body: [
      "A class is drawn as a rectangle in up to three stacked compartments: the name on top, the attributes below it, and operations at the bottom.",
      "Because these classes model stored information rather than behavior, the operations compartment is left out entirely.",
      "The result is a compact, readable summary of one kind of thing and everything the enterprise knows about it.",
    ],
    diagram: {
      kind: "class-model",
      cols: 2,
      rows: 1,
      entities: [
        {
          id: "customer",
          name: "Customer",
          col: 0,
          row: 0,
          span: 2,
          attributes: [
            "name : string",
            "contactName : string",
            "phone : string",
            "city : string",
            "country : string",
            "creditLimit : money",
          ],
        },
      ],
      associations: [],
    },
    diagramCaption: "The Customer class: name compartment, then descriptive attributes with types.",
  },
  {
    id: "classes-schema",
    article: A,
    articleLabel: L,
    kind: "concept",
    title: "A schema is a precise description of a type",
    body: [
      "A schema is a formal statement of what a piece of data looks like — which fields it has, and what type each field is.",
      "An English sentence about \"customer records\" can be read several ways. A schema cannot: it pins the structure down so two systems, or two people, mean exactly the same thing.",
      "The class diagram is how we write that schema while the design is still a conversation.",
    ],
    aside: {
      label: "The payoff",
      text: "Precision now is what lets the relational tables, constraints, and SQL be generated from the model with no guesswork.",
    },
  },

  // ---- Exercise: Designing classes ----
  {
    id: "classes-ex-design",
    article: A,
    articleLabel: L,
    eyebrow: "Exercise · Designing classes",
    kind: "exercise",
    title: "Describe five things as classes",
    scenario: [
      "Practice the two-step move — describe in English, then draw — on things from different worlds:",
      "a university student; a faculty member; a work of art in a gallery; a vehicle registered with the motor vehicle department; a pizza on a restaurant menu.",
    ],
    tasks: [
      "For each, write one sentence saying what counts as a member of the class.",
      "List only descriptive attributes, each with a data type.",
      "Leave out any ID number that exists only for the database.",
      "Draw the two-compartment box: name, then attributes.",
    ],
    hint: "The hard part is the description sentence. \"A pizza\" could mean a menu item or a single pie leaving the oven — decide which.",
    solution: {
      notes: [
        "Student — a person currently admitted to and enrolled at the university. Facts worth keeping: name, date of birth, major, year admitted.",
        "Artwork — a single physical piece held in the collection. Facts: title, artist name, year, medium, dimensions, acquisition date.",
        "Vehicle — one registered automobile. Facts: plate, make, model, model year, color, VIN as a real-world identifier (not an invented one).",
        "In every case the description sentence, not the attribute list, is what stops two designers building different things.",
      ],
      diagram: {
        kind: "class-model",
        cols: 3,
        rows: 1,
        entities: [
          {
            id: "student",
            name: "Student",
            col: 0,
            row: 0,
            attributes: [
              "name : string",
              "dateOfBirth : date",
              "major : string",
              "yearAdmitted : int",
            ],
          },
          {
            id: "artwork",
            name: "Artwork",
            col: 1,
            row: 0,
            attributes: [
              "title : string",
              "artist : string",
              "year : int",
              "medium : string",
            ],
          },
          {
            id: "vehicle",
            name: "Vehicle",
            col: 2,
            row: 0,
            attributes: [
              "plate : string",
              "make : string",
              "model : string",
              "modelYear : int",
            ],
          },
        ],
        associations: [],
      },
      diagramCaption: "Three of the five, each a name compartment over descriptive attributes.",
    },
  },
];
