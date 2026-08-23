---
title: Git Commands
description: Everyday git commands and workflows — staging, committing, branching, syncing with remotes, stashing, merging, and fixing mistakes after the fact.
sidebar_label: Git Commands
tags: [git, cli, version-control]
---

A collection of git commands and workflows I frequently reach for, from everyday staging and committing to fixing my own mistakes after the fact.

:::tip Related
For general terminal and PowerShell commands, see [Terminal Commands](./terminal-commands.md).
:::

---

## Daily Workflow

### Check Status

```powershell
git status
```

Shows staged, unstaged, and untracked files relative to the last commit.

### Stage Changes

```powershell
git add file-name
git add .
```

Stages a specific file, or `.` to stage everything in the current directory (including new/untracked files).

### View Unstaged Changes

```powershell
git diff
```

Shows line-by-line differences for changes that haven't been staged yet.

### View Staged Changes

```powershell
git diff --staged
```

Shows what's staged and about to go into the next commit — useful as a final check before committing.

### Commit Staged Changes

```powershell
git commit -m "✨ feat: add github label page"
```

### Clone a Repository

```powershell
git clone https://github.com/user/repo.git
```

---

## Syncing with a Remote

### Fetch Remote Changes (Without Merging)

```powershell
git fetch
```

Downloads new commits/branches from the remote but doesn't touch your working directory or current branch — safe to run anytime to see what's changed.

### Pull Remote Changes (Fetch + Merge)

```powershell
git pull
```

### Pull with Rebase Instead of Merge

```powershell
git pull --rebase
```

Replays your local commits on top of the latest remote commits instead of creating a merge commit — keeps history linear.

### Push Local Commits

```powershell
git push
```

### Inspect Remotes

```powershell
git remote -v
```

Lists the remotes configured for the repo (e.g. `origin`) and their URLs.

### Add a Remote

```powershell
git remote add origin https://github.com/user/repo.git
```

---

## Inspecting History

### View Commit History

```powershell
git log --oneline -10
```

Compact one-line-per-commit view of the last 10 commits.

### View History as a Graph

```powershell
git log --oneline --graph --all
```

Useful for visualizing how branches diverged and merged.

### Filter History by Author

```powershell
git log --author="Abdul Hadi Khan"
```

### Show a Specific Commit

```powershell
git show <commit-hash>
```

Displays the full diff and metadata for a single commit.

### See Who Last Changed Each Line

```powershell
git blame file-name
```

---

## Stashing

### Stash Uncommitted Changes

```powershell
git stash
```

Temporarily shelves both staged and unstaged changes, giving you a clean working directory (e.g. to switch branches without committing half-done work).

### List Stashes

```powershell
git stash list
```

### Reapply the Latest Stash

```powershell
git stash pop
```

Reapplies the most recent stash and removes it from the stash list.

### Reapply Without Removing

```powershell
git stash apply
```

### Drop a Stash

```powershell
git stash drop
```

---

## Branch Management

### Create and Switch to a New Branch

```powershell
git checkout -b new-branch-name
```

### Switch Branches

```powershell
git checkout branch-name
```

### Rename the Current Branch

```powershell
git branch -m new-branch-name
```

Renames the branch you're currently on.

### Rename a Branch You're Not On

```powershell
git branch -m old-branch-name new-branch-name
```

### Push a Renamed Branch and Update Upstream

```powershell
git push origin -u new-branch-name
git push origin --delete old-branch-name
```

Pushes the renamed branch, sets it as the upstream tracking branch, then deletes the old branch name from the remote.

### Delete a Local Branch

```powershell
git branch -d branch-name
```

Deletes the branch if it's already merged. Use `-D` (capital) to force-delete an unmerged branch.

### Delete a Remote Branch

```powershell
git push origin --delete branch-name
```

### List All Branches (Local and Remote)

```powershell
git branch -a
```

---

## Merging, Rebasing & Cherry-Picking

### Merge a Branch into the Current One

```powershell
git merge branch-name
```

Creates a merge commit combining the histories of both branches (unless a fast-forward is possible).

### Rebase the Current Branch onto Another

```powershell
git rebase branch-name
```

Replays the current branch's commits on top of `branch-name`, producing linear history instead of a merge commit.

### Resolve a Conflict During Merge/Rebase

```powershell
# after manually editing the conflicted file(s):
git add file-name
git rebase --continue
# or, if merging:
git merge --continue
```

### Abort a Rebase or Merge

```powershell
git rebase --abort
git merge --abort
```

Bails out and returns to the state before the rebase/merge started — useful if conflicts get too messy to resolve inline.

### Cherry-Pick a Specific Commit

```powershell
git cherry-pick <commit-hash>
```

Applies the changes from a single commit onto the current branch without merging the whole branch it came from.

---

## Tags

### Create a Tag

```powershell
git tag v1.0.0
```

### Push Tags to the Remote

```powershell
git push --tags
```

---

## Fixing a Forgotten Commit Message Format

The workflow for when you forget to follow the emoji + conventional-commit naming format (e.g. `♻️ refactor: ...`, `✨ feat: ...`) on your most recent commit, and need to fix it after already pushing.

### 1. Check the Last Commit

```powershell
git log --oneline -10
```

```
8306550 (HEAD -> main, origin/main, origin/HEAD) Refactor label management script for clarity
28445b8 ✨ feat: add github label page
c08e60c 🐛 fix: wrong config info in MD files
...
```

Confirm the most recent commit (`8306550`) is the one with the incorrectly formatted message, and note that it's already on `origin/main`.

### 2. Amend the Commit Message

```powershell
git commit --amend -m "♻️ refactor: refactor label management script for clarity"
```

```
[main fec9be9] ♻️ refactor: refactor label management script for clarity
 Author: Abdul Hadi Khan <ahkn63@gmail.com>
 Date: Thu Jun 25 20:19:00 2026 -0400
 1 file changed, 17 insertions(+), 4 deletions(-)
```

This rewrites the message of the last commit in place rather than creating a new one. Note that this **changes the commit hash** (`8306550` → `fec9be9`), so local history no longer matches what's on the remote.

### 3. Verify the Rewrite

```powershell
git log --oneline -10
```

```
fec9be9 (HEAD -> main) ♻️ refactor: refactor label management script for clarity
28445b8 ✨ feat: add github label page
...
```

Confirm the top commit now has the correct message and the new hash. Notice `origin/main` no longer shows next to `HEAD` — local and remote have diverged.

### 4. Push the Rewritten History

```powershell
git push --force-with-lease
```

```
To https://github.com/AbdulDevHub/Dev-Mountain.git
 + 8306550...fec9be9 main -> main (forced update)
```

Since the commit was already pushed, a normal `git push` will be rejected (non-fast-forward). `--force-with-lease` force-pushes the corrected history, but only if no one else has pushed new commits to the remote branch since your last fetch — it fails safely instead of silently overwriting someone else's work, which is what plain `git push --force` would risk.

:::caution
Only rewrite and force-push history on commits that aren't shared/relied on by others (e.g. a solo branch, or you've confirmed no one has pulled the old commit). Rewriting shared history that others have already based work on will cause conflicts for them.
:::

---

## Undoing Commits

### Undo the Last Commit, Keep Changes Staged

```powershell
git reset --soft HEAD~1
```

Removes the last commit but keeps all its changes staged, ready to re-commit (e.g. with a corrected message or split into multiple commits).

### Undo the Last Commit, Keep Changes Unstaged

```powershell
git reset HEAD~1
```

Removes the last commit and unstages its changes, but leaves them in your working directory.

### Undo the Last Commit and Discard Changes

```powershell
git reset --hard HEAD~1
```

Removes the last commit and permanently discards its changes. **Destructive** — only use if you're sure you don't need those changes.

### Revert a Commit That's Already Pushed/Shared

```powershell
git revert <commit-hash>
```

Creates a new commit that undoes the changes from `<commit-hash>`, without rewriting history. Safer than `reset`/amend for commits others may have already pulled.

### Fix Multiple Past Commit Messages (Not Just the Last One)

```powershell
git rebase -i HEAD~5
```

Opens an interactive rebase covering the last 5 commits. Mark commits as `reword` to edit their messages, `squash`/`fixup` to combine them, or `drop` to remove them entirely.

---

## Staging & Amending

### Add Forgotten Files to the Last Commit (Without Changing the Message)

```powershell
git add forgotten-file.js
git commit --amend --no-edit
```

Stages the missed file and folds it into the previous commit, keeping the existing commit message unchanged.

### Unstage a File

```powershell
git restore --staged file-name
```

### Discard Unstaged Changes to a File

```powershell
git restore file-name
```

Reverts a file in the working directory back to its last committed state, discarding uncommitted edits. **Destructive** — only use if you're sure you don't need those changes.

---

## Notes

* `git add .` stages everything in the current directory tree; use `git add -p` if you want to stage changes hunk-by-hunk instead of whole files.
* `git pull --rebase` is generally preferable on feature branches to avoid noisy merge commits; plain `git pull` is fine on branches where linear history doesn't matter as much.
* `--force-with-lease` is preferred over `--force` any time you're pushing rewritten history — it protects against overwriting commits you haven't seen yet.
* Prefer `git revert` over `git reset`/`--amend` for commits that have already been pulled by others.
* Interactive rebase (`git rebase -i`) is the general tool for cleaning up several commits at once — messages, squashing, reordering, or dropping.
* `git stash` is your friend when you need to switch branches mid-work without committing unfinished changes.
