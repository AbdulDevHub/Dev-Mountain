---
name: bootstrap
description: Bootstraps the context files (AGENTS.md and context/*.md) for a new project by conducting a conversational interview.
---

# Project Bootstrapping Skill

Use this skill when starting a new project. You are responsible for interviewing the user to gather all key details, and then incrementally writing a high-quality, professional set of context files (`AGENTS.md` and 9 markdown files inside a `context/` directory at the project root).

## Core Directives

1. **Be Conversational & Incremental**: Do NOT ask all questions at once. Conduct a 6-stage interview. Ask questions for one stage, wait for the user's answers, write the corresponding markdown files for that stage, and then move to the next stage.
2. **Use the Templates**: Load and copy the structure of the templates located in the skill's reference directory (`C:\Users\kokok\.agents\skills\bootstrap\references/`). Customize them with the user's actual project details.
3. **Keep Links Clickable**: When generating markdown files, follow the rule that file links MUST be formatted as `[filename](file:///absolute/path/to/file)` with the `file:///` scheme and forward slashes. Do NOT wrap link text in backticks.
4. **Deliver Premium Quality**: Do not use placeholders. Write clear, detailed, and professional content.

---

## The 6-Stage Bootstrapping Flow

### Stage 1: Core Concept & Overview
1. **Interview**: Ask the user for the project name, description, the problem it solves, target audience, core features, and page routes.
2. **Generation**: Create the `context/` directory at the workspace root if it doesn't exist. Read `C:\Users\kokok\.agents\skills\bootstrap\references\project-overview-template.md`, customize it, and write it to `context/project-overview.md`.

### Stage 2: Architecture & Tech Stack
1. **Interview**: Ask about the programming languages, framework, database, authentication, storage, AI integration, serverless functions, and external API integrations.
2. **Generation**: Read `C:\Users\kokok\.agents\skills\bootstrap\references\architecture-template.md`, customize it, and write it to `context/architecture.md`.

### Stage 3: Design System & UI Rules
1. **Interview**: Ask about styling (Vite, Next.js, Tailwind v3/v4, CSS), color palettes, font choices (e.g. Google Fonts Inter), borders, shadows, layout sizes (max widths, padding), active/inactive navbar styles, and cards/buttons design.
2. **Generation**: 
   - Read `C:\Users\kokok\.agents\skills\bootstrap\references\ui-tokens-template.md`, customize it, and write to `context/ui-tokens.md`.
   - Read `C:\Users\kokok\.agents\skills\bootstrap\references\ui-rules-template.md`, customize it, and write to `context/ui-rules.md`.

### Stage 4: Engineering & Code Standards
1. **Interview**: Ask about the project's strict TypeScript settings, React Server Components vs Client Components rules, naming conventions (folders, files, components, utilities, routes), error handling, and Git flow.
2. **Generation**: Read `C:\Users\kokok\.agents\skills\bootstrap\references\code-standards-template.md`, customize it, and write to `context/code-standards.md`.

### Stage 5: Libraries & Integrations
1. **Interview**: Ask about third-party libraries (e.g., PostHog, InsForge, Lucide, react-pdf, Stripe) and how they should be structured/used in the project.
2. **Generation**:
   - Read `C:\Users\kokok\.agents\skills\bootstrap\references\library-docs-template.md`, customize it, and write to `context/library-docs.md`.
   - Read `C:\Users\kokok\.agents\skills\bootstrap\references\ui-registry-template.md`, customize it, and write to `context/ui-registry.md` (creating the empty/base UI component registry).

### Stage 6: Build Plan & Rules
1. **Interview**: Ask about the development milestones, phases (Foundation, Core Features, Analytics/Advanced), automated testing setup, and manual validation.
2. **Generation**:
   - Read `C:\Users\kokok\.agents\skills\bootstrap\references\build-plan-template.md`, customize it, and write to `context/build-plan.md`.
   - Read `C:\Users\kokok\.agents\skills\bootstrap\references\progress-tracker-template.md`, customize it, and write to `context/progress-tracker.md`.
   - Read `C:\Users\kokok\.agents\skills\bootstrap\references\agents-template.md`, customize it, and write to root `AGENTS.md`.

---

## Rules for Writing the Context Files

- **Folder structure**: Files must be written exactly as:
  - `AGENTS.md` (root)
  - `context/project-overview.md`
  - `context/architecture.md`
  - `context/ui-tokens.md`
  - `context/ui-rules.md`
  - `context/ui-registry.md`
  - `context/code-standards.md`
  - `context/library-docs.md`
  - `context/build-plan.md`
  - `context/progress-tracker.md`
- **File Links**: Always write complete relative file links (or absolute when necessary) using the exact file scheme, e.g. `[project-overview.md](file:///absolute/path/to/project-overview.md)`.
- **Alerts**: Use GitHub alerts (`> [!NOTE]`, `> [!IMPORTANT]`, etc.) to emphasize key architectural patterns, rules, or design decisions.
- **Completeness**: Never output comments like `// TODO: add other files` inside the generated context files. Put all actual names, structures, and files defined during the interview.
