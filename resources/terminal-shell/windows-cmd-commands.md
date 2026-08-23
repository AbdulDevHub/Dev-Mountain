---
title: Windows Power & System Control Commands
sidebar_label: Windows CMD Commands
description: Quick reference for Windows Command Prompt and PowerShell commands covering system power states, CMD tricks, Wi-Fi, networking, security, and scheduled tasks.
tags: [windows, cmd, powershell, cli]
---

A quick reference guide for essential Windows Command Prompt and PowerShell commands — power management, system info, networking tricks, and more.

:::tip Related
For PowerShell syntax, variables, and pipeline concepts, see [PowerShell](./powershell.md). For Windows file attribute management, see [Windows File Attributes](../tools-workflow/windows-file-attributes.md).
:::

---

## CMD Power Tricks

Handy commands that work in the Windows Command Prompt (CMD) or PowerShell.

### System Information

```cmd
systeminfo
```

Displays detailed configuration, OS, hardware, and system information.

### Wi-Fi Password Retrieval

```cmd
netsh wlan show profile
```

Lists all Wi-Fi network profiles saved on the system.

```cmd
netsh wlan show profile "<SSID>" key=clear
```

Displays the saved clear-text password for a specific Wi-Fi network.

```cmd
netsh wlan show profile * key=clear
```

Extracts passwords for all saved Wi-Fi profiles at once.

```cmd
netsh wlan show profile * key=clear > wifi_passwords.txt
```

Exports all saved Wi-Fi profiles and plain-text passwords into a text file.

### Networking & Web Tricks

```cmd
curl checkip.amazonaws.com
```

Retrieves your public IP address.

```cmd
curl wttr.in/<location>
```

Displays a text-based weather forecast in the terminal (e.g., `curl wttr.in/London`).

```cmd
curl qrenco.de/<url>
```

Generates an ASCII QR code for a given URL directly inside the terminal.

```cmd
curl -Is <url>
```

Checks the HTTP response status header of a website.

```cmd
curl -I -L <short_url> | findstr Location
```

Traces a shortened URL to reveal its full destination address.

```cmd
start <url>
```

Opens a specified website in your default web browser.

### File Explorer

```cmd
explorer .
```

Opens Windows File Explorer at the current directory location.

### Command History

```cmd
doskey /history
```

Displays a list of all commands entered during the current CMD session.

### Getting Help

```cmd
help
```

Lists available Windows built-in commands.

```cmd
<command> /?
```

Displays usage, options, and help documentation for a specific command (e.g., `shutdown /?`).

### Console Customization

```cmd
color <background_code><text_code>
```

Customizes the background and text colors of the Command Prompt window (e.g., `color 0A` for black background, green text).

```cmd
title <window_name>
```

Sets a custom title for the Command Prompt window.

```cmd
prompt [text]$G
```

Customizes the Command Prompt prompt string (e.g., `prompt MyPC$G` → `MyPC>`).

```cmd
prompt
```

Resets the Command Prompt prompt string back to default.

### Security & File Tricks

```cmd
cipher /e
```

Encrypts every file in the current directory using Windows EFS (Encrypted File System).

```cmd
attrib +h +s +r <folder>
```

Hides a folder by setting Hidden, System, and Read-Only attributes (it won't appear in Explorer under normal settings).

```cmd
attrib -h -s -r <folder>
```

Unhides a previously hidden folder.

```cmd
copy /b <image> + <folder.zip> <output_image>
```

Hides a ZIP archive inside an image file (steganography trick — you can then `unzip` the image to extract the archive).

---

## Direct Commands

### Clear Screen

```cmd
cls
```

Clears all text from the current Command Prompt window.

### Immediate UEFI / BIOS Reboot

```cmd
shutdown /r /fw /f /t 0
```

Forcefully restarts the computer immediately (`/f`, `/t 0`) and boots directly into the UEFI/BIOS firmware settings (`/fw`).

:::note
Running `/fw` requires Administrator privileges on your command prompt or terminal session.
:::

---

## Power & State Commands Summary

Windows includes native commands for triggering various power and session states. While `shutdown` natively supports time delays via flags, other commands execute immediately unless paired with a delay timer or scheduler.

| Action | Native Command | Notes / Prerequisites |
| :--- | :--- | :--- |
| **Shutdown** | `shutdown /s` | Safely turns off the machine. |
| **Restart** | `shutdown /r` | Reboots the system. |
| **Lock** | `rundll32.exe user32.dll,LockWorkStation` | Immediately locks the active user session. |
| **Hibernate** | `shutdown /h` | Saves memory state to disk and powers off. |
| **Sleep** | `rundll32.exe powrprof.dll,SetSuspendState 0,1,0` | Enters low-power sleep mode. |

:::warning Sleep vs. Hibernate Behavior
If Hibernation is enabled on your system, the `SetSuspendState` command for **Sleep** may trigger Hibernate instead. To strictly enforce sleep via command line, disable hibernation first using `powercfg -h off`.
:::

---

## Timed Delays (Relative Time)

### 1. Native `shutdown` Delays

The `/t` parameter specifies a delay in **seconds** (e.g., `3600` seconds = 1 hour).

```cmd
# Shutdown in 1 hour (3600 seconds)
shutdown /s /t 3600

# Restart in 30 minutes (1800 seconds)
shutdown /r /t 1800

# Abort any pending timed shutdown or restart
shutdown /a
```

:::tip
Add the `/f` flag (e.g., `shutdown /s /f /t 3600`) to force-close active applications without waiting for user prompts.
:::

### 2. Paired Delays for Lock, Sleep, and Hibernate

Because commands like `LockWorkStation` and `SetSuspendState` lack standard delay parameters, chain them with a delay command.

#### Command Prompt (`timeout`)

```cmd
# Sleep after 30 minutes (1800 seconds)
timeout /t 1800 /nobreak && rundll32.exe powrprof.dll,SetSuspendState 0,1,0
```

#### PowerShell (`Start-Sleep`)

```powershell
# Lock after 15 minutes (900 seconds)
Start-Sleep -Seconds 900; rundll32.exe user32.dll,LockWorkStation
```

---

## Exact Clock Time Scheduling (`schtasks`)

To execute a power state action at a specific time (e.g., 11:30 PM), create a one-time task using Windows Task Scheduler via `schtasks`.

### Creating Timed Tasks

```cmd
# Shutdown at 11:30 PM
schtasks /create /tn "TimedShutdown" /tr "shutdown /s /f" /sc once /st 23:30 /f

# Lock at 6:00 PM
schtasks /create /tn "TimedLock" /tr "rundll32.exe user32.dll,LockWorkStation" /sc once /st 18:00 /f

# Hibernate at 2:00 AM
schtasks /create /tn "TimedHibernate" /tr "shutdown /h" /sc once /st 02:00 /f
```

### Deleting Scheduled Tasks

If you need to cancel or remove a scheduled task before or after execution, pass its task name (`/tn`):

```cmd
schtasks /delete /tn "TimedShutdown" /f
```
