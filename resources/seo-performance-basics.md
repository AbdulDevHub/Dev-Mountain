---
id: seo-performance-basics
title: SEO & Performance Basics (Next.js / Vite)
sidebar_label: SEO & Performance Basics
description: Notes on metadata, Open Graph tags, favicons, image optimization, minification, and CSS nesting for JS projects.
tags: [seo, performance, nextjs, vite, css]
---

Quick-reference notes for setting up SEO metadata and squeezing performance out of a Next.js or Vite project. This is a living page — the goal is "if it's not written here, I haven't learned it."

## Metadata & Open Graph tags

Next.js (App Router) lets you export a `metadata` object from a layout or page file instead of hand-writing `<head>` tags. Anything not natively supported by the typed `Metadata` object (custom `<meta>` tags like `theme-color`, `color-scheme`, or Twitter/OG tags) goes inside `other`.

```ts
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'JS Mastery',
  description: 'JS Mastery Resources',
  other: {
    'theme-color': '#0d1117',
    'color-scheme': 'dark only',
    'twitter:image': 'https://i.ibb.co/d6TXXB2/homepage-thumbnail.jpg',
    'twitter:card': 'summary_large_image',
    'og:url': 'jsmastery.pro',
    'og:image': 'https://i.ibb.co/d6TXXB2/homepage-thumbnail.jpg',
    'og:type': 'website',
  },
};
```

A few things worth remembering here:

- `theme-color` tells mobile browsers what color to paint the address bar / UI chrome.
- `color-scheme: dark only` hints to the browser that the page only supports a dark UI, so it won't try to apply light-mode form controls, scrollbars, etc.
- The `twitter:*` and `og:*` tags control how the link looks when shared on Twitter/X, Discord, Slack, LinkedIn, etc. Next.js also has a dedicated `openGraph` and `twitter` field on the `Metadata` type if you want type safety instead of dumping raw tags into `other` — worth switching to once the tags stabilize.
- Watch for stray/mismatched quotes when copy-pasting metadata blobs (easy to end up with a `'` where a `"` should be) — it silently breaks the object rather than throwing where you'd expect.

### Tools for checking metadata

- **[opengraph.xyz](https://www.opengraph.xyz/)** — paste a URL and preview exactly how the OG/Twitter card will render on different platforms before you ship it. Good for catching wrong image dimensions or missing tags.
- **[gtmetrix.com](https://gtmetrix.com/)** — full performance audit (Core Web Vitals, waterfall chart, render-blocking resources). Use this after deploying to see what's actually slow, not just what looks slow locally.

## SEO / Performance checklist

Rough order of operations when polishing a site before launch:

1. **Compress and convert images** — ship WebP/AVIF instead of raw JPEG/PNG where possible.
2. **SEO meta tags** — title, description, canonical URL, OG/Twitter tags (see above).
3. **Favicon** — generate source art, then export the full icon set (16px, 32px, 180px Apple touch icon, etc.) via a favicon generator. An AI image tool (e.g. Google's **Nano Banana** — the nickname for Gemini's native image-generation models, good at quick icon/mark generation from a text prompt) works well for producing a clean square source image fast; then trace/export it as an **SVG** favicon for crisp rendering at any size, since modern browsers support `<link rel="icon" type="image/svg+xml">`.
4. **Minify code** — HTML, and whatever your bundler outputs (Vite and Next.js both minify JS/CSS automatically in production builds, but double check `build` output isn't accidentally running in dev mode).
5. **Image optimization / lazy-loading** — see the framework-specific section below.

## Image optimization: Next.js vs. Vite

**Next.js** — use the built-in `<Image />` component (`next/image`). It handles resizing, format conversion (WebP/AVIF), lazy-loading, and layout-shift prevention out of the box. There's rarely a good reason to use a plain `<img>` tag for content images in a Next.js app.

```tsx
import Image from 'next/image';

<Image src="/hero.jpg" alt="Hero banner" width={1200} height={600} priority />;
```

**Vite** (no built-in image pipeline) — the most popular choice is [`vite-plugin-image-optimizer`](https://github.com/FatehAK/vite-plugin-image-optimizer). Add it to `vite.config.js` and it will automatically compress JPEG, PNG, SVG, and WebP files every time you run a production build.

```js
// vite.config.js
import { defineConfig } from 'vite';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

export default defineConfig({
  plugins: [ViteImageOptimizer()],
});
```

For lazy-loading in a Vite/vanilla setup where you don't have `next/image`, the native `loading="lazy"` attribute on `<img>` covers most cases without needing a JS library.

## Nested CSS

Modern CSS supports native nesting (no Sass/Less required), shipped in all major browsers as of 2023–2024:

```css
.card {
  padding: 1rem;
  border-radius: 8px;

  & .title {
    font-size: 1.25rem;
    font-weight: 600;
  }

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }
}
```

Notes:

- The `&` explicitly refers to the parent selector, same idea as in Sass.
- Nesting a plain element selector (`.card { p { ... } }`) works too, but prefixing with `&` (`& p`) is the safer/more explicit habit, especially with pseudo-classes and combinators.
- Since it's native CSS, no build step or preprocessor is required — but check your target browser support if you need to go further back than \~2023.
