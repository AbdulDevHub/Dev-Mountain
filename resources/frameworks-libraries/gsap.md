---
id: gsap
title: GSAP (GreenSock Animation Platform)
sidebar_label: GSAP
tags: [animation, javascript, frontend]
---

GSAP (GreenSock Animation Platform) is a JavaScript animation library for
tweening basically any property of any JS object — DOM styles, SVG
attributes, canvas, Three.js objects, React state via setters, etc. It's
framework-agnostic and works alongside React, Vue, Svelte, or vanilla JS.

Since 2024 GSAP is **100% free**, including plugins that used to be
"Club GreenSock only" (ScrollTrigger, SplitText, MorphSVG, DrawSVG, etc.) —
Webflow acquired GreenSock and open-sourced everything.

## Installation

```bash
npm install gsap
```

```js
import { gsap } from "gsap";
```

For plugins, import and register them explicitly:

```js
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);
```

Forgetting to `registerPlugin` is the #1 cause of "my ScrollTrigger just
doesn't do anything" bugs.

## Core mental model

Everything in GSAP boils down to a **tween**: animate property(ies) of a
target from one value to another over time. Timelines are just containers
that sequence tweens.

| Method              | What it does                                              |
| -------------------- | ---------------------------------------------------------- |
| `gsap.to(target, {})`     | Animates **from current value → given value**        |
| `gsap.from(target, {})`   | Animates **from given value → current value** (useful for "enter" animations) |
| `gsap.fromTo(target, {}, {})` | Explicitly set both start and end state             |
| `gsap.set(target, {})`    | Instantly sets properties, no animation (shorthand for a 0-duration tween) |

```js
gsap.to(".box", { x: 200, duration: 1, ease: "power2.out" });

gsap.from(".card", { opacity: 0, y: 40, duration: 0.6, stagger: 0.1 });

gsap.fromTo(
  ".logo",
  { scale: 0 },
  { scale: 1, duration: 0.5, ease: "back.out(1.7)" }
);
```

### Common vars (properties) object

- `duration` — seconds (default 0.5)
- `delay` — seconds before start
- `ease` — see [Easing](#easing)
- `repeat` — number of repeats (`-1` = infinite)
- `yoyo` — reverses on alternate repeats (needs `repeat`)
- `stagger` — delay between each element in a selection (number or object: `{ each, from, grid, amount }`)
- `onComplete`, `onStart`, `onUpdate`, `onRepeat` — callbacks
- `x`, `y`, `xPercent`, `yPercent`, `rotation`, `scale`, `opacity` — GSAP-optimized shorthand props that use transforms instead of triggering layout/reflow

:::tip
Prefer `x`/`y` (which map to `translate`) and `xPercent`/`yPercent` over
animating `left`/`top`/`margin`. Transform-based animation is GPU
accelerated and doesn't cause reflow — this is the single biggest perf win
in GSAP.
:::

## Easing

Easing controls the rate of change over the tween's duration.

```js
gsap.to(".box", { x: 300, ease: "power2.inOut" });
```

Common built-ins: `"power1"` → `"power4"` (subtle → strong), each with
`.in`, `.out`, `.inOut` (e.g. `"power2.out"`), plus `"back"`, `"elastic"`,
`"bounce"`, `"circ"`, `"expo"`, `"sine"`, and `"none"` (linear).

- `.out` = fast start, slow finish — good for elements entering/settling
- `.in` = slow start, fast finish — good for elements exiting
- `.inOut` = slow-fast-slow — good for continuous/looping motion

Use the [GSAP ease visualizer](https://gsap.com/docs/v3/Eases) to preview
these rather than guessing.

## Timelines

A `gsap.timeline()` lets you sequence and overlap tweens with a shared
playback controller (play/pause/reverse/seek the whole sequence at once).

```js
const tl = gsap.timeline({ defaults: { duration: 0.5, ease: "power2.out" } });

tl.to(".title", { opacity: 1, y: 0 })
  .to(".subtitle", { opacity: 1, y: 0 }, "-=0.3") // start 0.3s before previous ends
  .to(".cta", { opacity: 1, y: 0 }, "<")           // start at same time as previous
  .to(".bg", { scale: 1 }, "+=0.2");               // start 0.2s after previous ends
```

### Position parameter cheatsheet

The 3rd argument to `.to()`/`.from()`/`.fromTo()` in a timeline controls
where the tween is inserted relative to the playhead:

| Value       | Meaning                                   |
| ----------- | ------------------------------------------ |
| (omitted)   | Right after the previous tween ends        |
| `"+=1"`     | 1 second after the previous tween ends     |
| `"-=0.5"`   | 0.5 seconds before the previous tween ends (overlap) |
| `"<"`       | At the **start** of the previous tween     |
| `">"`       | At the **end** of the previous tween (same as default) |
| `"1.5"`     | At the absolute time 1.5s on the timeline  |
| `"myLabel"` | At a named label — set with `tl.addLabel("myLabel")` |

## Staggering multiple elements

```js
gsap.to(".card", {
  opacity: 1,
  y: 0,
  duration: 0.6,
  stagger: {
    each: 0.1,
    from: "start", // "start" | "end" | "center" | "edges" | "random" | index
  },
});
```

For grids: `stagger: { each: 0.05, grid: "auto", from: "center" }`.

## ScrollTrigger

The most-used plugin: ties animation progress (or start/end) to scroll
position.

```js
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

gsap.to(".panel", {
  x: -500,
  scrollTrigger: {
    trigger: ".panel",
    start: "top center",   // when top of trigger hits center of viewport
    end: "bottom top",
    scrub: true,            // tie progress directly to scroll (or a number for smoothing, e.g. 1)
    pin: true,               // pin the trigger element while active
    markers: true,           // debug visual markers — REMOVE before shipping
  },
});
```

Key `scrollTrigger` options:

- `trigger` — element that starts/stops the animation (defaults to the tween's target)
- `start` / `end` — `"<trigger-position> <viewport-position>"`, e.g. `"top 80%"`
- `scrub` — `true` (tightly linked) or a number (seconds of "catch-up" smoothing, e.g. `0.5`)
- `pin` — pins the element in place for the duration of the scroll trigger
- `toggleActions` — `"play pause resume reset"` style string for onEnter/onLeave/onEnterBack/onLeaveBack
- `markers` — visual start/end markers, dev-only

:::caution
`ScrollTrigger.refresh()` is your friend when layout shifts (images
loading, fonts swapping, content resizing) — otherwise trigger positions
go stale. In React, this is usually handled automatically inside
`useGSAP`'s cleanup, but manual setups often need it wired to
`window.addEventListener("load", ...)`.
:::

## Using GSAP with React

Use the official `@gsap/react` hook instead of raw `useEffect` — it
handles cleanup (reverting all animations/ScrollTriggers created inside
it) automatically on unmount, which prevents duplicate/ghost triggers on
re-render or React StrictMode double-invocation.

```bash
npm install @gsap/react
```

```jsx
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

function Box() {
  const container = useRef();

  useGSAP(
    () => {
      // gsap.context() scoping happens automatically here —
      // selectors like ".box" only match inside `container`
      gsap.to(".box", { rotation: 360, duration: 2, repeat: -1 });
    },
    { scope: container } // scopes selectors + auto-cleanup on unmount
  );

  return (
    <div ref={container}>
      <div className="box" />
    </div>
  );
}
```

`useGSAP` accepts a dependency array as a second option too:
`useGSAP(() => {...}, { dependencies: [someState], scope: container })`.

## Other plugins worth knowing

| Plugin | Use case |
| ------ | -------- |
| `ScrollTrigger` | Scroll-linked animation & pinning |
| `SplitText` | Split text into chars/words/lines to animate individually |
| `Draggable` | Drag-to-interact elements (works with inertia) |
| `Flip` | Animate layout changes (FLIP technique) smoothly — great for reordering lists/grids |
| `MotionPathPlugin` | Animate elements along an SVG path |
| `ScrollSmoother` | Buttery smooth-scroll wrapper that pairs with ScrollTrigger |
| `TextPlugin` | Typewriter-style text swapping |

## Gotchas / things I learned the hard way

- **Register plugins before use** — `gsap.registerPlugin(ScrollTrigger)` or nothing fires, silently.
- **`gsap.from` uses current CSS as the end state** — if the element's
  final CSS isn't already correct in your stylesheet, `from` will animate
  to the wrong place.
- **Transforms stack per-element, not per-property** — animating `x` and
  `rotation` together works fine (GSAP manages the transform string for
  you), but mixing GSAP transforms with manual CSS `transform` in the same
  stylesheet rule will conflict.
- **Kill or revert tweens on cleanup** — in vanilla JS/SPA routers, call
  `tween.kill()` / `ScrollTrigger.getAll().forEach(t => t.kill())` when a
  component/page unmounts, or you get memory leaks and stacked triggers.
  In React, `useGSAP`'s auto-cleanup handles this for you.
- **`will-change` / layout thrashing** — for heavy scroll-scrubbed
  animations, animating `x`/`y`/`scale`/`opacity`/`rotation` is cheap;
  animating `width`, `height`, `top`, `left` is expensive and can cause
  jank.
- **`immediateRender`** — `gsap.from()` renders the "from" state
  immediately by default, even before the tween starts (e.g. before a
  ScrollTrigger is in view). Set `immediateRender: false` if you don't
  want that flash.
- **StrictMode double effects** — raw `useEffect` GSAP setups often run
  twice in dev, duplicating ScrollTriggers. `useGSAP` avoids this.
- **z-index / 3D transforms** — animating `rotationY`/`rotationX` can
  trigger unexpected stacking context issues; add `transformPerspective`
  and `backfaceVisibility: "hidden"` for cleaner 3D flips.

## Quick reference snippets

**Fade + slide in on scroll:**

```js
gsap.from(".reveal", {
  opacity: 0,
  y: 60,
  duration: 0.8,
  ease: "power3.out",
  scrollTrigger: { trigger: ".reveal", start: "top 85%" },
});
```

**Looping pulse:**

```js
gsap.to(".pulse", {
  scale: 1.1,
  duration: 0.8,
  ease: "sine.inOut",
  repeat: -1,
  yoyo: true,
});
```

**Sequenced hero intro:**

```js
gsap
  .timeline()
  .from(".hero-title", { opacity: 0, y: 30, duration: 0.6 })
  .from(".hero-subtitle", { opacity: 0, y: 20, duration: 0.5 }, "-=0.3")
  .from(".hero-cta", { opacity: 0, scale: 0.8, duration: 0.4 }, "-=0.2");
```

## Further reading

- [Official docs](https://gsap.com/docs/v3/)
- [Ease visualizer](https://gsap.com/docs/v3/Eases)
- [ScrollTrigger docs](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)
- [React guide (`@gsap/react`)](https://gsap.com/resources/React/)
