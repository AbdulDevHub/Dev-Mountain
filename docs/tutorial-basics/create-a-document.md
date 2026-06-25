---
sidebar_position: 2
---

# Create a Document

Documents are the Markdown/MDX files that make up the **Docusaurus Guide** (`docs/`) and **Resources** (`resources/`) sections. They're connected via:

- An **auto-generated sidebar** (from folder structure)
- **Previous / Next** navigation at the bottom of each page
- Optional **version** support

## Adding a Resource Page

Drop a new `.md` file into the `resources/` folder:

```md title="resources/my-new-resource.md"
---
title: My New Resource
description: A short description shown in search results and meta tags
---

## My New Resource

Content goes here...
```

The file auto-appears in the Resources sidebar. No config changes needed.

## Adding a Guide Page

Same idea — drop a `.md` file into `docs/` (or a subfolder like `docs/tutorial-basics/`):

```md title="docs/my-guide.md"
---
sidebar_position: 5
---

# My Guide

Content goes here...
```

## Controlling Sidebar Order

Use `sidebar_position` in the frontmatter to control the order:

```md
---
sidebar_position: 3
---
```

Lower numbers appear higher in the sidebar.

## Category Folders

To group pages under a collapsible section, create a folder and add a `_category_.json` file:

```json title="docs/my-section/_category_.json"
{
  "label": "My Section",
  "position": 4,
  "link": {
    "type": "generated-index",
    "description": "Description shown on the category index page."
  }
}
```
