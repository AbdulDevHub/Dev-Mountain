---
id: api-design-fundamentals
title: API Design Fundamentals
sidebar_label: API Design
tags: [system-design, interview-prep]
---

## CRUD Maps to HTTP

The standard mapping interviewers expect you to know cold:

| Operation | HTTP Verb | Example |
| --- | --- | --- |
| Create | `POST` | `POST /orders` |
| Read | `GET` | `GET /orders/42` |
| Update (full replace) | `PUT` | `PUT /orders/42` |
| Update (partial) | `PATCH` | `PATCH /orders/42` |
| Delete | `DELETE` | `DELETE /orders/42` |

Status codes follow a simple pattern: **2xx** success, **3xx** redirection, **4xx** client error (you sent something wrong), **5xx** server error (something broke on the server).

## Three API Paradigms

| Paradigm | How it works | Strength | Weakness |
| --- | --- | --- | --- |
| **REST** | Resources exposed over standard HTTP verbs, JSON payloads | Simple, cacheable, widely understood | Prone to **over-fetching** (getting fields you didn't need) or **under-fetching** (needing multiple round-trips to assemble one view) |
| **GraphQL** | Single POST endpoint; client specifies exactly which fields it wants in the query | Client controls the shape of the response — no over/under-fetching | More complex server-side setup; caching is harder than plain REST |
| **gRPC** | Runs over HTTP/2, serializes payloads as binary via Protocol Buffers | Fast, compact, great for service-to-service (microservice) calls | Not human-readable on the wire, less natural for public-facing browser clients |

> **Rule of thumb:** REST for general-purpose public APIs, GraphQL when clients have wildly different data needs (e.g., mobile vs. web needing different subsets of the same resource), gRPC for internal microservice-to-microservice calls where raw speed matters and both ends are services you control.

## API Design Guidelines

- **Idempotency** — calling the same operation multiple times should produce the same result as calling it once. `GET` must always be idempotent (zero side effects/mutations). This matters a lot for retries: if a client times out and retries a request, an idempotent endpoint won't accidentally double-charge a customer or double-create a record.
- **Versioning** — when you need to make a breaking change, don't break existing clients. Introduce a version prefix instead (e.g., `/v2/products`) so old integrations keep working against `/v1/` while new consumers move to `/v2/`.
- **Rate limiting** — protects the API from being overwhelmed (accidentally or as a DoS attack). See the rate-limiting algorithms table in *System Design Fundamentals* (token bucket, leaky bucket, fixed window, sliding window).
- **CORS (Cross-Origin Resource Sharing)** — a browser security mechanism. By default, a web page running on `siteA.com` can't call an API hosted on `siteB.com` via JavaScript. CORS headers on the API's responses explicitly allow-list which origins are permitted to call it. If you build a public API meant to be called from browser-based frontends on other domains, you'll need to configure this deliberately — it's a common "why is my API call failing only in the browser" gotcha.
