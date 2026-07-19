---
id: sass-cheatsheet
title: Sass Cheat Sheet
sidebar_label: Sass Cheat Sheet
tags: [css, sass, scss, preprocessor]
---

Sass (**S**yntactically **A**wesome **S**tyle **S**heets) is a CSS preprocessor — it compiles down to plain CSS but adds programming-language features CSS lacks: variables, nesting, functions, loops, and modules.

There are two syntaxes:

| Syntax | Extension | Notes |
|---|---|---|
| **SCSS** (Sassy CSS) | `.scss` | Superset of CSS. Uses `{}` and `;` like normal CSS. **This is the one almost everyone uses today.** |
| **Sass** (indented) | `.sass` | Older, whitespace-significant, no braces/semicolons. Rare in the wild now. |

All examples below use SCSS.

## Installing / Compiling

```bash
npm install -D sass
```

```bash
# one-off compile
sass input.scss output.css

# watch mode
sass --watch src/styles:dist/css

# compressed output for production
sass --style=compressed input.scss output.css
```

Most modern setups (Vite, webpack, Next.js) compile Sass automatically once the `sass` package is installed — no extra config needed for `.scss` imports.

## Variables

```scss
$primary-color: #3498db;
$spacing-unit: 8px;
$font-stack: 'Helvetica Neue', sans-serif;

.button {
  background: $primary-color;
  padding: $spacing-unit * 2;
}
```

- Variables are scoped like block-scoped variables — declared inside a `{}` they don't leak out, unless marked `!global`.
- Naming convention: kebab-case (`$primary-color`, not `$primaryColor`).

## Nesting

```scss
.card {
  padding: 1rem;
  border: 1px solid #ddd;

  .card-title {
    font-weight: bold;
  }

  &:hover {
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
  }

  &.is-active {
    border-color: $primary-color;
  }
}
```

- `&` refers to the parent selector — essential for pseudo-classes (`&:hover`), pseudo-elements (`&::before`), and modifier classes (`&.is-active`, useful for BEM: `&__element`, `&--modifier`).
- **Don't nest more than 3 levels deep** — it produces overly specific selectors and bloated CSS. Prefer flatter structures with BEM-style naming instead.

## Partials & Modules (`@use` / `@forward`)

> `@import` is **deprecated** (removed in Dart Sass 3.0). Use `@use` and `@forward` instead.

A **partial** is a file meant to be imported, prefixed with `_` (e.g. `_variables.scss`). The underscore tells Sass not to compile it to its own CSS file.

```
styles/
  _variables.scss
  _mixins.scss
  _buttons.scss
  main.scss
```

```scss
// _variables.scss
$primary-color: #3498db;
$radius: 4px;
```

```scss
// main.scss
@use 'variables' as v;

.button {
  background: v.$primary-color;
  border-radius: v.$radius;
}
```

Key differences from old `@import`:
- `@use` only loads a file **once**, no matter how many times it's used elsewhere (avoids duplicate CSS output).
- Everything loaded with `@use` is **namespaced** (`v.$primary-color`) unless you add `as *` to load it into the global namespace.
- `@forward` re-exports another file's members, useful for building a single "barrel" entry point:

```scss
// _index.scss (barrel file)
@forward 'variables';
@forward 'mixins';
@forward 'buttons';
```

```scss
// consumer
@use 'styles' as s;
```

## Mixins (`@mixin` / `@include`)

Reusable chunks of styles, optionally parameterized.

```scss
@mixin flex-center($direction: row) {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: $direction;
}

.header {
  @include flex-center;
}

.modal {
  @include flex-center(column);
}
```

Mixins can also take a content block via `@content`:

```scss
@mixin responsive($breakpoint) {
  @media (min-width: $breakpoint) {
    @content;
  }
}

.container {
  width: 100%;

  @include responsive(768px) {
    width: 750px;
  }
}
```

## Functions (`@function`)

Unlike mixins (which output styles), functions **return a value**.

```scss
@function rem($px, $base: 16px) {
  @return math.div($px, $base) * 1rem;
}

.title {
  font-size: rem(24px); // 1.5rem
}
```

## `@extend` (Inheritance)

Lets one selector inherit the styles of another. Best used with **placeholder selectors** (`%name`) so nothing is output unless it's actually extended.

```scss
%button-base {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: none;
  cursor: pointer;
}

.btn-primary {
  @extend %button-base;
  background: $primary-color;
  color: white;
}

.btn-secondary {
  @extend %button-base;
  background: #eee;
}
```

⚠️ **Caution:** `@extend` merges selectors together in the compiled CSS, which can create unexpectedly large/specific selector lists. Prefer mixins for anything parameterized; use `@extend` mainly for small shared bases.

## Control Directives

```scss
// @if / @else
@mixin theme($mode) {
  @if $mode == dark {
    background: #111;
    color: #fff;
  } @else if $mode == light {
    background: #fff;
    color: #111;
  } @else {
    @warn "Unknown theme: #{$mode}";
  }
}

// @each — loop over a list or map
$sizes: (small: 8px, medium: 16px, large: 24px);

@each $name, $size in $sizes {
  .p-#{$name} {
    padding: $size;
  }
}

// @for — numeric loop
@for $i from 1 through 5 {
  .col-#{$i} {
    width: math.div(100%, 5) * $i;
  }
}

// @while
$i: 1;
@while $i <= 3 {
  .m-#{$i} {
    margin: $i * 4px;
  }
  $i: $i + 1;
}
```

## Maps

Sass's key-value data structure — great for design tokens.

```scss
$breakpoints: (
  sm: 576px,
  md: 768px,
  lg: 992px,
  xl: 1200px,
);

@mixin bp($name) {
  @media (min-width: map.get($breakpoints, $name)) {
    @content;
  }
}

.sidebar {
  @include bp(md) {
    display: block;
  }
}
```

## Built-in Modules

Since Dart Sass moved away from global functions, most utilities now live in `sass:` modules that you `@use`:

```scss
@use 'sass:math';
@use 'sass:color';
@use 'sass:list';
@use 'sass:map';
@use 'sass:string';
```

| Module | Common functions |
|---|---|
| `sass:math` | `math.div()`, `math.round()`, `math.ceil()`, `math.floor()`, `math.abs()`, `math.min()`, `math.max()` |
| `sass:color` | `color.adjust()`, `color.scale()`, `color.mix()`, `color.channel()` |
| `sass:list` | `list.append()`, `list.length()`, `list.nth()`, `list.join()` |
| `sass:map` | `map.get()`, `map.merge()`, `map.keys()`, `map.values()`, `map.has-key()` |
| `sass:string` | `string.quote()`, `string.slice()`, `string.to-upper-case()` |

⚠️ Note: plain `/` division is deprecated for math — use `math.div()` instead of `$a / $b`.

## Operators

```scss
.box {
  width: 100px + 20px;     // arithmetic
  height: 100% - 20px;
  margin: -$spacing-unit;  // negation
}

// comparison: ==  !=  <  >  <=  >=
// logical:    and  or  not
```

## Interpolation `#{}`

Used to inject a Sass value into a place that expects a literal string — selector names, property names, strings.

```scss
$side: top;

.mt-4 {
  margin-#{$side}: 4px;
}

@each $name, $color in (primary: blue, danger: red) {
  .text-#{$name} {
    color: $color;
  }
}
```

## Useful At-Rules

- `@debug` — prints a value to the console during compilation, for debugging.
- `@warn` — prints a warning without stopping compilation.
- `@error` — stops compilation with an error message (good for validating mixin/function arguments).

```scss
@mixin square($size) {
  @if not (unitless($size) == false) {
    @error "Size must include a unit, got #{$size}.";
  }
  width: $size;
  height: $size;
}
```

## Common Pitfalls / Gotchas

- **`@import` is deprecated** — new projects should use `@use`/`@forward` exclusively.
- Overusing nesting leads to overly specific, hard-to-override selectors.
- `@extend` across unrelated selectors can bloat output CSS in surprising ways — prefer mixins when in doubt.
- Sass variables are **not** the same as CSS custom properties (`--my-var`). Sass variables are compile-time only and disappear from the output; CSS custom properties persist at runtime and can be changed via JS or media queries. For theming that needs to change at runtime (e.g. dark mode toggle), use CSS custom properties, optionally generated *with* Sass.
- File load order matters with `@use` — circular imports will throw an error.

## Quick Reference Cheat Sheet

```scss
$var: value;                     // variable
%placeholder { }                 // extend-only selector
@mixin name($arg: default) { }   // reusable style block
@include name(value);            // use a mixin
@function name($arg) { @return; }// reusable value
@use 'file' as alias;            // import a module
@forward 'file';                 // re-export a module
@extend %placeholder;            // inherit styles
&                                 // parent selector reference
#{$var}                          // interpolation
```

## Further Reading

- [Official Sass docs](https://sass-lang.com/documentation/)
- [Sass built-in modules reference](https://sass-lang.com/documentation/modules/)
