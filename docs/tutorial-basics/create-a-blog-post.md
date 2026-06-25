---
sidebar_position: 3
---

# Create a Blog Post

The Blog section is where you can write dev notes, resource spotlights, workflow tips, or project updates. It's intentionally low-key — think of it as your personal developer notebook, made public.

## File Naming

Blog posts live in `blog/` and follow this naming convention:

```
blog/YYYY-MM-DD-post-slug.md
```

Or as a folder (useful when you want to co-locate images):

```
blog/YYYY-MM-DD-post-slug/
  index.md
  screenshot.png
```

## Frontmatter

Every blog post needs frontmatter at the top:

```md title="blog/2026-06-25-my-post.md"
---
slug: my-post
title: My Post Title
authors: [abdul]
tags: [frontend, tools, workflow]
---

Brief intro paragraph shown in the blog list view.

<!-- truncate -->

Full post content goes here...
```

- **`authors`** — must match a key in `blog/authors.yml`
- **`tags`** — free-form, used to group related posts
- **`<!-- truncate -->`** — everything before this is shown as the excerpt in the list view

## Adding Yourself as an Author

Edit `blog/authors.yml`:

```yaml title="blog/authors.yml"
abdul:
  name: Abdul Khan
  title: Maintainer of Dev-Mountain
  url: https://github.com/AbdulDevHub
  image_url: https://github.com/AbdulDevHub.png
```

## Post Ideas

- 🆕 "New resource added: [tool name] — why it's worth knowing"
- 🔧 "How I set up my terminal / VS Code for this workflow"
- 🎨 "UI experiment of the week: [animation technique]"
- 📌 "TIL: [short dev discovery]"

:::tip
Even one post every few months makes the blog section valuable. Don't overthink it — treat it like a changelog or learning log.
:::
