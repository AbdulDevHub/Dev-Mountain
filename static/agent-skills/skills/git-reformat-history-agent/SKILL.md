---
name: git-reformat-history-agent
description: 'Reformat ALL existing git commit messages in a repo to use conventional commits + gitmoji style. Use when the user asks to "reformat commit history", "fix all commit messages", "update git history to use emojis/conventional commits", or says "/reformat-commits". This skill handles the full rewrite autonomously: reading history, inferring types from diffs, generating a rebase script, and executing it. Designed for AI agents with terminal access. Single-author repos only — rewrites all commits including already-pushed ones (requires force push).'
license: MIT
allowed-tools: Bash
---

# Git Reformat History (Agent Version)

## Overview

Rewrite every commit message in the repo's history to follow Conventional Commits + Gitmoji format. This does **not** change file contents, dates, or authorship — only the commit messages. Hashes will change (expected and acceptable).

## Commit Type Reference

| Emoji | Type       | When to use / file signals                                      |
|-------|------------|-----------------------------------------------------------------|
| ✨    | `feat`     | New files, new pages, new components, new features             |
| 🐛    | `fix`      | Bug fixes, typo corrections, broken behavior                   |
| 📝    | `docs`     | `.md`, `.mdx`, `.txt`, README, guides, documentation files     |
| 💄    | `style`    | CSS, color changes, formatting, visual-only tweaks             |
| ♻️    | `refactor` | Renames, restructures, folder moves with no feature change     |
| ⚡️    | `perf`     | Performance improvements                                        |
| 🧪    | `test`     | Test files added or updated                                     |
| 📦    | `assets`   | Images, gifs, fonts, PDFs, binary assets uploaded              |
| 💚    | `ci`       | CI config, GitHub Actions, workflows                           |
| 🔧    | `chore`    | Config files, lockfiles, package.json, tooling, misc           |
| ⏪    | `revert`   | Reverts a previous commit                                       |

**Scope** (optional): area of the codebase affected, e.g. `about`, `resources`, `assets`, `deps`

**Format**: `<emoji> <type>(<scope>): <description in lowercase imperative>`

---

## Workflow

### Step 1 — Gather full commit history

```bash
git log --format="%H %s"
```

Skip any commits whose message already starts with an emoji + conventional commit format. Only reformat the rest.

### Step 2 — Capture the origin URL before rewriting

`git-filter-repo` removes the `origin` remote as a safety measure. Capture the URL first so you can re-add it:

```bash
git remote get-url origin
```

Store this — you'll need it in Step 5.

### Step 3 — For each commit, inspect the diff to infer type/scope

```bash
git show --stat <hash>
```

Use file paths and extensions to infer the best type:
- `.css`, `color`, `style` in message → `💄 style`
- `.md`, `.mdx`, `.txt` → `📝 docs`
- `.png`, `.gif`, `.jpg`, `.pdf` → `📦 assets`
- rename, move, folder restructure → `♻️ refactor`
- new page/feature file → `✨ feat`
- vague/unclassifiable → `🔧 chore` as fallback

**Never ask the user for clarification.** Always pick the best guess.

### Step 4 — Write and run the rewrite script

Write this Python script to a temp file and execute it. **Do not use `git filter-branch`** — it breaks on Windows due to backslash escaping in temp paths. Always use `git-filter-repo`.

```python
import subprocess, json, os, tempfile

COMMIT_MAP = {
    # "<hash>": "<new message>",
    # ... fill in all commits
}

ORIGIN_URL = "<captured in step 2>"

# Forward slashes required — avoids Windows unicode escape errors
map_path = os.path.join(tempfile.gettempdir(), "commit_map.json").replace("\\", "/")
with open(map_path, "w", encoding="utf-8") as f:
    json.dump(COMMIT_MAP, f, ensure_ascii=False)

# Write callback to a file — never inline it (quoting breaks on Windows)
callback_path = os.path.join(tempfile.gettempdir(), "msg_callback.py").replace("\\", "/")
with open(callback_path, "w", encoding="utf-8") as f:
    f.write(f"""\
import json

with open(r"{map_path}", encoding="utf-8") as fh:
    m = json.load(fh)

# Use commit.original_id and commit.message — NOT bare 'message' variable (causes UnboundLocalError)
original_hash = commit.original_id.decode("utf-8") if commit.original_id else None
current_msg = commit.message.decode("utf-8", errors="replace").strip()
new_msg = m.get(original_hash, current_msg)
commit.message = (new_msg + "\\n").encode("utf-8")
""")

env = os.environ.copy()
env["FILTER_BRANCH_SQUELCH_WARNING"] = "1"

result = subprocess.run(
    ["git", "filter-repo", "--force", "--commit-callback",
     open(callback_path, encoding="utf-8").read()],
    env=env, text=True,
)

if result.returncode == 0:
    subprocess.run(["git", "remote", "add", "origin", ORIGIN_URL])
    print("✅ Done.")
else:
    print("❌ Failed — check output above.")
```

If `git-filter-repo` is not installed:
```bash
pip install git-filter-repo
```

### Step 5 — Force push

```bash
git push --force origin main
```

### Step 6 — Verify

```bash
git log --oneline -10
```

Confirm the top commits show the correct emoji + type format and report back to the user.

---

## Safety Rules

- NEVER modify file contents — messages only
- NEVER change `--author` or `--date` fields
- NEVER use `git filter-branch` — use `git-filter-repo` exclusively
- NEVER pass the callback as an inline string — always write to a temp file
- ALWAYS capture `origin` URL before running and re-add it after
- ALWAYS show a dry-run preview (old → new table) before executing