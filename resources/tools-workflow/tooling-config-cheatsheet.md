---
title: Tooling Config Cheat Sheet
description: Personal reference for linting, formatting, and type-checking config in JS/TS projects.
tags: [eslint, prettier, oxlint, typescript, tooling]
---

This page is my working reference for how I configure the JS/TS "code quality" stack: **Prettier** (formatting), **ESLint** (deep linting), **oxlint** (fast linting), and **tsconfig.json** (type-checking). Each tool has a distinct job — the friction usually comes from overlap, not from any one tool being hard to configure.

## Mental model: who owns what

| Concern | Tool | Speed | Depth |
|---|---|---|---|
| Code *formatting* (whitespace, quotes, line breaks) | Prettier | Fast | N/A — opinionated, no semantic understanding |
| Code *correctness* / style rules (unused vars, hooks rules, import order) | ESLint | Slow-ish (JS-based, type-aware rules are slower still) | Deep, plugin ecosystem |
| Fast subset of lint rules | oxlint | Very fast (Rust) | Shallower rule set, growing |
| Type correctness | `tsc` via tsconfig | Slow on large projects | Deepest — actual type system |

The rule I try to follow: **Prettier never fights ESLint** (turn off all ESLint stylistic rules), and **oxlint is a fast pre-pass, not a replacement** for ESLint's type-aware and plugin-specific rules.

---

## Prettier

Prettier only cares about formatting — it has no opinion on code quality. Keep the config minimal; the whole point of Prettier is to stop bikeshedding.

### Config file

Use `.prettierrc.json` (or `prettier.config.js` if you need to compute values dynamically). Avoid putting Prettier config inside `package.json` — it gets noisy.

```json title=".prettierrc.json"
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

Notes on options I actually think about:

- **`trailingComma: "all"`** — cleaner git diffs on multiline arrays/objects/function args. Requires modern JS/TS target, which is basically always true now.
- **`printWidth`** — 80 is the Prettier default but often too aggressive for TS with generics; 100 is a common relaxed choice.
- **`endOfLine: "lf"`** — pins line endings regardless of OS, avoids Windows/Mac diff noise. `.gitattributes` reinforces this at the git layer (see "related" section).

### Ignore file

```txt title=".prettierignore"
dist
build
coverage
pnpm-lock.yaml
package-lock.json
*.snap
```

### Editor integration

"Format on save" in the editor is what makes Prettier invisible day-to-day. In VS Code this is `editor.formatOnSave: true` plus the Prettier extension set as default formatter (see [Editor setup](#editor-setup-vs-code) below). Without this, Prettier only really does its job at commit time via `lint-staged`.

---

## ESLint

As of ESLint v9, **flat config** (`eslint.config.js` / `.mjs`) is the default and the legacy `.eslintrc.*` format is on its way out. If you're setting up a new project, use flat config — the old cascading `.eslintrc` + `extends` + `overrides` model was genuinely confusing and flat config fixes most of that by just being plain JS arrays.

### Core plugin stack (TS + React project)

- `@typescript-eslint/eslint-plugin` + `@typescript-eslint/parser` — TS-aware linting
- `eslint-plugin-react` — React-specific rules
- `eslint-plugin-react-hooks` — rules of hooks (non-negotiable, catches real bugs)
- `eslint-plugin-import` (or `eslint-plugin-import-x`, a faster fork) — import order, no-duplicate-imports, resolves paths
- `eslint-config-prettier` — **disables** all ESLint rules that would conflict with Prettier's formatting. This is the glue that keeps the two tools from fighting.

### Example flat config

```js title="eslint.config.js"
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import importPlugin from 'eslint-plugin-import';
import prettierConfig from 'eslint-config-prettier';

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      react,
      'react-hooks': reactHooks,
      import: importPlugin,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/consistent-type-imports': 'warn',
      'import/order': [
        'warn',
        { 'newlines-between': 'always', alphabetize: { order: 'asc' } },
      ],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
  prettierConfig, // must be last — turns off conflicting stylistic rules
);
```

### Rules worth customizing (and why)

- **`@typescript-eslint/no-unused-vars` with `argsIgnorePattern: '^_'`** — lets you keep unused function params named `_event` etc. without noise, common in callbacks.
- **`@typescript-eslint/consistent-type-imports`** — forces `import type { Foo }` instead of `import { Foo }` for type-only imports; keeps bundlers happy and makes intent explicit.
- **`no-console`** — usually want to allow `warn`/`error` but flag stray `console.log` debugging leftovers.
- **Type-aware rules** (`@typescript-eslint/no-floating-promises`, `no-misused-promises`) — genuinely catch bugs but require `parserOptions.project` pointing at `tsconfig.json`, which slows lint down significantly. Worth it on CI, maybe not on every save.

---

## oxlint

[oxlint](https://oxc.rs/) is a Rust-based linter, part of the oxc toolchain. The pitch: **10-100x faster than ESLint** because it's a native binary, not a JS AST walker. Tradeoffs:

- Implements a large but still-growing subset of ESLint/typescript-eslint/react-hooks rules — not a full replacement yet.
- No plugin ecosystem comparable to ESLint's (no custom rule authoring in the same way, though this is evolving fast).
- Doesn't do type-aware linting (no equivalent to `no-floating-promises`).

### Where it fits

I use it as a **fast first pass** — in a pre-commit hook or as a quick "did I break anything obvious" check while iterating — and keep full ESLint (with type-aware rules) for CI. Running both isn't redundant: oxlint catches the cheap stuff instantly, ESLint catches the deep stuff that's worth the extra seconds in CI.

### Config

```json title=".oxlintrc.json"
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript"],
  "rules": {
    "no-unused-vars": "warn",
    "react-hooks/rules-of-hooks": "error"
  },
  "ignorePatterns": ["dist", "build", "coverage"]
}
```

Run it with `npx oxlint` — it's fast enough to run on every save if you want, unlike full ESLint.

---

## tsconfig.json

The one config file that actually changes program behavior, not just style — get `strict` mode right early, because retrofitting it onto a large codebase later is painful.

```json title="tsconfig.json"
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "esModuleInterop": true,
    "isolatedModules": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

### What `strict: true` actually bundles

`strict` is shorthand for a group of flags — worth knowing individually since you sometimes want to enable them piecemeal on a legacy codebase:

- `strictNullChecks` — the big one; `null`/`undefined` aren't silently assignable everywhere. Usually the most painful to retrofit.
- `noImplicitAny` — variables/params without inferred types must be explicitly typed or explicitly `any`.
- `strictFunctionTypes`, `strictBindCallApply`, `strictPropertyInitialization`, `alwaysStrict`, `useUnknownInCatchVariables`, `noImplicitThis` — smaller but real safety nets.

### Options I flag deliberately

- **`moduleResolution: "bundler"`** — correct choice if you're using Vite/esbuild/webpack and not shipping the compiled output directly for Node consumption. Use `"node16"`/`"nodenext"` if you're actually publishing a package meant to run in Node with real ESM resolution semantics.
- **`noUncheckedIndexedAccess`** — not in `strict`, but I turn it on deliberately: `arr[i]` is typed as `T | undefined` instead of just `T`, which reflects reality and catches real bugs.
- **`isolatedModules: true`** — required when using esbuild/SWC/Babel as the transpiler (they compile files independently, so this ensures TS features that need whole-program knowledge, like `const enum`, aren't used).
- **`skipLibCheck: true`** — skips type-checking `.d.ts` files in `node_modules`. Almost always want this on; without it you're at the mercy of every dependency's type quality.
- **`noEmit: true`** — when a bundler (Vite/esbuild/SWC) does the actual transpilation and `tsc` is only used for type-checking, not for emitting JS.

### Monorepo notes

- `references` + `composite: true` per-package tsconfig, with a root tsconfig that just lists references — enables incremental builds (`tsc -b`) that only rebuild changed packages.
- `paths` for internal package aliases (`@myorg/ui/*`) — but remember these are a TS-only concept; the bundler needs its own alias config that mirrors it (Vite's `resolve.alias`, etc.), or you get "works in editor, fails at build" bugs.

---

## How the tools fit together

Suggested pipeline, cheapest/fastest checks first:

```json title="package.json (scripts)"
{
  "scripts": {
    "lint:fast": "oxlint",
    "lint": "eslint . --max-warnings=0",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "typecheck": "tsc --noEmit",
    "check": "npm run lint:fast && npm run lint && npm run format:check && npm run typecheck"
  }
}
```

- **Local dev / pre-commit**: oxlint (instant feedback) + Prettier format-on-save.
- **CI**: full `check` pipeline — oxlint, ESLint (including type-aware rules), Prettier check (not write — CI should fail, not silently reformat), `tsc --noEmit`.

---

## Editor setup (VS Code)

```json title=".vscode/settings.json"
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "eslint.useFlatConfig": true,
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

Key extensions: `esbenp.prettier-vscode`, `dbaeumer.vscode-eslint`. An oxlint VS Code extension exists too if you want fast inline feedback there specifically.

---

## Related, Not Covered Here

Things that live in the same "project hygiene" space but didn't make it onto this page — worth knowing exist, revisit separately if needed:

| Config / tool | What it does |
|---|---|
| `.editorconfig` | Baseline whitespace/EOL/charset rules honored by editors and tools beyond just Prettier; some teams treat it as the source of truth Prettier defers to. |
| `.nvmrc` / `.node-version` / `engines` in `package.json` | Pins the Node version used across the team/CI. |
| `.npmrc` | Registry config, save-exact behavior, pnpm hoisting flags (`node-linker`, `shamefully-hoist`). |
| `.gitattributes` | Line-ending normalization (`* text=auto`), marking generated files as `linguist-generated` so they're excluded from diffs/review. |
| `stylelint` | The ESLint-equivalent for CSS/SCSS/Tailwind; relevant if the project has non-trivial stylesheet code. |
| `commitlint` + `.czrc` / commitizen | Enforcing conventional commit messages. |
| `.markdownlint.json` | Linting for Markdown/docs content itself. |
| `lint-staged` + `husky` | Git hook automation to run the above tools only on staged files at commit time. Tightly coupled to this whole setup and arguably deserves folding in later. |
| `.github/workflows/*.yml` | CI job(s) actually running `npm run check`. |
| `renovate.json` / Dependabot config | Automated dependency update tooling. |
| Framework/bundler configs (`next.config.js`, `vite.config.ts`, `tsup.config.ts`) | A different concern (build tooling), not lint/format/type-check, but often interacts with `tsconfig.json` paths and Prettier ignore patterns. |
