---
id: scrum
title: Scrum
sidebar_label: Scrum
description: Personal reference notes on the Scrum framework — roles, events, artifacts, and lessons learned.
tags: [agile, scrum, project-management]
---

> Personal notes, kept so future-me doesn't have to relearn this from scratch. Scrum is one implementation of [Agile](./agile.md) — see that page for Kanban, XP, Lean, and the rest.

Scrum is a lightweight **framework** (not a methodology, not a process) for tackling complex, adaptive problems while delivering products of the highest possible value. It's defined by the [Scrum Guide](https://scrumguides.org/), maintained by Ken Schwaber and Jeff Sutherland, most recently updated in **2020**.

Key thing to remember: **Scrum is a framework, not a set of rules.** It gives you the minimal set of roles, events, and artifacts needed to build a complex product incrementally. Everything else (estimation techniques, specific ceremonies formats, tooling) is "how teams implement Scrum," not Scrum itself.

---

## Why Scrum exists — Empiricism

Scrum is built on **empirical process control theory** — the idea that knowledge comes from experience and decisions should be based on what is observed, not what is predicted.

Three pillars uphold empiricism:

| Pillar | Meaning |
|---|---|
| **Transparency** | Significant aspects of the process must be visible to those responsible for the outcome (e.g., a shared definition of "Done"). |
| **Inspection** | Artifacts and progress must be inspected frequently to detect undesirable variances. |
| **Adaptation** | If inspection reveals the process is deviating outside acceptable limits, the process or the material must be adjusted ASAP. |

Scrum also leans on **Lean Thinking** — reducing waste and focusing on the essentials.

---

## The Scrum Values

Five values give the team direction on their day-to-day work:

1. **Commitment** — to the goals of the Scrum Team.
2. **Focus** — on the work of the Sprint and the goals of the team.
3. **Openness** — about the work and the challenges.
4. **Respect** — team members respect each other's capability and independence.
5. **Courage** — to do the right thing, tackle tough problems, and be honest.

> Mnemonic: **C.F.O.R.C.** (Commitment, Focus, Openness, Respect, Courage).

---

## The Scrum Team

As of the **2020 Guide**, there are only **three accountabilities**, all inside one Scrum Team (no more "team roles" vs "team" split — everyone is on *one* team). Typically 10 or fewer people total.

### 1. Product Owner

- Owns the **"what"** — maximizes the value of the product resulting from the work of the Scrum Team.
- Accountable for effective **Product Backlog management**: creating and communicating the Product Goal, ordering items, ensuring the backlog is transparent and understood.
- **One person**, not a committee (a committee can advise the PO, but the PO makes the final call).

### 2. Scrum Master

- Accountable for establishing Scrum "as defined in the Scrum Guide" and for the **Scrum Team's effectiveness**.
- A true **servant-leader**: coaches, removes impediments, shields the team from disruptions, facilitates events.
- Serves the PO (backlog techniques, goal clarity), the Developers (self-management, cross-functionality), and the **organization** (driving adoption, working with other Scrum Masters).
- **Not a project manager.** Doesn't assign tasks or manage the team's day-to-day work.

### 3. Developers

- The people who do the work of turning Product Backlog items into a usable **Increment** each Sprint.
- **Self-managing**: they decide *who* does *what*, *when*, and *how* — nobody (including the SM or PO) tells them how to turn backlog items into increments.
- Cross-functional as a group: collectively they have all the skills needed (design, build, test, etc.).

---

## The Scrum Events

All events are **time-boxed** — they have a maximum duration.

### The Sprint

- The heartbeat of Scrum. A time-boxed container for all other events, usually **1–4 weeks** (2 weeks is the most common default).
- Fixed length — during a Sprint: no changes that endanger the Sprint Goal, quality doesn't decrease, and the Product Backlog is refined as needed.
- A new Sprint starts immediately after the previous one ends.
- **Can be cancelled** — only the Product Owner has authority to do this, and only if the Sprint Goal becomes obsolete.

### Sprint Planning

- **Time-box:** max 8 hours for a 1-month Sprint (proportionally less for shorter Sprints, e.g. ~4 hrs for a 2-week Sprint).
- Answers three questions:
  1. **Why is this Sprint valuable?** → produces the **Sprint Goal**.
  2. **What can be Done this Sprint?** → Developers select items from the Product Backlog.
  3. **How will the chosen work get done?** → Developers plan/decompose into a plan (often tasks).
- Whole Scrum Team attends.

### Daily Scrum

- **Time-box:** 15 minutes, every working day.
- For the **Developers only** — inspect progress toward the Sprint Goal and adapt the Sprint Backlog.
- The classic "3 questions" format (what I did / what I'll do / blockers) is **just one example**, not mandatory — teams can run it however works, as long as it stays focused on progress toward the Sprint Goal.
- Improves communication, identifies impediments, promotes quick decision-making.

### Sprint Review

- **Time-box:** max 4 hours for a 1-month Sprint (proportionally less otherwise).
- Inspect the **outcome** of the Sprint with stakeholders and determine future adaptations.
- Not just a demo — a working session to review what was built vs. the Product Goal and update the Product Backlog if needed.

### Sprint Retrospective

- **Time-box:** max 3 hours for a 1-month Sprint (proportionally less otherwise).
- Last event of the Sprint. The team inspects **how the last Sprint went** re: individuals, interactions, processes, tools, and Definition of Done.
- Produces at least one improvement to be actioned in the next Sprint (should be added to the Sprint Backlog).

> Rule of thumb for time-boxes (1-month Sprint baseline): **Planning 8h → Daily 15min → Review 4h → Retro 3h.** Scale down proportionally for shorter Sprints.

---

## The Scrum Artifacts & Commitments

Each artifact has a **commitment** attached, which gives it a clear goal to measure progress against.

| Artifact | Commitment | Purpose |
|---|---|---|
| **Product Backlog** | **Product Goal** | Ordered, emergent list of everything needed to improve the product. The single source of work. |
| **Sprint Backlog** | **Sprint Goal** | The Product Backlog items selected for the Sprint, plus a plan for delivering them. Owned entirely by the Developers. |
| **Increment** | **Definition of Done (DoD)** | A concrete, usable, potentially releasable stepping stone toward the Product Goal. Every increment is additive to all prior ones. |

### Definition of Done (DoD)

- A **formal description of the state** of the Increment when it meets the quality measures required.
- If there's an organizational standard, all Scrum Teams follow it as a minimum; otherwise the team creates one appropriate for the product.
- A Product Backlog item is not "Done" — and cannot be presented at Sprint Review — unless it meets the DoD.

### Product Goal

- Describes a future state of the product that can serve as a target for the Scrum Team to plan against.
- One Product Goal at a time; the current one must be fulfilled (or abandoned) before taking on the next.

---

## Common Terminology (not official Scrum Guide terms, but widely used)

| Term | Meaning |
|---|---|
| **Backlog Refinement / Grooming** | Ongoing activity of adding detail, estimates, and order to Product Backlog items. Not an official event but a recommended, ongoing activity (rule of thumb: ~10% of Developers' capacity). |
| **Story Points** | Relative, unit-less estimate of effort/complexity/uncertainty for a backlog item. Common scale: Fibonacci-like (1, 2, 3, 5, 8, 13, 21...). |
| **Velocity** | Average amount of work (e.g. story points) a team completes per Sprint. Used for forecasting, not a performance metric. |
| **Burndown / Burnup Chart** | Visualizes remaining work (burndown) or completed work (burnup) over time within a Sprint or release. |
| **User Story** | A short, plain-language description of a feature from the user's perspective. Common format: *"As a [role], I want [goal], so that [reason]."* |
| **INVEST** | Heuristic for good user stories: Independent, Negotiable, Valuable, Estimable, Small, Testable. |
| **Definition of Ready (DoR)** | Unofficial complement to DoD — criteria a backlog item should meet before it's pulled into a Sprint (e.g., clear acceptance criteria, sized, dependencies identified). |
| **Spike** | A time-boxed research/investigation task used to reduce uncertainty (technical or design) before committing to real work. |
| **Technical Debt** | Shortcuts taken for speed that will cost extra effort later; should be visible in the backlog. |
| **Epic** | A large body of work that gets broken down into multiple smaller stories. |

---

## Scrum vs. Kanban (quick contrast)

| | Scrum | Kanban |
|---|---|---|
| Cadence | Fixed-length Sprints | Continuous flow |
| Roles | PO, SM, Developers (defined) | No prescribed roles |
| Change mid-cycle | Discouraged during a Sprint | Allowed anytime |
| Key metric | Velocity | Cycle time / Throughput |
| Board resets | Yes, each Sprint | No, it's continuous |
| Core constraint | Time-box | WIP (Work In Progress) limits |

Some teams run a hybrid: **"Scrumban"** — Scrum's cadence/events + Kanban's WIP limits and flow focus.

---

## Common Anti-Patterns (things to watch for)

- **Water-Scrum-Fall** — doing big up-front design/requirements and big final testing/release phases, with Scrum only in the middle. Defeats the point of empiricism.
- **Zombie Scrum** — going through the motions (all events happen) but with no real inspection/adaptation or stakeholder value.
- **Scrum Master as project manager** — assigning tasks, tracking individual performance. Breaks self-management.
- **Product Owner by committee** — slows down decisions; the Guide requires one accountable individual.
- **Velocity as a performance target** — turns a forecasting tool into a perverse incentive (inflated estimates, cut corners).
- **Skipping the Retrospective** — usually the first event to get cut when time is short; ironically the one most responsible for long-term improvement.
- **Sprint length creep** — constantly changing Sprint length destroys the team's ability to build a reliable rhythm/velocity baseline.

---

## Scaling Scrum

When one team isn't enough, common frameworks/approaches include:

- **Nexus** — official Scrum.org framework for scaling (3–9 teams), adds a "Nexus Integration Team."
- **LeSS (Large-Scale Scrum)** — minimalist scaling approach, keeps single Product Backlog/PO across teams.
- **SAFe (Scaled Agile Framework)** — heavier, adds enterprise-level layers (portfolio, program, etc.) — more prescriptive, sometimes controversial for being "un-agile" in spirit.
- **Spotify Model** (Squads, Tribes, Chapters, Guilds) — not officially a framework anymore (Spotify itself moved away from parts of it), but still referenced a lot.

---

## References

- [Official Scrum Guide (scrumguides.org)](https://scrumguides.org/)
- [Scrum.org](https://www.scrum.org/)
- [Agile & Other Methods](./agile.md) — how Scrum fits into the broader Agile picture
