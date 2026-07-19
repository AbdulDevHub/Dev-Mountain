---
id: agile
title: Agile & Other Methods
sidebar_label: Agile
description: Personal reference notes on Agile as an umbrella philosophy, and the frameworks/methods other than Scrum (Kanban, XP, Lean, etc.).
tags: [agile, project-management]
---

> Personal notes. Scrum is the method I actually use day-to-day, so it gets [its own dedicated page](./scrum.md). This page covers **Agile as the umbrella philosophy**, and the other frameworks/methods that fall under it (or alongside it) — mostly so I remember how they differ from Scrum and from each other.

---

## What "Agile" actually is

**Agile is not a methodology.** It's a **set of values and principles** for software (and other) development, defined in 2001 by 17 practitioners in the **Agile Manifesto**. Scrum, Kanban, XP, etc. are all *implementations* of Agile thinking — Agile itself prescribes no roles, no events, no artifacts.

### The Agile Manifesto — 4 Values

> We are uncovering better ways of developing software by doing it and helping others do it. Through this work we have come to value:

1. **Individuals and interactions** over processes and tools
2. **Working software** over comprehensive documentation
3. **Customer collaboration** over contract negotiation
4. **Responding to change** over following a plan

> Important nuance: *"while there is value in the items on the right, we value the items on the left more"* — it's not that the right-hand items don't matter, just that they're secondary.

### The 12 Agile Principles (condensed)

1. Highest priority is satisfying the customer through **early and continuous delivery** of valuable software.
2. **Welcome changing requirements**, even late in development.
3. Deliver working software **frequently** (weeks, not months).
4. Business people and developers must **work together daily**.
5. Build projects around **motivated individuals**; give them the environment/support and trust them.
6. **Face-to-face conversation** is the most efficient form of communication.
7. **Working software** is the primary measure of progress.
8. Agile promotes **sustainable development** — a constant, indefinite pace.
9. **Continuous attention to technical excellence** and good design.
10. **Simplicity** — maximizing the amount of work *not* done — is essential.
11. Best architectures/requirements/designs emerge from **self-organizing teams**.
12. Regularly **reflect and tune** behavior (this is where the Retrospective idea comes from).

Notice how many Scrum concepts trace directly back to these — the Sprint Retrospective (#12), self-managing Developers (#11), sustainable pace, frequent delivery, etc. Scrum is essentially one well-specified implementation of these principles.

---

## Agile vs. Waterfall (the classic contrast)

| | Waterfall | Agile |
|---|---|---|
| Approach | Sequential phases (requirements → design → build → test → release) | Iterative, incremental |
| Change | Expensive, discouraged once a phase is signed off | Expected and welcomed |
| Customer feedback | Mostly at the end | Continuous, every iteration |
| Documentation | Heavy, upfront | "Just enough," evolving |
| Risk | Discovered late | Surfaced early and often |
| Best for | Well-understood, stable requirements (e.g. construction, hardware) | Complex, evolving problem spaces |

---

## The Other Frameworks/Methods

### Kanban

- Originated from Toyota's manufacturing system; adapted to knowledge work by David J. Anderson.
- **Continuous flow**, not time-boxed iterations — no Sprints.
- Core mechanics: a **visual board** (columns = workflow stages), **WIP (Work In Progress) limits** per column, and **pull system** (new work is pulled in only when capacity frees up).
- Key metrics: **Cycle time** (time for one item to go start→finish) and **Throughput** (items completed per time period), rather than Scrum's velocity.
- No prescribed roles — layers on top of whatever process already exists ("start with what you do now").
- Great fit for support/ops/maintenance work where priorities shift constantly and fixed Sprints don't make sense.

### Extreme Programming (XP)

- Created by Kent Beck in the late 1990s. The most **engineering-practice-heavy** Agile method.
- Adds concrete technical practices on top of Agile values:
  - **Pair programming**
  - **Test-Driven Development (TDD)**
  - **Continuous Integration**
  - **Collective code ownership**
  - **Simple design / refactoring**
  - **Small, frequent releases**
- Very short iterations (often 1–2 weeks, similar to Scrum Sprints).
- Where Scrum defines *process/management structure*, XP defines *how the code itself should be written*. Many teams combine "Scrum for process + XP for engineering practices."

### Lean Software Development

- Adapted from **Lean Manufacturing** (Toyota Production System) by Mary & Tom Poppendieck.
- 7 principles: **Eliminate waste, Amplify learning, Decide as late as possible, Deliver as fast as possible, Empower the team, Build integrity in, See the whole.**
- "Waste" in software = partially done work, extra features, task switching, waiting, defects, unnecessary movement/handoffs.
- Kanban is often described as one practical application of Lean thinking.

### Crystal

- Family of methods by Alistair Cockburn (Crystal Clear, Yellow, Orange, Red...), sized by **team size and criticality** of the project.
- Philosophy: people > process. Prioritizes communication and lightweight rules over heavy documentation.
- Less commonly used commercially today, but influential in Agile's early history (Cockburn was also a Manifesto co-author).

### Feature-Driven Development (FDD)

- Model-driven, short-iteration method built around delivering **client-valued features**.
- Process: build overall model → build feature list → plan by feature → design by feature → build by feature.
- More structured/upfront-design-heavy than Scrum or XP; less common today outside large legacy enterprise contexts.

### DSDM (Dynamic Systems Development Method)

- One of the oldest Agile frameworks (originated 1994, predates the Manifesto).
- Known for the **MoSCoW prioritization** technique: **M**ust have, **S**hould have, **C**ould have, **W**on't have (this time).
- Emphasizes fixed time/cost/quality with flexible scope — the inverse of traditional fixed-scope project management.

### Scrumban

- Hybrid: Scrum's structure (roles, some events like Retro/Planning) + Kanban's continuous flow and WIP limits.
- Popular for teams transitioning off Scrum, or maintenance-heavy teams that still want some Scrum ceremony/cadence.

---

## Scaling Frameworks (for multiple teams on one product)

These sit "above" whichever base framework (usually Scrum) each team uses:

| Framework | Style | Notes |
|---|---|---|
| **Nexus** | Minimal, official Scrum.org extension | Best for 3–9 Scrum Teams; adds a "Nexus Integration Team" to manage cross-team dependencies. |
| **LeSS (Large-Scale Scrum)** | Minimalist | Keeps a *single* Product Backlog and PO across all teams; "just enough" extra structure. |
| **SAFe (Scaled Agile Framework)** | Heavy, prescriptive | Adds Portfolio/Program/Team layers, PI (Program Increment) Planning, RTEs. Widely adopted in large enterprises; often criticized by Agile purists as too top-down/waterfall-in-disguise. |
| **Spotify Model** | Organizational, not a scaling framework per se | Squads, Tribes, Chapters, Guilds — describes team topology, not process. Note: Spotify itself has since moved away from parts of it. |

---

## Quick Comparison Table

| Method | Iteration style | Roles defined? | Main focus |
|---|---|---|---|
| **Scrum** | Fixed Sprints | Yes (PO, SM, Developers) | Process/product delivery cadence |
| **Kanban** | Continuous flow | No | Flow, WIP limits, visualizing work |
| **XP** | Short iterations | Loosely | Engineering/technical practices |
| **Lean** | N/A (philosophy) | No | Eliminating waste |
| **Crystal** | Short iterations | Loosely, by team size | People-centric, lightweight |
| **FDD** | Short iterations | Yes (feature teams, Chief roles) | Feature-by-feature modeling |
| **DSDM** | Time-boxed | Yes | Fixed time/cost, flexible scope (MoSCoW) |

---

## How These Relate (mental model)

```
              AGILE (values & principles — the umbrella)
                    |
   ------------------------------------------------
   |        |        |        |        |          |
 Scrum   Kanban     XP      Lean    Crystal   DSDM / FDD
   |        |
   -----------
  Scrumban (hybrid)
   |
Scaled up via: Nexus / LeSS / SAFe / Spotify Model
```

---

## See Also

- [Scrum — deep dive](./scrum.md) — the method I actually use at work.

## References

- [Agile Manifesto](https://agilemanifesto.org/)
- [12 Principles Behind the Agile Manifesto](https://agilemanifesto.org/principles.html)
- [Scrum Guide](https://scrumguides.org/)
