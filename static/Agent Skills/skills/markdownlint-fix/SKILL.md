---
name: markdownlint-fix
description: Fix or suppress markdownlint warnings in a project. Use this skill whenever the user mentions markdownlint warnings, markdown linting errors, or asks to set up/configure markdownlint for a project. Also trigger when the user mentions specific rule codes like MD033, MD041, MD045, MD059, MD036, or asks to configure .vscode/settings.json for markdown. Trigger even if they just say "my README has lint warnings" or "fix markdown warnings". This skill handles both auto-fixing issues in Markdown files where it makes sense AND configuring the project's markdownlint settings to suppress rules that can't or shouldn't be auto-fixed.
---

# Markdownlint Fix Skill

This skill handles markdownlint warnings in a project by doing two things:
1. **Auto-fixing** issues in Markdown files where a code change is clean and correct
2. **Suppressing via config** rules that are stylistic, impractical to fix, or already correctly used

---

## Step 1: Discover the project

Before doing anything, understand what's in the project:

```bash
# Find all Markdown files
find . -name "*.md" -not -path "*/node_modules/*" -not -path "*/.git/*"

# Check if markdownlint config already exists
ls -la .markdownlint* .vscode/settings.json 2>/dev/null || echo "No config found"
```

If no Markdown files are found, tell the user and stop.

---

## Step 2: Identify which warnings are present

The user may have already listed them. If not, try to run markdownlint:

```bash
# Try npx markdownlint-cli2 first, then markdownlint-cli
npx --yes markdownlint-cli2 "**/*.md" 2>&1 | head -80 \
  || npx --yes markdownlint "**/*.md" 2>&1 | head -80
```

Parse the output to get a list of unique rule codes (e.g. MD033, MD041, MD045).

---

## Step 3: Apply the decision matrix

For each rule, decide: **auto-fix the Markdown** or **suppress in config**.

### Rules to AUTO-FIX in the Markdown file

| Rule | What to fix |
|------|-------------|
| **MD041** first-line-h1 | Add `# <Title>` as the very first line of the file. Infer the title from the filename or the first heading found in the file. |
| **MD045** no-alt-text | Add descriptive alt text to every `![](url)` image tag. Infer from surrounding context, the filename, or use a generic descriptive label. |
| **MD059** descriptive-link-text | Replace non-descriptive link text (`click here`, `here`, `link`, `this`, bare URLs) with descriptive text inferred from the URL or surrounding context. |
| **MD036** no-emphasis-as-heading | Convert `**Bold text**` used as a standalone paragraph (acting as a heading) to a proper `### Heading`. Choose the heading level based on context. |

**How to auto-fix:**
- Read each Markdown file that has warnings
- Make targeted edits — do not reformat unrelated content
- Preserve all existing content; only change the flagged patterns
- After fixing, briefly summarize what was changed in each file

### Rules to SUPPRESS in config

| Rule | Why suppress |
|------|--------------|
| **MD033** no-inline-html | HTML tags are commonly needed in READMEs for layouts, badges, images with sizing, etc. Suppress with an `allowed_elements` list. |
| Any rule the user explicitly says they don't want to fix | User preference wins. |
| Rules that would require restructuring large amounts of existing content | Practical tradeoff — suppressing is better than mass rewrites. |

---

## Step 4: Write/update the VSCode settings

### MD033: Build the allowed_elements list dynamically

Do NOT use a hardcoded list. Instead, scan all Markdown files to discover which HTML tags are actually used, then allow exactly those:

```bash
# Extract every unique HTML tag name present in the Markdown files
grep -hoPi '<\K[a-z][a-z0-9]*(?=[\s>/])' **/*.md 2>/dev/null \
  | sort -u
```

Use the resulting tag names as the `allowed_elements` list. This way the config reflects the project's real usage — no more, no less. If a tag appears in the files, it belongs in the allowlist. If it doesn't, it shouldn't be there.

Example: if the files contain `<img>`, `<br>`, and `<div>` tags, the config should be:

```json
{
  "markdownlint.config": {
    "MD033": {
      "allowed_elements": ["br", "div", "img"]
    }
  }
}
```

### Merging rules

Create or merge into `.vscode/settings.json`:
- If `.vscode/settings.json` already exists, read it first and merge — never overwrite unrelated settings
- If the project has a `.markdownlint.json` or `.markdownlintrc` at the root, add suppressions there instead (or in addition, depending on what already exists)
- Prefer `.vscode/settings.json` for workspace-scoped suppression

To suppress additional rules (e.g. MD036 if the user prefers not to fix):
```json
{
  "markdownlint.config": {
    "MD033": {
      "allowed_elements": ["br", "div", "img"]
    },
    "MD036": false
  }
}
```

---

## Step 5: Report what was done

After completing, give the user a clear summary:

```
## Markdownlint fixes applied

### Auto-fixed in Markdown files
- README.md
  - MD041: Added `# Project Name` as first line
  - MD045: Added alt text to 3 images
  - MD059: Updated 2 links with descriptive text
  - MD036: Converted 1 bold-as-heading to `### Installation`

### Suppressed via .vscode/settings.json
- MD033: Allowed HTML elements (discovered in files): br, div, img

### No action needed
- (list any rules that were already fine or not found)
```

If any warnings couldn't be resolved (e.g. ambiguous context for alt text), flag them explicitly and ask the user for input.

---

## Edge cases

- **Multiple Markdown files**: Apply fixes to all of them, not just README.md
- **Already has markdownlint config**: Merge, don't replace
- **User only wants suppression, no file edits**: Respect that — only touch the config
- **User only wants file fixes, no config changes**: Respect that too
- **Ambiguous alt text**: If you can't infer a good description from context, use the image filename (minus extension, with hyphens replaced by spaces) as a fallback, and note it
- **MD036 in the middle of content**: Only convert to heading if it's genuinely acting as a section title; if it's emphasis for emphasis's sake, leave it and suppress the rule instead

---

## Notes on common projects

For typical GitHub READMEs:
- MD041 fix: use the repo/project name as the H1
- MD033 suppress: almost always needed (badges, HTML formatting)
- MD045: images in READMEs are often badges or screenshots — alt text like "Build status", "License badge", or "Screenshot of the dashboard" is appropriate

For documentation sites (docs/, wiki/):
- Files may intentionally start without H1 (nav handles titles) — consider suppressing MD041 instead of fixing
- Link text fixes are almost always worthwhile

For CHANGELOG.md / CONTRIBUTING.md / LICENSE.md:
- These have conventional formats — be conservative about structural changes
- Prefer suppression over restructuring these files