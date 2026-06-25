---
sidebar_position: 5
---

# Deploy This Site

Dev-Mountain is built with Docusaurus and can be deployed as a **static site** to any static hosting provider (Vercel, Netlify, GitHub Pages, Cloudflare Pages, etc.).

## Build for Production

```bash
yarn build
```

This generates static HTML/CSS/JS in the `build/` folder. No server required — everything is pre-rendered.

## Preview the Production Build

```bash
yarn serve
```

This serves the `build/` folder locally at [http://localhost:3000](http://localhost:3000). Always preview before deploying if you've made config changes.

## Deploy to GitHub Pages

```bash
# With SSH
USE_SSH=true yarn deploy

# Without SSH
GIT_USER=<Your GitHub username> yarn deploy
```

This builds the site and pushes to the `gh-pages` branch automatically.

## Deploy to Vercel / Netlify

1. Connect the repo in your Vercel or Netlify dashboard
2. Set build command: `yarn build`
3. Set output directory: `build`
4. Deploy — Vercel/Netlify handles the rest on every push

:::tip
Vercel and Netlify give you preview deployments on every pull request, which is handy for reviewing content changes before merging.
:::

## Further Reading

- [Docusaurus Deployment Guide](https://docusaurus.io/docs/deployment) — full platform-by-platform breakdown
