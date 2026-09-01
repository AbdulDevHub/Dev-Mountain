---
title: PNPM – Fast, Disk-Efficient Package Manager
description: Learn what pnpm is, why it’s useful, and how to migrate from npm or Yarn
tags: [pnpm, npm, package-manager, nodejs, javascript, tooling]
---

## What is pnpm?

**pnpm** is a fast, disk-efficient JavaScript package manager.  
It is compatible with npm and Yarn but uses a different dependency storage model
that saves disk space and improves install speed.

---

## 🚀 Why Use pnpm?

- **Much faster installs**
- **Saves disk space** using a global content-addressable store
- **Strict dependency resolution** (prevents phantom dependencies)
- Fully compatible with **npm ecosystem**
- Works with **monorepos** out of the box

---

## 📦 Installing pnpm

Using Corepack (recommended):

```bash
corepack enable
corepack prepare pnpm@latest --activate
````

Or via npm:

```bash
npm install -g pnpm
```

---

## 🔄 Converting an Existing Project to pnpm

pnpm provides a dedicated command for migration:

## ✅ `pnpm import`

This command **converts existing lockfiles** into a `pnpm-lock.yaml`.

---

### From npm (`package-lock.json`)

```bash
pnpm import
pnpm install
```

- Reads `package-lock.json`
- Generates `pnpm-lock.yaml`
- Preserves dependency versions

---

### From Yarn (`yarn.lock`)

```bash
pnpm import
pnpm install
```

- Reads `yarn.lock`
- Converts it to `pnpm-lock.yaml`
- No need to delete files beforehand

---

## 🧠 How `pnpm import` Works

- Converts lockfiles **without reinstalling immediately**
- Ensures **version parity** with existing dependency tree
- Ideal for large or production projects
- Safer than deleting lockfiles manually

---

## ⚠️ Notes After Importing

- You may delete old lockfiles after verifying:

  ```text
  package-lock.json
  yarn.lock
  ```

- Some packages may fail if they rely on undeclared dependencies

- This is expected and improves long-term stability

---

## 📂 pnpm Store Location

pnpm stores packages globally and links them:

```text
~/.pnpm-store
```

Multiple projects can share the same dependencies without duplication.

---

## 🧪 Useful pnpm Commands

```bash
pnpm install        # Install dependencies
pnpm add <pkg>      # Add a dependency
pnpm add -D <pkg>   # Add a dev dependency
pnpm remove <pkg>   # Remove a dependency
pnpm update         # Update dependencies
pnpm run <script>   # Run package.json scripts
```

---

## 🧠 When pnpm Shines

- Monorepos
- Large projects
- CI environments
- Disk-constrained systems
- Teams that want dependency correctness

---

## 🔗 Learn More

- [https://pnpm.io/](https://pnpm.io/)
- [https://pnpm.io/motivation](https://pnpm.io/motivation)
