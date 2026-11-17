# Architecture

> Purpose: where content and code live in Dev Mountain, how the two docs instances fit together, and which file to edit for each kind of change.
> Read this before adding pages, categories, navbar items or homepage sections.
> Keep it at folder level (not per file) so it stays accurate; update it when a folder, plugin or config pattern changes.

## Folder map

```
resources/            Main content (second docs plugin instance, id "resources", route /resources)
  index.md            Resources landing page
  <category>/         One folder per sidebar category; ids are "<category>/<file>"
                      ai-systems, cs-concepts, design-ui, frameworks-libraries, getting-started,
                      infrastructure-devops, programming-languages, project-management,
                      quality-testing-performance, references-knowledge, scripting-automation,
                      security-privacy, system-design, terminal-shell, tools-workflow, web-fundamentals
docs/                 "Docusaurus Guide" tab (default docs instance, sidebars.ts). Keep tutorial-basics/ and tutorial-extras/.
blog/                 Posts named YYYY-MM-DD-slug.md(x); authors in blog/authors.yml
src/pages/            index.tsx (homepage), about.tsx (project page), about-me.md (bio source of truth)
src/components/       TrailIndex/ (homepage topic list, built from sidebars-resources.ts), Tag.js, Highlight.js, Counter.js
src/css/custom.css    Infima theme variables and global overrides
static/img, static/assets   Logos, social card, favicons, GIFs
docusaurus.config.ts  Site metadata, navbar, footer, plugins, themes (mermaid, local search)
sidebars-resources.ts Sidebar for resources/ (every page must be listed here)
```

## Plugin setup

`resources/` is a second `@docusaurus/plugin-content-docs` instance (`id: "resources"`, `sidebarPath: ./sidebars-resources.ts`), separate from the default `docs/` instance. Search is `@easyops-cn/docusaurus-search-local`; diagrams use `@docusaurus/theme-mermaid`.

## Where to make changes

| Goal | Edit |
| --- | --- |
| Add a resource link | The matching `resources/<category>/*.md`, under a `###` heading |
| Add a resource page | New file in `resources/<category>/` + entry in `sidebars-resources.ts` |
| Add a resource category | New folder in `resources/` + category block in `sidebars-resources.ts` |
| Site title, tagline, SEO metadata | `docusaurus.config.ts` |
| Navbar / footer | `docusaurus.config.ts` → `themeConfig.navbar` / `themeConfig.footer` |
| Homepage | `src/pages/index.tsx` + `index.module.css`, `src/components/TrailIndex/` |
| Theme colours and fonts | `src/css/custom.css` (tokens in `context/UI_TOKENS.md`) |
| Blog post / author | `blog/` / `blog/authors.yml` |
| About pages | `src/pages/about.tsx` (project) or `src/pages/about-me.md` (bio) |
