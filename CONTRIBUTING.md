# Contributing to Dev-Mountain

This guide explains how to add, edit, and organise content across the three main sections of the site: **Resources**, **Docusaurus Guide**, and **Blog**.

---

## 🗂️ Site Structure at a Glance

```
Dev-Mountain/
├── resources/          ← Main content hub (curated links & guides)
├── docs/               ← How this site is built (Docusaurus Guide tab)
├── blog/               ← Dev notes, updates, posts (Blog tab)
├── src/
│   ├── pages/          ← Custom React pages (Home, About)
│   └── components/     ← Shared React components
├── static/             ← Static assets (images, icons)
├── docusaurus.config.ts  ← Site title, navbar, footer, plugins
├── sidebars.ts         ← Sidebar config for docs/
└── sidebars-resources.ts ← Sidebar config for resources/
```

---

## 📚 Adding a Resource

Resources are the core of this site. Each `.md` file in `resources/` becomes a page in the **Resources** tab.

### Steps

1. Create a new `.md` file in `resources/`:

   ```
   resources/my-new-topic.md
   ```

2. Add frontmatter at the top:

   ```md
   ---
   title: My New Topic
   description: A short description for search results and meta tags
   ---
   ```

3. Write your content. Organise links by category using `###` headings.

4. Add the page to the Resources sidebar by editing `sidebars-resources.ts`:

   ```ts
   {
     type: "doc",
     id: "my-new-topic",
   },
   ```

   Add it in the desired position within the `resourcesSidebar` array.

### Existing Resource Files

| File                            | Content                                         |
| ------------------------------- | ----------------------------------------------- |
| `learning-platforms.md`         | Coding tutorials, AI/ML courses, practice sites |
| `ui-libraries-and-animation.md` | React component libraries, CSS frameworks       |
| `ui-motion-and-inspiration.md`  | Animation libraries, CodePen demos, inspiration |
| `frontend-snippets.md`          | Copy-paste frontend code snippets               |
| `terminal-commands.md`          | CLI reference — git, file navigation, etc.      |
| `terminal-themes.md`            | Shell themes, prompts, fonts                    |
| `vscode-setup.md`               | VS Code extensions, settings, shortcuts         |
| `pnpm-guide.md`                 | pnpm commands and workspace patterns            |
| `commit-lint-guide.md`          | Conventional commits reference                  |
| `python-scripts.md`             | Useful Python scripts and snippets              |
| `agent-skills.md`               | AI agent prompts and skill patterns             |
| `asset-filenames.mdx`           | Naming conventions for assets                   |
| `docusaurus-syntax-reference.md`     | Docusaurus Markdown/MDX syntax reference (admonitions, tabs, code blocks) |
| `docusaurus-react-mdx-reference.mdx` | React/MDX capabilities reference (custom components, JS expressions)     |

---

## 📖 Adding to the Docusaurus Guide

The `docs/` folder powers the **Docusaurus Guide** tab. This section documents how the site itself is built.

### Steps

1. Add a `.md` file to `docs/` or a subfolder:

   ```
   docs/my-guide.md
   docs/tutorial-basics/my-guide.md
   ```

2. Add frontmatter:

   ```md
   ---
   sidebar_position: 7
   ---

   # My Guide
   ```

3. Done — it auto-appears in the sidebar.

### Adding a Category (Folder Group)

Create a folder and add `_category_.json`:

```json
{
  "label": "My Section",
  "position": 4,
  "link": {
    "type": "generated-index",
    "description": "Description shown on the category index."
  }
}
```

---

## ✍️ Writing a Blog Post

The blog is for dev notes, resource spotlights, workflow tips, and project updates.

### Steps

1. Create a file in `blog/` with a date prefix:

   ```
   blog/2026-06-25-my-post-title.md
   ```

   Or as a folder with images:

   ```
   blog/2026-06-25-my-post-title/
     index.md
     screenshot.png
   ```

2. Add frontmatter:

   ```md
   ---
   slug: my-post-title
   title: My Post Title
   authors: [abdul]
   tags: [frontend, tools]
   ---

   Brief intro shown in the blog list.

   <!-- truncate -->

   Full content goes here...
   ```

3. `authors` must match a key in `blog/authors.yml`. Currently defined: `abdul`.

### Post Tags

Use tags consistently to make filtering useful:

| Tag          | Use for                     |
| ------------ | --------------------------- |
| `frontend`   | Frontend dev topics         |
| `ui`         | UI design, components       |
| `animation`  | Motion, transitions         |
| `tools`      | Developer tools             |
| `terminal`   | CLI, shell, terminal        |
| `workflow`   | Productivity, process       |
| `meta`       | Posts about the site itself |
| `docusaurus` | Docusaurus-specific content |

---

## 🔧 Editing Site Config

All global config lives in `docusaurus.config.ts`:

- **Navbar items** → `themeConfig.navbar.items`
- **Footer links** → `themeConfig.footer.links`
- **Site title / tagline** → `config.title` / `config.tagline`
- **Plugin registration** (for `resources/`) → `plugins` array

After changing `docusaurus.config.ts`, restart the dev server:

```bash
yarn start
```

---

## 🚀 Running Locally

```bash
yarn          # install dependencies (first time)
yarn start    # dev server at http://localhost:3000
yarn build    # production build
yarn serve    # serve production build locally
```
