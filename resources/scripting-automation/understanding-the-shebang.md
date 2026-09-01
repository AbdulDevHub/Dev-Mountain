---
id: understanding-the-shebang
title: Understanding the Shebang (#!) in the Terminal
sidebar_label: The Shebang (#!)
description: A guide to what the shebang (#!) is, why it matters, and how to use it in shell scripts.
keywords:
  - shebang
  - bash
  - terminal
  - linux
  - macos
  - scripting
tags: [bash, terminal, linux, shell, scripting, devops]
---

A **shebang** (written as `#!`) is a character sequence at the very first line of a script in Unix-like operating systems (such as Linux and macOS). It tells the operating system's kernel which program (interpreter) to use to execute the code in that file.

---

## Why Is It Important?

When you try to execute a text file directly, the operating system needs to know if it is reading a Bash script, a Python file, or something else.

* **Removes Guesswork**: The system immediately knows the correct interpreter.
* **Ensures Portability**: Your script runs exactly as intended, regardless of the user's default terminal shell.

---

## Common Examples

### Bash

```bash
#!/bin/bash
```

or (more portable):

```bash
#!/usr/bin/env bash
```

### Python

```bash
#!/usr/bin/python3
```

or (more portable):

```bash
#!/usr/bin/env python3
```

:::tip

Using the `#!/usr/bin/env` path is highly recommended. Instead of hardcoding a specific location for an interpreter, it tells the system to search your environment's `$PATH` variable to find the program.

:::

---

## Crucial Rules

1. **First Line**: It must be on the very first line of the script.
2. **No Spaces**: There cannot be any spaces before the `#!`.
3. **Correct Path**: It must point to a valid executable path on your system.

---

## Step-by-Step Implementation

To run a script directly by its name in the terminal, you must include a shebang and grant the file execution permissions.

### 1. Create the Script

Create a file named `hello.sh` and add the shebang at the top:

```bash
#!/bin/bash
echo "Hello, World!"
```

### 2. Make the Script Executable

In your terminal, use the change mode command to grant execution permissions:

```bash
chmod +x hello.sh
```

### 3. Run Your Script

Execute the file directly from your terminal:

```bash
./hello.sh
```
