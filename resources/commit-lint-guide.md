---
title: Commit Lint & Conventional Commits
description: A quick reference guide for writing consistent, meaningful Git commit messages
---

## Commit Lint

Commit linting helps enforce **consistent and readable commit messages**, making project history easier to understand and automate.

This guide follows **`commitlint-config-conventional`**, which is based on the **Angular commit convention**.

---

## ✍️ Commit Message Format

A typical commit message looks like this:

```

<type>(optional scope): <short description>

```

---

## ✅ Real-World Examples

```

chore: run tests on travis ci
fix(server): send cors headers
feat(blog): add comment section

```

---

## 🏷️ Common Commit Types

Below are the most common commit types supported by  
`commitlint-config-conventional`:

- **build** — Changes that affect the build system or dependencies
- **chore** — Maintenance tasks that don’t modify production code
- **ci** — Changes to CI configuration or scripts
- **docs** — Documentation-only changes
- **feat** — A new feature
- **fix** — A bug fix
- **perf** — Performance improvements
- **refactor** — Code changes that neither fix a bug nor add a feature
- **revert** — Reverts a previous commit
- **style** — Formatting changes (no code behavior change)
- **test** — Adding or updating tests

---

## 🧠 Why Use Commit Lint?

- Improves **readability** of Git history
- Enables **automated changelogs**
- Helps teams stay **consistent**
- Works well with **semantic versioning**

---

## 🔗 Related Tools

- commitlint
- Husky
- Conventional Commits
- Semantic Release
