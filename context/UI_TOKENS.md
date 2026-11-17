# UI Tokens

> Purpose: the design tokens behind Dev Mountain's "Contour Map" look, so new UI matches it.
> Source of truth is `src/css/custom.css` (`--dm-*` variables feeding Infima's `--ifm-*`); keep this file in sync when a token changes.
> Use the variables in components; never hard-code colours or one-off sizes.

## Colour (OKLCH)

| Role | Light | Dark |
| --- | --- | --- |
| `--dm-paper` (page) | `oklch(0.985 0.006 160)` | `oklch(0.2 0.015 165)` |
| `--dm-surface` (inputs, cards) | `oklch(1 0 0)` | `oklch(0.24 0.018 165)` |
| `--dm-ink` (text) | `oklch(0.27 0.04 165)` | `oklch(0.94 0.012 160)` |
| `--dm-muted` (secondary text) | `oklch(0.45 0.03 165)` | `oklch(0.78 0.02 160)` |
| `--dm-line` (dividers, borders) | `oklch(0.88 0.02 160)` | `oklch(0.34 0.02 165)` |
| `--dm-contour` (hero lines) | `oklch(0.82 0.045 160)` | `oklch(0.36 0.035 162)` |
| `--dm-accent` (links, CTA, counts) | `oklch(0.5 0.11 160)` | `oklch(0.78 0.11 160)` |
| Footer | `oklch(0.24 0.035 165)` | `oklch(0.16 0.015 165)` |

Static assets use hex equivalents: ink `#163d30`, light ink `#e9f2ec`, light accent `#7fcfa6`.

## Type

- Display: Fraunces 800 (homepage h1, navbar title), 600 (section h2 on homepage). Loaded via Google Fonts in `docusaurus.config.ts` → `stylesheets`.
- Body and docs headings: IBM Plex Sans 400/500/600.
- Homepage h1 `clamp(3rem, 9vw, 7rem)`, line-height 0.95, letter-spacing -0.03em; lede 1.25rem / 1.55.

## Spacing, radius, motion

- Spacing on a 4/8 scale: 8, 12, 16, 20, 32, 40, 56, 64, 96 px.
- Radius: 10px on inputs and buttons. Controls at least 48px tall.
- Motion: `--dm-ease: cubic-bezier(0.25, 1, 0.5, 1)`, 180ms colour fades only; disabled under `prefers-reduced-motion`.
