import type { Slide } from "@/lib/types";

const A = "many-to-many" as const;
const L = "Many-to-many";

export const manyToManySlides: Slide[] = [
  {
    id: "mm-third-shape",
    article: A,
    articleLabel: L,
    kind: "concept",
    title: "The third shape of relationship",
    body: [
      "So far associations have had a 1 on at least one end. That covers one-to-one and one-to-many — and many-to-one, which is just one-to-many read backwards.",
      "The remaining case has many on both ends: an object of either class can be tied to many objects of the other.",
      "A student takes many courses; a course enrolls many students. Neither side is the single parent.",
    ],
    diagram: {
      kind: "class-model",
      cols: 2,
      rows: 1,
      entities: [
        { id: "student", name: "Student", col: 0, row: 0 },
        { id: "course", name: "Course", col: 1, row: 0 },
      ],
      associations: [
        {
          from: "student",
          to: "course",
          label: "takes",
          fromMult: "*",
          toMult: "*",
        },
      ],
    },
    diagramCaption: "Many on both ends: the many-to-many association.",
  },
  {
    id: "mm-orders-products",
    article: A,
    articleLabel: L,
    kind: "concept",
    title: "Orders and products",
    body: [
      "A product here is a kind of item for sale — a particular model of toy car from a particular maker — not one physical unit in the warehouse.",
      "An order lists one or more products. A product can appear on any number of orders, including none at all if nobody has bought it yet.",
      "Order 1..* — 0..* Product. Many-to-many.",
    ],
    diagram: {
      kind: "class-model",
      cols: 2,
      rows: 1,
      entities: [
        {
          id: "order",
          name: "Order",
          col: 0,
          row: 0,
          attributes: ["placedOn : date", "status : string"],
        },
        {
          id: "product",
          name: "Product",
          col: 1,
          row: 0,
          attributes: ["name : string", "scale : string", "listPrice : money"],
        },
      ],
      associations: [
        {
          from: "order",
          to: "product",
          label: "contains",
          fromMult: "0..*",
          toMult: "1..*",
        },
      ],
    },
    diagramCaption: "Each order holds at least one product; each product may be on many orders.",
  },
  {
    id: "mm-between",
    article: A,
    articleLabel: L,
    kind: "concept",
    title: "Some facts belong to neither class",
    body: [
      "How many units of a product are on an order? At what price were they sold?",
      "Quantity is not a property of the product, and not a property of the order — it describes one product's place on one order. The sale price behaves the same way, since the same product can go out at different prices on different days.",
      "These facts belong to the pairing itself. UML gives the pairing a home: an association class.",
    ],
    aside: {
      label: "The tell",
      text: "If an attribute needs both classes named before it makes sense, it belongs on the association, not on either class.",
    },
  },
  {
    id: "mm-association-class",
    article: A,
    articleLabel: L,
    kind: "concept",
    title: "The association class",
    body: [
      "An association class hangs off the middle of a many-to-many line with a dashed connector. It carries the attributes that describe each pairing.",
      "Here OrderDetail records the quantity ordered and the price each. Subtotal is derived — quantity times price — so it is marked with a leading slash and never stored directly.",
      "The Order and Product boxes stay clean; the pairing data has somewhere to live.",
    ],
    diagram: {
      kind: "class-model",
      cols: 2,
      rows: 2,
      entities: [
        {
          id: "order",
          name: "Order",
          col: 0,
          row: 1,
          attributes: ["placedOn : date", "status : string"],
        },
        {
          id: "product",
          name: "Product",
          col: 1,
          row: 1,
          attributes: ["name : string", "listPrice : money"],
        },
      ],
      associations: [
        {
          from: "order",
          to: "product",
          label: "contains",
          fromMult: "0..*",
          toMult: "1..*",
          associationClass: {
            name: "OrderDetail",
            attributes: ["quantity : int", "priceEach : money", "/subtotal : money"],
            side: "above",
          },
        },
      ],
    },
    diagramCaption: "OrderDetail holds quantity and price; /subtotal is derived.",
  },
  {
    id: "mm-object-graph",
    article: A,
    articleLabel: L,
    kind: "concept",
    title: "Why the pairing data is unavoidable",
    body: [
      "Two customers, two orders, and one popular product. The 1936 Mercedes-Benz 500K sells on both orders — at 41.00 on one and 38.50 on the other.",
      "That price cannot sit on the Product (it varies) or on the Order (the order has several products at different prices). It only makes sense on each Order–Product pairing.",
      "The object graph makes the argument for the association class better than any rule can.",
    ],
    diagram: {
      kind: "object-graph",
      cols: 3,
      rows: 2,
      nodes: [
        { id: "o1", label: "o-101 : Order", col: 0, row: 0, lines: ["placedOn = Mar 3"] },
        { id: "o2", label: "o-102 : Order", col: 0, row: 1, lines: ["placedOn = Mar 9"] },
        {
          id: "prod",
          label: "mb500k : Product",
          col: 2,
          row: 0,
          span: 1,
          lines: ["name = MB 500K", "listPrice = 45.00"],
          accent: "highlight",
        },
      ],
      links: [
        { from: "o1", to: "prod", label: "@ 41.00" },
        { from: "o2", to: "prod", label: "@ 38.50" },
      ],
    },
    diagramCaption: "Same product, two prices — the price lives on the link.",
  },

  // ---- Relational implementation (exposition aside) ----
  {
    id: "mm-rel-junction",
    article: A,
    articleLabel: L,
    eyebrow: "Relational implementation",
    kind: "concept",
    title: "The junction table",
    body: [
      "Relational databases connect tables with a one-to-many link and nothing else. A many-to-many association cannot be stored directly.",
      "The fix is a table in the middle — a junction table — that turns one many-to-many into two one-to-many links. Each of its rows joins one order to one product.",
      "This is exactly where the association class lands: OrderDetail becomes the orderdetails table.",
    ],
    diagram: {
      kind: "class-model",
      cols: 3,
      rows: 1,
      entities: [
        { id: "order", name: "orders", col: 0, row: 0, attributes: ["orderNumber : PK", "placedOn : date"] },
        {
          id: "od",
          name: "orderdetails",
          col: 1,
          row: 0,
          accent: "highlight",
          attributes: ["orderNumber : FK", "productCode : FK", "quantity : int", "priceEach : money"],
        },
        { id: "product", name: "products", col: 2, row: 0, attributes: ["productCode : PK", "name : string"] },
      ],
      associations: [
        { from: "order", to: "od", fromMult: "1", toMult: "0..*" },
        { from: "product", to: "od", fromMult: "1", toMult: "0..*" },
      ],
    },
    diagramCaption: "orderdetails sits between the two parents, one row per pairing.",
  },
  {
    id: "mm-rel-key",
    article: A,
    articleLabel: L,
    eyebrow: "Relational implementation",
    kind: "concept",
    title: "The key is both parents together",
    body: [
      "The primary key of the junction table is the pair of foreign keys: {orderNumber, productCode}.",
      "That composite key enforces the business rule that a product appears on an order at most once — you cannot insert the same pair twice.",
      "Keys never travel directly between the two parent tables. The only path from an order to its products runs through the junction rows.",
    ],
    aside: {
      label: "Consequence",
      text: "If the business ever needs the same product on one order twice, this key is exactly what stands in the way — see \"with history\".",
    },
  },
  {
    id: "mm-rel-rules",
    article: A,
    articleLabel: L,
    eyebrow: "Relational implementation",
    kind: "concept",
    title: "How a junction table may connect",
    body: [
      "A junction table can be a parent to other tables — nothing stops a detail row from having children of its own.",
      "It should not be the child in an identifying relationship, and it should not be a subtype under a supertype: either move would change its key and break the many-to-many it exists to represent.",
      "When its key grows past two columns and other tables need to point at it, add a single surrogate key for them to reference — but keep the original combination unique.",
    ],
  },

  // ============ EXERCISES ============

  {
    id: "mm-ex-notecards",
    article: A,
    articleLabel: L,
    eyebrow: "Exercise · Notecards",
    kind: "exercise",
    title: "Model an order on index cards",
    scenario: [
      "Before touching a database, lay a sales order out on paper. Use one index card per object and write each card's facts in the margin, including the keys.",
      "Then arrange the cards so the links between orders, their line items, and products are visible just from how the cards point at each other.",
    ],
    tasks: [
      "Make cards for Customer, Order, OrderLine, and Product.",
      "Give each card its own key and the foreign keys it carries.",
      "Lay them out so one order's lines sit under it, each pointing to a product.",
    ],
    hint: "The OrderLine card is the junction. It should carry a key from an Order and a key from a Product, and nothing links Order and Product except through it.",
    solution: {
      notes: [
        "Customer 1 — 0..* Order — 1..* OrderLine, and Product 1 — 0..* OrderLine.",
        "An OrderLine card carries orderNumber and productCode as foreign keys plus its own quantity and price.",
        "Reading the cards: pick an order, gather the line cards that name it, follow each to its product card.",
      ],
      diagram: {
        kind: "class-model",
        cols: 4,
        rows: 1,
        entities: [
          { id: "cust", name: "Customer", col: 0, row: 0, attributes: ["customerId : PK", "name : string"] },
          { id: "ord", name: "Order", col: 1, row: 0, attributes: ["orderNumber : PK", "customerId : FK"] },
          {
            id: "line",
            name: "OrderLine",
            col: 2,
            row: 0,
            accent: "highlight",
            attributes: ["orderNumber : FK", "productCode : FK", "quantity : int"],
          },
          { id: "prod", name: "Product", col: 3, row: 0, attributes: ["productCode : PK", "name : string"] },
        ],
        associations: [
          { from: "cust", to: "ord", fromMult: "1", toMult: "0..*" },
          { from: "ord", to: "line", fromMult: "1", toMult: "1..*" },
          { from: "prod", to: "line", fromMult: "1", toMult: "0..*" },
        ],
      },
      diagramCaption: "Four cards; OrderLine is the one that joins orders to products.",
    },
  },

  {
    id: "mm-ex-student",
    article: A,
    articleLabel: L,
    eyebrow: "Exercise · Students and classes",
    kind: "exercise",
    title: "Where does the grade go?",
    scenario: [
      "Model students and the university classes they take. A student takes many classes; a class has many students.",
      "Each student earns one grade in each class. The design has to say where that grade is recorded.",
    ],
    tasks: [
      "Identify the classes and the many-to-many between them.",
      "Read the association both ways with multiplicities.",
      "Place the grade where it actually belongs.",
    ],
    hint: "A grade needs a student and a class named before it means anything. That points to an association class.",
    solution: {
      notes: [
        "Student *..* Class is the association. Neither side is a parent.",
        "The grade describes one student in one class — it goes on an Enrollment association class, alongside the term taken.",
        "In relational form, Enrollment becomes a junction table keyed by {studentId, classId}.",
      ],
      diagram: {
        kind: "class-model",
        cols: 2,
        rows: 2,
        entities: [
          { id: "student", name: "Student", col: 0, row: 1, attributes: ["name : string", "major : string"] },
          { id: "class", name: "Class", col: 1, row: 1, attributes: ["title : string", "term : string"] },
        ],
        associations: [
          {
            from: "student",
            to: "class",
            label: "enrolls in",
            fromMult: "*",
            toMult: "*",
            associationClass: { name: "Enrollment", attributes: ["grade : string"], side: "above" },
          },
        ],
      },
      diagramCaption: "The grade lives on Enrollment, the association class.",
    },
  },

  {
    id: "mm-ex-author",
    article: A,
    articleLabel: L,
    eyebrow: "Exercise · Authors",
    kind: "exercise",
    title: "Books and their authors, in order",
    scenario: [
      "A book's catalog entry cannot hold its authors, because a book can have several. An author, in turn, writes several books.",
      "Authors care about the order they are listed in — first author, second author — so the model has to record position, not just the fact of authorship.",
    ],
    tasks: [
      "Draw the many-to-many between CatalogEntry and Author.",
      "Add whatever is needed to capture author order.",
      "Say where the position attribute belongs.",
    ],
    hint: "\"Second author\" is a fact about one author on one book. Same home as a grade or a price.",
    solution: {
      notes: [
        "CatalogEntry *..* Author. An Authorship association class carries position.",
        "Position belongs on Authorship because it only means something for a specific author–book pair.",
        "As a junction table, Authorship is keyed by {catalogId, authorId}; position is an ordinary column that a query sorts on.",
      ],
      diagram: {
        kind: "class-model",
        cols: 2,
        rows: 2,
        entities: [
          { id: "cat", name: "CatalogEntry", col: 0, row: 1, attributes: ["title : string", "year : int"] },
          { id: "auth", name: "Author", col: 1, row: 1, attributes: ["name : string", "born : int"] },
        ],
        associations: [
          {
            from: "cat",
            to: "auth",
            label: "written by",
            fromMult: "1..*",
            toMult: "1..*",
            associationClass: { name: "Authorship", attributes: ["position : int"], side: "above" },
          },
        ],
      },
      diagramCaption: "Authorship records where each author falls in the byline.",
    },
  },

  {
    id: "mm-ex-repair",
    article: A,
    articleLabel: L,
    eyebrow: "Exercise · Auto repair",
    kind: "exercise",
    title: "Repair orders and service types",
    scenario: [
      "A customer brings in a vehicle and a service advisor writes a repair order noting the customer, the vehicle, the date, and the advisor.",
      "A repair order covers one or more service types — oil change, tire rotation, and so on. Each service type has a standard number of work hours and is billed at a flat shop rate per hour.",
    ],
    tasks: [
      "Identify the classes and their one-to-many links.",
      "Model the many-to-many between RepairOrder and ServiceType.",
      "Decide where the billed hours for a specific job belong.",
    ],
    hint: "The standard hours belong to the service type. The hours actually billed on one order might differ — that is pairing data.",
    solution: {
      notes: [
        "Customer, Vehicle, and ServiceAdvisor are each 1 — 0..* to RepairOrder.",
        "RepairOrder *..* ServiceType, resolved by a ServiceLine association class.",
        "ServiceType.standardHours is the book value; ServiceLine.billedHours is what went on this order. Line total is derived from billedHours and the shop rate.",
      ],
      diagram: {
        kind: "class-model",
        cols: 3,
        rows: 3,
        entities: [
          { id: "cust", name: "Customer", col: 0, row: 0, attributes: ["name : string"] },
          { id: "veh", name: "Vehicle", col: 0, row: 1, attributes: ["plate : string", "model : string"] },
          { id: "adv", name: "ServiceAdvisor", col: 0, row: 2, attributes: ["name : string"] },
          {
            id: "ro",
            name: "RepairOrder",
            col: 1,
            row: 1,
            attributes: ["writtenOn : date"],
          },
          {
            id: "st",
            name: "ServiceType",
            col: 2,
            row: 1,
            attributes: ["name : string", "standardHours : decimal", "shopRate : money"],
          },
        ],
        associations: [
          { from: "cust", to: "ro", fromMult: "1", toMult: "0..*" },
          { from: "veh", to: "ro", fromMult: "1", toMult: "0..*" },
          { from: "adv", to: "ro", fromMult: "1", toMult: "0..*" },
          {
            from: "ro",
            to: "st",
            label: "covers",
            fromMult: "0..*",
            toMult: "1..*",
            associationClass: { name: "ServiceLine", attributes: ["billedHours : decimal"], side: "above" },
          },
        ],
      },
      diagramCaption: "ServiceLine holds the hours billed for one job on one order.",
    },
  },

  {
    id: "mm-ex-video",
    article: A,
    articleLabel: L,
    eyebrow: "Exercise · Video rental",
    kind: "exercise",
    title: "A night at the video store",
    scenario: [
      "A rental store lets a customer check out several videos at once and hands back one invoice listing the rentals, their charges, and their due dates.",
      "A \"video\" is one physical copy. Many copies can exist of the same title.",
    ],
    tasks: [
      "Separate the title from the physical copy.",
      "Model a checkout that covers many copies but produces one invoice.",
      "Place the charge and due date for each copy on the checkout.",
    ],
    hint: "One checkout, many copies — that is one-to-many, not many-to-many. The copy is only on one active rental at a time.",
    solution: {
      notes: [
        "Title 1 — 1..* VideoCopy separates the movie from the disc.",
        "Customer 1 — 0..* Rental, and Rental 1 — 1..* RentalLine, with VideoCopy 1 — 0..* RentalLine.",
        "Each RentalLine carries the charge and due date for one copy; the invoice is the Rental seen from the billing side.",
      ],
      diagram: {
        kind: "class-model",
        cols: 4,
        rows: 1,
        entities: [
          { id: "cust", name: "Customer", col: 0, row: 0, attributes: ["name : string"] },
          { id: "rental", name: "Rental", col: 1, row: 0, attributes: ["checkedOutOn : date"] },
          {
            id: "line",
            name: "RentalLine",
            col: 2,
            row: 0,
            accent: "highlight",
            attributes: ["charge : money", "dueOn : date"],
          },
          { id: "copy", name: "VideoCopy", col: 3, row: 0, attributes: ["barcode : string"] },
        ],
        associations: [
          { from: "cust", to: "rental", fromMult: "1", toMult: "0..*" },
          { from: "rental", to: "line", fromMult: "1", toMult: "1..*" },
          { from: "copy", to: "line", fromMult: "1", toMult: "0..*" },
        ],
      },
      diagramCaption: "RentalLine joins one checkout to one copy, with its charge and due date.",
    },
  },

  {
    id: "mm-ex-santa",
    article: A,
    articleLabel: L,
    eyebrow: "Exercise · Santa's list",
    kind: "exercise",
    title: "Wishes and deliveries",
    scenario: [
      "Santa records each child's name, address, and birth date. Every year children send wish lists. Santa marks each child naughty or nice and decides which toys to deliver.",
      "A child never gets the same toy twice in a year, and never a toy they were given in a past year. A child can also receive a toy they never asked for — or coal.",
    ],
    tasks: [
      "Model the children, the toys, and the year.",
      "Keep wishes separate from deliveries.",
      "Make sure a toy delivered this year cannot be delivered to the same child again.",
    ],
    hint: "It is simpler than it looks. Two many-to-manies — wished and delivered — each tagged with a year.",
    solution: {
      notes: [
        "Child *..* Toy appears twice: once as WishListItem (child, toy, year) and once as Delivery (child, toy, year).",
        "Delivery keyed by {childId, toyId} across all years prevents a repeat ever; add year as an attribute for the within-year record.",
        "An unrequested gift is a Delivery with no matching WishListItem; coal is just another Toy.",
      ],
      diagram: {
        kind: "class-model",
        cols: 3,
        rows: 3,
        entities: [
          {
            id: "wish",
            name: "WishListItem",
            col: 1,
            row: 0,
            accent: "highlight",
            attributes: ["year : int"],
          },
          {
            id: "child",
            name: "Child",
            col: 0,
            row: 1,
            attributes: ["name : string", "address : string", "born : date"],
          },
          { id: "toy", name: "Toy", col: 2, row: 1, attributes: ["name : string"] },
          {
            id: "delivery",
            name: "Delivery",
            col: 1,
            row: 2,
            accent: "highlight",
            attributes: ["year : int", "naughty : bool"],
          },
        ],
        associations: [
          { from: "child", to: "wish", fromMult: "1", toMult: "0..*" },
          { from: "toy", to: "wish", fromMult: "1", toMult: "0..*" },
          { from: "child", to: "delivery", fromMult: "1", toMult: "0..*" },
          { from: "toy", to: "delivery", fromMult: "1", toMult: "0..*" },
        ],
      },
      diagramCaption:
        "WishListItem and Delivery each resolve the child–toy many-to-many, kept separate.",
    },
  },
];
