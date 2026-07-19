---
id: sql
title: SQL
sidebar_label: SQL
description: Personal reference notes on SQL — syntax, concepts, and gotchas.
tags: [sql, databases, backend]
---

## What is SQL?

**SQL** (Structured Query Language) is the standard language for interacting with **relational databases** — databases that organize data into tables of rows and columns, related to each other via keys.

SQL is **declarative**: you describe *what* data you want, not *how* to fetch it. The database's query planner figures out the "how."

Common implementations: PostgreSQL, MySQL/MariaDB, SQLite, SQL Server (T-SQL), Oracle (PL/SQL). Syntax is ~90% shared, but each has its own extensions and quirks — this page is written with Postgres/MySQL-flavored SQL unless noted.

---

## Core building blocks

### Tables, rows, columns

- A **table** is a collection of rows with a fixed set of typed columns.
- A **row** (a.k.a. record/tuple) is one entry in the table.
- A **schema** defines the columns, types, and constraints of a table.

### Keys

- **Primary key (PK)** — uniquely identifies a row in a table. Can't be `NULL`. Often an auto-incrementing integer (`id`) or a UUID.
- **Foreign key (FK)** — a column that references another table's primary key, enforcing referential integrity (e.g. `orders.user_id` → `users.id`).
- **Composite key** — a primary/unique key made of multiple columns.

### Constraints

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  age INT CHECK (age >= 0),
  created_at TIMESTAMP DEFAULT NOW()
);
```

- `NOT NULL` — column must have a value
- `UNIQUE` — no duplicate values allowed
- `CHECK` — custom validation rule
- `DEFAULT` — fallback value if none provided
- `FOREIGN KEY ... REFERENCES ...` — links to another table

---

## CRUD basics

### Create (insert)

```sql
INSERT INTO users (email, age) VALUES ('a@b.com', 30);

-- multiple rows at once
INSERT INTO users (email, age) VALUES
  ('a@b.com', 30),
  ('c@d.com', 25);
```

### Read (select)

```sql
SELECT id, email FROM users
WHERE age > 18
ORDER BY created_at DESC
LIMIT 10 OFFSET 20;
```

### Update

```sql
UPDATE users
SET age = age + 1
WHERE id = 5;
```

⚠️ Always double-check the `WHERE` clause — an `UPDATE` (or `DELETE`) without one hits **every row**.

### Delete

```sql
DELETE FROM users WHERE id = 5;
```

---

## Filtering & sorting

```sql
WHERE age BETWEEN 18 AND 65
WHERE email LIKE '%@gmail.com'      -- pattern match, % = wildcard
WHERE status IN ('active', 'pending')
WHERE deleted_at IS NULL            -- NULL checks need IS, not =
WHERE NOT (age < 18)

ORDER BY created_at DESC, id ASC    -- multi-column sort
LIMIT 10 OFFSET 20                  -- pagination
```

**Gotcha:** `NULL = NULL` evaluates to `NULL` (not `TRUE`). Always use `IS NULL` / `IS NOT NULL`.

---

## Joins

Joins combine rows from two or more tables based on a related column.

| Join type | Returns |
|---|---|
| `INNER JOIN` | only rows with matches in both tables |
| `LEFT JOIN` | all rows from the left table, matched rows from the right (`NULL` if no match) |
| `RIGHT JOIN` | mirror of `LEFT JOIN` |
| `FULL OUTER JOIN` | all rows from both tables, matched where possible |
| `CROSS JOIN` | cartesian product — every row paired with every row |

```sql
SELECT orders.id, users.email
FROM orders
INNER JOIN users ON orders.user_id = users.id;

-- LEFT JOIN example: find users with no orders
SELECT users.id
FROM users
LEFT JOIN orders ON orders.user_id = users.id
WHERE orders.id IS NULL;
```

**Mental model:** picture `LEFT JOIN` as "keep everything on the left, glue on the right where it fits, leave gaps as `NULL` where it doesn't."

---

## Aggregation

```sql
SELECT status, COUNT(*), AVG(total), SUM(total)
FROM orders
GROUP BY status
HAVING COUNT(*) > 5
ORDER BY COUNT(*) DESC;
```

- `GROUP BY` — collapses rows into groups per unique value(s)
- `HAVING` — filters groups *after* aggregation (like `WHERE`, but for aggregates)
- `WHERE` filters rows before grouping; `HAVING` filters groups after

Common aggregate functions: `COUNT()`, `SUM()`, `AVG()`, `MIN()`, `MAX()`.

**Rule of thumb:** every non-aggregated column in `SELECT` must appear in `GROUP BY`.

---

## Subqueries & CTEs

### Subquery

```sql
SELECT * FROM users
WHERE id IN (SELECT user_id FROM orders WHERE total > 100);
```

### Common Table Expression (CTE) — `WITH`

Readable, named, temporary result set — great for breaking complex queries into steps.

```sql
WITH big_orders AS (
  SELECT user_id, SUM(total) AS spend
  FROM orders
  GROUP BY user_id
  HAVING SUM(total) > 100
)
SELECT users.email, big_orders.spend
FROM users
JOIN big_orders ON users.id = big_orders.user_id;
```

Recursive CTEs (for hierarchical data like trees/org charts):

```sql
WITH RECURSIVE subordinates AS (
  SELECT id, manager_id, name FROM employees WHERE id = 1
  UNION ALL
  SELECT e.id, e.manager_id, e.name
  FROM employees e
  JOIN subordinates s ON e.manager_id = s.id
)
SELECT * FROM subordinates;
```

---

## Window functions

Like aggregates, but they **don't collapse rows** — each row keeps its identity while getting a computed value based on a "window" of related rows.

```sql
SELECT
  name,
  department,
  salary,
  RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS dept_rank,
  AVG(salary) OVER (PARTITION BY department) AS dept_avg
FROM employees;
```

- `PARTITION BY` — splits rows into groups (like `GROUP BY`, but no row collapsing)
- `ORDER BY` (inside `OVER`) — defines order within each partition
- Common functions: `ROW_NUMBER()`, `RANK()`, `DENSE_RANK()`, `LAG()`, `LEAD()`, `SUM() OVER (...)`

**Use case I keep coming back to:** deduplicating rows by keeping the "latest" per group.

```sql
SELECT * FROM (
  SELECT *, ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at DESC) AS rn
  FROM sessions
) t
WHERE rn = 1;
```

---

## Indexes

An **index** is a data structure (usually a B-tree) that speeds up lookups on a column, at the cost of extra storage and slower writes (the index must be updated on every insert/update/delete).

```sql
CREATE INDEX idx_users_email ON users(email);
CREATE UNIQUE INDEX idx_users_email_unique ON users(email);
```

- Primary keys and (usually) foreign keys are indexed automatically.
- Index columns you frequently filter (`WHERE`), join (`JOIN ... ON`), or sort (`ORDER BY`) on.
- Don't over-index — every index adds write overhead.
- Use `EXPLAIN` / `EXPLAIN ANALYZE` to see if a query is actually using an index or doing a full table scan.

```sql
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'a@b.com';
```

---

## Transactions

A **transaction** groups multiple statements so they succeed or fail as a unit (atomicity).

```sql
BEGIN;

UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;

COMMIT;   -- or ROLLBACK; to undo everything since BEGIN
```

### ACID

- **Atomicity** — all-or-nothing
- **Consistency** — DB moves from one valid state to another
- **Isolation** — concurrent transactions don't interfere with each other
- **Durability** — once committed, it survives crashes

### Isolation levels (weakest → strongest)

`READ UNCOMMITTED` → `READ COMMITTED` → `REPEATABLE READ` → `SERIALIZABLE`

Higher isolation = fewer anomalies (dirty reads, non-repeatable reads, phantom reads) but more locking/lower concurrency.

---

## Normalization (schema design)

Organizing tables to reduce redundancy and avoid update anomalies.

- **1NF** — atomic columns (no lists/arrays crammed into one field)
- **2NF** — 1NF + every non-key column depends on the *whole* primary key (matters for composite keys)
- **3NF** — 2NF + no column depends on another non-key column (no transitive dependencies)

**In practice:** normalize for correctness, then selectively **denormalize** (duplicate data) where read performance matters more than write simplicity — common in analytics/reporting tables.

---

## Set operations

```sql
SELECT email FROM users
UNION            -- combines + removes duplicates
SELECT email FROM newsletter_signups;

SELECT email FROM users
UNION ALL        -- combines, keeps duplicates (faster)
SELECT email FROM newsletter_signups;

SELECT email FROM users
INTERSECT        -- rows in both
SELECT email FROM newsletter_signups;

SELECT email FROM users
EXCEPT           -- in first, not in second (MINUS in Oracle)
SELECT email FROM newsletter_signups;
```

Column count/types must match between the queries.

---

## Handy patterns

**Upsert (insert or update on conflict)** — Postgres:

```sql
INSERT INTO users (id, email) VALUES (1, 'a@b.com')
ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email;
```

MySQL equivalent: `ON DUPLICATE KEY UPDATE`.

**Case expressions:**

```sql
SELECT
  name,
  CASE
    WHEN age < 18 THEN 'minor'
    WHEN age < 65 THEN 'adult'
    ELSE 'senior'
  END AS age_group
FROM users;
```

**Coalesce (first non-null value):**

```sql
SELECT COALESCE(nickname, first_name, 'Unknown') FROM users;
```

**Count distinct:**

```sql
SELECT COUNT(DISTINCT user_id) FROM orders;
```

---

## Order of execution (important for debugging)

SQL is written in one order but *executed* in another:

```
FROM → JOIN → WHERE → GROUP BY → HAVING → SELECT → DISTINCT → ORDER BY → LIMIT
```

This is why you can't reference a `SELECT` alias in a `WHERE` clause (it doesn't exist yet at that stage) but you *can* use it in `ORDER BY`.

---

## Things I keep forgetting

- `WHERE` can't filter on aggregates — use `HAVING` instead.
- `LEFT JOIN` + `WHERE right_table.col IS NULL` is the classic pattern for "find rows with no match."
- `DISTINCT` applies to the whole selected row, not just one column, unless you use `DISTINCT ON` (Postgres-specific).
- String comparisons are case-sensitive in some DBs (Postgres) and case-insensitive by default in others (MySQL, depending on collation).
- Always test `DELETE`/`UPDATE` with a `SELECT` using the same `WHERE` clause first.
- `NULL` breaks intuitive boolean logic — anything compared to `NULL` (except `IS NULL`) returns `NULL`, not `TRUE`/`FALSE`.

---

## Further reading

- [PostgreSQL docs](https://www.postgresql.org/docs/)
- [Use The Index, Luke](https://use-the-index-luke.com/) — indexing deep dive
- [SQLZoo](https://sqlzoo.net/) — interactive practice
