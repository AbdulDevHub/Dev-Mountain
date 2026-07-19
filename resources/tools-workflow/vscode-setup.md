---
title: VS Code Setup
description: My VS Code settings, themes, extensions, and customization preferences
---

This page documents my VS Code configuration, including editor preferences, formatting rules, themes, icons, terminal behavior, and custom color overrides.

---

## Theme Overview

### Icon Themes

```json
{
  "workbench.iconTheme": "material-icon-theme",
  "workbench.productIconTheme": "material-product-icons"
}
```

**Extensions Used**

* Material Icon Theme
* Material Product Icons

---

## Purple Accent Theme

Primary accent color:

```text
#8500cc
```

Secondary accents:

```text
#7900bb
#8700d3
#c457ff
#d485ff
#a600ff44
```

### Custom UI Colors

```json
{
  "button.background": "#8500cc",
  "button.hoverBackground": "#7900bb",
  "focusBorder": "#8500cc",
  "badge.background": "#8500cc",
  "progressBar.background": "#8500cc",
  "activityBar.activeBorder": "#8500cc",
  "activityBarBadge.background": "#8500cc",
  "panelTitle.activeBorder": "#8500cc",
  "menu.selectionBackground": "#8500cc",
  "statusBar.debuggingBackground": "#8500cc"
}
```

### Link Colors

```json
{
  "textLink.foreground": "#d485ff",
  "textLink.activeForeground": "#c457ff"
}
```

### Selection Colors

```json
{
  "editor.selectionBackground": "#44475A",
  "list.activeSelectionBackground": "#a600ff44",
  "pickerGroup.border": "#a600ff44"
}
```

### Terminal Colors

```json
{
  "terminal.ansiBrightGreen": "#00eea2",
  "terminal.ansiBrightBlue": "#c457ff",
  "terminalCommandDecoration.successBackground": "#00eea2"
}
```

---

## Editor Preferences

### Linked Editing

Automatically rename matching HTML/JSX tags.

```json
{
  "editor.linkedEditing": true
}
```

### Inline Suggestions

```json
{
  "editor.inlineSuggest.suppressSuggestions": true
}
```

### Diff Editor

```json
{
  "diffEditor.ignoreTrimWhitespace": false
}
```

---

## Formatting

### Prettier

```json
{
  "prettier.semi": false
}
```

### Default Formatters

| Language         | Formatter                      |
| ---------------- | ------------------------------ |
| JavaScript       | esbenp.prettier-vscode         |
| JavaScript React | esbenp.prettier-vscode         |
| TypeScript       | esbenp.prettier-vscode         |
| TypeScript React | esbenp.prettier-vscode         |
| HTML             | esbenp.prettier-vscode         |
| CSS              | esbenp.prettier-vscode         |
| Vue              | esbenp.prettier-vscode         |
| JSONC            | esbenp.prettier-vscode         |
| JSON             | vscode.json-language-features  |
| Markdown         | DavidAnson.vscode-markdownlint |
| XML              | redhat.vscode-xml              |
| Liquid           | sissel.shopify-liquid          |

---

## Terminal Configuration

### Send Keybindings to Shell

```json
{
  "terminal.integrated.sendKeybindingsToShell": true
}
```

### Terminal Suggestions

```json
{
  "terminal.integrated.suggest.enabled": true
}
```

### Code Runner

```json
{
  "code-runner.runInTerminal": true
}
```

---

## Vim Extension

```json
{
  "vim.cursorStylePerMode.normal": "line",
  "vim.startInInsertMode": true
}
```

---

## AI & Productivity

### Codeium

```json
{
  "codeium.enableConfig": {
    "*": true,
    "plaintext": true,
    "properties": true,
    "markdown": true
  }
}
```

### Chat Instructions

Automatically loads custom instruction files from:

```text
.github/instructions
```

Plus temporary Postman-generated instruction files.

---

## Remote Development

```json
{
  "remote.autoForwardPortsSource": "hybrid"
}
```

---

## Sidebar Preferences

```json
{
  "workbench.secondarySideBar.defaultVisibility": "hidden"
}
```

---

## Prisma

Disable Prisma Data Platform notifications:

```json
{
  "prisma.showPrismaDataPlatformNotification": false
}
```

---

## Custom Dictionary

Words added to cSpell:

```text
COURSERA
editability
favourite
Favourited
freemium
Hackathon
Hadi
INACTVE
KAHOOT
Matplotlib
Photoshop
pygame
QUIZLET
skyfall
SOCRATIVE
strech
Studica
Subpages
Tkinter
vercel
Vuetify
Wireframe
```

---

## YAML Schemas

Bitbucket Pipelines schema:

```json
{
  "yaml.schemas": {
    "...pipelines-schema.json": "bitbucket-pipelines.yml"
  }
}
```

---

## Installed Extensions

Full list via `code --list-extensions`:

```text
anthropic.claude-code
bradlc.vscode-tailwindcss
catppuccin.catppuccin-vsc
codeium.codeium
coderabbit.coderabbit-vscode
davidanson.vscode-markdownlint
dbaeumer.vscode-eslint
dsznajder.es7-react-js-snippets
esbenp.prettier-vscode
formulahendry.auto-rename-tag
github.codespaces
github.remotehub
mechatroner.rainbow-csv
ms-azuretools.vscode-containers
ms-python.debugpy
ms-python.python
ms-python.vscode-pylance
ms-python.vscode-python-envs
ms-vscode-remote.remote-containers
ms-vscode-remote.remote-ssh
ms-vscode-remote.remote-ssh-edit
ms-vscode.remote-explorer
ms-vscode.remote-repositories
ms-vsliveshare.vsliveshare
pkief.material-icon-theme
pkief.material-product-icons
postman.postman-for-vscode
ritwickdey.liveserver
saoudrizwan.claude-dev
snyk-security.snyk-vulnerability-scanner
streetsidesoftware.code-spell-checker
tomoki1207.pdf
usernamehw.errorlens
```

To restore on a new machine:

```powershell
code --list-extensions | % { code --install-extension $_ }
```

(On macOS/Linux, save the list to a file and loop over it with `xargs -n 1 code --install-extension`.)

---

## Keybindings

Custom overrides in `keybindings.json`:

```json
[
  {
    "key": "ctrl+m",
    "command": "editor.emmet.action.balanceOut"
  },
  {
    "key": "ctrl+shift+u",
    "command": "editor.action.transformToUppercase",
    "when": "editorTextFocus"
  },
  {
    "key": "ctrl+shift+l",
    "command": "editor.action.transformToLowercase",
    "when": "editorTextFocus"
  }
]
```

---

## MCP Servers

### Claude Code (`~/.claude.json`)

| Server | Type | Notes |
| --- | --- | --- |
| wmux | local (node) | bundled with wmux app install |
| context7 | http | needs `CONTEXT7_API_KEY` env var — stored separately, not here |
| github | stdio (npx) | needs `GITHUB_PERSONAL_ACCESS_TOKEN` env var — stored separately, not here |
| chrome-devtools | stdio (npx) | `chrome-devtools-mcp@latest` |
| playwright | stdio (npx) | `@playwright/mcp@latest` |

> Secrets for context7 and github were rotated after being pasted into chat on 2026-07-18 — re-generate fresh ones and store in a password manager, not in this doc.

### VS Code (`%APPDATA%\Code\User\mcp.json`)

| Server | Type | Version |
| --- | --- | --- |
| context7 (Upstash) | stdio (npx) | 1.0.31 |
| chrome-devtools | stdio (npx) | 1.6.0 |
| github-mcp-server | http | 1.6.0 |
| playwright | stdio (npx) | latest |

---

## Git Config

```text
user.name=Abdul Khan
user.email=ahkn63@gmail.com
filter.lfs.required=true
filter.lfs.clean=git-lfs clean -- %f
filter.lfs.smudge=git-lfs smudge -- %f
filter.lfs.process=git-lfs filter-process
init.defaultbranch=main
```

---

## SSH Config

```text
Host cs.utm.utoronto.ca
  HostName cs.utm.utoronto.ca
  User khanab72
```

---

## Node / Package Managers

* **Node:** v22.22.3 (via nvm) — other versions installed: 22.0.0, 18.14.2
* **uv:** 0.11.21
* Python: not installed as a standalone binary (Store alias only)

---

## GitHub CLI

```text
Logged in to github.com as AbdulDevHub
Protocol: https
Scopes: gist, read:org, repo, workflow
```

---

## Full settings.json

<details>
<summary>Expand settings.json</summary>

```json
{
  "terminal.integrated.sendKeybindingsToShell": true,
  "editor.inlineSuggest.suppressSuggestions": true,
  "codeium.enableConfig": {
    "*": true,
    "plaintext": true,
    "properties": true,
    "markdown": true
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[markdown]": {
    "editor.defaultFormatter": "DavidAnson.vscode-markdownlint"
  },
  "editor.linkedEditing": true,
  "[javascriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[html]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[css]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "cSpell.userWords": [
    "COURSERA",
    "editability",
    "favourite",
    "Favourited",
    "freemium",
    "Hackathon",
    "Hadi",
    "INACTVE",
    "KAHOOT",
    "Matplotlib",
    "Photoshop",
    "pygame",
    "QUIZLET",
    "skyfall",
    "SOCRATIVE",
    "strech",
    "Studica",
    "Subpages",
    "Tkinter",
    "vercel",
    "Vuetify",
    "Wireframe"
  ],
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[json]": {
    "editor.defaultFormatter": "vscode.json-language-features"
  },
  "yaml.schemas": {
    "file:///c%3A/Users/kokok/.vscode/extensions/atlassian.atlascode-3.0.10/resources/schemas/pipelines-schema.json": "bitbucket-pipelines.yml"
  },
  "code-runner.runInTerminal": true,
  "workbench.colorCustomizations": {
    "button.background": "#8500cc",
    "button.hoverBackground": "#7900bb",
    "focusBorder": "#8500cc",
    "editor.selectionBackground": "#44475A",
    "list.activeSelectionBackground": "#a600ff44",
    "badge.background": "#8500cc",
    "progressBar.background": "#8500cc",
    "tab.activeBorderTop": "#8500cc",
    "extensionIcon.verifiedForeground": "#b224fffe",
    "notificationsInfoIcon.foreground": "#8500cc",
    "welcomePage.progress.foreground": "#8500cc",
    "textLink.foreground": "#d485ff",
    "textLink.activeForeground": "#c457ff",
    "statusBarItem.remoteBackground": "#8500cc",
    "statusBarItem.remoteHoverBackground": "#8700d3",
    "inputValidation.infoBorder": "#8500cc",
    "activityBar.activeBorder": "#8500cc",
    "activityBarBadge.background": "#8500cc",
    "panelTitle.activeBorder": "#8500cc",
    "pickerGroup.border": "#a600ff44",
    "terminal.ansiBrightGreen": "#00eea2",
    "terminal.ansiBrightBlue": "#c457ff",
    "terminalCommandDecoration.successBackground": "#00eea2",
    "menu.selectionBackground": "#8500cc",
    "statusBar.debuggingBackground": "#8500cc"
  },
  "workbench.iconTheme": "material-icon-theme",
  "workbench.productIconTheme": "material-product-icons",
  "[vue]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[jsonc]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "vim.cursorStylePerMode.normal": "line",
  "vim.startInInsertMode": true,
  "prisma.showPrismaDataPlatformNotification": false,
  "prettier.semi": false,
  "[xml]": {
    "editor.defaultFormatter": "redhat.vscode-xml"
  },
  "remote.autoForwardPortsSource": "hybrid",
  "diffEditor.ignoreTrimWhitespace": false,
  "[liquid]": {
    "editor.defaultFormatter": "sissel.shopify-liquid"
  },
  "terminal.integrated.suggest.enabled": true,
  "chat.instructionsFilesLocations": {
    ".github/instructions": true,
    "C:\\Users\\kokok\\AppData\\Local\\Temp\\postman-collections-post-response.instructions.md": true,
    "C:\\Users\\kokok\\AppData\\Local\\Temp\\postman-collections-pre-request.instructions.md": true,
    "C:\\Users\\kokok\\AppData\\Local\\Temp\\postman-folder-post-response.instructions.md": true,
    "C:\\Users\\kokok\\AppData\\Local\\Temp\\postman-folder-pre-request.instructions.md": true,
    "C:\\Users\\kokok\\AppData\\Local\\Temp\\postman-http-request-post-response.instructions.md": true,
    "C:\\Users\\kokok\\AppData\\Local\\Temp\\postman-http-request-pre-request.instructions.md": true
  },
  "workbench.secondarySideBar.defaultVisibility": "hidden"
}
```

</details>

---

## Notes

### Things I Like About This Setup

* Purple-accented UI
* Material icons
* Prettier everywhere
* Vim insert-mode startup
* Terminal-focused workflow
* Codeium enabled across most file types
* Minimal secondary sidebar usage

### Future Improvements

* Export extensions list
* Add keyboard shortcuts
* Add snippets collection
* Add favorite VS Code extensions page
