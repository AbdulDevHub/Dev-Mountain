---
id: frontend-frameworks-comparison
title: Frontend Frameworks Comparison
sidebar_label: Frontend Frameworks Comparison
description: A plain-language comparison of the most popular frontend frameworks and tools in 2026, written as a personal learning reference.
tags: [frontend, frameworks, react, vue, svelte, angular, astro, vite, tanstack, notes]
---

> **Why this page exists:** same reason as the [backend frameworks page](./backend-frameworks-comparison.md) — I'm learning this stuff, and if I don't write it down in plain language, it evaporates. This is my own reference for "what is this thing, and when do I reach for it."

## The first thing to understand: these aren't all the same *kind* of tool

| Layer | What it actually does | Examples on this page |
|---|---|---|
| **Build tool / dev server** | Bundles your code, gives you hot-reload, doesn't care what UI library you use | **Vite** |
| **UI library** | Lets you build components and manage state/rendering in the browser | React, Vue, Svelte, Angular |
| **Meta-framework** | Wraps a UI library with routing, server rendering, data-fetching conventions, etc. | Next.js (wraps React), Nuxt (wraps Vue), SvelteKit (wraps Svelte), Astro (its own thing), TanStack Start (wraps React) |

So "Next.js vs Vite" isn't really a fair fight — Next.js *actually uses* a bundler internally (Turbopack, its own thing), while Vite is more comparable to Webpack or Turbopack. And "React vs Next.js" isn't a fair fight either — Next.js is built *on top of* React. Keeping this distinction straight solves 80% of the initial confusion.

---

## Vanilla (no framework at all)

**What it is:** Plain HTML, CSS, and JavaScript, with no library or build step at all — or maybe just Vite for a dev server.

- ✅ Zero dependencies, zero abstractions, nothing to learn beyond "the web platform"
- ✅ Fastest possible page loads — there is no framework runtime to download
- ✅ Great for simple static sites, landing pages, or learning how the DOM actually works
- ❌ You write all the state-management, DOM-diffing, and componentization by hand
- ❌ Gets painful fast once the app has more than a handful of interactive pieces
- ❌ No ecosystem of pre-built components — you build (or copy-paste) everything

**In noob terms:** This is the "no framework" baseline everything else is compared against. Modern vanilla JS (with `<template>` tags, Web Components, and ES modules) is more capable than people assume, and it's genuinely worth building one small vanilla project just to feel the pain that frameworks were invented to solve.

---

## Vite (build tool, not a UI framework)

**What it is:** A modern, extremely fast development server and bundler. It's not a UI framework by itself — you pair it *with* React, Vue, Svelte, vanilla JS, or almost anything else. Before Vite, most people used Webpack or Create React App (now deprecated) for this job.

- ✅ Near-instant dev server startup and hot module reload, because it serves native ES modules instead of bundling everything up front
- ✅ Framework-agnostic — official templates for React, Vue, Svelte, vanilla, and more
- ✅ Simple, sane configuration compared to old-school Webpack setups
- ❌ Still just a build tool — you need to add your own routing, data-fetching, SSR, etc. if you want them
- ❌ Production build behavior can differ subtly from dev-server behavior, occasionally causing "works in dev, breaks in build" bugs

**In noob terms:** If you're doing `npm create vite@latest`, you're picking Vite as the engine and then a UI library as the actual framework on top of it. Vite basically won the "which build tool do I use" argument by 2026 — it's the default scaffolding tool for React, Vue, and Svelte projects that don't need a meta-framework.

---

## The question I actually care about: Vite + React vs Next.js

This is the one that comes up on almost every project, so it gets its own section instead of being buried in the theory above.

**The short version:** you can't really "use Next.js and Vite together" because Next.js already bundles its own build tooling internally (used to be Webpack, now Turbopack) — it already *is* the "Vite + Router + SSR + API routes + everything" package. So it's not a technical incompatibility, it's that picking Next.js means you're taking its bundled tooling instead of assembling your own with Vite. The real decision is: **do you want to assemble the pieces yourself (Vite + React), or take the batteries-included framework (Next.js)?**

| Question | Vite + React | Next.js |
|---|---|---|
| Does this need to rank on Google / be crawled by search engines? | ❌ No SSR by default — bad for SEO | ✅ SSR/SSG built in — good for SEO |
| Is it behind a login (dashboard, internal tool, admin panel)? | ✅ SEO doesn't matter here, Vite is simpler | Works fine too, but you don't need what it offers |
| Do you want backend API routes living in the same project? | ❌ You'll need a separate backend (Express/Fastify/etc.) | ✅ API routes built in (`/app/api/...`) |
| Do you want the simplest possible mental model / fastest dev server? | ✅ Vite's dev server is famously snappy, less "magic" | Slightly more moving parts (Server Components, `use client`, file-based routing conventions) |
| Do you want multi-page routing without installing anything extra? | ❌ Need React Router or TanStack Router yourself | ✅ File-based routing out of the box |
| Deploying to Vercel / want zero-config hosting? | Works anywhere (Netlify, S3, any static host) | ✅ Vercel is built by the Next.js team — first-class support |

**My honest rule of thumb:**

- **Internal dashboard, admin panel, tool behind a login, or a genuine single-page app** where nobody outside the team ever needs to Google their way into a specific page → **Vite + React**. Fast, simple, no-nonsense setup, and I'm not paying for SSR machinery I don't need.
- **Anything public-facing that needs to be found/indexed** — marketing site, SaaS landing page, blog, e-commerce, anything where a stranger might land on `/pricing` from Google → **Next.js**. SSR/SSG genuinely matters here for SEO and first-load speed.
- **If unsure and it's a smaller project** — default to Vite. Less to learn, less to fight with, and migrating to Next.js later (if the project grows into needing SSR) is doable, if painful.

---

## Quick comparison table (UI libraries & meta-frameworks)

| Framework | Backed by | Rendering model | Learning curve | Bundle size | Best for |
|---|---|---|---|---|---|
| **Vanilla** | — | You do it all manually | Low (but tedious) | Smallest (0 KB framework) | Tiny static sites, learning fundamentals |
| **React + Next.js** | Meta | Virtual DOM + Server Components | Medium | Large, offset by RSC | Large apps, biggest ecosystem, most jobs |
| **Vue + Nuxt** | Community/OpenCollective | Virtual DOM (reactive) | Low | Medium | Teams wanting an easier ramp-up than React |
| **Svelte + SvelteKit** | Community (Rich Harris) | Compiles away — no virtual DOM | Low-Medium | Smallest of the "real" frameworks | Performance-focused apps, small teams |
| **Angular** | Google | Zone-based, now adding Signals | High | Largest | Big enterprise apps needing built-in structure |
| **Astro** | Community/Astro Technology | Zero-JS by default, "islands" | Low-Medium | Near-zero for static content | Content sites: blogs, docs, marketing, e-commerce fronts |
| **TanStack (Router/Query/Start)** | Community (Tanner Linsley) | Pairs with React/Solid/Vue; type-safe | Medium | Small-Medium, à la carte | Type-safety-obsessed teams, complex data-fetching apps |

---

## React (with Next.js)

**What it is:** The most widely used UI library in the world. On its own, React just handles rendering components and re-rendering when state changes — routing, data-fetching, and server rendering are add-ons, which is why almost nobody uses "just React" for a real app. **Next.js** is the dominant meta-framework that wraps React with routing, SSR, and more.

<cite index="9-1">With over 230,000 GitHub stars and 24 million weekly npm downloads, React remains the undisputed leader in 2026, and combined with Next.js you get SSR, SSG, streaming, Turbopack, and an unmatched ecosystem containing over 200,000 React-related packages.</cite>

- ✅ <cite index="9-1">Largest ecosystem and community in the world with 200,000+ npm packages</cite>
- ✅ <cite index="9-1">Next.js offers SSR, SSG, Server Components, streaming, and incremental static regeneration</cite>
- ✅ <cite index="9-1">Most job openings on the market both nationally and internationally</cite>
- ✅ <cite index="9-1">Turbopack reduces development build times by up to 90 percent compared to Webpack</cite>
- ❌ <cite index="9-1">Requires choices in state management, forms, and data fetching if you're not using Next.js</cite>
- ❌ <cite index="9-1">Frequently changing best practices — Server Components require a new mental model</cite>
- ❌ <cite index="9-1">Hydration costs can negatively impact Core Web Vitals on large interactive pages</cite>

**In noob terms:** React is the "safe default" — biggest community, most tutorials, most jobs, most AI-coding-assistant support. The tradeoff is that React alone is unopinionated about a lot (how do I fetch data? route between pages? manage global state?), so in practice almost everyone uses Next.js on top of it to get those answers for free.

---

## Vue.js (with Nuxt)

**What it is:** A "progressive" framework designed to be approachable, with HTML-like template syntax that feels more familiar if you're coming from plain web development rather than a JS-heavy background. **Nuxt** is Vue's equivalent of Next.js.

<cite index="9-1">Vue 3 with the Composition API offers powerful state management and composability, and Nuxt 3 delivers a production-ready meta-framework with SSR, auto-imports, server routes, and a module ecosystem of 200+ modules. Vue is fully open-source and independent of Big Tech companies.</cite>

- ✅ <cite index="9-1">Lowest learning curve of all major frameworks thanks to intuitive template syntax</cite>
- ✅ <cite index="9-1">Template syntax close to HTML makes the transition smoother for backend developers</cite>
- ✅ <cite index="9-1">Nuxt 3 provides excellent SSR, auto-imports, server routes, and 200+ community modules</cite>
- ✅ <cite index="9-1">Independent of Big Tech — community-driven governance with sponsorship via OpenCollective</cite>
- ❌ <cite index="9-1">Smaller ecosystem than React with fewer production-ready component libraries</cite>
- ❌ <cite index="9-1">Fewer job openings available globally compared to React or Angular</cite>
- ❌ <cite index="9-1">Two API styles (Options vs Composition) can cause confusion during onboarding</cite>

**In noob terms:** If React's JSX (`<div>{count}</div>` mixed directly into JavaScript) feels alien, Vue's templates (closer to plain HTML with some special attributes) are usually the easier on-ramp. Popular with teams that want React-level capability with a gentler learning slope.

---

## Svelte (with SvelteKit)

**What it is:** Instead of shipping a framework "runtime" to the browser that does its work at runtime (like React's virtual DOM), Svelte is a **compiler** — it turns your components into small, plain JavaScript at build time. Less code shipped to the browser, less work done in the browser.

<cite index="9-1">Svelte 5 introduces Runes, a new reactivity system enabling fine-grained updates, and SvelteKit provides a full-featured application framework with file-based routing, SSR, form actions, and an adapter system for deployment to any host. It consistently ranks highest in developer satisfaction surveys.</cite>

- ✅ <cite index="9-1">Smallest bundle size and best runtime performance through compile-time optimization</cite>
- ✅ <cite index="9-1">Minimal boilerplate — write up to 40 percent less code than in React or Vue</cite>
- ✅ <cite index="9-1">SvelteKit offers a complete full-stack experience with form actions and server routes</cite>
- ✅ <cite index="9-1">Highest developer satisfaction score in the State of JS 2025 survey</cite>
- ❌ <cite index="9-1">Significantly smaller ecosystem than React or Vue with fewer third-party components</cite>
- ❌ <cite index="9-1">Fewer job openings and available developers on the international market</cite>
- ❌ <cite index="9-1">Less proven in large enterprise projects with dozens of developers</cite>

**In noob terms:** Svelte is the "why ship a framework to the browser at all if you can just compile it away" answer. Developers who use it tend to love it — but the smaller ecosystem and hiring pool are real tradeoffs if you're building something that needs to outlive you or scale to a big team.

---

## Angular

**What it is:** Not just a UI library — a complete, opinionated application platform from Google, with routing, forms, HTTP client, and dependency injection all built in and expected to be used "the Angular way."

<cite index="9-1">Angular is a complete application platform from Google with built-in routing, form validation, HTTP client, dependency injection, and state management, and is the default choice for large enterprise applications in sectors like finance, government, and healthcare.</cite>

- ✅ <cite index="9-1">All-in-one platform with no external dependencies for routing, forms, or HTTP</cite>
- ✅ <cite index="9-1">Native TypeScript with strict type safety as standard from day one</cite>
- ✅ <cite index="9-1">Strong in large enterprise applications with complex forms and data flows</cite>
- ✅ <cite index="9-1">Predictable release policy with long-term support for every major version</cite>
- ❌ <cite index="9-1">Steepest learning curve of all frameworks due to extensive concepts and terminology</cite>
- ❌ <cite index="9-1">Larger initial bundle size than React, Vue, or Svelte applications</cite>
- ❌ <cite index="9-1">Less flexible due to opinionated architecture that makes deviating from conventions harder</cite>

**In noob terms:** Angular is the "we already decided everything for you" option — good for big, long-lived enterprise apps where consistency across a large team matters more than flexibility. Fun fact: NestJS (from the backend comparison page) borrows a lot of its structure and philosophy from Angular, so learning one gives you a head start on the other.

---

## Astro

**What it is:** A content-focused framework built around the idea that most websites don't actually need much JavaScript. By default, Astro renders everything to plain HTML with **zero** JavaScript shipped, and only adds interactive JS in the specific spots you ask for ("islands").

<cite index="9-1">Astro is a content-oriented framework that ships zero JavaScript to the client by default, supports components from any framework via islands architecture, and offers content collections, view transitions, image optimization, and MDX support — ideal for blogs, documentation sites, marketing pages, and e-commerce storefronts.</cite>

- ✅ <cite index="9-1">Zero JavaScript by default — pages load extremely fast with perfect Lighthouse scores</cite>
- ✅ <cite index="9-1">Islands architecture — use React, Vue, or Svelte components where interaction is actually needed</cite>
- ✅ <cite index="9-1">Excellent for blogs, documentation, marketing sites, and content-rich platforms</cite>
- ✅ <cite index="9-1">Outstanding SEO performance through server-rendered HTML without hydration overhead</cite>
- ❌ <cite index="9-1">Less suitable for interactive SPA applications with extensive client-side state</cite>
- ❌ <cite index="9-1">Younger ecosystem with fewer plugins and integrations than React or Vue</cite>
- ❌ <cite index="9-1">Limited support for complex client-side routing and navigation patterns</cite>

**In noob terms:** If you're building a blog, docs site, or marketing site — not a dashboard or an app with lots of client-side interactivity — Astro will almost always be faster and simpler than reaching for Next.js or Nuxt. And the "islands" trick means you're not locked into one UI library; you can drop a single interactive React component into an otherwise static Astro page.

---

## TanStack (Router, Query, and Start)

**What it is:** Not a single framework but a family of framework-agnostic, type-safety-obsessed tools, created by Tanner Linsley. This page's source article didn't cover TanStack directly, so this section is from general knowledge — worth flagging since it's genuinely become a big deal in the React ecosystem by 2026.

- **TanStack Query** — the de facto standard library for fetching, caching, and syncing server data in React/Vue/Solid apps (handles loading states, caching, retries, background refetching for you)
- **TanStack Router** — a fully type-safe client-side router for React, an alternative to React Router with much stronger TypeScript inference
- **TanStack Start** — a newer full-stack meta-framework (built on Vite + TanStack Router) that competes directly with Next.js, aimed at teams who want SSR and full-stack routing without buying into Next.js's specific conventions

Pros:

- ✅ Best-in-class TypeScript inference — routes, params, and query results are fully typed with very little manual typing
- ✅ "À la carte" — you can adopt just Query, just Router, or the whole Start framework, unlike more all-or-nothing meta-frameworks
- ✅ TanStack Query in particular has become close to a default choice for data-fetching in React apps regardless of which meta-framework you use

Cons:

- ❌ TanStack Start is newer and less battle-tested at scale than Next.js or Nuxt
- ❌ Smaller ecosystem and fewer "just Google it" answers than Next.js
- ❌ Mostly React-first in practice, even though some tools support other libraries

**In noob terms:** If you've been told "just use React Query for data fetching," that's TanStack Query — genuinely close to essential in most modern React apps. TanStack Start is the newer, more type-safety-focused challenger to Next.js, worth watching if you care a lot about catching bugs at compile time rather than runtime.

---

## How to actually choose (decision guide)

```text
Is this mostly static content (blog, docs, marketing site, portfolio)?
├── Yes, and it's genuinely tiny (a handful of pages)   → Vanilla HTML/CSS/JS (+ maybe Vite)
├── Yes, and it needs a few interactive widgets          → Astro (with islands)
└── No, it's an actual interactive application
    │
    Does your team already know a specific UI library?
    ├── Yes, React            → Next.js (or TanStack Start if TS-safety is a top priority)
    ├── Yes, Vue              → Nuxt
    ├── Yes, Svelte           → SvelteKit
    ├── Yes, Angular          → Angular (it's the whole platform already)
    └── No strong preference
        │
        Is this a large enterprise app with many teams/devs?
        ├── Yes, need maximum structure and built-in everything → Angular
        ├── Yes, but want more flexibility + huge hiring pool   → React + Next.js
        └── No, small-to-mid team
            │
            Is performance/bundle size the top priority?
            ├── Yes → Svelte + SvelteKit
            └── Not especially, want gentle learning curve → Vue + Nuxt
```

---

## FAQ (my own notes)

**Which one should I actually learn first in 2026?**
<cite index="9-1">React is the safest choice due to the largest ecosystem, the most job openings, and the best AI tooling support via Copilot and Cursor. If speed of learning matters most, Vue.js is the most approachable option thanks to its intuitive template syntax, and Svelte is compelling if the priority is performance and minimal bundle size.</cite>

**Is React still actually the most popular?**
<cite index="9-1">Yes — React dominates the market with the highest number of downloads, job openings, and community contributions, and the introduction of React 19 with improved Server Components, Actions, and optimistic updates further strengthens that position.</cite>

**Can I mix frameworks in one project?**
<cite index="9-1">Yes — Astro makes this straightforward with its islands architecture, letting you use React, Vue, and Svelte components in the same project wherever interactivity is needed, though for most projects a single framework is recommended for codebase consistency and easier onboarding.</cite>

**What are React Server Components, actually?**
<cite index="9-1">React Server Components run exclusively on the server and send their HTML to the client without JavaScript overhead, drastically reducing bundle size and improving load times, especially on mobile devices — and Next.js makes RSC the default for all components, where "use client" is added explicitly only where interactivity is needed.</cite>

**Next.js or Nuxt?**
<cite index="9-1">Choose Next.js if your team has React experience, you want the largest ecosystem, and Server Components matter to you. Choose Nuxt if your team prefers Vue, you want a lower learning curve, or your app makes heavy use of auto-generated routes and server-side rendering — both are production-ready with comparable functionality, though React developers are easier to find internationally.</cite>

**Is Astro only good for simple websites, or can I build a real app with it?**
<cite index="9-1">Astro is primarily designed for content-rich websites such as blogs, documentation, marketing pages, and e-commerce storefronts, where it delivers unparalleled performance with zero JavaScript by default. For interactive web applications with extensive client-side state and complex navigation, a framework like Next.js or SvelteKit is more appropriate.</cite>

**Does bundle size actually matter?**
<cite index="9-1">Yes — bundle size has a direct impact on load times, Core Web Vitals, and search ranking, especially on mobile devices with slower networks. Svelte and Astro produce the smallest bundles, while React with Next.js compensates for a larger initial bundle using Server Components that minimize client-side JavaScript; a good target is under 100 kB of first-load JavaScript.</cite>

---

## My personal takeaway (for future-me)

- **Vite vs a framework isn't a real choice in the abstract** — Vite is the engine, the framework (React/Vue/Svelte/etc.) is what sits on top of it. But **"Vite + React" vs "Next.js" is my actual day-to-day decision**, and it comes down to: SEO/public-facing → Next.js, internal/behind-login/simple SPA → Vite + React. See the dedicated section above — that's the one I'll actually reread.
- **"UI library" vs "meta-framework"** is the same split as backend "minimal vs batteries-included": React alone ≈ Express/Flask, Next.js ≈ NestJS/Django in terms of "how much comes bundled for you."
- For **content sites** (blogs, docs, marketing), reach for **Astro** first — it's very hard to beat on speed and SEO for that use case.
- For **interactive apps**, it's basically: **React+Next.js** for hiring pool and ecosystem, **Vue+Nuxt** for gentler onboarding, **Svelte+SvelteKit** for performance-obsessed small teams, **Angular** for big rigid enterprise builds.
- **TanStack** is worth learning regardless of which meta-framework I pick — TanStack Query in particular has become close to a default for data-fetching even inside Next.js/Nuxt apps.
- Same rule as the backend page: pick for **team fit and long-term maintainability first**, benchmark numbers second — bundle-size differences rarely matter until the app (or the team) is actually large.
