---
id: css-quick-reference
title: CSS Quick Reference
sidebar_label: CSS Quick Reference
---

A cheat sheet for the CSS syntax I always forget after a break. Ctrl+F is your friend here.

## Selectors

```css
* { }                 /* universal */
div { }                /* type */
.class { }              /* class */
#id { }                 /* id */
[type="text"] { }        /* attribute */
[href^="https"] { }       /* starts with */
[href$=".pdf"] { }        /* ends with */
[href*="docs"] { }        /* contains */

div p { }               /* descendant */
div > p { }              /* direct child */
div + p { }              /* adjacent sibling (immediately after) */
div ~ p { }              /* general sibling (any after) */

a, button { }             /* group selector */
```

## Specificity (low to high)

1. Type selectors & pseudo-elements (`div`, `::before`) — weight `0-0-1`
2. Class, attribute, pseudo-class (`.foo`, `[type]`, `:hover`) — weight `0-1-0`
3. ID selectors (`#foo`) — weight `1-0-0`
4. Inline styles — always win unless...
5. `!important` — overrides everything (avoid unless truly necessary)

## Box Model

```css
.box {
  box-sizing: border-box; /* width/height include padding+border. Set this globally: */
  width: 200px;
  padding: 10px;
  border: 1px solid black;
  margin: 20px;
}

/* Global reset trick */
*, *::before, *::after {
  box-sizing: border-box;
}
```

- `content-box` (default): width = content only
- `border-box`: width = content + padding + border

## Display & Positioning

```css
display: block;
display: inline;
display: inline-block;
display: none;         /* removes from layout entirely */
visibility: hidden;      /* hides but keeps the space */

position: static;       /* default */
position: relative;      /* offset from normal position, still takes up space */
position: absolute;      /* removed from flow, positioned relative to nearest positioned ancestor */
position: fixed;        /* relative to viewport, stays on scroll */
position: sticky;       /* toggles between relative/fixed based on scroll */

top: 0; right: 0; bottom: 0; left: 0;
z-index: 10;          /* only works on positioned elements (not static) */
```

## Flexbox

```css
.container {
  display: flex;
  flex-direction: row | row-reverse | column | column-reverse;
  flex-wrap: nowrap | wrap | wrap-reverse;

  justify-content: flex-start | flex-end | center | space-between | space-around | space-evenly;
  align-items: stretch | flex-start | flex-end | center | baseline;
  align-content: flex-start | center | space-between; /* multi-line only */

  gap: 1rem;          /* row-gap column-gap */
}

.item {
  flex-grow: 0;        /* how much to grow relative to siblings */
  flex-shrink: 1;       /* how much to shrink */
  flex-basis: auto;      /* starting size before grow/shrink */
  flex: 1 1 auto;       /* shorthand: grow shrink basis */
  align-self: center;     /* overrides align-items for one item */
  order: 2;           /* visual reordering, default 0 */
}
```

**Quick mental model:** `justify-content` = main axis, `align-items` = cross axis. Main axis flips with `flex-direction`.

## Grid

```css
.container {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  grid-template-columns: repeat(3, 1fr);
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); /* responsive without media queries */
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
    "header header"
    "sidebar content"
    "footer footer";

  gap: 1rem;          /* row-gap column-gap */
  justify-items: center;    /* horizontal align within cell */
  align-items: center;     /* vertical align within cell */
  justify-content: center;   /* aligns whole grid horizontally */
}

.item {
  grid-column: 1 / 3;      /* start / end line */
  grid-column: span 2;     /* span 2 tracks */
  grid-row: 2 / 4;
  grid-area: header;      /* matches a named area above */
}
```

## Typography

```css
font-family: "Helvetica Neue", Arial, sans-serif;
font-size: 1rem;        /* prefer rem over px for accessibility */
font-weight: 400;        /* normal=400, bold=700 */
font-style: italic;
line-height: 1.5;        /* unitless preferred, scales with font-size */
letter-spacing: 0.05em;
text-align: left | center | right | justify;
text-decoration: underline;
text-transform: uppercase | capitalize | lowercase;
white-space: nowrap;      /* prevent wrapping */
text-overflow: ellipsis;    /* needs overflow:hidden + white-space:nowrap */
overflow: hidden;
```

## Colors & Units

```css
color: #ff0000;
color: rgb(255 0 0);
color: rgb(255 0 0 / 0.5);   /* with alpha */
color: hsl(0 100% 50%);
color: hsl(0 100% 50% / 0.5);

/* Absolute units */
px    /* pixels */

/* Relative units */
%     /* relative to parent */
em    /* relative to parent font-size */
rem   /* relative to root font-size — most predictable, use for spacing/type */
vw    /* 1% of viewport width */
vh    /* 1% of viewport height */
vmin  /* 1% of smaller viewport dimension */
vmax  /* 1% of larger viewport dimension */
ch    /* width of "0" character — handy for text-based widths */
```

## Pseudo-classes & Pseudo-elements

```css
a:hover { }
a:active { }
a:focus { }
a:visited { }
input:disabled { }
input:checked { }
li:first-child { }
li:last-child { }
li:nth-child(2) { }
li:nth-child(odd) { }
li:nth-child(3n+1) { }
:not(.excluded) { }

p::before { content: "→ "; }
p::after { content: ""; }
::selection { background: yellow; }
input::placeholder { color: gray; }
```

## Transitions & Animations

```css
.button {
  transition: background-color 0.3s ease-in-out;
  transition: all 0.2s ease, transform 0.2s ease-out;
  /* shorthand order: property duration timing-function delay */
}

@keyframes fade-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}

.element {
  animation: fade-in 0.5s ease-in forwards;
  /* name duration timing-function fill-mode */
  animation-iteration-count: infinite;
}

.card:hover {
  transform: scale(1.05) rotate(2deg) translateY(-4px);
}
```

Common timing functions: `linear`, `ease`, `ease-in`, `ease-out`, `ease-in-out`, `cubic-bezier(...)`.

## Responsive / Media Queries

```css
/* Mobile-first: base styles = mobile, then override upward */
@media (min-width: 768px) {
  .container { flex-direction: row; }
}

@media (max-width: 767px) {
  .sidebar { display: none; }
}

@media (prefers-color-scheme: dark) {
  body { background: #111; color: #eee; }
}

/* Common breakpoints (rough guide, adjust to your design) */
/* sm: 576px, md: 768px, lg: 992px, xl: 1200px */
```

## Centering Cheat Sheet

```css
/* Flexbox — centers both axes */
.parent {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Grid — one-liner */
.parent {
  display: grid;
  place-items: center;
}

/* Absolute + transform — centers a single element without flex/grid parent */
.child {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* Horizontally center a block with a fixed width */
.child {
  width: 600px;
  margin-inline: auto; /* or: margin: 0 auto; */
}
```

## Common Gotchas

- **Margin collapsing**: vertical margins between adjacent block elements collapse to the larger one, not the sum. Doesn't happen with flex/grid children.
- **`z-index` does nothing** on `position: static` elements — must be `relative`, `absolute`, `fixed`, or `sticky`.
- **`%` height doesn't work** unless the parent has an explicit height set.
- **`overflow: hidden`** on a parent clips absolutely-positioned children too, even if they're meant to "escape."
- **Specificity beats source order** — a later rule can lose to an earlier, more specific one.
- **`inline` elements ignore** `width`, `height`, and vertical `margin`. Use `inline-block` or `block` instead.
- **`gap` works in both flexbox and grid** now — no more margin hacks for spacing between items.

## Handy Shorthand Reference

```css
margin: 10px;              /* all sides */
margin: 10px 20px;           /* vertical horizontal */
margin: 10px 20px 30px;        /* top horizontal bottom */
margin: 10px 20px 30px 40px;     /* top right bottom left (clockwise) */

border: 1px solid #333;        /* width style color */
background: #fff url(bg.png) no-repeat center / cover;
font: italic bold 16px/1.5 Arial, sans-serif; /* style weight size/line-height family */
```
