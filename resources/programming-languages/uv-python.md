---
id: uv-python
title: UV (Python Package & Project Manager)
sidebar_label: UV
description: Notes on uv, the Rust-based all-in-one Python packaging and project tool by Astral.
tags: [python, tooling, packaging]
---

## What is uv?

**uv** is an extremely fast Python package and project manager, written in Rust by [Astral](https://astral.sh) (the same team behind `ruff`). It aims to replace a whole pile of separate tools:

- `pip` / `pip-tools` — installing & resolving packages
- `virtualenv` / `venv` — creating virtual environments
- `pyenv` — installing & managing Python versions
- `poetry` / `pdm` — project & dependency management, lockfiles
- `pipx` — installing & running CLI tools in isolated envs
- `twine` — building & publishing packages (partial)

The pitch: **one binary, no Python required to bootstrap it, 10–100x faster than pip**, with a unified workflow from "I need Python 3.12" all the way to "publish this package to PyPI."

:::tip Why it matters
Before uv, a typical setup involved pyenv + venv + pip + pip-tools (or poetry) — four tools, four mental models. uv collapses that into one CLI with consistent flags and a single lockfile format.
:::

## Installation

```bash
# macOS / Linux
curl -LsSf https://astral.sh/uv/install.sh | sh

# Windows (PowerShell)
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"

# Or via pipx / pip if you already have Python
pipx install uv

# Or via Homebrew
brew install uv
```

Upgrade in place:

```bash
uv self update
```

Check version:

```bash
uv --version
```

## Core Concepts

uv operates in two main "modes":

1. **Project mode** — driven by `pyproject.toml` + `uv.lock`, similar to Poetry/PDM. Use this for apps, libraries, anything with real dependencies.
2. **Script mode** — for standalone `.py` scripts with inline dependency metadata (PEP 723). No project needed.

There's also a **global tool layer** (`uv tool`) for installing CLI apps like `pipx` does, and a **Python version manager layer** (`uv python`) like `pyenv`.

## Managing Python Versions

uv can download and manage its own Python builds (via the `python-build-standalone` project), independent of your OS Python.

```bash
# List available versions
uv python list

# Install a specific version
uv python install 3.12
uv python install 3.11 3.12 3.13   # multiple at once

# Pin a project to a version (writes .python-version)
uv python pin 3.12

# Find where uv put it
uv python find 3.12

# Uninstall
uv python uninstall 3.11
```

This means you don't need `pyenv` at all — `uv python install` + `.python-version` covers the same ground.

## Project Workflow (the main one)

### Starting a new project

```bash
uv init my-project
cd my-project
```

This scaffolds:

```
my-project/
├── .python-version
├── pyproject.toml
├── README.md
└── src/
    └── my_project/
        └── __init__.py
```

Options I use often:

```bash
uv init --app          # application layout (default-ish)
uv init --lib          # library layout (src/ with __init__.py, build backend set)
uv init --package       # ensure it's installable/importable as a package
uv init --python 3.12   # pin a specific Python
```

### Adding / removing dependencies

```bash
uv add requests
uv add "fastapi[all]"
uv add pytest --dev              # dev-only dependency group
uv add "django>=5,<6"

uv remove requests
```

This updates **both** `pyproject.toml` and `uv.lock`, and syncs the environment automatically. No separate "now run pip install" step.

### Installing from an existing lockfile / pyproject

```bash
uv sync              # create/update .venv to match uv.lock exactly
uv sync --frozen      # don't update the lockfile, just install what's locked
uv sync --no-dev      # skip dev dependency group
```

### Running things

```bash
uv run python script.py
uv run pytest
uv run -- some-cli --flag
```

`uv run` automatically ensures the venv exists and is in sync with the lockfile **before** running — you basically never need to manually `activate` a venv again if you always go through `uv run`.

### The lockfile — `uv.lock`

- Auto-generated, **should be committed to git**.
- Cross-platform by default (resolves for all OS/arch combos, not just the one you're on).
- Human-readable TOML, but treat it as generated — don't hand-edit.
- Regenerate explicitly with:

```bash
uv lock                 # recompute lockfile from pyproject.toml
uv lock --upgrade        # upgrade all deps to latest allowed versions
uv lock --upgrade-package requests   # upgrade just one
```

### Dependency groups

Beyond the default `dev` group, you can define custom groups in `pyproject.toml`:

```toml
[dependency-groups]
dev = ["pytest", "ruff"]
docs = ["mkdocs", "mkdocs-material"]
```

```bash
uv sync --group docs
uv add mkdocs --group docs
```

## Virtual Environments (manual mode)

If you don't want the full project workflow, uv still speeds up plain venv + pip usage:

```bash
uv venv                    # creates .venv in current dir
uv venv --python 3.11      # with a specific version

uv pip install requests    # pip-compatible interface, but fast
uv pip list
uv pip freeze > requirements.txt
uv pip compile requirements.in -o requirements.txt   # like pip-tools
uv pip sync requirements.txt                          # install exactly what's listed
```

Note: `uv pip` is a **drop-in-ish** replacement for `pip` commands — useful for gradually migrating a repo, or CI scripts already built around pip syntax.

## Running Standalone Scripts (PEP 723)

For one-off scripts you don't want to turn into a full project, uv supports inline dependency metadata:

```python
# /// script
# dependencies = [
#   "requests",
#   "rich",
# ]
# ///

import requests
from rich import print

print(requests.get("https://example.com").status_code)
```

```bash
uv run script.py
```

uv reads the inline block, builds a throwaway environment with exactly those deps, and runs it — cached, so repeat runs are instant. You can add deps to the block automatically:

```bash
uv add --script script.py requests
```

This is great for gists / quick utilities that need reproducibility without a whole `pyproject.toml`.

## Installing CLI Tools Globally (`uv tool`, aka pipx replacement)

```bash
uv tool install ruff
uv tool install httpie
uv tool list
uv tool uninstall ruff
uv tool upgrade ruff

# Run without installing (like `pipx run`)
uvx ruff check .
uvx black .
```

`uvx` is shorthand for `uv tool run` — spins up an ephemeral isolated env for the tool, caches it, runs the command. Handy for one-off usage of a CLI you don't want polluting your project venv.

## Building & Publishing Packages

```bash
uv build              # builds sdist + wheel into dist/
uv publish            # uploads to PyPI (or a configured index)
```

Covers what `build` + `twine` used to do.

## Configuration

### `pyproject.toml` — uv-specific section

```toml
[tool.uv]
dev-dependencies = ["pytest"]
index-url = "https://pypi.org/simple"

[[tool.uv.index]]
name = "internal"
url = "https://pypi.mycompany.com/simple"
```

### Global config

- `uv.toml` (project-level, alternative to `[tool.uv]` in pyproject.toml)
- `~/.config/uv/uv.toml` (user-level defaults)
- Env vars: `UV_INDEX_URL`, `UV_PYTHON`, `UV_CACHE_DIR`, `UV_NO_CACHE`, etc.

### Cache

uv caches aggressively (wheels, builds, Python installs) under a shared cache dir. This is a big part of why repeated installs are near-instant.

```bash
uv cache dir      # show cache location
uv cache clean     # nuke it
```

## Quick Command Cheat Sheet

| Task | Command |
|---|---|
| New project | `uv init my-app` |
| Add dependency | `uv add requests` |
| Add dev dependency | `uv add pytest --dev` |
| Remove dependency | `uv remove requests` |
| Install from lock | `uv sync` |
| Update lockfile | `uv lock --upgrade` |
| Run something in the env | `uv run <cmd>` |
| Install Python version | `uv python install 3.12` |
| Pin project's Python | `uv python pin 3.12` |
| Create bare venv | `uv venv` |
| pip-style install | `uv pip install <pkg>` |
| Install global CLI tool | `uv tool install <tool>` |
| Run tool without installing | `uvx <tool>` |
| Build package | `uv build` |
| Publish package | `uv publish` |

## How It Compares

| | uv | pip + venv | Poetry | pyenv |
|---|---|---|---|---|
| Speed | Very fast (Rust) | Slow | Slow–moderate | N/A |
| Manages Python versions | ✅ | ❌ | ❌ | ✅ |
| Lockfile | ✅ (`uv.lock`) | ❌ (needs pip-tools) | ✅ (`poetry.lock`) | ❌ |
| Standalone script deps (PEP 723) | ✅ | ❌ | ❌ | ❌ |
| Global tool installs | ✅ (`uv tool`) | ❌ | ❌ | ❌ |
| Build/publish | ✅ | ❌ (needs build/twine) | ✅ | ❌ |
| Requires Python to install | ❌ (single binary) | N/A | ✅ | ✅ |

## Gotchas / Things I Learned the Hard Way

- **Commit `uv.lock`.** It's the reproducibility guarantee — without it, `uv sync` just resolves fresh from `pyproject.toml` constraints.
- **`uv run` auto-syncs.** If you manually edit `pyproject.toml` deps instead of using `uv add`, the next `uv run` or `uv sync` will pick up the change and update the lock — but prefer `uv add`/`uv remove` so both files stay in sync deliberately.
- **`.python-version` vs `--python` flag.** `uv python pin` writes `.python-version`, which uv (and pyenv, if present) will respect. Explicit `--python` flags on a command override it for that invocation only.
- **`uv pip` is not identical to `pip`.** It's compatible for common cases but doesn't share pip's exact resolver behavior or config files — don't assume 1:1 parity for edge cases (e.g., some legacy `--no-binary` behaviors).
- **Global vs project tools.** `uv add` installs into the *project* env; `uv tool install` installs into an *isolated global* env for running as a CLI. Mixing these up is a common early mistake (e.g., trying to `uv add ruff` just to get the `ruff` CLI globally — should be `uv tool install ruff` instead).
- **Cache is shared across projects.** Disk usage stays low because wheels are hardlinked/cached centrally — don't be surprised that a "fresh" `uv sync` on a new machine is still fast after the first project primes the cache.

## Further Reading

- [Official docs](https://docs.astral.sh/uv/)
- [GitHub](https://github.com/astral-sh/uv)
- [PEP 723 - Inline Script Metadata](https://peps.python.org/pep-0723/)
