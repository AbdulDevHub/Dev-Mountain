---
title: Agent Skills Library
description: What Agent Skills (SKILL.md folders) are, how to install them, and where to find good ones, including my own Agent Skills Factory.
tags: [ai, agents, agent-skills, tooling, automation]
---

An **Agent Skill** is a folder with a `SKILL.md` file (plus optional scripts and references) that teaches an AI coding agent how to do one job well. The agent reads the short description up front and loads the full instructions only when the task needs them. The format is open, so the same skill works in Claude Code, OpenAI Codex, Cursor, GitHub Copilot, Gemini CLI and others.

## My skill directory

**[Agent Skills Factory](https://github.com/AbdulDevHub/Agent-Skills-Factory)**: my open-source skills, MIT licensed.

```bash
npx skills@latest add AbdulDevHub/Agent-Skills-Factory
```

| Skill | What it does |
| --- | --- |
| `idea-quasar` | Turns a rough idea into an approved build plan before any code is written |
| `setup-agent-context` | Scaffolds `AGENTS.md` plus a `context/` folder for any codebase |
| `gitmoji-commit` | Commits staged files as `🐛 fix: ...` gitmoji + conventional commits |
| `ship` | End-of-day polish: SEO check, README refresh, commit and push |
| `humanizer` | Removes AI writing patterns from prose |
| `web-seo-optimization` | Meta tags, Open Graph, JSON-LD, sitemap and robots.txt for web apps |
| `omni-ui` | Designs, polishes and audits web UI |

See the [full skill list](https://github.com/AbdulDevHub/Agent-Skills-Factory#skills) and the [External Skills](https://github.com/AbdulDevHub/Agent-Skills-Factory/blob/main/External%20Skills.md) table of third-party skills I use, with their source repos and install commands.

## Finding more skills

- [agentskills.io](https://agentskills.io): the open `SKILL.md` specification.
- [skills.sh](https://skills.sh): searchable directory and leaderboard of public skills.
- [vercel-labs/skills](https://github.com/vercel-labs/skills): the `npx skills` CLI for installing skills into any agent.
- [anthropics/skills](https://github.com/anthropics/skills): Anthropic's official example skills (documents, design, testing).

## Install basics

```bash
# One skill from a repo
npx skills add vercel-labs/agent-skills --skill react-best-practices

# Globally, for Claude Code only, no prompts
npx skills add <owner>/<repo> -g -a claude-code -y
```
