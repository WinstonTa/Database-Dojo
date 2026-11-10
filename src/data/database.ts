/** Small, legally consistent CECS 323 practice dataset.
 *  Invented teaching data (NOT the course's official Homework database).
 *  Identifiers are intentionally lowercase: PostgreSQL folds unquoted camelCase.
 */
export const schemaSQL = `
DROP TABLE IF EXISTS orderdetails, payments, orders, products, customers CASCADE;
CREATE TABLE customers (
  customernumber INTEGER PRIMARY KEY,
  customername TEXT NOT NULL,
  country TEXT NOT NULL
);
CREATE TABLE products (
  productcode TEXT PRIMARY KEY,
  productname TEXT NOT NULL,
  buyprice NUMERIC(10,2) NOT NULL
);
CREATE TABLE orders (
  ordernumber INTEGER PRIMARY KEY,
  orderdate DATE NOT NULL,
  customernumber INTEGER NOT NULL REFERENCES customers(customernumber)
);
CREATE TABLE orderdetails (
  ordernumber INTEGER NOT NULL REFERENCES orders(ordernumber),
  productcode TEXT NOT NULL REFERENCES products(productcode),
  quantityordered INTEGER NOT NULL CHECK (quantityordered > 0),
  priceeach NUMERIC(10,2) NOT NULL,
  PRIMARY KEY (ordernumber, productcode)
);
CREATE TABLE payments (
  customernumber INTEGER NOT NULL REFERENCES customers(customernumber),
  checknumber TEXT NOT NULL,
  paymentdate DATE NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  PRIMARY KEY (customernumber, checknumber)
);
INSERT INTO customers VALUES
(101,'Atlas Collectibles','USA'),(102,'Bluebird Toys','USA'),
(103,'Cedar Models','USA'),(104,'Delta Hobby','USA'),
(105,'Evergreen Gifts','France'),(106,'Fjord Collectibles','France'),
(107,'Golden Miniatures','France'),(108,'Harbor Models','Germany'),
(109,'Indigo Classics','Germany'),(110,'Juniper Toys','Japan'),
(111,'Kite Collectibles','Japan'),(112,'Lumen Hobby','Brazil');
INSERT INTO products VALUES
('P01','1930s Roadster',45.00),('P02','Vintage Plane',32.50),
('P03','Steam Train',65.00),('P04','Sailing Ship',28.00),
('P05','Classic Motorcycle',38.00),('P06','Race Car',54.00),
('P07','Museum Bus',21.00),('P08','Retro Rocket',72.00);
INSERT INTO orders VALUES
(1001,'2023-01-05',101),(1002,'2023-06-18',101),
(1003,'2023-11-13',102),(1004,'2024-02-09',105),
(1005,'2024-04-23',106),(1006,'2024-08-04',108),
(1007,'2024-09-16',109),(1008,'2025-03-22',110),
(1009,'2025-05-11',112),(1010,'2025-07-07',105);
INSERT INTO orderdetails VALUES
(1001,'P01',20,50),(1001,'P02',60,40),(1002,'P01',60,50),
(1002,'P03',3,80),(1003,'P04',48,35),(1003,'P05',55,45),
(1004,'P03',10,80),(1004,'P06',9,70),(1005,'P01',15,50),
(1005,'P02',2,40),(1006,'P05',7,45),(1006,'P06',20,70),
(1007,'P04',3,35),(1008,'P03',12,80),(1008,'P06',6,70),
(1009,'P02',22,40),(1010,'P04',20,35),(1010,'P05',10,45);
INSERT INTO payments VALUES
(101,'CHK-A','2023-02-01',500),(101,'CHK-B','2023-07-02',750),
(102,'CHK-C','2023-12-02',300),(103,'CHK-D','2024-01-03',125),
(105,'CHK-E','2024-03-01',900),(105,'CHK-F','2025-08-01',900),
(106,'CHK-G','2024-05-02',380),(108,'CHK-H','2024-09-02',600),
(110,'CHK-I','2025-04-02',250),(112,'CHK-J','2025-06-02',125);
`;
export const tables = [
 {name:'customers', key:'customernumber',desc:'12 customers, including customers with no orders',columns:['customernumber','customername','country']},
 {name:'orders',key:'ordernumber',desc:'10 orders across 2023–2025',columns:['ordernumber','orderdate','customernumber']},
 {name:'orderdetails',key:'ordernumber + productcode',desc:'18 line items: each row is one product in one order',columns:['ordernumber','productcode','quantityordered','priceeach']},
 {name:'products',key:'productcode',desc:'8 products, including products that were never ordered',columns:['productcode','productname','buyprice']},
 {name:'payments',key:'customernumber + checknumber',desc:'10 payments, including a payment from a customer with no orders',columns:['customernumber','checknumber','paymentdate','amount']}
] as const;
