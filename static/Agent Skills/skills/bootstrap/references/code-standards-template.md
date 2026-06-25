# Code Standards

Implementation rules and conventions for the entire project. The AI agent must follow these in every session without exception. These rules prevent pattern drift across sessions.

---

## Engineering Mindset

- **Think before implementing** — understand what is being built and why before writing a single line.
- **Read context files first** — never assume, always verify against [architecture.md](file:///context/architecture.md) and [project-overview.md](file:///context/project-overview.md).
- **Scope is sacred** — only build what the current feature requires. Never go beyond scope even if it seems helpful.
- **Every feature must be testable** — if it cannot be verified immediately after implementation, it is incomplete.
- **Clean over clever** — simple readable code that a junior developer can understand is always preferred over clever abstractions.
- **One thing at a time** — complete one feature fully before touching the next.
- **Failures are expected** — wrap agent operations in try/catch, log failures, never let one failure crash everything.

---

## Programming Language Standards (e.g. TypeScript)

{{languageStandardsDetails}}

---

## Framework Conventions (e.g. Next.js / Vite / React)

{{frameworkConventionsDetails}}

---

## File and Folder Naming

- **Folders**: {{folderNamingConvention}}
- **Component files**: {{componentFileNamingConvention}}
- **Utility files**: {{utilityNamingConvention}}
- **Type files**: {{typesNamingConvention}}
- **API routes/endpoints**: {{apiRoutesNamingConvention}}

---

## Error Handling & Resiliency

{{errorHandlingRules}}

---

## Linting & Quality Control

{{lintingRules}}

---

## Git & Commits

- **Commit message style**: {{gitCommitConvention}}
- **Branch naming**: {{gitBranchConvention}}
