---
id: wsl-dev-setup
title: The Ideal WSL Dev Setup (When You Need It)
sidebar_label: WSL Dev Setup
description: A 20-minute setup guide for a clean, fast WSL2 development environment on Windows.
tags: [wsl, windows, linux, vscode, python, tmux]
---

## 1. Distro & install

- `wsl --install -d Ubuntu` (default choice, best support/docs). This gets you WSL2 automatically on modern Windows.

## 2. Filesystem rule (the one that matters most)

- All active project files live inside Linux: `~/projects/...`
- Never work on `/mnt/c/...` from inside WSL for anything beyond quick one-off edits — it's slow and defeats half the point of WSL.
- Windows Explorer shortcut to `\\wsl$\Ubuntu\home\<you>\projects` (or the newer `\\wsl.localhost\...` path) so you can still drag-and-drop or double-click files from the Windows side.

## 3. Python — isolated via uv

- Install `uv` *inside* WSL separately from your Windows uv — they don't share anything, no conflicts possible since they're different OS binaries entirely.

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

- From there, `uv` manages Python versions and venvs per-project as usual. Nothing about your Windows Python setup changes at all.

## 4. Shell — tmux + a decent shell config

```bash
sudo apt install tmux
```

- Optional but common pairing: swap default bash for `zsh` + a framework like Oh My Zsh, or keep bash and just add a solid `.bashrc`/`.tmux.conf`. This is taste, not necessity.
- Basic `~/.tmux.conf` tweaks people usually want: mouse mode on, saner prefix key, maybe `tpm` (tmux plugin manager) if you want persistent sessions across reboots.

> 💡 **Note on [cmux](https://cmux.com/):** If you ever work across platforms or pair your WSL environment with a macOS host machine, check out `cmux`. It is a modern, UI-driven alternative built on Ghostty that functions like a visual multiplexer with native tabs and status alerts—ideal for tracking multiple parallel terminal sessions or running AI coding agents simultaneously. While it's macOS-only for now, it supports natively attaching to remote `tmux` sessions running on your Linux environments.

## 5. VS Code — no reinstall needed

- Install the **WSL extension** (`ms-vscode-remote.remote-wsl`) in your *existing* Windows VS Code.
- Open a WSL folder two ways:
  - From Windows Terminal/WSL shell:

    ```bash
    cd ~/projects/myapp && code .
    ```

    This launches your normal Windows VS Code, connected to WSL, editing Linux files.
  - Or `Ctrl+Shift+P` → **"WSL: Connect to WSL"** from within VS Code.
- **Extensions:** UI extensions (themes, icon packs) stay shared. Workspace-relevant extensions (language servers, linters) get auto-prompted to install "on WSL" the first time — one-time thing per extension, not a full re-setup.
- **Integrated terminal:** once connected to a WSL window, the integrated terminal *is* a WSL/bash terminal automatically. For terminal profiles in a normal (non-WSL-connected) window, VS Code also lets you add a "WSL" terminal profile in `settings.json` alongside your Git Bash one — same dropdown, just another option.

## 6. Terminal app

- Use **Windows Terminal** (likely already installed) as the front door — it auto-detects WSL distros and gives you tabbed/split panes, which pairs naturally with tmux if you want persistent sessions.
