---
id: git-cheatsheet
title: Git & GitHub
sidebar_label: Git & GitHub
sidebar_position: 1
description: Personal reference on Git fundamentals, workflows, and GitHub-specific special files and features.
tags: [git, github, version-control, ci-cd]
---

Personal knowledge dump on Git and GitHub. Written so future-me doesn't have to relearn this from scratch.

## What Git Actually Is

Git is a **distributed version control system (DVCS)**. Every clone of a repo is a full copy of the history, not just a pointer to a central server. This is why you can commit, branch, and view history entirely offline — the "remote" (e.g. GitHub) is just another copy you sync with, not a database you're constantly talking to.

Git tracks **snapshots**, not diffs. Every commit is a full snapshot of the tracked files (internally deduplicated via content hashing), which is different from older VCS tools (like SVN) that store changesets.

## Core Concepts

| Term | Meaning |
|---|---|
| **Working directory** | The actual files on disk you're editing |
| **Staging area (index)** | A holding zone for changes you're about to commit (`git add`) |
| **Repository (.git folder)** | The database of commits, branches, tags, config |
| **Commit** | A snapshot + metadata (author, message, parent commit(s), hash) |
| **Branch** | A movable pointer to a commit — lightweight, just a 41-byte file |
| **HEAD** | Pointer to the commit/branch you currently have checked out |
| **Remote** | A named reference to another copy of the repo (usually `origin`) |

Mental model: `working directory → (git add) → staging area → (git commit) → repository → (git push) → remote`

## Everyday Commands

```bash
git init                      # create a new repo
git clone <url>                # copy a remote repo locally
git status                     # what's changed / staged / untracked
git add <file>                 # stage a file
git add -p                     # stage interactively, hunk by hunk (very useful)
git commit -m "message"        # commit staged changes
git commit -am "message"       # stage + commit tracked files in one step (skips new files)
git push                       # send commits to remote
git pull                       # fetch + merge from remote
git fetch                      # download remote changes WITHOUT merging (safer than pull)
```

`git pull` = `git fetch` + `git merge`. When in doubt, prefer `fetch` then look at what changed before merging.

## Branching & Merging

```bash
git branch                     # list local branches
git branch <name>              # create a branch
git switch <name>               # move to a branch (modern replacement for checkout)
git switch -c <name>            # create + switch in one step
git checkout <name>             # older way to switch branches (also used for files)
git merge <branch>               # merge <branch> into current branch
git rebase <branch>              # replay current branch's commits on top of <branch>
```

### Merge vs Rebase

- **Merge** creates a new "merge commit" that ties two histories together. Non-destructive, preserves exact history, but the log gets messy with lots of merge commits.
- **Rebase** rewrites your branch's commits so they appear to start from the tip of the target branch. Produces a clean, linear history, but it **rewrites commit hashes** — never rebase commits that have already been pushed and shared with others.

Rule of thumb: rebase your own local/feature branch to keep it tidy before opening a PR; merge (not rebase) once it's shared/public.

```bash
git rebase -i HEAD~3            # interactive rebase: squash/reorder/edit last 3 commits
```

### Merge Conflicts

Happens when Git can't auto-merge because both sides changed the same lines. Git marks the file with conflict markers:

```
<<<<<<< HEAD
your version
=======
their version
>>>>>>> branch-name
```

Edit the file to resolve, remove the markers, then:

```bash
git add <file>
git commit          # (or `git rebase --continue` if mid-rebase)
```

To bail out entirely: `git merge --abort` or `git rebase --abort`.

## Undoing Things

This is the part everyone forgets and has to re-Google. Cheat sheet:

| Situation | Command |
|---|---|
| Unstage a file (keep changes) | `git restore --staged <file>` |
| Discard uncommitted changes to a file | `git restore <file>` |
| Amend the last commit (message or add files) | `git commit --amend` |
| Undo last commit, keep changes staged | `git reset --soft HEAD~1` |
| Undo last commit, keep changes unstaged | `git reset HEAD~1` (mixed, default) |
| Undo last commit, **discard** changes entirely | `git reset --hard HEAD~1` ⚠️ destructive |
| Undo a commit that's already pushed/shared | `git revert <commit>` (creates a new "undo" commit — safe for shared history) |
| Temporarily shelve changes | `git stash` then later `git stash pop` |
| Recover a "lost" commit | `git reflog` (shows every HEAD movement, even after reset --hard) |

**`reset` vs `revert`**: `reset` rewrites history (dangerous on shared branches). `revert` adds a new commit that undoes changes (safe anywhere, preferred once pushed).

`git reflog` is the safety net — almost nothing in Git is truly lost until garbage collection runs, because the reflog remembers where HEAD has been.

## Inspecting History

```bash
git log                        # commit history
git log --oneline --graph --all   # compact visual history, very useful
git diff                       # unstaged changes vs last commit
git diff --staged              # staged changes vs last commit
git show <commit>               # what a specific commit changed
git blame <file>                # who last touched each line
```

## Remotes & Tags

```bash
git remote -v                  # list remotes
git remote add origin <url>     # add a remote
git tag v1.0.0                  # lightweight tag
git tag -a v1.0.0 -m "message"  # annotated tag (preferred — stores author/date/message)
git push origin v1.0.0          # tags don't push automatically, must be explicit
git push --tags                # push all tags
```

Tags are typically used to mark release points (`v1.2.0`) and often trigger GitHub Actions release workflows.

## .gitignore

Tells Git which files to never track (build artifacts, `node_modules`, `.env`, OS junk files like `.DS_Store`). Patterns:

```gitignore
node_modules/
*.log
.env
dist/
!dist/keep-this.txt   # negate a pattern (un-ignore)
```

If a file is already tracked, adding it to `.gitignore` won't untrack it — you need `git rm --cached <file>` first.

GitHub maintains a good set of starter templates: [github.com/github/gitignore](https://github.com/github/gitignore).

## Commit Message Conventions

Loosely following [Conventional Commits](https://www.conventionalcommits.org/) makes history and changelogs much more useful:

```
feat: add user authentication
fix: correct off-by-one error in pagination
docs: update README install steps
refactor: extract validation logic into helper
chore: bump dependencies
```

Common types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `ci`. Tools like `semantic-release` can auto-version and auto-changelog based on these prefixes.

## Common Branching Workflows

- **Feature branch workflow**: every change gets its own branch off `main`, merged via PR. Simple, works for most teams.
- **Trunk-based development**: short-lived branches, merged into `main` very frequently (often daily), relies heavily on feature flags. Favored for CI/CD-heavy teams.
- **Git Flow**: `main` + `develop` + `feature/*` + `release/*` + `hotfix/*` branches. More ceremony, common in projects with scheduled releases rather than continuous deployment.

## Useful Config

```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
git config --global init.defaultBranch main
git config --global core.editor "code --wait"
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.lg "log --oneline --graph --all"
```

---

## GitHub Special Files & Pages

GitHub looks for certain filenames/paths in a repo and gives them special treatment in the UI or CI. None of these are "Git" features — they're **GitHub** (the platform) conventions layered on top.

### README.md

The front door of the repo. Rendered automatically on the repo's home page. Placed at the root (or `.github/`, or `docs/` as fallbacks). Good READMEs typically include:

- What the project does (one paragraph, no fluff)
- Install/setup instructions
- Basic usage example
- Badges (build status, coverage, npm version, license) — usually via [shields.io](https://shields.io)
- Link to contribution guide / license

### CONTRIBUTING.md

Guidelines for contributors. When present, GitHub links to it automatically whenever someone opens an issue or PR ("By submitting this PR, you agree to follow our Contributing Guidelines"). Typically covers:

- Dev environment setup
- Branch naming / commit message conventions
- How to run tests
- PR review process / who to tag

Can live at the root, in `.github/`, or in `docs/`.

### CODE_OF_CONDUCT.md

Community behavior expectations. GitHub surfaces it in a repo's "Community" tab and often auto-suggests the [Contributor Covenant](https://www.contributor-covenant.org/) template when creating one via the GitHub UI.

### LICENSE (or LICENSE.md)

Determines the legal terms for reuse. GitHub auto-detects common licenses (MIT, Apache-2.0, GPL-3.0, etc.) and displays a summary badge at the top of the repo. No LICENSE file = default copyright applies, meaning **no one else has legal permission to use the code**, even though it's publicly visible.

### SECURITY.md

Explains how to responsibly report vulnerabilities (rather than opening a public issue). GitHub surfaces a "Report a vulnerability" button in the Security tab when this exists, and can link to GitHub's private vulnerability reporting flow.

### CODEOWNERS

Path: `.github/CODEOWNERS`, `CODEOWNERS`, or `docs/CODEOWNERS`. Automatically requests review from the listed owner(s) when a PR touches matching paths.

```
# .github/CODEOWNERS
*.js       @frontend-team
/api/      @backend-team
/docs/     @doc-writers
```

### FUNDING.yml

Path: `.github/FUNDING.yml`. Adds a "Sponsor" button to the repo, linking to GitHub Sponsors, Open Collective, Patreon, Ko-fi, etc.

```yaml
github: [your-username]
open_collective: your-project
```

### Issue & PR Templates

Path: `.github/ISSUE_TEMPLATE/` (folder of `.md` or `.yml` files) and `.github/PULL_REQUEST_TEMPLATE.md`. Pre-fills the form when someone opens a new issue/PR. The `.yml` format supports structured forms (dropdowns, required fields) rather than plain markdown.

```yaml
# .github/ISSUE_TEMPLATE/bug_report.yml
name: Bug Report
description: File a bug report
body:
  - type: textarea
    id: what-happened
    attributes:
      label: What happened?
    validations:
      required: true
```

### Dependabot Config

Path: `.github/dependabot.yml`. Automates dependency update PRs.

```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
```

### GitHub Pages

Turns a repo (or a specific branch/folder, commonly `gh-pages` or `docs/`) into a static website hosted at `username.github.io/repo`. Can be configured under **Settings → Pages**, or built via a GitHub Action that deploys to the `gh-pages` branch — this is actually how Docusaurus sites are commonly published.

### GitHub Actions

Path: `.github/workflows/*.yml`. GitHub's built-in CI/CD — each `.yml` file is a **workflow** made of **jobs**, each job made of **steps**, each step either running a shell command or invoking a reusable **action** (from the Marketplace or your own repo).

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm test
```

Key building blocks:

| Concept | Notes |
|---|---|
| `on:` | Trigger — `push`, `pull_request`, `schedule` (cron), `workflow_dispatch` (manual button), `release`, etc. |
| `jobs:` | Run in parallel by default; use `needs:` to sequence them |
| `runs-on:` | The runner OS/image (`ubuntu-latest`, `macos-latest`, `windows-latest`, or self-hosted) |
| `steps:` | Sequential within a job; either `uses:` (an action) or `run:` (shell command) |
| `secrets.*` | Encrypted values set in **Settings → Secrets and variables**, referenced as `${{ secrets.MY_TOKEN }}` |
| `matrix:` | Run the same job across multiple versions/OSes in parallel |

Example matrix build:

```yaml
strategy:
  matrix:
    node-version: [18, 20, 22]
steps:
  - uses: actions/setup-node@v4
    with:
      node-version: ${{ matrix.node-version }}
```

Common use cases: run tests/linters on every PR, auto-deploy on merge to `main`, publish a package on tag push, auto-label issues, close stale issues, build & deploy a Docusaurus site to GitHub Pages.

### .github/ folder summary

A tidy way to think about it — almost everything GitHub-specific lives under `.github/` to keep the repo root clean:

```
.github/
├── workflows/
│   └── ci.yml
├── ISSUE_TEMPLATE/
│   ├── bug_report.yml
│   └── feature_request.yml
├── PULL_REQUEST_TEMPLATE.md
├── CODEOWNERS
├── FUNDING.yml
└── dependabot.yml
```

Root-level (also commonly checked by GitHub, don't need to be in `.github/`):

```
README.md
LICENSE
CONTRIBUTING.md
CODE_OF_CONDUCT.md
SECURITY.md
.gitignore
```

## Further Reading

- [Pro Git book (free)](https://git-scm.com/book/en/v2) — the canonical deep reference
- [GitHub Docs: About .github](https://docs.github.com/en/communities) — community health files
- [GitHub Actions documentation](https://docs.github.com/en/actions)
