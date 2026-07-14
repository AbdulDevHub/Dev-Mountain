---
id: tailwind-cheatsheet
title: Tailwind CSS Quick Reference
sidebar_label: Tailwind Cheatsheet
---

# Tailwind CSS Quick Reference

A no-fluff cheatsheet for when you've been away from Tailwind for a while and just need the syntax back.

:::tip
Classes generally follow the pattern `{property}-{value}` and most accept a `{screen}:` or `{state}:` prefix, e.g. `md:flex`, `hover:bg-blue-500`.
:::

## Directives (CSS-first config, v4)

Tailwind v4 dropped `tailwind.config.js` and `@tailwind` in favor of plain CSS, driven by `@import` plus a handful of at-rules:

```css
@import "tailwindcss";
```

```
@import "tailwindcss";      loads Tailwind (replaces @tailwind base/components/utilities)
@theme { ... }               define design tokens (colors, spacing, fonts, breakpoints) as CSS vars
@source "path";              add extra file paths for class detection
@source not "path";          exclude a path from detection
@utility { ... }             define a custom utility class
@variant hover { ... }       apply a variant inside a CSS rule
@custom-variant name (...)   define your own variant/modifier
@apply text-lg font-bold;    inline existing utilities into custom CSS
@plugin "pkg-name";          load a legacy JS plugin
@config "./tailwind.config.js";   load a legacy JS config file (v3 migration)
@layer theme, base, components, utilities;   declare/reorder cascade layers
@reference "./app.css";      pull in theme values for @apply in scoped contexts (Vue/Svelte SFCs)
```

Example `@theme` block:

```css
@import "tailwindcss";

@theme {
  --color-brand: #1da1f2;
  --spacing-128: 32rem;
  --breakpoint-3xl: 1920px;
}
```

Custom dark-mode variant (v4 removed `darkMode` from the JS config):

```css
@custom-variant dark (&:where(.dark, .dark *));
```

:::note
`@tailwind base/components/utilities` and `tailwind.config.js` still work in v3 projects — the directives above are the v4 way.
:::

## Spacing (margin & padding)

| Class | CSS |
|---|---|
| `p-4` | `padding: 1rem;` |
| `px-4` / `py-4` | padding-inline / padding-block |
| `pt-4` `pr-4` `pb-4` `pl-4` | padding per side |
| `m-4`, `mx-4`, `my-4`, `mt-4`... | same pattern for margin |
| `m-auto` | `margin: auto;` |
| `-mt-4` | negative margin |
| `space-x-4` | horizontal gap between children |
| `space-y-4` | vertical gap between children |
| `gap-4` / `gap-x-4` / `gap-y-4` | gap in flex/grid |

Scale: `0, px, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 72, 80, 96` (each step ≈ 0.25rem, so `4` = 1rem).

## Sizing

| Class | CSS |
|---|---|
| `w-4`, `h-4` | width/height from spacing scale |
| `w-1/2`, `w-1/3`, `w-2/3` | fractional widths |
| `w-full` | `width: 100%;` |
| `w-screen` | `width: 100vw;` |
| `w-min` / `w-max` / `w-fit` | intrinsic sizing |
| `min-w-0` / `max-w-md` | min/max width |
| `size-10` | sets width **and** height |

Common `max-w-*` names: `xs sm md lg xl 2xl ... 7xl`, `prose`, `full`, `screen-sm/md/lg/xl`.

## Flexbox

```
flex               display: flex
inline-flex        display: inline-flex
flex-row           flex-direction: row
flex-col           flex-direction: column
flex-wrap          flex-wrap: wrap
flex-nowrap        flex-wrap: nowrap

items-start/center/end/baseline/stretch     align-items
justify-start/center/end/between/around/evenly   justify-content

flex-1             flex: 1 1 0%
flex-auto          flex: 1 1 auto
flex-none          flex: none
grow / grow-0      flex-grow: 1 / 0
shrink / shrink-0  flex-shrink: 1 / 0

order-1 ... order-12, order-first, order-last
```

## Grid

```
grid                       display: grid
grid-cols-3                grid-template-columns: repeat(3, minmax(0, 1fr))
grid-rows-3                grid-template-rows: repeat(3, minmax(0, 1fr))
col-span-2                 grid-column: span 2 / span 2
col-start-2 / col-end-4    grid-column-start/end
row-span-2, row-start-2, row-end-4

grid-flow-row / grid-flow-col / grid-flow-dense

place-items-center         align-items + justify-items
place-content-center       align-content + justify-content
```

## Typography

```
text-xs sm base lg xl 2xl 3xl 4xl 5xl ... 9xl     font-size (+ matching line-height)
font-thin/light/normal/medium/semibold/bold/black
italic / not-italic
underline / line-through / no-underline
uppercase / lowercase / capitalize / normal-case
tracking-tight / tracking-normal / tracking-wide
leading-none/tight/normal/relaxed/loose
text-left/center/right/justify
truncate                  overflow hidden + ellipsis + nowrap
line-clamp-3               clamp to N lines
whitespace-nowrap/pre/pre-wrap
break-words / break-all
```

Shorthand line-height: `text-lg/7` sets `font-size` + `line-height: 1.75rem` in one class.

### Fluid text (viewport-scaling font sizes)

Tailwind has no dedicated "fluid" utility, but the arbitrary-value escape hatch takes a two- or three-argument `clamp()` directly, so text can scale smoothly between a min and max size instead of jumping at breakpoints:

```html
<h1 class="text-[clamp(1.75rem,5vw,3rem)]">Fluid headline</h1>
```

```
text-[clamp(min,preferred,max)]     smoothly scales font-size with the viewport
```

For reusable fluid sizes, define them once as theme tokens and use them like any other size:

```css
@theme {
  --text-fluid-h1: clamp(2rem, 4vw + 1rem, 4rem);
}
```

```html
<h1 class="text-fluid-h1">Scales across breakpoints</h1>
```

:::note
True fluid *type scales* (multiple coordinated sizes with min/max viewports) usually come from a small plugin (e.g. `fluid-tailwindcss`, `tailwind-clamp`) — the pattern above covers one-off fluid values with core Tailwind only.
:::

## Colors

Pattern: `{property}-{color}-{shade}` where shade is `50, 100, 200 ... 900, 950`.

```
text-{color}-{shade}        color
bg-{color}-{shade}          background-color
border-{color}-{shade}      border-color
decoration-{color}-{shade}  text-decoration-color
divide-{color}-{shade}      border color of divide-x/y
ring-{color}-{shade}        box-shadow ring color
fill-{color}-{shade}        SVG fill
stroke-{color}-{shade}      SVG stroke
accent-{color}-{shade}      accent-color (checkboxes, radios, range, progress)
caret-{color}-{shade}       caret-color (text input cursor)
```

Palette names: `slate gray zinc neutral stone red orange amber yellow lime green emerald teal cyan sky blue indigo violet purple fuchsia pink rose`.

Opacity modifier: `bg-black/50`, `text-white/75`, `accent-blue-500/50`.

**Accent color example** — restyle native checkboxes/radios/range sliders without extra markup:

```html
<input type="checkbox" class="accent-pink-500" checked />
<input type="range" class="accent-pink-500" />
```

`accent-inherit`, `accent-current`, and `accent-transparent` are also available, and it takes state/responsive prefixes like any other utility: `hover:accent-pink-500`, `md:accent-pink-500`.

**Caret color example** — color just the text-input cursor:

```html
<textarea class="caret-pink-500 focus:caret-rose-600"></textarea>
```

## Backgrounds

```
bg-transparent / bg-current
bg-gradient-to-r, bg-gradient-to-br, ...
from-{color} via-{color} to-{color}
bg-cover / bg-contain / bg-auto
bg-center / bg-top / bg-bottom
bg-no-repeat / bg-repeat
bg-fixed / bg-local / bg-scroll
```

## Borders

```
border / border-2 / border-4 / border-8
border-t / border-r / border-b / border-l  (per side, add width too: border-t-2)
border-solid / border-dashed / border-dotted / border-none
rounded / rounded-sm / rounded-md / rounded-lg / rounded-xl / rounded-full
rounded-t-lg / rounded-tl-lg  (per corner/side)
divide-x / divide-y          borders between children
```

## Effects & Filters

```
shadow-sm/md/lg/xl/2xl/inner/none
opacity-0 ... opacity-100 (step of 5 or 10)
mix-blend-multiply, bg-blend-overlay, etc.

blur-sm/md/lg/xl
brightness-50/100/150
contrast-50/100/150
grayscale / grayscale-0
saturate-0/100/200
backdrop-blur-sm, backdrop-brightness-50, ...
```

## Transitions & Animation

```
transition            transitions common properties
transition-all/colors/opacity/shadow/transform
duration-150/300/500/700/1000
ease-linear/in/out/in-out
delay-150/300...

animate-spin / animate-ping / animate-pulse / animate-bounce
```

## Transform

```
scale-95 / scale-100 / scale-105 / scale-x-50 / scale-y-50
rotate-45 / -rotate-45
translate-x-4 / -translate-y-2 / translate-x-1/2
skew-x-6
origin-center / origin-top-left
```

## Layout & Positioning

```
block / inline-block / inline / hidden
container
static / relative / absolute / fixed / sticky
top-0 / right-0 / bottom-0 / left-0 / inset-0 / inset-x-0 / inset-y-0
z-0 / z-10 / z-50 / z-auto
overflow-auto/hidden/visible/scroll
overflow-x-auto / overflow-y-hidden
object-cover / object-contain / object-center
float-left / float-right / clear-both
```

## Interactivity & State Variants

Prefix any utility with a state name and a colon:

```
hover:bg-blue-500
focus:outline-none
focus-visible:ring-2
active:scale-95
disabled:opacity-50
visited:text-purple-600
group-hover:text-white       (parent needs `group` class)
peer-checked:block           (sibling needs `peer` class)
first:mt-0 / last:mb-0 / odd:bg-gray-50 / even:bg-white
```

Cursor & user select:

```
cursor-pointer / cursor-not-allowed / cursor-wait
select-none / select-text / select-all
pointer-events-none / pointer-events-auto
```

### Pseudo-element & state variant prefixes

```
file:mr-4 file:rounded-full file:border-0 file:bg-blue-50   ::file-selector-button (styles the "Choose file" button on <input type="file">)
selection:bg-pink-300 selection:text-pink-900               ::selection (styles user-highlighted text)
open:bg-gray-100                                              [open] attribute on <details>/<dialog>/<summary> when expanded
```

```html
<!-- Styled file input button -->
<input type="file" class="file:mr-4 file:rounded-full file:border-0 file:bg-violet-50 file:px-4 file:py-2 file:text-violet-700 hover:file:bg-violet-100" />

<!-- Custom text selection color -->
<p class="selection:bg-pink-300 selection:text-pink-900">Select some of this text.</p>

<!-- Style a <details> element when open -->
<details class="open:bg-gray-100 [&_summary]:cursor-pointer">
  <summary>Toggle me</summary>
  <p class="mt-2">Revealed content.</p>
</details>
```

Like other variants, these can be stacked and combined with breakpoints/dark mode: `dark:file:bg-gray-800`, `md:open:bg-gray-50`.

## Responsive Design (mobile-first)

Prefix a utility with a breakpoint to apply it **from that width up**:

```
sm:   >= 640px
md:   >= 768px
lg:   >= 1024px
xl:   >= 1280px
2xl:  >= 1536px
```

Example: `class="text-sm md:text-base lg:text-lg"` — small text by default, bigger on tablet+, bigger still on desktop.

## Dark Mode

```
dark:bg-gray-900
dark:text-white
```

Requires `darkMode: 'class'` (v3, in `tailwind.config.js`) or, in v4, a `@custom-variant dark (&:where(.dark, .dark *));` declaration. Toggle by adding `class="dark"` to `<html>`.

## Arbitrary Values (escape hatch)

When the design scale doesn't have what you need, use square brackets:

```
w-[137px]
bg-[#1da1f2]
top-[calc(100%-2rem)]
grid-cols-[repeat(auto-fill,minmax(200px,1fr))]
text-[15px]
text-[clamp(1rem,2vw,1.5rem)]
```

## Handy Combos / Patterns

**Center a div both ways:**

```html
<div class="flex items-center justify-center h-screen">...</div>
```

**Card:**

```html
<div class="rounded-xl border border-gray-200 shadow-sm p-6 bg-white">...</div>
```

**Responsive grid of cards:**

```html
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">...</div>
```

**Button with states:**

```html
<button class="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 active:scale-95 disabled:opacity-50 transition">
  Click me
</button>
```

**Truncated text with tooltip fallback:**

```html
<p class="truncate max-w-xs" title="Full text here">Full text here</p>
```

**Sticky header:**

```html
<header class="sticky top-0 z-50 bg-white/80 backdrop-blur border-b">...</header>
```

## Config File Basics

```js title="tailwind.config.js"
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx,md,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: { brand: '#1da1f2' },
      spacing: { 128: '32rem' },
    },
  },
  plugins: [],
};
```

Using extended values: `bg-brand`, `p-128`.

:::note
For anything not covered here, the [official Tailwind docs](https://tailwindcss.com/docs) are searchable and have a live class-name search bar — usually faster than digging through this page for an edge case.
:::
