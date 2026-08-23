---
title: macOS Terminal Commands
sidebar_label: macOS Terminal
description: Handy macOS-specific terminal commands for system utilities, clipboard, text-to-speech, Quick Look, local servers, and Touch ID sudo authentication.
tags: [macos, terminal, cli, bash]
---

Useful macOS-specific terminal commands that go beyond standard Unix/bash — things built into macOS or only available on Darwin-based systems.

:::tip Related
For standard Unix commands that also work on macOS, see [Linux](./linux.md). For modern CLI productivity tools, see [Linux CLI Tools](./linux-terminal-tools.md).
:::

---

## Text-to-Speech

### `say`

Makes your Mac speak the entered text out loud using the built-in text-to-speech engine.

```bash
say "Hello, world"
say "Build complete" && open .   # announce when a task finishes
```

---

## System Info & Utilities

### Wi-Fi Password Retrieval

Retrieves the saved password for a specific Wi-Fi network from the macOS Keychain.

```bash
security find-generic-password -wa "Wi-Fi Network Name"
```

### `pbcopy` & `pbpaste`

Copy command output to your clipboard, or paste clipboard contents into a command.

```bash
cat file.txt | pbcopy        # copy file contents to clipboard
pwd | pbcopy                 # copy current path to clipboard
pbpaste > file.txt           # paste clipboard into a file
```

### `caffeinate`

Keeps your Mac awake and prevents it from sleeping until stopped (`Ctrl+C`). Useful when running long tasks.

```bash
caffeinate                   # keep awake indefinitely
caffeinate -t 3600           # keep awake for 1 hour (3600 seconds)
caffeinate -i make build     # keep awake while a command runs
```

### `uptime`

Displays how long your Mac has been running without a reboot.

```bash
uptime
```

### `qlmanage`

Opens a Quick Look preview of a file directly from the terminal, without opening the full application.

```bash
qlmanage -p file.pdf
qlmanage -p image.png
```

### `diff`

Compares two files line by line and highlights differences.

```bash
diff file1.txt file2.txt
```

### `leave`

Sets a terminal alarm for a specified time. When the time arrives, the terminal reminds you to leave.

```bash
leave 1430        # set reminder for 2:30 PM
leave +30         # set reminder 30 minutes from now
```

### `history`

Displays a list of all previously executed terminal commands.

```bash
history
history | grep ssh     # search history for ssh commands
history | tail -20     # last 20 commands
```

### `open`

Opens a file or application using its default system viewer, from the terminal.

```bash
open .                    # open current directory in Finder
open file.pdf             # open PDF in Preview
open -a "Visual Studio Code" .   # open directory in a specific app
open https://example.com  # open URL in default browser
```

---

## Local Server & Power

### Quick Local HTTP Server

Spins up a local HTTP web server in the current directory on port 8000. Useful for testing static files.

```bash
python3 -m http.server 8000
```

### Shutdown & Restart

```bash
shutdown -h now    # instantly shut down the Mac
shutdown -r now    # instantly restart the Mac
```

---

## Touch ID for sudo Authentication

By default, `sudo` on macOS requires you to type your password. You can configure it to accept Touch ID instead.

Edit the PAM configuration file for sudo:

```bash
sudo nano /etc/pam.d/sudo
```

Add the following line as the **first** `auth` line in the file:

```
auth       sufficient     pam_tid.so
```

Save and exit (`Ctrl+O`, `Enter`, `Ctrl+X`). Touch ID will now be accepted for `sudo` commands in the current terminal session.

:::note
This change may be reset after macOS updates. Some terminal emulators (like VS Code's integrated terminal) don't support Touch ID via PAM — it works best in Terminal.app and iTerm2.
:::
