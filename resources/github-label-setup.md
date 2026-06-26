---
title: GitHub Label Setup
description: Optimized scoped label scheme for GitHub repos, with CLI scripts to apply them in bulk or to new repos.
---

# GitHub Label Setup

A standardized, scoped label scheme for all GitHub repositories. Labels are grouped by prefix (`Status:`, `Type:`, `Priority:`, `Resolution:`) with a consistent color family per group, making issue filtering and triage significantly faster.

:::info Why not default labels?
GitHub's default labels (`bug`, `enhancement`, `wontfix`, etc.) are ungrouped, inconsistently named, and can't be set as account-wide defaults on personal accounts — only GitHub Organizations support that. The setup below works around this with two CLI scripts.
:::

---

## Label Reference

### 🔄 Status Labels

| Label | Color | Description |
|---|---|---|
| `Status: Todo` | `#D4C5F9` Light Purple | Work that is ready to be assigned or started. |
| `Status: In Progress` | `#FBCA04` Warm Yellow | Active development or investigation has begun. |
| `Status: On Hold` | `#E6E6E6` Muted Gray | Work is temporarily blocked or waiting on external factors. |
| `Status: In Review` | `#1D76DB` Bright Blue | Changes are submitted or code review is ongoing. |
| `Status: Done` | `#0E8A16` Dark Green | Work is successfully completed and merged. |

### 🏷️ Type Labels

| Label | Color | Description |
|---|---|---|
| `Type: Bug` | `#D93F0B` Deep Red | Something isn't working or throwing errors. |
| `Type: Feature` | `#A2EEEF` Light Cyan | New features, modules, or functional requests. |
| `Type: Enhancement` | `#BFD4F2` Soft Blue | Improving existing code, performance, or UI. |
| `Type: Documentation` | `#006B75` Teal | Improvements or additions to docs, READMEs, or guides. |
| `Type: Maintenance` | `#F9D0C4` Peach | Chores, refactoring, dependencies, or package updates. |

### 🚨 Priority Labels

| Label | Color | Description |
|---|---|---|
| `Priority: Critical` | `#B60205` Crimson | Main branch broken, security flaw, blocking all progress. |
| `Priority: High` | `#E11D21` Red | High-impact issue that needs immediate attention. |
| `Priority: Medium` | `#FBCA04` Yellow | Standard priority task for the current milestone. |
| `Priority: Low` | `#C5DEF5` Pale Blue | Low impact, minor annoyance, or nice-to-have. |

### 🤝 Community & Resolution Labels

| Label | Color | Description |
|---|---|---|
| `Good First Issue` | `#702D95` Purple | Approachable tasks specifically curated for newcomers. |
| `Help Wanted` | `#0052CC` Royal Blue | Core team needs extra context or external code support. |
| `Resolution: Duplicate` | `#CFD3D7` Gray | This issue or pull request already exists elsewhere. |
| `Resolution: Invalid` | `#CFD3D7` Gray | The issue is unreproducible, spam, or out of scope. |
| `Resolution: Wontfix` | `#CFD3D7` Gray | Valid issue, but consciously decided not to pursue. |

---

## Scripts

Two scripts handle the full lifecycle. Both require the [GitHub CLI](https://cli.github.com/) to be installed and authenticated (`gh auth login`).

### How the scripts work

- **Renames** the 8 matching GitHub defaults (`bug` → `Type: Bug`, `enhancement` → `Type: Enhancement`, etc.) using `gh label edit`. Because it's a rename — not a delete — every issue already tagged with the old label silently upgrades to the new name with zero data loss. This applies to both open and closed issues.
- **Deletes** the `question` label, which has no equivalent in the new scheme. Any issues tagged with it will lose that label, but the issues themselves are unaffected.
- **Creates** the 11 new labels (`Status:*`, `Priority:*`, `Type: Feature`, `Type: Maintenance`) using `--force`, so if a label already exists with the right name but the wrong color it gets corrected.
- **Never touches** any other labels you've created yourself.

:::tip Safe to re-run
Both scripts are idempotent. Running them multiple times on the same repo is harmless — renames that already happened are skipped, and `--force` on creates just updates the color/description if anything drifted.
:::

---

### `update-all-labels.sh` — Bulk update all repos

Run once to apply the label scheme across every repository in your account.

```bash
bash update-all-labels.sh
```

```bash
#!/bin/bash
# =============================================================================
# update-all-labels.sh
# Applies the optimized label scheme across ALL your personal repos.
# - Renames matching GitHub defaults to the new scoped style
# - Adds brand new Status, Type, Priority, and Resolution labels
# - Never deletes any existing labels (safe for labeled issues)
# - Uses --force so colors/descriptions are always corrected
#
# Usage: bash update-all-labels.sh
# =============================================================================

# ── Renames: "old name" "New Name" "COLOR" "Description" ─────────────────────
RENAME_OLDS=("bug" "documentation" "enhancement" "good first issue" "help wanted" "duplicate" "invalid" "wontfix")
RENAME_NEWS=("Type: Bug" "Type: Documentation" "Type: Enhancement" "Good First Issue" "Help Wanted" "Resolution: Duplicate" "Resolution: Invalid" "Resolution: Wontfix")
RENAME_COLORS=("D93F0B" "006B75" "BFD4F2" "702D95" "0052CC" "CFD3D7" "CFD3D7" "CFD3D7")
RENAME_DESCS=(
  "Something isn't working or throwing errors."
  "Improvements or additions to docs, READMEs, or guides."
  "Improving existing code, performance, or UI."
  "Approachable tasks specifically curated for newcomers."
  "Core team needs extra context or external code support."
  "This issue or pull request already exists elsewhere."
  "The issue is unreproducible, spam, or out of scope."
  "Valid issue, but consciously decided not to pursue."
)

# ── New labels to create ──────────────────────────────────────────────────────
NEW_NAMES=("Status: Todo" "Status: In Progress" "Status: On Hold" "Status: In Review" "Status: Done" "Type: Feature" "Type: Maintenance" "Priority: Critical" "Priority: High" "Priority: Medium" "Priority: Low")
NEW_COLORS=("D4C5F9" "FBCA04" "E6E6E6" "1D76DB" "0E8A16" "A2EEEF" "F9D0C4" "B60205" "E11D21" "FBCA04" "C5DEF5")
NEW_DESCS=(
  "Work that is ready to be assigned or started."
  "Active development or investigation has begun."
  "Work is temporarily blocked or waiting on external factors."
  "Changes are submitted or code review is ongoing."
  "Work is successfully completed and merged."
  "New features, modules, or functional requests."
  "Chores, refactoring, dependencies, or package updates."
  "Main branch broken, security flaw, blocking all progress."
  "High-impact issue that needs immediate attention."
  "Standard priority task for the current milestone."
  "Low impact, minor annoyance, or nice-to-have."
)

# ── Helper: pure bash case-insensitive substring check (no grep/pipe) ─────────
str_contains_icase() {
  local haystack="$1"
  local needle="$2"
  local lower_hay lower_needle
  lower_hay=$(echo "$haystack" | tr '[:upper:]' '[:lower:]')
  lower_needle=$(echo "$needle" | tr '[:upper:]' '[:lower:]')
  [[ "$lower_hay" == *"$lower_needle"* ]]
}

# ── Helper: apply labels to a single repo ────────────────────────────────────
apply_labels() {
  local repo="$1"

  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "📦 Processing: $repo"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

  # Fetch all existing label names once per repo into a plain string
  local existing_labels
  existing_labels=$(gh label list --repo "$repo" --limit 200 --json name -q '.[].name' 2>/dev/null || true)

  # 1. Delete labels with no equivalent in the new scheme
  if str_contains_icase "$existing_labels" "question"; then
    echo "  🗑️  Deleting \"question\""
    gh label delete "question" --repo "$repo" --yes 2>/dev/null || true
  fi

  # 2. Rename matching defaults
  local i
  for i in "${!RENAME_OLDS[@]}"; do
    local old_name="${RENAME_OLDS[$i]}"
    local new_name="${RENAME_NEWS[$i]}"
    local color="${RENAME_COLORS[$i]}"
    local desc="${RENAME_DESCS[$i]}"

    if str_contains_icase "$existing_labels" "$old_name"; then
      echo "  ✏️  Renaming \"$old_name\" → \"$new_name\""
      gh label edit "$old_name" \
        --name "$new_name" \
        --color "$color" \
        --description "$desc" \
        --repo "$repo" 2>/dev/null || echo "  ⚠️  Could not rename \"$old_name\" (skipping)"
    fi
  done

  # 3. Create / force-update new labels
  for i in "${!NEW_NAMES[@]}"; do
    local name="${NEW_NAMES[$i]}"
    local color="${NEW_COLORS[$i]}"
    local desc="${NEW_DESCS[$i]}"
    echo "  ➕ Creating \"$name\""
    gh label create "$name" \
      --color "$color" \
      --description "$desc" \
      --repo "$repo" \
      --force 2>/dev/null || true
  done

  echo "  ✅ Done."
}

# ── Main ──────────────────────────────────────────────────────────────────────
echo "🔍 Fetching your repositories..."
repos=$(gh repo list --limit 200 --no-archived --json nameWithOwner -q '.[].nameWithOwner')

repo_count=$(echo "$repos" | wc -l | tr -d ' ')
echo "📋 Found $repo_count repositories. Starting label update..."

for repo in $repos; do
  apply_labels "$repo"
done

echo ""
echo "🎉 All $repo_count repositories updated successfully!"
```

---

### `init-labels.sh` — Initialize a single new repo

Run this every time you create a new repository. GitHub doesn't support account-wide default labels for personal accounts, so this is the workaround.

```bash
bash init-labels.sh AbdulDevHub/my-new-repo
```

```bash
#!/bin/bash
# =============================================================================
# init-labels.sh
# Applies the optimized label scheme to a SINGLE repository.
# Run this whenever you create a new repo.
#
# Usage: bash init-labels.sh <owner/repo>
# Example: bash init-labels.sh AbdulDevHub/my-new-project
# =============================================================================

if [[ $# -ne 1 ]]; then
  echo "❌ Usage: bash init-labels.sh <owner/repo>"
  echo "   Example: bash init-labels.sh AbdulDevHub/my-new-project"
  exit 1
fi

REPO="$1"

if ! gh repo view "$REPO" &>/dev/null; then
  echo "❌ Repository \"$REPO\" not found or you don't have access."
  exit 1
fi

# ── Renames ───────────────────────────────────────────────────────────────────
RENAME_OLDS=("bug" "documentation" "enhancement" "good first issue" "help wanted" "duplicate" "invalid" "wontfix")
RENAME_NEWS=("Type: Bug" "Type: Documentation" "Type: Enhancement" "Good First Issue" "Help Wanted" "Resolution: Duplicate" "Resolution: Invalid" "Resolution: Wontfix")
RENAME_COLORS=("D93F0B" "006B75" "BFD4F2" "702D95" "0052CC" "CFD3D7" "CFD3D7" "CFD3D7")
RENAME_DESCS=(
  "Something isn't working or throwing errors."
  "Improvements or additions to docs, READMEs, or guides."
  "Improving existing code, performance, or UI."
  "Approachable tasks specifically curated for newcomers."
  "Core team needs extra context or external code support."
  "This issue or pull request already exists elsewhere."
  "The issue is unreproducible, spam, or out of scope."
  "Valid issue, but consciously decided not to pursue."
)

# ── New labels ────────────────────────────────────────────────────────────────
NEW_NAMES=("Status: Todo" "Status: In Progress" "Status: On Hold" "Status: In Review" "Status: Done" "Type: Feature" "Type: Maintenance" "Priority: Critical" "Priority: High" "Priority: Medium" "Priority: Low")
NEW_COLORS=("D4C5F9" "FBCA04" "E6E6E6" "1D76DB" "0E8A16" "A2EEEF" "F9D0C4" "B60205" "E11D21" "FBCA04" "C5DEF5")
NEW_DESCS=(
  "Work that is ready to be assigned or started."
  "Active development or investigation has begun."
  "Work is temporarily blocked or waiting on external factors."
  "Changes are submitted or code review is ongoing."
  "Work is successfully completed and merged."
  "New features, modules, or functional requests."
  "Chores, refactoring, dependencies, or package updates."
  "Main branch broken, security flaw, blocking all progress."
  "High-impact issue that needs immediate attention."
  "Standard priority task for the current milestone."
  "Low impact, minor annoyance, or nice-to-have."
)

# ── Helper: pure bash case-insensitive substring check (no grep/pipe) ─────────
str_contains_icase() {
  local haystack="$1"
  local needle="$2"
  local lower_hay lower_needle
  lower_hay=$(echo "$haystack" | tr '[:upper:]' '[:lower:]')
  lower_needle=$(echo "$needle" | tr '[:upper:]' '[:lower:]')
  [[ "$lower_hay" == *"$lower_needle"* ]]
}

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📦 Initializing labels for: $REPO"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Fetch existing labels once
existing_labels=$(gh label list --repo "$REPO" --limit 200 --json name -q '.[].name' 2>/dev/null || true)

# 1. Delete labels with no equivalent in the new scheme
if str_contains_icase "$existing_labels" "question"; then
  echo "  🗑️  Deleting \"question\""
  gh label delete "question" --repo "$REPO" --yes 2>/dev/null || true
fi

# 2. Rename matching defaults
for i in "${!RENAME_OLDS[@]}"; do
  old_name="${RENAME_OLDS[$i]}"
  new_name="${RENAME_NEWS[$i]}"
  color="${RENAME_COLORS[$i]}"
  desc="${RENAME_DESCS[$i]}"

  if str_contains_icase "$existing_labels" "$old_name"; then
    echo "  ✏️  Renaming \"$old_name\" → \"$new_name\""
    gh label edit "$old_name" \
      --name "$new_name" \
      --color "$color" \
      --description "$desc" \
      --repo "$REPO" 2>/dev/null || echo "  ⚠️  Could not rename \"$old_name\" (skipping)"
  fi
done

# 3. Create / force-update new labels
for i in "${!NEW_NAMES[@]}"; do
  name="${NEW_NAMES[$i]}"
  color="${NEW_COLORS[$i]}"
  desc="${NEW_DESCS[$i]}"
  echo "  ➕ Creating \"$name\""
  gh label create "$name" \
    --color "$color" \
    --description "$desc" \
    --repo "$REPO" \
    --force 2>/dev/null || true
done

echo ""
echo "✅ Labels initialized for $REPO!"
```

---

## Notes

- **Archived repos are skipped** by the bulk script (`--no-archived` flag).
- **Forks are skipped** — the `gh repo list` call omits them since you don't own those repos.
- **Windows Git Bash quirk:** avoid `echo "..." | grep` patterns in any bash scripts you run through Git Bash on Windows. The pipe crashes when `grep` exits with code 1 (no match). Use pure bash string matching (`[[ "$var" == *"$needle"* ]]`) instead.
- **The `--limit 200` flag** on `gh repo list` and `gh label list` ensures the scripts won't silently truncate if you grow past 36 repos or a repo grows past the default limit.
