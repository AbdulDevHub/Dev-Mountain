---
id: hld-lld-video-streaming-case-study
title: "HLD vs. LLD: A Live-Streaming Case Study"
sidebar_label: HLD vs. LLD Case Study
tags: [system-design, interview-prep, oop]
---

System design interviews (and real design work) actually happen at two different zoom levels. This page walks through both, using a YouTube/Zoom-style live-streaming app as the running example.

- **High-Level Design (HLD)** — the big picture: which services exist, how they talk to each other, what infrastructure is involved. Answers "what are the pieces, and how do they fit together?"
- **Low-Level Design (LLD)** — the actual code-level design: classes, methods, object interactions, memory/concurrency concerns. Answers "how do I actually build the piece I just drew a box for?"

---

## Part 1: High-Level Design

### From Product Requirements to a Technical Spec

The starting point isn't the architecture diagram — it's the **PRD (Product Requirement Document)**. The engineering job is to:

1. Pull out the *core* user-facing features and prioritize them over nice-to-haves.
2. Map each feature to concrete **data entities** (e.g., a "like" is a row/record, a "comment" is a row/record, a video "frame" is a chunk of bytes with a timestamp).
3. Expose those entities through **protocol-agnostic APIs** — design the endpoint/contract first (`get_video_frame(video_id, device_type, offset)`), and only *then* decide whether it's served over HTTP, gRPC, FTP, etc.
4. Layer in engineering requirements: avoid single points of failure (via data duplication/partitioning — this is your replication/sharding knowledge in action), design for extensibility, and validate the design with load testing and capacity estimation **before** writing production code.

### Design Patterns as Reusable Answers

A **design pattern** is just a named, reusable solution to a recurring problem. One that comes up constantly in high-scale systems:

- **Publisher-Subscriber (pub/sub)** — publishers emit events without knowing who's listening; subscribers register interest and get notified when something happens. Classic use case: a celebrity's post needs to reach millions of followers — you don't push it individually to every follower's feed synchronously (that would melt the server); you publish the event once, and a fan-out/notification system handles distributing it to subscribers asynchronously.

### High-Level Blueprint: Live Streaming

**Basic flow:** Client Request → API Gateway / Application Server → Database / File System.

**Where different data lives — and why it's not all in one place:**

| Data type | Where it lives | Why |
| --- | --- | --- |
| Raw video content | File storage (Amazon S3, HDFS) | Large binary blobs are expensive and awkward to store in a relational DB — file/object storage is built for this |
| Comments, metadata, user data | SQL (Postgres/MySQL) | Needs relational joins — who commented, on which video, with what reply chain |
| High-scale key-value data (view counts, session state) | NoSQL | Needs to scale horizontally faster than relational joins would allow |

**Protocols involved, and why each one is used where it is:**

- **HTTP** — for stateless, non-real-time actions like posting a comment. No need for anything fancier.
- **RTMP (Real-Time Messaging Protocol)** — carries the *raw, high-quality* video stream from the camera/source up to backend storage, prioritizing zero data loss over low latency to the viewer.
- **MPEG-DASH / HLS** — used to *broadcast* the already-processed stream out to viewers, using **adaptive bitrate streaming**: the client automatically steps video quality up or down based on current network conditions, so playback doesn't stall.

> Notice the asymmetry: ingest (camera → server) prioritizes not losing any data (RTMP), while delivery (server → viewer) prioritizes smooth, uninterrupted playback even at the cost of quality (DASH/HLS). Same overall "video pipeline," two different protocols because the two legs optimize for different things.

**Processing the video — MapReduce:**

Once raw video (e.g., 8K) lands in storage, it needs to become multiple resolutions and formats for different devices. This is done by chunking the video into small segments (e.g., 10 seconds each) and running a **MapReduce**-style job: each chunk is transcoded in parallel into multiple resolutions (1080p, 720p, 480p, 1440p) and device-specific codecs (e.g., H.264). Parallelizing per-chunk is what makes transcoding a multi-hour video tractable in a reasonable amount of time.

**Caching in the streaming pipeline:** recently-watched chunks (e.g., the last 10 minutes across all users) are cached at the application server or pushed to CDN edge nodes, cutting down repeat database/storage hits and reducing latency for popular content — the same cache-aside/CDN ideas from your caching notes, applied specifically to video chunks instead of API responses.

---

## Part 2: Low-Level Design

Once the high-level architecture is settled, LLD is where you actually design the code: specific classes, their responsibilities, how they interact, and details like concurrency and memory that don't show up in a box-and-arrow diagram.

### Step 1 — Nail Down the Use Cases First

Before writing any classes, pin down exactly what the user can do. For the video player specifically:

1. Play a video from a specific timestamp.
2. Resume from the last saved seek position.
3. Fetch the optimum video quality for the current device/network.
4. Play back without interruption via background buffering.

### Step 2 — Structural Diagrams

**Use case diagram** — maps *actors* (Customer, Admin, Videographer) to the actions they can take. One useful design decision that falls out of this stage: dynamic bandwidth/quality switching is **offloaded to the HTTP-DASH protocol itself**, rather than building a custom rate-limiter object — if the transport protocol already solves a problem, don't re-solve it in your own class design.

**Class diagram** — the core entities for the video player:

| Class | Holds | Does |
| --- | --- | --- |
| `Video` | `id`, `frames[]`, `metadata` | `get_frame(timestamp)` |
| `Frame` | `bytes`, `start_time`, `end_time` | — |
| `User` | `id`, `name`, `email` | — |
| `WatchedVideo` | `user_id`, `video_id`, `seek_timestamp` | tracks watch history / resume position |
| `VideoConsumingService` / `VideoService` | — | expose the APIs for fetching seek positions and pulling frame bytes from storage |

**Sequence diagram** — traces the actual chronological call order: `User` → `VideoConsumingService` → `VideoService` → file system, and back. This is where you catch design issues that a static class diagram hides — e.g., realizing a call needs to happen before another one can succeed.

### Step 3 — From Diagram to Code: A Few Concrete Lessons

Working through this example in Java surfaces some small but important OOP habits worth internalizing generally, not just for video apps:

- **Frame lookup logic** — iterate frames and return the one where `start_time <= timestamp < end_time`. When the timestamp is out of bounds, **throw an explicit exception** rather than silently returning `null`. A `null` return pushes the "what do I do now?" problem onto every caller; a thrown exception makes the failure impossible to ignore.
- **Avoid hidden global constants** — frame duration was initially a global constant, then refactored to be a property on each `Frame` instance instead. Variable-length data shouldn't be modeled as a fixed constant just because it "usually" doesn't vary — encapsulate it on the object it actually belongs to.
- **Service abstraction over storage** — the `VideoService` layer wraps file-system interaction (querying by video ID, returning `Frame` objects) behind a clean interface, so callers never talk to the file system directly. This is the same principle as the cache-aside pattern from HLD — callers go through a service, and the service decides where the data actually comes from.

---

## How This Connects Back

- The **replication/sharding** concepts from your core notes are what "avoiding single points of failure through data duplication/partitioning" is actually referring to at the PRD stage.
- The **file storage vs. SQL vs. NoSQL** split here is a concrete instance of the *Database Paradigms* table — video blobs don't belong in a relational DB for the same reason you wouldn't index a low-cardinality boolean column: the tool has to match the access pattern.
- **RTMP / MPEG-DASH / HLS** slot into the *Application Layer Protocols* reference as domain-specific protocols, alongside HTTP/WebSockets/etc.
- The **pub/sub pattern** is a named answer to the same "how do I avoid overloading the system with a burst of work" problem that message queues (BullMQ, async processing) solve in your other notes — different mechanism, same underlying motivation.
