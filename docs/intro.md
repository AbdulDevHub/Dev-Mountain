---
sidebar_position: 1
---

# Docusaurus Guide

> This section documents **how Dev-Mountain is built** using Docusaurus. It's kept here as a living reference so you (or any contributor) can quickly understand how the site works, how to add content, and how to customise things — without digging through the Docusaurus docs every time.

## 🦕 What is Docusaurus?

[Docusaurus](https://docusaurus.io/) is the static-site generator powering this project. It takes Markdown / MDX files and turns them into a fast, searchable documentation website. The core things to know:

- Content lives in **plain `.md` / `.mdx` files** — no database, no CMS.
- The sidebar is **auto-generated** from the folder structure (or can be defined manually in `sidebars.ts`).
- React components can be dropped into `.mdx` files for interactive content.
- The dev server hot-reloads — edit a file and the browser refreshes instantly.

## 🗂️ How This Site is Structured

| Section | Folder | Navbar Label | Purpose |
|---|---|---|---|
| Main docs | `docs/` | Docusaurus Guide | This guide — how the site works |
| Resources | `resources/` | Resources | Curated tools, libraries, platforms |
| Blog | `blog/` | Blog | Dev notes, updates, discoveries |
| Pages | `src/pages/` | Home / About | Custom React/MDX pages |

## 🚀 Running Locally

```bash
# Install dependencies (first time only)
yarn

# Start dev server at http://localhost:3000
yarn start
```

Changes in `docs/`, `resources/`, and `blog/` hot-reload automatically. Changes to `docusaurus.config.ts` or `sidebars.ts` require a server restart.

## ➕ Adding Content

**New resource page** → add a `.md` file to `resources/`, it auto-appears in the sidebar.

**New guide page** → add a `.md` file to `docs/`, it auto-appears here.

**New blog post** → add a `.md` file to `blog/` with the date prefix (e.g. `2026-06-25-my-post.md`).

See **Tutorial Basics** and **Tutorial Extras** in this section for detailed walkthroughs on creating pages, documents, blog posts, and more.

## 📖 Further Reading

- [Docusaurus official docs](https://docusaurus.io/docs) — full reference
- [Markdown features](https://docusaurus.io/docs/markdown-features) — admonitions, tabs, code blocks
- [MDX](https://mdxjs.com/) — using React components inside Markdown
