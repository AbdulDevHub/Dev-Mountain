---
id: system-design-fundamentals
title: System Design Fundamentals
sidebar_label: System Design Fundamentals
tags: [system-design, interview-prep]
---

## Core Building Blocks

### Horizontal vs. Vertical Scaling

How you handle more load:

- **Vertical scaling** — make one machine bigger (more CPU, RAM, disk). Simple, but has a ceiling, and it's a single point of failure.
- **Horizontal scaling** — add more machines and spread the work across them. Harder (you now have a *distributed* system), but scales much further and adds redundancy — if one machine dies, others keep serving traffic.

> **Rule of thumb:** vertical scaling buys you time; horizontal scaling is the long-term answer at real scale.

### Load Balancing

Once you have multiple machines, something needs to decide which one handles each incoming request — that's a **load balancer**.

Common strategies:

| Strategy | How it works |
| --- | --- |
| Round robin | Requests go to servers in rotation |
| Weighted round robin | Same as round robin, but stronger servers get proportionally more requests |
| Least connections | Send to whichever server currently has the fewest active connections |
| Least response time | Send to whichever server is currently responding fastest |
| IP hash | Hash the client IP to consistently route the same client to the same server — useful for session "stickiness" |
| Geographical | Route based on the user's physical location, to the nearest datacenter/edge |
| Consistent hashing | Hash both servers and keys onto a virtual ring; each key goes to the next server clockwise on the ring |

**Why consistent hashing matters:** with plain hashing (`hash(key) % N`), adding or removing *one* server changes `N` and remaps almost every key to a different server — a cache stampede. Consistent hashing arranges servers as points on a ring; adding/removing a server only remaps the small slice of keys between it and its neighbor, leaving everything else untouched. This is why it shows up specifically in caching layers and sharded databases, where minimizing remapping during scale events matters a lot.

Load balancers also run **health checks** — unresponsive servers get pulled out of rotation automatically. To avoid the load balancer itself being a single point of failure, production setups typically run a redundant **primary/standby pair** with active monitoring and DNS failover to the standby if the primary goes down.

### Forward Proxy vs. Reverse Proxy

A **proxy** is a middleman server. Which side it sits on determines what it's for:

- **Forward proxy** — sits in front of *clients*, between them and the internet. Hides client identity from the destination server, and is used for things like content filtering, network access control, or caching outbound requests. (Think: a company's outbound internet gateway.)
- **Reverse proxy** — sits in front of *servers*, between the internet and your backend. Hides server infrastructure from the outside world, and commonly handles load balancing, SSL/TLS termination (decrypting HTTPS so backend servers don't have to), and security rules (e.g., a Web Application Firewall). Nginx is a common example.

> **Rule of thumb:** if it's protecting/anonymizing who's *asking*, it's a forward proxy. If it's protecting/optimizing who's *answering*, it's a reverse proxy — and in practice, most load balancers you'll design with are a form of reverse proxy.

### Caching Strategies

Caching keeps a copy of expensive-to-compute or expensive-to-fetch data somewhere fast (usually in memory) so you don't redo the work every time.

Core patterns:

- **Cache-aside (lazy loading)** — app checks cache first; on a miss, it fetches from the DB and writes the result into the cache. Most common pattern.
- **Write-through** — every write goes to the cache *and* the DB at the same time, keeping them in sync.
- **Write-behind (write-back)** — write to cache immediately; DB is updated asynchronously later. Faster, but riskier if the cache crashes before syncing.
- **Write-around** — write goes straight to the DB, bypassing the cache entirely; the cache only gets populated later on a read (cache-aside style). Good when data is written once but rarely re-read soon after — avoids filling the cache with stuff nobody asks for again.
- **TTL (time-to-live) / eviction policies** — memory is limited, so entries expire or get evicted. Common policies: **LRU** (least recently used), **LFU** (least frequently used), **FIFO** (first in, first out — simplest; evicts the oldest entry regardless of how often it's used).

### CDN Caching Direction

Beyond app-level caching, static assets (images, video, JS/CSS) are often cached at CDN edge nodes, geographically close to users. Two ways content gets there:

- **Pull-based** — the CDN fetches the asset from the origin the first time it's requested, then caches it for later users. Simple, but the first requester pays a cold-miss penalty.
- **Push-based** — content is proactively uploaded to the CDN ahead of time (e.g., right after a video finishes processing). No cold-miss penalty, but you have to manage what gets pushed and when.

---

## CAP Theorem and Database Scaling

### Database Paradigms, at a Glance

Before diving into CAP and replication, it helps to place databases into three broad buckets:

| Type | Traits | Examples |
| --- | --- | --- |
| **Relational (SQL)** | Table-based, fixed schema, joins, **ACID** guarantees (Atomicity, Consistency, Isolation, Durability) | PostgreSQL, MySQL, SQLite |
| **NoSQL** | Schema-less, optimized for flexibility and horizontal scale, usually relaxes strict/immediate consistency in favor of availability. Sub-types: key-value, document, graph | MongoDB (document), Cassandra (wide-column), Redis (key-value), Neo4j (graph) |
| **In-memory** | Data lives in RAM instead of disk — extremely fast, often used as a cache layer or for ephemeral data | Redis, Memcached |

**ACID**, spelled out: the transaction either fully happens or not at all (**Atomicity**), the DB moves from one valid state to another (**Consistency** — schema/constraint sense, not the CAP sense below), concurrent transactions don't see each other's half-finished work (**Isolation**), and once committed, data survives a crash (**Durability**).

> **Naming note:** you'll also see replication described as **master-slave** (single writer, multiple readers) or **master-master** (multiple writers) — these map directly to the single-leader / multi-leader terms used below; different books use different vocabulary for the same idea.

### The CAP Theorem

In a distributed system, when a **network partition** occurs (nodes can't talk to each other), you can only guarantee **two** of the following three at once:

- **Consistency (C)** — every node sees the same data at the same time; a read right after a write returns the latest value, regardless of which node you hit.
- **Availability (A)** — every request gets a response (success or failure), even if some nodes are down or unreachable.
- **Partition tolerance (P)** — the system keeps working even when communication between nodes breaks down.

**Key insight:** partitions *will* happen — networks are unreliable. So P isn't really optional in practice. The real tradeoff is **C vs. A** *when* a partition occurs.

| Choice | Behavior during a partition | Example |
| --- | --- | --- |
| **CP** | Reject some requests to guarantee correct, up-to-date data | Banking system — rather reject a transaction than show a stale balance |
| **AP** | Keep responding to every request, even with temporarily stale data | Social media "like" counter — fine if slightly out of sync, but should never stop working |

> CAP only forces a choice **during a partition**. When there's no partition, most systems try to give you both C and A.

### Replication

Replication = keeping copies of the same data on multiple nodes.

**Topology patterns:**

- **Single-leader (primary-replica)** — one node accepts writes; changes propagate to read replicas. Simple, reads scale horizontally. Leader is a write bottleneck and single point of failure until a replica is promoted.
- **Multi-leader / leaderless** — multiple nodes accept writes. More available, better for geo-distributed systems, but introduces **write conflicts** to resolve.

**Consistency dimension:**

- **Synchronous replication** — leader waits for replica confirmation before acknowledging a write. Safer, slower.
- **Asynchronous replication** — leader confirms immediately; replicas catch up after. Faster, but risks data loss if the leader crashes before replicas catch up.

### Sharding (Partitioning)

Where replication *copies* the same data everywhere, **sharding splits the data** — each shard holds a different subset of rows across different machines. This is how you scale **writes** horizontally (replication alone doesn't help with that, since writes still funnel through the leader).

| Strategy | How it works | Tradeoff |
| --- | --- | --- |
| Range-based | Split by value range (e.g., user IDs 1–1000 on shard A) | Simple, but can create hot shards |
| Hash-based | Hash the key to pick a shard | Even load distribution, but range queries become expensive |
| Directory-based | A lookup service tracks which shard owns which key | Flexible, but the lookup service itself needs to stay available |
| Geographical | Shard by region (e.g., EU users on shard A, US users on shard B) | Keeps data close to users (lower latency, easier data-residency compliance), but regional traffic imbalances create hot shards |

> Sharding trades simplicity for scale — cross-shard queries and joins become expensive or impossible to do efficiently. Usually a last resort after replication and caching aren't enough.
---

## Message Queues and Rate Limiting

### Message Queues: When Async Beats Sync

A normal API call is **synchronous** — the client sends a request and waits for the server to fully finish before it gets a response. That's fine when the work is fast and the client needs the result immediately (e.g., "log me in").

A **message queue** flips this: instead of doing the work immediately, you drop a "job" onto a queue and respond to the client right away ("got it, processing"). A separate worker process picks up jobs from the queue and does the actual work on its own time.

**When async wins:**

- **The work is slow** and the client doesn't need to wait for it — e.g., sending a confirmation email, generating a PDF report, resizing an uploaded image.
- **You want to smooth out traffic spikes.** A queue lets workers process a burst of requests at a sustainable rate instead of servers falling over trying to handle them all synchronously.
- **You need to decouple services.** The producer doesn't need to know or care which service consumes the work, or whether it's up right now — improving resilience.
- **You need retries.** If a job fails (e.g., a third-party API timeout), the queue can retry automatically without the original client doing anything.

**When sync is still right:**

- The client genuinely needs the result to proceed (e.g., "is this password correct?").
- The work is fast and predictable.
- Adding a queue would add latency and complexity without a real benefit.

> **Eventual consistency** shows up here too — when you queue a job (e.g., "update search index after a write"), there's a window where the system is slightly stale until the worker catches up. Usually an acceptable tradeoff for the resilience and throughput gained.

**Connecting to BullMQ:**

- BullMQ jobs support **retry policies with backoff** (e.g., exponential delay) — maps directly to the "retries" benefit above.
- BullMQ supports **concurrency control** on workers — controls load on downstream systems (e.g., not hammering a third-party API).
- Built on Redis, so the queue lives in memory (with persistence options) — worth knowing the durability tradeoffs if a job needs to survive a crash.

### Rate Limiting Algorithms

| Algorithm | Allows bursts? | Complexity | Common use |
| --- | --- | --- | --- |
| Token bucket | Yes | Low | API rate limiting |
| Leaky bucket | No (smooths) | Low | Traffic shaping |
| Fixed window | Yes (edge burst issue) | Very low | Simple/naive limiters |
| Sliding window | No | Medium | Precise limiting (e.g., login attempts) |

- **Token bucket** — a bucket holds up to N tokens, refilled at a fixed rate. Each request consumes a token; empty bucket = reject/queue. Allows bursts if tokens were saved up. Most common in practice (many API/cloud rate limiters use this).
- **Leaky bucket** — requests queue up and are processed at a fixed, constant rate, like water leaking out at a steady drip. Smooths bursts rather than allowing them.
- **Fixed window counter** — count requests in fixed clock-aligned windows (e.g., max 100/minute). Simple, but has an edge case: a client can send 100 requests at the very end of one window and 100 more at the start of the next — 200 requests in ~2 seconds, technically within the rules.
- **Sliding window** — fixes the fixed-window edge case by using a rolling window instead of a clock-aligned one. Two flavors: **sliding window log** (track every timestamp — accurate, memory-heavy) and **sliding window counter** (weighted average of current + previous window — cheaper, close enough for most cases).

> **Interview tip:** the strongest answer picks the right algorithm for a scenario and explains why — e.g., "for a login endpoint I'd want sliding window since bursts are exactly what I'm trying to prevent; for a general API I'd use token bucket since I want to allow reasonable burstiness without being too strict."

---

## Database Indexing and Query Optimization

### What an Index Actually Is

An index is a **separate, extra data structure** Postgres builds and maintains *alongside* a table — like a second, sorted copy of one (or a few) columns, plus a pointer back to the full row. It doesn't change the table itself.

Without an index, a query like `WHERE email = 'bob@x.com'` requires a **sequential scan** — checking every row top to bottom. With an index on `email`, Postgres can binary-search a sorted structure and jump almost straight to the match — an **index scan**.

**Primary key vs. regular index:** the primary key is **automatically indexed** by Postgres the moment it's declared — that's why lookups by `id` are already fast. But indexing is a general-purpose tool you can apply to *any* column or combination of columns. Postgres does **not** automatically index other columns (including foreign keys) — that's a deliberate choice based on what your queries actually filter, join, or sort by.

> **Mental model:** the table is like unsorted index cards. The primary key index is like the cards being numbered — great if you know the number. A regular index (e.g., on last name) is like a separate, alphabetically sorted list pointing back to the right card — without it, finding "everyone named Smith" means flipping through every card.

> **Rule of thumb:** index columns you frequently filter (`WHERE`), join (`JOIN ... ON`), or sort (`ORDER BY`) on — not every column. Indexes speed up reads but slow down writes and cost disk space.

### Types of Indexes (Postgres)

- **B-tree** (default, most common) — good for equality (`=`) and range queries (`<`, `>`, `BETWEEN`), and sorting. Default choice if unsure.
- **Hash** — pure equality lookups only; rarely used since B-tree already covers this well.
- **GIN** — good for values with multiple elements: array columns, JSONB, full-text search.
- **GiST** — geometric data and other exotic types (range types, nearest-neighbor searches).

For interviews, B-tree is 90% of the conversation — know the others exist and what they're for.

### Composite (Multi-Column) Indexes

An index can span multiple columns, e.g., `CREATE INDEX ON orders (user_id, created_at)`. **Column order matters:**

- Efficient for queries filtering on `user_id` alone, or `user_id` AND `created_at` together.
- **Not** efficient for a query filtering only on `created_at` — like a phone book sorted by (last name, first name): great for finding "Smith", useless for finding everyone named "John" regardless of last name.

### Common Indexing Mistakes

- **Over-indexing** — every extra index slows writes and bloats storage.
- **Indexing low-cardinality columns** — e.g., a boolean column with mostly one value; barely helps since Postgres still scans a huge fraction of rows.
- **Functions on indexed columns in queries** — e.g., `WHERE LOWER(email) = 'x'` won't use a plain index on `email`. Needs a matching **expression index**: `CREATE INDEX ON users (LOWER(email))`.
- **Forgetting to index foreign keys** — Postgres does *not* auto-index FK columns (unlike the primary key). Joins on unindexed FKs are a classic slow-query culprit.

### Reading Query Plans with EXPLAIN ANALYZE

`EXPLAIN` shows Postgres's *planned* execution strategy without running the query. `EXPLAIN ANALYZE` actually runs it and shows real timing and row counts.

```sql
EXPLAIN ANALYZE
SELECT * FROM orders WHERE user_id = 42;
```

What to look for:

- **Seq Scan vs. Index Scan** — a `Seq Scan` on a large table where an index was expected is the #1 red flag (though see the caveat below).
- **Estimated rows vs. actual rows** — a big mismatch usually means stale statistics (fix with `ANALYZE tablename;`), which can lead to a suboptimal plan.
- **Cost** (`cost=X..Y`) — relative units (not milliseconds); estimated startup and total cost. Useful for comparing plans, not absolute timing.
- **Actual time** — with `ANALYZE`, real `actual time=X..Y ms` per step plus total execution time. This is what matters for hunting a slow query.
- **Nested Loop / Hash Join / Merge Join** — join strategy. Nested loops are fine for small result sets but expensive at scale; hash joins are typically better for larger joins.

> **Subtlety:** Postgres sometimes deliberately chooses a sequential scan over an available index, and it's not always a bug. If a query matches a large fraction of a table's rows, a seq scan (straight read-through) can genuinely be cheaper than an index scan (random I/O per row). The strongest answer is "it depends on selectivity," not "always add an index."

### Practicing on a Real Database

1. Pick a query known to be slow (or write one against a decent-sized table).
2. Run `EXPLAIN ANALYZE` and check for a Seq Scan.
3. Add an index on the filtered/joined column, run `ANALYZE tablename;` to refresh stats, then re-run `EXPLAIN ANALYZE`.
4. Compare "actual time" before/after, and check whether the plan switched to an Index Scan.

---

## Practice — Design One System End to End

### Why This Exercise Matters

Interviewers care less about a "correct" answer and more about **how you think through tradeoffs out loud**. There's no single right design — there's a design that makes sense *given* the stated (or clarified) constraints.

### A Repeatable Framework

1. **Clarify requirements** — functional (what does it do?) and non-functional (how many users? read- or write-heavy? how much data? latency needs?). State assumptions out loud rather than making them silently.
2. **Estimate scale** — rough back-of-envelope numbers (requests/sec, storage growth). Doesn't need to be precise, just directionally sane.
3. **API design** — core endpoints (e.g., `POST /shorten`, `GET /{code}`).
4. **Data model & database choice** — schema shape, SQL vs. NoSQL, and why.
5. **High-level architecture** — client → load balancer → app servers → database, plus cache, queue, CDN where relevant.
6. **Deep dive on 1–2 interesting parts** — e.g., "how do we generate unique short codes without collisions at scale?"
7. **Scaling plan** — bottlenecks as traffic grows, and how to address each (caching, read replicas, sharding, etc.).

### Worked Example: URL Shortener

**1. Requirements**

- Functional: submit a long URL → get a short code; visiting the short URL redirects to the original.
- Non-functional: read-heavy (many more redirects than URL creations, e.g., 100:1+), redirects need low latency, short codes must be unique.

**2. Rough scale estimate**

- ~100M new URLs/month → ~40 writes/sec average.
- 100:1 read:write ratio → ~4,000 redirects/sec average.
- The read-heavy skew is the key number — it signals caching will matter a lot.

**3. API**

- `POST /shorten` — body `{ "url": "https://..." }` → returns `{ "short_code": "abc123" }`
- `GET /{short_code}` → 302 redirect to the original URL

**4. Data model & DB choice**

- Schema: `short_code (PK), original_url, created_at, expires_at (optional)`.
- Good fit for relational DB (Postgres) — small rows, minimal relationships, no need for complex joins. No strong reason to reach for NoSQL here.

**5. High-level architecture**

```
Client → Load Balancer → App Servers → Cache (Redis) → Postgres
                                      ↘ (on cache miss) ↗
```

- On `GET /{code}`, check Redis first (cache-aside pattern) — hit → redirect immediately; miss → look up Postgres, then populate cache.
- Since this is read-heavy, Postgres **read replicas** behind the app servers would also help distribute read load, on top of caching.

**6. Deep dive — generating short codes**

- **Option A: random string** (e.g., 7 random base62 chars) — check for collision, retry if taken. Simple, but wasteful at high write volume due to retries.
- **Option B: auto-incrementing counter**, base62-encoded (e.g., ID `125` → `"cb"`). No collisions possible, but reveals ordering/volume — may or may not matter.
- Good trade-off discussion point — no clean winner, just different downsides.

**7. Scaling plan**

- Redirects are already cached and cheap.
- If write volume grows a lot, the counter/ID generation could bottleneck → **sharding** (multiple counters with different offsets/ranges per shard).
- CDN or edge caching for very popular short links could reduce load further.
