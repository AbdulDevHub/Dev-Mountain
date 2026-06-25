# AGENTS.md — Dev-Mountain AI Reference

> This file is for AI agents and automated tooling working on this repository. It provides a quick orientation to the project structure, content conventions, and what to change where.

---

## Project Identity

- **Name**: Dev-Mountain (also "Dev Dino Mountain" in the site title)
- **Type**: Docusaurus static documentation site
- **Purpose**: Curated collection of developer resources, UI/UX inspiration, motion design examples, and workflow references
- **Maintainer**: Abdul Khan ([@AbdulDevHub](https://github.com/AbdulDevHub))
- **GitHub**: https://github.com/AbdulDevHub/Dev-Mountain

---

## Tech Stack

| Layer           | Technology                                             |
| --------------- | ------------------------------------------------------ |
| Framework       | [Docusaurus v3](https://docusaurus.io/)                |
| Language        | TypeScript + React (`.tsx`, `.ts`)                     |
| Content         | Markdown (`.md`) + MDX (`.mdx`)                        |
| Package manager | Yarn                                                   |
| Styling         | Infima CSS (Docusaurus default) + `src/css/custom.css` |

---

## Directory Map

```
Dev-Mountain/
├── resources/               ← PRIMARY CONTENT — curated links & reference docs
│   ├── index.md             ← Resources section landing page
│   ├── learning-platforms.md
│   ├── ui-libraries-and-animation.md
│   ├── ui-motion-and-inspiration.md
│   ├── frontend-snippets.md
│   ├── terminal-commands.md
│   ├── terminal-themes.md
│   ├── vscode-setup.md
│   ├── pnpm-guide.md
│   ├── commit-lint-guide.md
│   ├── python-scripts.md
│   ├── agent-skills.md
│   └── asset-filenames.mdx
│
├── docs/                    ← DOCUSAURUS GUIDE TAB — how the site is built
│   ├── intro.md             ← Entry point for the Guide section
│   ├── tutorial-basics/     ← Core Docusaurus concepts (pages, docs, blog)
│   └── tutorial-extras/     ← Advanced features (versioning, i18n)
│
├── blog/                    ← BLOG TAB — dev notes, posts, updates
│   ├── authors.yml          ← Blog author definitions
│   └── *.md / *.mdx         ← Blog posts (date-prefixed filenames)
│
├── src/
│   ├── pages/
│   │   ├── index.tsx        ← Homepage (hero + features section)
│   │   └── about.tsx        ← About page
│   ├── components/
│   │   ├── HomepageFeatures/ ← Feature cards shown on homepage
│   │   └── Tag.js           ← Tag component
│   └── css/custom.css       ← Global CSS overrides + theme variables
│
├── static/img/              ← Static images (SVGs, logos, social card)
├── docusaurus.config.ts     ← MAIN CONFIG: title, navbar, footer, plugins
├── sidebars.ts              ← Sidebar config for docs/
├── sidebars-resources.ts    ← Sidebar config for resources/
├── CONTRIBUTING.md          ← Full content guide for humans and agents
└── AGENTS.md                ← This file
```

---

## Content Conventions

### Frontmatter (all .md files)

```yaml
---
title: Page Title # shown in sidebar and browser tab
description: Short summary # used in meta tags and search
sidebar_position: 1 # controls order in sidebar (lower = higher)
---
```

### Blog post frontmatter

```yaml
---
slug: post-url-slug
title: Post Title
authors: [abdul] # must match key in blog/authors.yml
tags: [frontend, tools]
---
```

### Tag conventions

| Tag          | Use for                     |
| ------------ | --------------------------- |
| `frontend`   | Frontend dev topics         |
| `ui`         | UI design, components       |
| `animation`  | Motion, transitions         |
| `tools`      | Developer tools             |
| `terminal`   | CLI, shell                  |
| `workflow`   | Productivity, process       |
| `meta`       | Posts about the site itself |
| `docusaurus` | Docusaurus internals        |

---

## Where to Make Changes

| Goal                         | File(s) to edit                                       |
| ---------------------------- | ----------------------------------------------------- |
| Add a resource link          | `resources/*.md`                                      |
| Add a new resource page      | New file in `resources/`                              |
| Change site title or tagline | `docusaurus.config.ts` → `title`, `tagline`           |
| Add a navbar item            | `docusaurus.config.ts` → `themeConfig.navbar.items`   |
| Add a footer link            | `docusaurus.config.ts` → `themeConfig.footer.links`   |
| Add a blog post              | New `.md` in `blog/` with `YYYY-MM-DD-slug.md` format |
| Add an author                | `blog/authors.yml`                                    |
| Change homepage hero         | `src/pages/index.tsx`                                 |
| Change feature cards         | `src/components/HomepageFeatures/index.tsx`           |
| Update about page            | `src/pages/about.tsx`                                 |
| Change theme colors          | `src/css/custom.css`                                  |
| Add a guide page             | New `.md` in `docs/`                                  |

---

## Running the Site

```bash
yarn          # install
yarn start    # dev server → http://localhost:3000
yarn build    # production build → ./build/
yarn serve    # serve production build locally
```

---

## Docusaurus Plugin Setup

The `resources/` section uses a **second docs plugin instance** configured in `docusaurus.config.ts`:

```ts
plugins: [
  [
    "@docusaurus/plugin-content-docs",
    {
      id: "resources",
      path: "resources",
      routeBasePath: "resources",
      sidebarPath: "./sidebars-resources.ts",
    },
  ],
],
```

This is why `resources/` has its own `sidebars-resources.ts` — it's a separate plugin from the main `docs/` instance.

---

## Notes for AI Agents

- Do NOT delete docs from `docs/tutorial-basics/` or `docs/tutorial-extras/` — they are intentional reference material
- Do NOT change `onBrokenLinks: "throw"` — broken links will fail the build
- When adding resource links, group them by category using `###` headings
- Always add `title` and `description` frontmatter to new resource pages
- Blog posts MUST have an `authors` field that matches a key in `blog/authors.yml`
- The `<!-- truncate -->` comment in blog posts controls what shows in the list view
