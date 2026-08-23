---
slug: terminal-setup-worth-copying
title: Terminal Setup Worth Copying
authors: [abdul]
tags: [terminal, productivity, tooling, workflow]
---

A developer's terminal is their most-used tool. Here's what a solid setup looks like — themes, prompts, and a few commands that make daily work noticeably smoother.

<!-- truncate -->

The full reference lives in [Terminal Commands](/resources/terminal-shell/terminal-commands) and [Terminal Themes](/resources/terminal-shell/terminal-themes), but this post is the opinionated "here's what I actually use" version.

## Shell: Oh My Zsh + Starship

[Oh My Zsh](https://ohmyz.sh/) is the plugin ecosystem. [Starship](https://starship.rs/) is the cross-shell prompt. Together they cover 90% of what you need.

```bash
# Install Oh My Zsh
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"

# Install Starship
curl -sS https://starship.rs/install.sh | sh
```

Starship's prompt is fast, shows git branch/status, language versions (Node, Python, Rust), and works identically on macOS, Linux, and WSL.

## Three Plugins That Change Daily Use

```bash
# Add to plugins=() in ~/.zshrc
plugins=(git zsh-autosuggestions zsh-syntax-highlighting)
```

- **git** — adds 60+ git aliases (`gst` for status, `gco` for checkout, `gcmsg` for commit -m, etc.)
- **zsh-autosuggestions** — grey completions from history, accept with →
- **zsh-syntax-highlighting** — commands turn green when valid, red when not

## One Alias to Rule Them All

```bash
# ~/.zshrc
alias dev="cd ~/code && ls"
```

Simple. Works. Change the path to wherever your projects live.

---

The [Terminal Commands](/resources/terminal-shell/terminal-commands) resource page has a broader reference — git tricks, file navigation, process management, and more.
