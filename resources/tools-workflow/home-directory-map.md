---
id: home-directory-map
title: What's in My Home Directory
sidebar_label: Home Directory Map
description: A reference for every folder and file living directly in C:\Users\kokok, so I remember what installed it and why it's there.
tags: [windows, powershell, environment, configuration, directory-structure]
---

This page exists so that the next time I open PowerShell, run `ls` in
`C:\Users\kokok`, and think *"wait, what is `.cagent` again?"* — I don't have
to re-discover it from scratch. Every top-level folder and file gets AI
tooling (config, cache, or state) folders dropped into `%USERPROFILE%` on
Windows without asking, so this list will keep growing. Treat this as a
living document: update it whenever something new shows up in `ls`.

:::info Snapshot date
Captured from `ls` output on **2026-07-16**, PowerShell 7.6.3, Windows.
:::

## How to read this page

Folders are grouped by what they're *for*, not alphabetically, because that's
more useful when I'm trying to remember "which of these can I safely delete
if I'm low on disk space." Within each group, entries are alphabetical.

A rough rule of thumb for `.dotfolders` in `%USERPROFILE%` on Windows: almost
all of them are **config/cache directories that a CLI tool or IDE created on
first run**, mirroring the `~/.toolname` convention from Linux/macOS. They are
usually safe to delete if the tool is uninstalled (you'll just lose saved
settings, chat history, or cached models) — but back up anything with API
keys or auth tokens first (see the [Security-Sensitive Folders](#security-sensitive-folders)
section).

---

## AI coding agents & IDEs

These are config/state directories for AI-assisted coding tools — CLIs, VS
Code–based IDEs, and JetBrains plugins that live in the terminal or editor.
This is the fastest-growing category, so expect to prune it periodically.

| Folder | Tool | Notes |
|---|---|---|
| `.agent` / `.agents` | Generic agent-runner config (varies by tool) | Some coding-agent CLIs use a plain `.agent`/`.agents` folder for local agent definitions or run history. Worth checking `ls .agent` next time to confirm which tool owns it, since the name isn't tool-specific. |
| `.antigravity` | **Google Antigravity** (legacy) | Google's agent-first IDE, built on VS Code. Note: Google split the app's data into two separate folders after the Antigravity 2.0 update — old data lives here, new installs use `.antigravity-ide`. |
| `.antigravity-ide` | **Google Antigravity IDE** (current) | The active data folder for the standalone Antigravity IDE app (post-split). If `.antigravity` looks stale, this is the one actually in use. |
| `.augment` | **Augment Code** | AI coding assistant plugin (VS Code/JetBrains) — config, index cache, and session data. |
| `.cagent` | **Docker cagent** | Docker's CLI for defining and running AI agents (or teams of agents) declaratively via YAML — think "Docker Compose for AI agents." Auto-installed tool binaries live under `.cagent/tools/`. |
| `.claude` | **Claude Code** | Anthropic's agentic CLI. Holds local config, project memory, and session data for Claude Code. |
| `.claude.json` (file) | **Claude Code** | Root-level config/session file paired with the `.claude` folder. |
| `.cline` | **Cline** | Autonomous coding agent extension for VS Code (formerly Claude Dev). |
| `.codeium` | **Codeium** | AI code-completion/chat extension config and cache. |
| `.copilot` | **GitHub Copilot** (CLI) | Config/cache for the Copilot CLI (distinct from the editor extension, which usually stores state under `.vscode`/`.config`). |
| `.gemini` | **Gemini CLI** | Google's terminal-based Gemini agent. Also doubles as a shared config root for Antigravity's global skills (`~/.gemini/config/skills/`) since both are part of the same Google ecosystem. |
| `.insforge` | **InsForge CLI** | CLI for InsForge, an agent-native backend-as-a-service (DB, auth, storage, edge functions) that coding agents call directly — this folder holds its auth/session config. |
| `.kilocode` | **Kilo Code** | Open-source autonomous coding agent extension for VS Code. |
| `.qoder` | **Qoder** | Alibaba's agentic coding IDE/JetBrains plugin/CLI — deep codebase indexing plus autonomous multi-file agents. |
| `.qwen` | **Qwen CLI** | Alibaba's terminal-based coding agent (Qwen model family), CLI equivalent of tools like Gemini CLI/Claude Code. |
| `.roo` | **Roo Code** | Another autonomous coding agent VS Code extension (fork lineage related to Cline). |
| `.securecoder` | Likely **Cisco SecureCoder** or a related secure-coding assistant | Given `.cisco` also being present, this is probably a Cisco-ecosystem AI/secure-coding tool config folder. Worth confirming which product installed it next time it's touched, since it's not one of the mainstream agent CLIs. |
| `.trae` | **Trae** | ByteDance's AI-native IDE (also VS Code–based), config and cache. |

## Editors, runtimes & language tooling

| Folder / File | What it is |
|---|---|
| `.vscode` | Global VS Code user settings that apply outside of any specific project (as opposed to a project-level `.vscode/` folder, which lives inside a repo). |
| `.vscode-shared` | Custom/shared VS Code configuration — not a folder VS Code creates by default, so this was likely set up manually (e.g., for syncing settings across machines or profiles). |
| `.bun` | **Bun** — the JS/TS runtime and package manager. Holds its installed binary, global packages, and cache. |
| `.config` | XDG-style config root. On Windows this shows up when cross-platform CLI tools (many Node/Rust/Go tools) follow the Linux convention of writing to `~/.config/<tool>/` instead of `%AppData%`. |
| `.local` | XDG-style data root (`~/.local/share`, `~/.local/bin`), same story as `.config` — cross-platform tools writing Linux-style paths on Windows. |
| `.m2` | **Maven** local repository — every JAR/dependency ever downloaded for a Java project lives here. Can get large; safe to delete, Maven just re-downloads on next build. |
| `.nuxt` / `.nuxtrc` | **Nuxt.js** — `.nuxt` is normally a per-project build cache (finding it in the home root is unusual and may be a leftover from a project run outside its folder); `.nuxtrc` is the global Nuxt CLI config file. |
| `.ollama` | **Ollama** — local LLM runner. This is where downloaded model weights are cached, so it's often one of the largest folders in the whole profile. |
| `.vuerc` | Global config for the **Vue CLI** (preferences picked when scaffolding new Vue projects). |
| `.angular-config.json` | Global **Angular CLI** config (analytics opt-in/out, CLI defaults). |
| `.czrc` | Config for **Commitizen** (`cz`) — standardizes conventional-commit prompts across all repos. |
| `.gitconfig` | Global **Git** configuration — user name/email, aliases, default editor, etc. |
| `.lesshst` | History file for the `less` pager (search terms used in `less`). |
| `.viminfo` | **Vim** history — command history, search patterns, marks, registers across editing sessions. |
| `.yarnrc` | Global **Yarn** config (registry URL, install preferences). |
| `.lemminx` | Cache/config for the **LemMinX** XML language server, usually pulled in as a dependency of a VS Code/Eclipse XML extension. |
| `tsconfig.json` | A **TypeScript** config file sitting directly in the home root. Confirmed (2026-07-17) to be the **stock, untouched output of `tsc --init`** — just the default template with its usual commented-out options and only `target`, `module`, `esModuleInterop`, `forceConsistentCasingInFileNames`, `strict`, and `skipLibCheck` set. No custom `paths`/`baseUrl`, so nothing else appears to `extend` it. Almost certainly a stray leftover from running `tsc --init` in the wrong directory rather than an intentional shared base config — safe to delete unless something's quietly relying on it. |
| `.prismic` | CLI config for **Prismic**, a headless CMS — auth token and project settings for the `prismic-cli`. |
| `.degit` | Cache for **degit**, a tool that scaffolds projects by cloning git repos without their `.git` history. |

## Cloud, containers & infra

| Folder | What it is |
|---|---|
| `.docker` | **Docker Desktop / Docker CLI** config — contexts, credential store references, and CLI settings. |
| `.cisco` | Config for a Cisco application — most likely **Cisco Secure Client / AnyConnect** (VPN client) or another Cisco security tool. |
| `.insforge` | *(see AI agents table above — it's infra-flavored but primarily agent-facing, so listed there.)* |

## Security-sensitive folders

Handle these with more care — back up before deleting, and never commit them
to a repo.

| Folder | What it is | Why it's sensitive |
|---|---|---|
| `.ssh` | SSH keypairs and `known_hosts` | Contains private keys used to authenticate to GitHub/servers. **Never delete without backing up first**, and never share its contents. |
| `.claude.json` | Claude Code session/auth state | May contain session identifiers tied to your account. |

## Cache & temp-ish folders

Generally safe to delete for disk space — tools will regenerate them, though
you may lose cached downloads (meaning slower re-installs) or local history.

| Folder | What it is |
|---|---|
| `.cache` | Generic cache root used by many cross-platform CLI tools (again, the XDG `~/.cache` convention showing up on Windows). |
| `npm-cache` | Explicit npm cache directory (separate from npm's default cache location — likely set via `npm config set cache`). |
| `pip` / `pipx` | Config and installed-app directories for Python's `pip` and `pipx` (isolated CLI tool installer). |
| `.thumbnails` | Cached thumbnail images generated by Windows Explorer or a media tool. |
| `.bash_history` | Command history for Bash sessions (e.g., via Git Bash or WSL interop) — not PowerShell history, which lives elsewhere (`(Get-PSReadlineOption).HistorySavePath`). |

## Standard Windows user folders

The usual suspects that Windows creates for every profile — not
tooling-related, just documented here for completeness:

- **3D Objects, Contacts, Favorites, Links, Music, Saved Games, Searches,
  Videos** — default Windows shell folders, several marked read-only
  (`d-r--`) because they're special shell folders rather than plain
  directories.
- **Documents, Downloads** — standard user folders, actively used.
- **Creative Cloud Files** — sync folder for **Adobe Creative Cloud**.
- **OneDrive** — Microsoft's cloud sync folder (marked `dar--`: directory,
  archive, read-only, reparse point — it's a sync junction, not a plain
  folder).
- **source** — commonly a self-created or Visual Studio–created folder
  (`source\repos` is Visual Studio's default clone location) for local git
  checkouts.
- **%AppData%** *(literally named that, not a real env-var expansion)* —
  worth double-checking this one; if it's a real folder named
  `%AppData%` rather than the actual `AppData` folder, something created it
  by treating the environment variable as a literal string instead of
  expanding it (a common scripting bug: using `mkdir %AppData%\foo` in a
  context where the variable isn't expanded).

---

## Maintenance checklist

Things to do periodically so this page stays accurate:

- [ ] Re-run `ls` in the home directory every couple of months and diff
      against this list.
- [ ] For any new AI-tool folder, note **which tool created it** and roughly
      **how big it gets** (some, like `.ollama` and `.m2`, can balloon).
- [ ] Confirm the identity of `.securecoder`, `.agent`/`.agents`, and the
      `%AppData%` folder — these were inferred/flagged as uncertain above.
- [ ] Check whether `.antigravity` (legacy) can be safely deleted now that
      `.antigravity-ide` is the active one.
