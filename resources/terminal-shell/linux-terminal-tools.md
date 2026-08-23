---
id: linux-terminal-tools
title: Modern Linux CLI Tools
sidebar_label: Linux CLI Tools
description: Essential modern Linux terminal utilities and local AI integration workflows using Fabric and Ollama.
tags: [linux, terminal, cli, fabric, ollama, zoxide, fzf]
---

# Modern Linux CLI Tools

A curated reference guide covering high-utility Linux CLI tools and local AI integration workflows.

---

## 1. AI Extensions for the Terminal

### Fabric

**Fabric** is an open-source AI framework designed to integrate large language models directly into standard terminal workflows and Unix pipelines. Instead of copying and pasting text into a web browser, pipe terminal output directly into Fabric patterns.

#### Workflow Examples

```bash
# Analyze history and summarize command usage habits
history | fabric --pattern summarize_commands

# Scan system logs or network activity for issues
sudo dmesg | fabric --pattern analyze_logs
lsof -i | fabric --pattern analyze_ports
```

---

### Ollama & Custom Modelfiles

**Ollama** enables running large language models locally. By writing custom **Modelfiles**, you can create specialized CLI agents tailored to generate commands, analyze scripts, or automate administrative tasks.

#### Step 1: Create a Modelfile

Create a text file named `createcommand`:

```dockerfile
FROM gemma3:4b
SYSTEM """
You are an AI assistant that helps with Linux commands. When asked to create a linux command or bash script, respond ONLY with the exact command enclosed in backticks, with zero conversational preamble or explanation.
"""
```

- **`FROM gemma3:4b`**: Specifies the base local model.
- **`SYSTEM`**: Enforces strict persona guidelines and output formatting via triple quotes.

#### Step 2: Build the Agent

Build the named model from the config file:

```bash
ollama create commander -f createcommand
```

#### Step 3: Execute the Custom Agent

Invoke the custom model directly from your shell:

```bash
ollama run commander "create a command that will find out what is taking up all of my disk space"
```

**Output:**
```bash
`du -h --max-depth=1 / | sort -hr`
```

---

## 2. Navigation & File Search

### `z` (zoxide) & `zi`

`zoxide` is a smarter replacement for `cd` that tracks your most frequently and recently used directories.

```bash
# Jump to a directory matching a query
z downloads

# Interactive directory selection using fzf
zi
```

### `fd`

A simple, fast, and user-friendly alternative to `find`. Defaults to colorized output, recursive search, and respecting `.gitignore`.

```bash
# Search for files matching a pattern
fd project_config

# Search for specific file extensions
fd -e md
```

### `fzf`

A general-purpose command-line fuzzy finder for interactive list filtering and pipeline chaining.

```bash
# Interactively search command history
history | fzf

# Select a file and edit it
nano $(fd -t f | fzf)
```

---

## 3. Directory Listing & Metadata

### `exa`

A modern replacement for `ls` featuring distinct color-coding, built-in tree views, and extended metadata visualization.

```bash
# Standard directory listing with metadata
exa -l

# Recursive tree view with extended details
exa --tree --level=2
```

### `stat`

Displays detailed file or file system metadata, including access/modification timestamps, inode numbers, and ownership data.

```bash
# View detailed information for a file
stat config.json

# Display file system status instead of file status
stat -f /dev/sda1
```

---

## 4. Hardware & System Monitoring

### `lshw`

Extracts detailed hardware configuration details across CPU, memory, storage controller, and display devices.

```bash
# View CPU details
sudo lshw -C cpu

# View memory configuration
sudo lshw -C memory
```

### `watch`

Executes a command periodically at a fixed interval, allowing real-time monitoring of command outputs.

```bash
# Monitor system disk space every 2 seconds
watch -n 2 df -h

# Track active connections on port 80
watch "lsof -i :80"
```

---

## 5. Container & Task Management

### `lazydocker`

A terminal-based user interface (TUI) for managing Docker containers, images, volumes, and network graphs.

```bash
# Launch the interactive terminal UI
lazydocker
```

### `task` (Taskwarrior)

A flexible, terminal-native task and project management framework.

```bash
# Add a task
task add "Configure server backups" priority:H

# List active tasks
task list

# Mark task #1 as complete
task 1 done
```

---

## 6. Data Transfer & Storage Security

### `rsync`

Delta-transfer file synchronization utility. Efficiently copies local or remote files by transmitting only changed blocks.

```bash
# Synchronize local directory to a remote server
rsync -avzP ./src/ user@remote:/var/www/src/
```

### `shred`

Securely overwrites files multiple times before deletion to prevent forensic data recovery.

```bash
# Overwrite file with random data and delete it
shred -u -n 3 secret_key.pem
```

---

## 7. Terminal Recording & Demonstration

### `asciinema` & `agg`

Record full terminal sessions to lightweight text-based `.cast` files, which can then be rendered into high-quality animated GIFs.

```bash
# Start recording session
asciinema rec demo.cast

# Perform terminal actions...
# Press Ctrl+D to stop recording

# Replay session in terminal
asciinema play demo.cast

# Convert recording to an animated GIF using agg
agg demo.cast demo.gif
```
