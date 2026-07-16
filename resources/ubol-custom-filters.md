---
title: Custom uBlock Origin Lite Filter Rules
sidebar_label: uBOL Custom Filters
description: Quick reference for writing precise custom cosmetic filters in uBlock Origin Lite (uBOL).
---

Reference for the element picker's **Create Custom Filter** dialog in **uBlock Origin Lite (uBOL)** — the Manifest V3 build, not classic uBlock Origin. uBOL works differently enough from classic uBO that most generic uBO tutorials will mislead you. This page reflects what's actually confirmed working, as of testing in July 2026.

## Before anything: set the site's mode

Cosmetic filtering (hiding elements) does **not** work in uBOL's default mode. Click the toolbar icon → set the mode for the current site to **Optimal** or **Complete**. The browser will prompt you to grant extra permissions for that site — accept it. If your custom filter "does nothing" and you haven't done this, this is why, before anything about selector syntax.

## The one thing that trips everyone up: don't type the domain

In classic uBO you write `domain.com##selector`. **In uBOL's picker, you paste the selector only** — no domain prefix. The picker automatically scopes the filter to whatever tab it was opened from when you click Create. Pasting `claude.ai##.selector` into the box gives it a token it doesn't parse there, and it silently fails to save instead of erroring.

```
✅ .selector-here
❌ example.com##.selector-here
```

The domain scope is fixed to *the page you had open when you clicked Create* — there's no field to type or edit it directly.

## Quick lookup

| I want to... | Filter to use | Example |
|---|---|---|
| Hide an element by class | plain CSS class selector | `.promo-banner` |
| Hide an element with a messy/generated class list | trim to shortest unique selector | `.font-claude-response-body` instead of the full class dump |
| Hide an element **only if it contains specific text** | `:has-text()` — confirmed working | `.card:has-text(Sponsored)` |
| Hide an element **only if it contains a specific child element** | `:has()` — native CSS, confirmed working | `.card:has(.badge)` |
| Hide the Nth matching element only | `:nth-of-type()` | `.sidebar > div:nth-of-type(2)` |
| Target a stable attribute instead of a volatile class | attribute selector | `[data-testid="newsletter-banner"]` |
| Un-hide something a filter list is hiding | exception filter, no domain prefix (see caveat below) | `#@#.some-selector` |
| Block a request (script/image/iframe) instead of hiding an element | network filter (Dashboard → My filters, not the picker) | `\|\|example.com/ads/*.js^$script` |

## Anatomy of a filter in the picker

Because the domain is handled for you, what you type is just the selector body:

```
selector-part
```

Everything after `##` in a classic uBO filter is what goes in uBOL's box — nothing before it.

Example — a real one that works, once you strip the domain:

```
p.font-claude-response-body.break-words.whitespace-normal
```

(You'd usually want to trim this further — see below.)

## Confirmed capabilities (tested)

These were verified directly with a test page, not just taken from docs, since uBOL's own documentation is inconsistent and outdated in places:

- **Plain CSS class/attribute selectors** — work as expected.
- **`:has-text("string")`** — a procedural filter, hides an element only if it (or its children) contain the given text. Confirmed working in current uBOL builds, despite older documentation and forum threads claiming procedural filters are unsupported in uBOL. This was added/fixed in 2026 releases.
- **`:has(selector)`** — hides an element only if it contains a matching descendant. This is real native CSS (browsers implement `:has()` directly), so it doesn't depend on uBO's procedural JS engine at all and is the most reliable of the three to rely on long-term.

## Precision over auto-generated selectors

The picker's auto-suggested selector is usually every class on the element, dumped in order — e.g. `div.text-center.h-\[10rem\].bg-bg-200.rounded-2xl.flex.flex-col.gap-3.items-center.justify-center.text-text-500.font-small`. Problems with using it as-is:

- **Brittle**: utility-CSS frameworks (Tailwind etc.) regenerate or reorder classes on rebuild.
- **Noisy**: usually only 1–2 of those classes are actually unique to the element; the rest is layout boilerplate reused everywhere.

Better, in order of preference:

1. Test in DevTools console first: `document.querySelectorAll('your-selector').length` — confirm it matches only what you expect before creating the filter.
2. Prefer an `#id` if the element has one.
3. Prefer a stable attribute (`data-testid`, `aria-label`) if the site has one.
4. Anchor on `:has-text()` if the wording is stable but the markup isn't.
5. Only fall back to the full class dump if nothing else uniquely identifies it — and even then, drop pure-layout utility classes (`flex`, `items-center`, `gap-3`) since they're the most likely to be reused elsewhere or to change.

**Escaping**: special characters in class names must be backslash-escaped exactly as the browser/picker shows them — `h-[10rem]` → `.h-\[10rem\]`, `md:flex` → `.md\:flex`.

## Exceptions (un-hiding)

`#@#selector` cancels a `##selector` rule for that same scope. Caveat specific to uBOL: fully domain-less/generic exceptions have had support issues in some uBOL builds — if a `#@#` filter you create doesn't seem to take effect, check the Dashboard → **My filters** list to confirm it actually saved, since the picker's silent-fail behavior (same as the domain-prefix issue above) can also happen here.

## Basic network filters

Unlike cosmetic filters, network filters aren't created through the picker's "Create Custom Filter" element flow — add them directly in Dashboard → **My filters**. They block a request outright rather than hiding an already-loaded element:

```
||example.com/ads/*.js^$script
```

- `||` anchors to the start of a domain.
- `^` is a separator placeholder (end of domain/path/port).
- `$script`, `$image`, `$xmlhttprequest`, `$subdocument` (iframes), `$domain=` restrict by resource type or context.

uBOL-specific limits: no wildcards in the domain portion of a custom static filter (`example.*##...` is silently ignored), and there's no dynamic per-request "matrix" view like classic uBO — you can't toggle blocking per-request live, only write static rules ahead of time.

## Debugging

uBOL has no logger/DOM-inspector like classic uBO. Practical workflow instead:

1. Confirm the site's mode is Optimal/Complete (see top of page) — the single most common cause of "nothing happens."
2. Test your selector in DevTools console (`document.querySelectorAll(...)`) before creating the filter, to rule out a bad selector vs. a uBOL-specific failure.
3. After creating, check Dashboard → **My filters** to confirm the filter actually saved with the content you expect — the picker fails silently (empties the box, closes) rather than erroring, both on the domain-prefix mistake above and on some malformed inputs.
4. Reload the page fully (not just soft-navigate, if the site is an SPA) to confirm.

## AI prompt for generating filters

Instead of hand-writing selectors, paste this prompt into an AI chat along with the element's HTML and what you want targeted. It bakes in uBOL's specific constraints so the output is ready to paste straight into the picker with no cleanup.

````text
You are writing a custom cosmetic filter selector for uBlock Origin Lite (uBOL), NOT classic uBlock Origin. Follow these constraints exactly:

1. Output ONLY the selector itself — no domain prefix, no "##", no "example.com##". uBOL's picker auto-scopes the domain; a prefix breaks it.
2. Confirmed-working selector types in uBOL: plain CSS selectors (class, id, attribute, tag, descendant/child combinators, :nth-of-type(), :nth-child()), native :has(), and the procedural :has-text("string"). Prefer plain CSS first; only reach for :has-text() or :has() when structure/class alone can't distinguish the target.
3. Escape special characters in class names exactly as they appear (e.g. a Tailwind class "h-[10rem]" becomes ".h-\[10rem\]", "md:flex" becomes ".md\:flex").
4. Prefer the shortest selector that is still unique — don't dump every class on the element. Use an #id or a stable data-* attribute if one exists over a long class chain.
5. If asked to select something "only if it contains X" (text or a child element), use :has-text() or :has() rather than assuming a class will do it.
6. Give me ONLY the final selector string on its own line, ready to paste — no explanation unless I ask for one, no markdown code fences, no domain, no "##".

Here is the HTML of the element/area:
[PASTE HTML HERE]

What I want selected/hidden:
[DESCRIBE TARGET HERE — e.g. "the 2nd div inside the span with class X"]
````

Fill in the two bracketed sections with the actual HTML and your targeting description, then paste the whole thing in. The output should be a single selector line you can drop directly into the picker's Create Custom Filter box.

## Gotchas specific to uBOL

- **Don't include a domain prefix** in the picker's text box — see above, this is the #1 cause of "it does nothing."
- **Cosmetic filtering silently no-ops in default mode** — must be Optimal or Complete for the specific site.
- **No global/domain-less filters** — every cosmetic filter is scoped to a single site by design; there's no way to write one rule that applies everywhere.
- **Escaping utility-CSS characters** (`[`, `]`, `:`) is still required, same as classic uBO.
- **Docs and forum posts about uBOL lag behind the actual extension** — procedural filter support is a real example of this; when in doubt, build a throwaway test page and confirm empirically rather than trusting a single source.
