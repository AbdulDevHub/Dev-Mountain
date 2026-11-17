# UI Rules

> Purpose: how Dev Mountain's UI should look and behave, so new pages and components stay consistent with the "Contour Map" direction chosen on 2026-11-17.
> Tokens live in `context/UI_TOKENS.md`; this file covers register, patterns and exceptions.
> Update it when a pattern is added or a rule changes.

- **Register**: docs site (product rules, reading first) with a brand-register homepage.
- **Scene**: a developer skimming for a command between tasks, usually in daylight at a desk; light theme by default, dark follows the system setting.
- **Signature element**: topographic contour lines with a summit marker in the homepage hero (also on the social card). Use it only there; docs pages stay plain.
- **Homepage**: hero (headline, lede, real search form posting to `/search?q=`, one solid CTA), then the trail index. The trail index is generated from `sidebars-resources.ts` by `src/components/TrailIndex` (`useTrails`), so new categories and pages appear automatically; never hard-code counts.
- **Lists over cards**: topics are a divided list with counts, not a grid of icon cards.
- **States**: every link/control has hover (colour to accent), visible `:focus-visible` ring (2px accent, 2px offset) and a 48px minimum target.
- **Mascot**: the T-Rex is no longer part of the brand visuals; the tagline "T-Rex Energy" remains in config only.
- **Brand name**: always "Dev Mountain" (two words, no hyphen) in UI copy.
