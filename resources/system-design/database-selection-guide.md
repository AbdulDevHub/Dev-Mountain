---
id: database-selection-guide
title: Database Selection Guide
sidebar_label: Database Selection Guide
description: A quick-reference guide and flowchart for choosing the right database type for your project.
---

Choosing the right database is one of those decisions that's easy to get wrong early and expensive to fix later. This guide gives you a decision flowchart plus a breakdown of each database family so you can pick with confidence.

## Quick Decision Flowchart

Start at the top and follow the path that matches your primary need.

```mermaid
flowchart TD
    Start([What does your data need?]) --> Q1{Do entities have deep,\nmany-to-many relationships\nyou need to traverse?}

    Q1 -- Yes: social graphs, fraud rings,\nrecommendations --> Graph[("Graph Database\nNeo4j, Amazon Neptune")]

    Q1 -- No --> Q2{Do you need\nsub-millisecond reads\nfor caching or sessions?}

    Q2 -- Yes: caching, leaderboards,\nrate limiting --> KV[("In-Memory Key-Value\nRedis, Memcached")]

    Q2 -- No --> Q3{Is this AI/ML data —\nembeddings or\nsimilarity search?}

    Q3 -- Yes --> Vector[("Vector Database\nPinecone, Milvus")]

    Q3 -- No --> Q4{Is it high-frequency,\ntimestamped data?\nIoT, metrics, ticks}

    Q4 -- Yes --> TimeSeries[("Time-Series Database\nInfluxDB, TimescaleDB")]

    Q4 -- No --> Q5{Do you need massive\nwrite throughput across\nmultiple data centers?}

    Q5 -- Yes --> WideColumn[("Wide-Column Store\nCassandra, ScyllaDB")]

    Q5 -- No --> Q6{Do you need strict\ndata integrity, transactions,\nor complex JOIN reporting?}

    Q6 -- Yes: finance, e-commerce,\ncomplex reports --> SQL[("Relational (SQL)\nPostgreSQL, MySQL, SQLite")]

    Q6 -- No: flexible schema,\nrapid iteration --> Document[("Document (NoSQL)\nMongoDB, Firestore, Couchbase")]

    style Graph fill:#4C566A,color:#fff
    style KV fill:#BF616A,color:#fff
    style Vector fill:#B48EAD,color:#fff
    style TimeSeries fill:#D08770,color:#fff
    style WideColumn fill:#EBCB8B,color:#000
    style SQL fill:#5E81AC,color:#fff
    style Document fill:#A3BE8C,color:#000
```

:::tip Rule of thumb
If you're still unsure, default to **PostgreSQL**. It handles relational data well and has solid extensions for JSON, full-text search, and even vector search — so you can outgrow it slowly instead of migrating early.
:::

## Comparison at a Glance

| Type | Examples | Best For | Main Trade-off |
|---|---|---|---|
| Relational (SQL) | PostgreSQL, MySQL, SQLite | Financial ledgers, e-commerce, reporting | Rigid schema, harder to scale horizontally |
| Document (NoSQL) | MongoDB, Firestore, Couchbase | Prototyping, user profiles, CMS | Weak multi-record relationships/aggregation |
| In-Memory (Key-Value) | Redis, Memcached | Caching, sessions, leaderboards | Volatile, limited by RAM |
| Graph | Neo4j, Amazon Neptune | Social networks, fraud detection | Steep learning curve (Cypher, etc.) |
| Vector | Pinecone, Milvus | AI/LLM embeddings | Niche use case, extra infra |
| Time-Series | InfluxDB, TimescaleDB | IoT, metrics, stock ticks | Niche use case, specialized queries |
| Wide-Column | Cassandra, ScyllaDB | Massive global write volume | Operationally complex |

## 1. Relational (SQL)

- **Examples:** PostgreSQL, MySQL, SQLite, Firebase SQL Connect
- **Data Structure:** Rigid tables with rows, columns, and foreign keys.
- **Best For:** Financial ledgers, e-commerce, complex reporting.
- **Pros:** Bulletproof data integrity, powerful multi-table JOIN queries.
- **Cons:** Harder to scale horizontally, requires strict schema migrations.

## 2. Document (NoSQL)

- **Examples:** MongoDB, Firebase Firestore, Couchbase
- **Data Structure:** Flexible, schemaless JSON-like documents.
- **Best For:** Rapid prototyping, user profiles, content management.
- **Pros:** Easy to change data structures, scales out automatically.
- **Cons:** Poor support for complex relationship queries and data aggregations.

## 3. In-Memory (Key-Value)

- **Examples:** Redis, Memcached
- **Data Structure:** Ultra-fast key-value pairs stored in RAM.
- **Best For:** User session caching, real-time leaderboards, speed optimization.
- **Pros:** Sub-millisecond response times.
- **Cons:** Volatile data storage if not backed up; restricted by RAM size.

## 4. Graph Databases

- **Examples:** Neo4j, Amazon Neptune
- **Data Structure:** Interconnected "Nodes" (entities) and "Edges" (relationships).
- **Best For:** Social networks, fraud detection, recommendation engines.
- **Pros:** Fast querying of deeply nested relationships without slow JOIN operations.
- **Cons:** High learning curve for graph query languages (like Cypher).

## 5. Niche / Specialized

- **Vector** (Pinecone, Milvus): Stores AI and LLM data embeddings.
- **Time-Series** (InfluxDB, TimescaleDB): Logs high-frequency data like IoT sensors and stock ticks.
- **Wide-Column** (Cassandra, ScyllaDB): Handles massive global write volumes across multiple data centers.
