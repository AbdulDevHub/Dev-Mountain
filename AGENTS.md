# AGENTS.md — Dev Mountain

> Read by AI coding agents working on this repo: commands, conventions and boundaries only.
> Folder map and "where to edit" table: `context/ARCHITECTURE.md`. Current work and todos: `context/PROGRESS_TRACKER.md`.
> After any meaningful change, update this file, `context/PROGRESS_TRACKER.md`, and the "Project Overview" section of `README.md` to reflect the current state — do this proactively, without being asked.

## Project

Dev Mountain is Abdul Khan's ([@AbdulDevHub](https://github.com/AbdulDevHub)) curated developer knowledge base: cheatsheets, guides and link collections, built with Docusaurus and deployed on Vercel at https://dev-mountain.vercel.app.

## Stack

Docusaurus 3 (TypeScript + React), Markdown/MDX content, Infima CSS + `src/css/custom.css`, local search (`@easyops-cn/docusaurus-search-local`), Mermaid. Package manager: Yarn Classic (pinned via `packageManager`).

## Commands

```bash
yarn            # install
yarn start      # dev server → http://localhost:3000
yarn build      # production build → ./build/
yarn serve      # serve the build
```

Verify: yarn typecheck
Verify-full: yarn build

## Conventions

- Every `.md` page has `title`, `description` and `tags` frontmatter; `sidebar_position` where order matters.
- Resource pages live in a topical `resources/<category>/` folder (never the `resources/` root) and must be added to `sidebars-resources.ts` with id `<category>/<filename>` (or the page's frontmatter `id`).
- Add `slug:` frontmatter when a page's URL must survive a folder move.
- Group resource links under `###` headings.
- Blog posts: `YYYY-MM-DD-slug.md`, `authors` must match a key in `blog/authors.yml`, `<!-- truncate -->` marks the list-view excerpt. Tags: frontend, ui, animation, tools, terminal, workflow, meta, docusaurus.

## Boundaries

- Never change `onBrokenLinks: "throw"` in `docusaurus.config.ts`; fix the link instead.
- Do not delete `docs/tutorial-basics/` or `docs/tutorial-extras/` (intentional reference).
- `src/pages/about-me.md` is the single source of truth for Abdul's bio, experience, skills, DSA progress and portfolio, reused by external career tooling: preserve its Markdown structure.

## More

- `README.md`: plain-language overview and contributor how-to. `CONTRIBUTING.md`: full content guide.
- `context/`: ARCHITECTURE.md (structure), PROGRESS_TRACKER.md (state and todos), UI_TOKENS.md + UI_RULES.md (look and feel; read before any UI change).
