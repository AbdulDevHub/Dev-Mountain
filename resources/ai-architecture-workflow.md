---
id: ai-architecture-workflow
title: AI Architecture & Workflow Reference
sidebar_label: Subagents & Effort Modes
description: A practical reference for when to use subagents and how to tune model effort/reasoning modes for cost-effective, reliable agentic workflows.
tags: [agents, subagents, llm, architecture, reasoning]
---

A practical guide to two core levers in agentic system design: **when to delegate work to subagents**, and **how much reasoning effort to allocate** to a model for a given task.

## 1. When to Use Subagents

Subagents act as isolated workers with their own system prompt, tool access, and memory. They keep your main conversation ("orchestrator" or "lead agent") clean by handling delegated tasks in a separate context, and returning only the result you actually need.

Consider spawning subagents when your project meets one or more of the following conditions.

### The task outgrows the context window

- **The problem:** A single agent reading dozens of logs, a large codebase, or a massive dataset gets overwhelmed. This leads to "context noise" — irrelevant tokens crowding out what matters — and a higher rate of hallucination.
- **The fix:** Offload the noisy, data-heavy exploration to a subagent whose only job is to read the raw files and return a distilled, high-level summary back to the main agent.

### You need parallel execution

- **The problem:** A single agent processes steps sequentially, which makes large, multi-component tasks slow.
- **The fix:** Use a "fan-out" pattern — spin up multiple subagents to tackle different sections of a task simultaneously (for example, summarizing five separate documents in parallel instead of one after another).

### The task requires a fresh perspective

- **The problem:** An agent tends to struggle to honestly critique its own work, because it's biased toward justifying decisions it already made.
- **The fix:** Use an adversarial subagent. For example, hand "find bugs in this code" to a separate critic subagent that has no context on how or why the code was written — it has nothing to defend.

### You're running specialized, repeatable workflows

- **The problem:** A generalist agent needs long, repetitive prompting every time to enforce the same constraints, which wastes tokens and produces inconsistent output.
- **The fix:** Define a permanent subagent with fixed instructions, restricted tool access (e.g., read-only), and a model chosen for the job — a fast/cheap model for extraction, a stronger model for planning.

:::tip Rule of thumb
If you find yourself re-explaining the same constraints, re-reading the same class of noisy data, or asking the main agent to argue with itself — that's usually a sign the work belongs in a subagent, not the main thread.
:::

---

## 2. Model Effort Modes

Effort modes control a reasoning model's internal "thinking budget" — how many tokens it spends analyzing a problem before producing an answer. Reasoning models typically expose an `effort` parameter ranging from **Minimal/None** to **Max/X-High**, letting you trade intelligence and accuracy against speed and cost.

### Effort mode breakdown

| Effort Mode | Internal Behavior | Best For | Avoid For |
| :--- | :--- | :--- | :--- |
| **None / Minimal** | Bypasses or minimizes reasoning tokens for near-instant execution. | Straightforward data extraction, basic formatting, simple rewrites. | Logic-heavy tasks, multi-step planning, complex coding. |
| **Low** | Small token budget (~1,000 tokens) for quick validation. | Boilerplate scaffolding, basic API calls, simple Q&A. | Core business logic, secure algorithms, deep debugging. |
| **Medium** | Balanced default for everyday tasks. | Standard feature building, routine refactoring, common math. | Highly nested logic or novel, unGoogleable problems. |
| **High** | Deep tree-of-thought exploration across dependencies. | Complex multi-file debugging, performance optimization, edge cases. | Repetitive extraction tasks or simple scripts — wastes money. |
| **Max / X-High** | No token ceiling; exhaustive error-checking. | Cryptographic implementations, architecture planning, critical bugs. | Fast brainstorming or rapid prototyping — too slow. |

:::caution Static settings are a trap
Using **Low** effort for something like a database migration can produce a script that ignores active user traffic and locks the whole database. Using **Max** effort for a 3-line documentation summary burns time and budget analyzing abstract theory nobody asked for. Effort should scale with stakes and novelty, not stay fixed across a project.
:::

### Concrete application: tiered effort in a migration workflow

A single feature — migrating a database — can (and often should) use three different effort levels across its lifecycle:

1. **System architecture plan → `/effort max`**
   The stakes are high: migrating 10 million rows with zero downtime. The model needs to spend heavily on reasoning tokens to anticipate race conditions, index fragmentation, and fallback strategies.

2. **Component implementation → `/effort medium`**
   The blueprint already exists. The model just needs to translate the high-level architecture from step 1 into standard extraction and mapping scripts.

3. **Test data generation → `/effort low`**
   Low risk, high speed. The model only needs to generate 50 rows of dummy names and emails to confirm the pipeline runs without crashing.

```text
Plan       →  effort: max     (architecture, race conditions, fallback design)
Implement  →  effort: medium  (standard pipeline code from the approved plan)
Test data  →  effort: low     (throwaway mock rows, no real logic)
```

---

## 3. Putting the two together

Subagents and effort modes compose well: the *effort* dial decides how hard a single model call thinks, while *subagents* decide who does the thinking and with what context. A common pattern:

- Orchestrator agent runs at **medium** effort, coordinating the overall task.
- A **planning subagent** runs at **max** effort for the one-time architecture decision.
- Several **parallel extraction subagents** run at **low/minimal** effort, since their job is narrow and repeatable.
- A **critic subagent** runs at **high** effort, since catching subtle bugs benefits from deeper reasoning — but doesn't need the exhaustive budget of the original planning step.

:::note
Matching effort to role, not just to task type, avoids the two failure modes above: underpowered critical decisions, and overpowered trivial ones.
:::
