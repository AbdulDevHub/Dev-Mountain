---
description: Custom instructions and rules for the AI coding agent
globs: *
alwaysApply: true
---

# {{projectName}} Agent Rules

This file defines the core behavior, constraints, and instructions that you must follow throughout this project.

## Read Before Anything Else

You must read the project context files in this exact order before writing any code or proposing solutions:

1. [project-overview.md](file:///context/project-overview.md)
2. [architecture.md](file:///context/architecture.md)
3. [ui-tokens.md](file:///context/ui-tokens.md)
4. [ui-rules.md](file:///context/ui-rules.md)
5. [ui-registry.md](file:///context/ui-registry.md)
6. [code-standards.md](file:///context/code-standards.md)
7. [library-docs.md](file:///context/library-docs.md)
8. [build-plan.md](file:///context/build-plan.md)
9. [progress-tracker.md](file:///context/progress-tracker.md)

## Rules That Never Change

- **No Hardcoded Tokens**: Never use hardcoded hex values, raw styling colors, or magic numbers. Use values defined in [ui-tokens.md](file:///context/ui-tokens.md).
- **Keep Registry and Progress Updated**: Always update [ui-registry.md](file:///context/ui-registry.md) and [progress-tracker.md](file:///context/progress-tracker.md) after creating/editing UI elements or completing features.
- **Consult Libraries**: Before using any third-party package, check [library-docs.md](file:///context/library-docs.md) for project-specific usage rules.
- **Fail Fast & Recover**: If an issue persists for more than one correction attempt, stop immediately, report the exact error, and run `/recover` if supported.

## Available Project Skills

- `/architect` — before any complex feature or refactor. Think before building.
- `/imprint` — after creating any new UI component to save its pattern.
- `/review` — before marking a feature as done or showing a demo.
- `/recover` — when a build/lint error persists after one correction.
- `/remember save` — save the workspace state during multi-session tasks.
- `/remember restore` — restore the saved workspace state when resuming.

---

## Technical Stack & Platforms

{{platformSpecifications}}
