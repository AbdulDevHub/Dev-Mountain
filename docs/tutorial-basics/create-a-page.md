---
sidebar_position: 1
---

# Create a Page

Dev-Mountain has two kinds of **standalone pages**:

- **React/TSX pages** — full custom pages with components (e.g. the Home page and About page)
- **Markdown pages** — quick standalone pages written in plain Markdown

Both live in `src/pages/`. Any file here becomes a route automatically.

## React Pages

Custom pages like the homepage (`src/pages/index.tsx`) and About page (`src/pages/about.tsx`) are React components wrapped in the Docusaurus `<Layout>` component.

```tsx title="src/pages/my-page.tsx"
import Layout from '@theme/Layout';

export default function MyPage() {
  return (
    <Layout title="My Page" description="A custom page">
      <main>
        <h1>Hello from my page!</h1>
      </main>
    </Layout>
  );
}
```

This page is now available at `/my-page`.

## Markdown Pages

For simpler pages, just drop a `.md` file in `src/pages/`:

```md title="src/pages/my-page.md"
# My Page

Some content here.
```

:::tip
Use React pages when you need full control over layout, styles, or interactive components. Use Markdown pages for simple, content-only pages.
:::
