---
title: Commit Lint & Conventional Commits
description: A quick reference guide for writing consistent, meaningful Git commit messages
---

## Commit Lint

Commit linting helps enforce **consistent and readable commit messages**, making project history easier to understand and automate.

This guide follows **`commitlint-config-conventional`**, which is based on the **Angular commit convention**.

---

## ✍️ Commit Message Format

A typical commit message looks like this:

```

<type>(optional scope): <short description>

```

---

## ✅ Real-World Examples

```

chore: run tests on travis ci
fix(server): send cors headers
feat(blog): add comment section

```

---

## 🏷️ Common Commit Types

Below are the most common commit types supported by  
`commitlint-config-conventional`:

- **build** — Changes that affect the build system or dependencies
- **chore** — Maintenance tasks that don’t modify production code
- **ci** — Changes to CI configuration or scripts
- **docs** — Documentation-only changes
- **feat** — A new feature
- **fix** — A bug fix
- **perf** — Performance improvements
- **refactor** — Code changes that neither fix a bug nor add a feature
- **revert** — Reverts a previous commit
- **style** — Formatting changes (no code behavior change)
- **test** — Adding or updating tests

---

## 🧠 Why Use Commit Lint?

- Improves **readability** of Git history
- Enables **automated changelogs**
- Helps teams stay **consistent**
- Works well with **semantic versioning**

---

## 🤖 Commitizen (Gitmoji + Conventional Commits)

**Commitizen** (`cz-cli`) with the **`cz-git`** adapter gives an interactive prompt that walks you through building a commit message, so you don't have to remember the format by hand. It produces commits like:

```
:emoji: <type>: <subject>
```

e.g. `:bug: fix: fix cz-git configuration`

### Project-local setup

Two files, kept deliberately separate: `package.json` only tells Commitizen *where* the adapter lives, and `commitlint.config.js` holds `cz-git`'s actual prompt/style options. Splitting them this way avoided CLI resolution errors on Windows when everything lived in `package.json`.

```json title="package.json"
{
  "scripts": {
    "commit": "cz"
  },
  "devDependencies": {
    "commitizen": "^4.3.2",
    "cz-git": "^1.13.1"
  },
  "config": {
    "commitizen": {
      "path": "node_modules/cz-git"
    }
  }
}
```

```js title="commitlint.config.js"
module.exports = {
  rules: {
    // standard commitlint rules go here if you want them enforced
  },
  prompt: {
    useEmoji: true,
    emojiAlign: 'left',
  },
};
```

Usage: stage changes as normal (`git add <files>`), then run `npm run commit` instead of `git commit`. It walks you through several prompts in order, then shows the composed message for confirmation before committing.

### Global setup (works in any repo, no per-project install)

```powershell
# Install once, globally
npm install -g commitizen cz-git
```

```powershell
# Create ~/.czrc so `git cz` works anywhere
Set-Content -Path "$HOME\.czrc" -Value '{
  "path": "cz-git",
  "useEmoji": true,
  "emojiAlign": "left"
}'
```

Once `.czrc` exists in the home directory, `git cz` works in any repo on the machine — no local `cz-git` install or config file needed.

### Walking through the prompts

Verified working example run:

```
PS C:\Users\kokok\Downloads\cz-emoji-demo> git cz
cz-cli@4.3.2, cz-git@1.13.1

? Select the type of change that you're committing: ci:       Changes to our CI configuration files and scripts
? Denote the SCOPE of this change (optional): empty
? Write a SHORT, IMPERATIVE tense description of the change: add .gitignore
? Provide a LONGER description of the change (optional). Use "|" to break new line:
? Select the ISSUES type of change (optional): skip

###--------------------------------------------------------###
:ferris_wheel: ci: add .gitignore
###--------------------------------------------------------###

? Are you sure you want to proceed with the commit above? Yes
[main 26b9e16] :ferris_wheel: ci: add .gitignore
 1 file changed, 1 insertion(+)
 create mode 100644 .gitignore
```

Two of these prompts trip people up the first time through, since neither is required and it's not obvious what they're asking for:

- **`? Denote the SCOPE of this change (optional):`** — the `(scope)` part of `type(scope): subject` (see "Commit Message Format" above). It names *which part* of the codebase the commit touches — a package, module, folder, or feature area, e.g. `server`, `blog`, `auth`, `api`. It's there so a changelog or `git log` reader can tell at a glance where a change landed without opening the diff. Press **Enter with nothing typed** to leave it out — that's what "empty" means in the example above. Skipping it is completely normal for changes that don't belong to one specific area (repo-wide config, CI, tooling), which is exactly the case in the `.gitignore` example.
- **`? Select the ISSUES type of change (optional):`** — lets you link the commit to an issue tracker entry (GitHub Issues, Jira, Linear, etc.), producing a trailer like `Closes #123` or `Refs #123` at the bottom of the commit message. `cz-git` offers a few link *types* here, generally something like `closed` (closes/resolves the issue) or `related` (just references it, doesn't close it). Selecting **"skip"** — the default — means the commit isn't linked to any issue at all, which is the right call if you're not using an issue tracker, or this particular commit doesn't correspond to a tracked ticket. There's nothing to configure ahead of time to make "skip" valid; it's always a safe choice.

In short: both prompts are safe to leave empty/skip unless you specifically want the extra metadata, and doing so (as in the example run) produces a perfectly valid conventional commit.

### Where this fits with the rest of the stack

This pairs naturally with `commitlint` (enforcing the conventional-commit *shape* on a commit-msg git hook, via `husky`) and with a `lint-staged` setup — `cz-git` produces well-formed messages interactively, while `commitlint` + a git hook is what actually *enforces* the format for commits that don't go through `cz`.

Note: `git cz` fails silently-ish with "No files added to staging! Did you forget to run git add?" if nothing is staged first — easy to forget since it doesn't look like an error at first glance.

---

## 🔗 Related Tools

- [Gitmoji](https://gitmoji.dev/) — An interactive guide to using emojis on git commit messages
- commitlint
- Commitizen (`cz-cli` + `cz-git`)
- Husky
- Conventional Commits
- Semantic Release
