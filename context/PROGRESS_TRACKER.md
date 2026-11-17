# Progress Tracker

> Purpose: the running state of Dev Mountain for AI coding sessions: what works, what is in progress, what is next, and a dated log of decisions.
> Read it at the start of a session; update it at the end of any meaningful change.
> Prune old log entries into "Earlier history" once they stop helping a new session pick up the work.

## Current state

- Docusaurus 3.10 site deployed at https://dev-mountain.vercel.app; 78 resource pages in 16 categories, all with `tags:` frontmatter.
- "Contour Map" branding live: forest-green theme, mountain logo (light/dark), SVG favicon, contour-line hero with real search form, auto-generated trail index, matching social card. See `context/UI_RULES.md`.
- React 19, TypeScript 5.9, `@docusaurus/faster` (Rspack/SWC), `future.v4` on; `yarn typecheck` and `yarn build` pass.

## Done in item 27 polish pass (2026-11-17)

- [x] **a. SEO**: homepage meta description, keywords, JSON-LD WebSite, font preconnect, sitemap lastmod + ignore patterns, robots.txt, social card, site name unified to "Dev Mountain", repo topics added.
- [x] **b. Homepage and branding**: direction A "Contour Map" chosen from 3 previews.
- [x] **e. Agent skill directory links**: README "Agent Skills" section; `resources/ai-systems/agent-skills.md` rewritten.
- [x] **i. Upkeep**: deps updated, edit links fixed (pointed at an old Docusaurus repo), Docusaurus community footer links replaced, Babel config removed (SWC), loose root pages moved into category folders.

## In progress

- Nothing active.

## Next steps (need Abdul first)

- [ ] **c. Readability review**: go through each page and flag ones that are hard to follow; agent fixes the flagged ones.
- [ ] **d. Valleys**: decide what a "Valley" is (likely navbar groups of categories) before restructuring folders/navbar.
- [ ] **f. About Me**: keep `src/pages/about-me.md` current (needs new info from Abdul).
- [ ] **g. Learn Vim page**: [issue #14](https://github.com/AbdulDevHub/Dev-Mountain/issues/14), built from its 5 YouTube links.
- [ ] **h. New pages**: [issue #20](https://github.com/AbdulDevHub/Dev-Mountain/issues/20): Next.js, Redux, Jenkins, Big-O / coding interviews, sorting algorithms, data structures, Firebase, React Native, Swift (needs a Mac).

## Reminders

- `src/pages/about-me.md` had uncommitted edits on 2026-11-17: commit them with item f or separately.
- `static/assets/loading-player.gif` is untracked and not used by any page yet.
- **Submit to Google Search Console**: add the property for https://dev-mountain.vercel.app (DNS or HTML-tag verification), then submit https://dev-mountain.vercel.app/sitemap.xml once the rebrand deploy is live. Needs Abdul's Google login.

## Session log

- **2026-11-17**: Planned item 27 with idea-quasar. Scope this session: a, b, e, i + agent context. c, d, f, g, h parked above. Pinned Yarn Classic (`packageManager: yarn@1.22.22`) because global Corepack Yarn 4 rejected the v1 lockfile. Added `context/` (this file, ARCHITECTURE.md, UI_TOKENS.md, UI_RULES.md). `future.v4` needed `markdown.mdx1Compat.comments: true` so `<!-- truncate -->` HTML comments keep compiling. Shipped a, b, e, i (see above).
