---
id: system-reliability-and-metrics
title: System Reliability, Metrics, and Production Architecture
sidebar_label: Reliability & Metrics
tags: [system-design, interview-prep]
---

This page covers how real production systems are structured operationally, and the vocabulary used to talk about *how good* a system is — separate from how it's built.

## What a Production Application Actually Looks Like

Beyond "client → load balancer → app servers → database," a real production setup includes:

- **CI/CD pipelines** (e.g., Jenkins, GitHub Actions) — automate testing and deployment from a code commit through to production, so releases aren't manual.
- **Logging, monitoring & alerting** — tools like PM2 (backend process monitoring) and Sentry (frontend/backend error tracking) capture logs and errors; automated alerts (e.g., pushed to Slack) get them in front of a developer fast.
- **Debugging discipline** — bugs get identified from logs and **reproduced in staging/test environments**, never debugged directly in production. If something's on fire, a **hotfix** is a fast, temporary patch deployed to stop the bleeding, with a proper fix following later.

## The Pillars of Good System Design

Most designs are judged against four qualities:

- **Scalability** — can it handle growth in load?
- **Maintainability** — can engineers understand, extend, and fix it without excessive pain?
- **Efficiency** — is it using resources (compute, storage, bandwidth) sensibly?
- **Planning for failure** — does it degrade gracefully instead of falling over completely?

Underneath all of this, most systems are ultimately doing one of three things: **moving data** (fast and securely), **storing data** (with the right access patterns/indexing), or **transforming data** (turning raw data into something useful).

## Measuring "How Good": SLA vs. SLO

These two terms get confused constantly, but they answer different questions:

- **SLO (Service Level Objective)** — an internal performance *target*, e.g., "p99 response time under 300ms." A goal your team holds itself to.
- **SLA (Service Level Agreement)** — a *contractual* promise to your users/customers, often with financial penalties if you miss it. SLAs are usually built on top of SLOs (you set the target internally, then promise a version of it externally).

### Availability & "The Nines"

Availability is usually expressed as a percentage of uptime, and small differences compound into big differences in allowed downtime per year:

| Availability | Downtime per year |
| --- | --- |
| 99% | ~3.65 days |
| 99.9% ("three nines") | ~8.76 hours |
| 99.99% ("four nines") | ~52.6 minutes |
| 99.999% ("five nines") | ~5.26 minutes |

Going from three nines to five nines isn't a small engineering lift — it's the difference between "a bad afternoon" and "basically never down," and the cost/complexity to get there rises steeply.

## Reliability, Fault Tolerance, and Redundancy — Three Different Things

These are often used interchangeably but describe different properties:

- **Reliability** — the system behaves correctly, consistently, over time.
- **Fault tolerance** — when something *does* go wrong (a server dies, a network link drops), the system keeps working — possibly in a degraded way — instead of failing completely.
- **Redundancy** — the mechanism that often *enables* fault tolerance: having backup components (extra servers, replica databases, a standby load balancer) ready to take over.

> **How they relate:** redundancy is a tool; fault tolerance is a property that redundancy (among other things) helps you achieve; reliability is the overall outcome you're aiming for. A system can be reliable without much redundancy if it just rarely fails in the first place — but at scale, redundancy is usually how you get there.

## Throughput vs. Latency

Easy to mix up, but they measure different things:

- **Throughput** — how much work the system gets through *over time*. Measured differently depending on the layer: **RPS** (requests/sec) for servers, **QPS** (queries/sec) for databases, **BPS** (bytes/sec) for networks.
- **Latency** — how long *one* request takes, end-to-end.

> A system can have high throughput and high latency at the same time (e.g., a batch pipeline processing millions of records/hour, but each individual record takes 2 seconds to move through the pipeline). Optimizing for one doesn't automatically improve the other — know which one your use case actually needs.
