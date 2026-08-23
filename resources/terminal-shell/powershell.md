---
title: PowerShell
sidebar_label: PowerShell
tags: [powershell, windows, cli, sysadmin]
---

Personal reference notes on PowerShell: core concepts, syntax, and the cmdlets I reach for most often. For copy-paste project/file scripts I actually use, see [Terminal Commands](./terminal-commands.md).

:::tip Related
See [Linux](./linux.md) for the Unix/bash equivalent of this page.
:::

## Core Concepts

- **Object pipeline** — unlike bash, PowerShell pipes pass full **.NET objects**, not plain text. `Get-Process | Sort-Object CPU` sorts on the actual `CPU` property, no text parsing needed.
- **Verb-Noun naming** — cmdlets follow a `Verb-Noun` pattern (`Get-Item`, `Set-Location`, `Remove-Item`). Verbs are standardized; run `Get-Verb` to see the approved list.
- **Case-insensitive** — commands, parameters, and most comparisons are case-insensitive by default.
- **Editions** — **Windows PowerShell** (5.1, built into Windows, `powershell.exe`) vs. **PowerShell 7+** (cross-platform, `pwsh.exe`, actively developed). New scripts should target 7+.
- **Providers** — PowerShell exposes things like the filesystem, registry, and certificate store as navigable "drives" (`cd HKLM:\`, `cd Cert:\`).

## Getting Help

```powershell
Get-Help Get-Process              # help for a cmdlet
Get-Help Get-Process -Examples     # just usage examples
Get-Help Get-Process -Full          # full help incl. parameters
Update-Help                          # refresh local help files (run as admin)
Get-Command                           # list all available commands
Get-Command -Verb Get                  # list commands with a given verb
Get-Command -Noun Process                # list commands with a given noun
Get-Member                                # inspect an object's properties/methods
```

```powershell
Get-Process | Get-Member    # see what properties/methods a Process object exposes
```

## Variables & Types

```powershell
$name = "Alice"             # string
$count = 5                    # int
$items = @("a", "b", "c")      # array
$map = @{ key = "value" }       # hashtable
$true / $false                   # booleans
$null                              # null

$name.GetType()                     # inspect the underlying .NET type
[int]"42"                            # cast to int
[string]42                            # cast to string
```

String interpolation uses double quotes only:

```powershell
"Hello, $name!"          # interpolates
'Hello, $name!'            # literal — single quotes do not interpolate
```

## Comparison & Logical Operators

PowerShell doesn't use `==`, `!=`, `<`, `>` for comparisons — it uses named operators:

| Operator | Meaning |
|---|---|
| `-eq` | equal |
| `-ne` | not equal |
| `-gt` / `-lt` | greater / less than |
| `-ge` / `-le` | greater-or-equal / less-or-equal |
| `-like` | wildcard match (`*`, `?`) |
| `-match` | regex match |
| `-contains` | collection contains value |
| `-in` | value is in collection |
| `-and` / `-or` / `-not` | logical operators |

```powershell
if ($count -gt 3 -and $name -eq "Alice") { "match" }
Get-ChildItem | Where-Object { $_.Name -like "*.log" }
```

## Control Flow

```powershell
if ($x -eq 1) { "one" } elseif ($x -eq 2) { "two" } else { "other" }

foreach ($item in $items) { Write-Host $item }

for ($i = 0; $i -lt 5; $i++) { Write-Host $i }

$i = 0
while ($i -lt 5) { $i++ }

switch ($value) {
    1 { "one" }
    2 { "two" }
    default { "other" }
}
```

## Functions & Scripts

```powershell
function Get-Square {
    param([int]$Number)
    return $Number * $Number
}

Get-Square -Number 4     # 16
```

```powershell
# Run a script
.\script.ps1

# Pass arguments
.\script.ps1 -Path "C:\data" -Verbose
```

## Execution Policy

Controls whether scripts are allowed to run (a safety feature, not real security).

```powershell
Get-ExecutionPolicy                                # check current policy
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser # common dev-friendly setting
```

Common values: `Restricted` (default, no scripts), `RemoteSigned` (local scripts run, downloaded ones need a signature), `Unrestricted`, `Bypass`.

## Profile (like `.bashrc`)

```powershell
$PROFILE                    # path to your profile script
Test-Path $PROFILE            # check if it exists
notepad $PROFILE                # edit it
. $PROFILE                       # reload it in the current session
```

Use it for aliases, functions, and env vars you want in every session.

## Common Cmdlets by Category

### Filesystem

```powershell
Get-ChildItem                 # list directory contents (alias: ls, dir, gci)
Get-ChildItem -Recurse -File    # list files recursively
Set-Location C:\path              # change directory (alias: cd)
Get-Location                        # print working directory (alias: pwd)
New-Item -ItemType Directory name      # mkdir
New-Item -ItemType File name.txt          # touch
New-Item -Path . -Name "data.json" -ItemType "File"   # create a named file in current dir
Copy-Item src dest -Recurse                 # cp
Move-Item old new                             # mv / rename
Remove-Item path -Recurse -Force                # rm -rf
Test-Path path                                    # check if a path exists
Rename-Item old.txt new.txt                         # rename a file
```

### Content / Text

```powershell
Get-Content file.txt                    # cat
Get-Content file.txt -Tail 20             # tail
Get-Content file.txt -Wait -Tail 20         # tail -f (follow)
Set-Content file.txt "text"                   # overwrite file contents
Add-Content file.txt "text"                     # append to file
Select-String "pattern" file.txt                  # grep
Select-String "pattern" -Path *.log -Recurse        # recursive grep
(Get-Content file.txt) -replace "foo","bar" |
    Set-Content file.txt                              # sed-style replace
```

### Processes & Services

```powershell
Get-Process                       # ps aux
Get-Process -Name chrome            # filter by name
Stop-Process -Name chrome              # kill by name
Stop-Process -Id 1234                    # kill by PID
Start-Process notepad.exe                  # launch a process
Get-Service                                  # list services
Get-Service -Name wuauserv                     # filter by name
Start-Service / Stop-Service / Restart-Service   # control a service
```

### Filtering, Sorting, Selecting (the real power of the pipeline)

```powershell
Get-Process | Sort-Object CPU -Descending
Get-Process | Where-Object { $_.CPU -gt 100 }
Get-Process | Select-Object Name, Id, CPU -First 10
Get-ChildItem | Group-Object Extension
Get-ChildItem | Measure-Object -Property Length -Sum
Get-Process | ForEach-Object { $_.Name }
```

### System Info

```powershell
Get-ComputerInfo                  # OS/hardware summary
$PSVersionTable                     # PowerShell version info
Get-CimInstance Win32_OperatingSystem  # detailed OS info (modern replacement for Get-WmiObject)
Get-Disk / Get-Volume                    # disk info
Get-EventLog -LogName System -Newest 20    # recent system events (Windows PowerShell)
Get-WinEvent -LogName System -MaxEvents 20   # recent system events (PS7+)
```

### Networking

```powershell
Test-Connection host             # ping
Test-NetConnection host -Port 443  # test a specific port
Resolve-DnsName domain.com           # DNS lookup
Get-NetIPAddress                       # show IP addresses
Get-NetAdapter                           # list network adapters
Invoke-WebRequest https://example.com      # curl-like HTTP request
Invoke-RestMethod https://api.example.com    # fetch + auto-parse JSON
```

### Modules & Packages

```powershell
Get-Module -ListAvailable       # list installed modules
Install-Module ModuleName         # install from PowerShell Gallery
Import-Module ModuleName            # load a module into the session
Find-Module keyword                   # search the gallery
```

### Remoting

```powershell
Enter-PSSession -ComputerName remotehost      # interactive remote session
Invoke-Command -ComputerName remotehost -ScriptBlock { Get-Process }
New-PSSession -ComputerName remotehost           # persistent session object
```

## Aliases Cheat Sheet

Many familiar Unix/cmd names are actually aliases for PowerShell cmdlets:

| Alias | Real Cmdlet |
|---|---|
| `ls`, `dir` | `Get-ChildItem` |
| `cd` | `Set-Location` |
| `pwd` | `Get-Location` |
| `cat`, `type` | `Get-Content` |
| `cp`, `copy` | `Copy-Item` |
| `mv`, `move` | `Move-Item` |
| `rm`, `del`, `erase` | `Remove-Item` |
| `ps` | `Get-Process` |
| `kill` | `Stop-Process` |
| `curl`, `wget` | `Invoke-WebRequest` |
| `echo` | `Write-Output` |
| `cls`, `clear` | `Clear-Host` |
| `history` | `Get-History` |
| `man`, `help` | `Get-Help` |

```powershell
Get-Alias ls          # see what an alias actually maps to
Get-Alias -Definition Get-ChildItem   # find all aliases for a cmdlet
```

## Redirection & Pipes

```powershell
command > file          # redirect output, overwrite
command >> file            # append
command 2> file               # redirect errors (stream 2)
command 2>&1                    # merge error stream into output
command | Out-Null                # discard output
command | Tee-Object file.txt        # write to file AND pass through
```

## Creating Aliases & Shortcuts

Learn how to map long, complex commands to short keywords using CMD and PowerShell.

### Method 1: Command Prompt (CMD)

In CMD, command aliases are called **macros** and are managed using the `doskey` tool.

#### Temporary Alias (Current Session Only)

```cmd
doskey lol=curl checkip.amazonaws.com
```

#### Make Aliases Permanent in CMD

CMD clears macros when closed. To automatically load them every time CMD opens:

1. Create a script file named `macros.cmd` (e.g., at `C:\Users\YourUsername\macros.cmd`).
2. Add your custom macros line-by-line:

   ```cmd
   doskey lol=curl checkip.amazonaws.com
   doskey wifi=netsh wlan show profile * key=clear
   ```

3. Open **Registry Editor** (`Win + R` → `regedit`).
4. Navigate to: `HKEY_CURRENT_USER\Software\Microsoft\Command Processor`
5. Right-click → **New** → **String Value**.
6. Name it **`AutoRun`**.
7. Set the Value Data to your file's path: `C:\Users\YourUsername\macros.cmd`.

### Method 2: Windows PowerShell

In PowerShell, aliases for full command lines with flags or parameters are best created using **functions**.

#### Quick Syntax

- **Simple command mapping:**

  ```powershell
  Set-Alias -Name lol -Value Get-Location
  ```

- **Complex/chained command mapping (recommended):**

  ```powershell
  function lol { curl.exe checkip.amazonaws.com }
  ```

#### Make Aliases Permanent in PowerShell

To keep your shortcuts across sessions, save them to your PowerShell profile script:

1. Open PowerShell and run:

   ```powershell
   notepad $PROFILE
   ```

2. If prompted to create a new file, click **Yes**.
3. Paste your function definitions into the file:

   ```powershell
   function lol { curl.exe checkip.amazonaws.com }
   function wifi { netsh wlan show profile * key=clear }
   ```

4. Save and close Notepad.

If PowerShell shows a script execution error on startup, run this once:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## Things I Keep Forgetting

- Single quotes `'...'` never interpolate; double quotes `"..."` do.
- `-Force` is needed to see hidden files with `Get-ChildItem` (and to remove read-only/system files with `Remove-Item`).
- Comparisons use `-eq`/`-gt`/etc., not `==`/`>` — those have different meanings in PowerShell (`>` is redirection).
- `$_` refers to the current pipeline object inside `Where-Object` / `ForEach-Object` blocks.
- Arrays are `@()`, hashtables are `@{}` — easy to mix up when typing fast.
- `Get-ChildItem` doesn't recurse by default; you need `-Recurse` explicitly.
- Check `$PSVersionTable.PSVersion` before assuming a cmdlet/parameter exists — behavior differs between Windows PowerShell 5.1 and PowerShell 7+.

## Further Reading

- [Microsoft PowerShell Docs](https://learn.microsoft.com/en-us/powershell/)
- [PowerShell Gallery](https://www.powershellgallery.com/) — community modules
- [about_* conceptual help topics](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_language_keywords) — run `Get-Help about_Operators`, `Get-Help about_Pipelines`, etc.
