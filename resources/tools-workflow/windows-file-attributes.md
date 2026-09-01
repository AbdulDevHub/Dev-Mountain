---
id: windows-file-attributes
title: "Windows File Attributes (the 'd-r--' Mode Column)"
sidebar_label: Windows File Attributes
description: What the Mode column (d----, d-r--, -a---, etc.) in PowerShell's ls output actually means.
tags: [windows, powershell, file-attributes, cli, sysadmin]
---

When I run `ls` (aliased to `Get-ChildItem`) in PowerShell, the `Mode`
column shows short strings like these:

```
Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
d----          2026-07-02  5:25 PM                .agent
d-r--          2026-07-16  6:50 PM                Downloads
-a---          2026-07-04 12:54 AM            207 .gitconfig
dar--          2024-12-31 12:23 PM                OneDrive
```

That five-character string looks similar to a Unix `chmod`-style permission
string, but it's an entirely different concept: it's **Windows file
attributes**, not permissions. See
[chmod Fundamentals](./chmod-and-file-mode-basics.md) for the actual
permissions system — this page is purely about the attribute flags shown
here.

:::tip Core idea
Windows attributes are a flat set of **on/off flags** per file (hidden,
read-only, system, archive, directory, link). There's no owner, no group, no
separate read/write/execute — just switches that are either set or not.
They're a MS-DOS-era concept that Windows still carries forward.
:::

## Decoding the letters

Each position in the string is either the letter or a `-` if that flag isn't
set:

| Letter | Attribute | Meaning |
|---|---|---|
| `d` | Directory | It's a folder, not a file. |
| `a` | Archive | Marked as changed since the last backup. Nearly everything has this — Windows sets it automatically whenever a file is created or modified. It does **not** mean "archived" in the zip-file sense. |
| `r` | Read-only | The read-only attribute is set. For **files**, this blocks accidental overwrites in some apps. For **folders**, it's mostly cosmetic/legacy — Windows Explorer sets `r` on folders for its own bookkeeping (e.g., to remember a custom folder icon), and it does **not** stop you from creating, deleting, or modifying files inside a "read-only" folder. |
| `h` | Hidden | Hidden from normal directory listings (`ls` without `-Force`, Explorer without "show hidden items"). |
| `s` | System | Marked as a critical OS file — extra protection against accidental deletion. |
| `l` | Reparse point | It's a symlink, junction, or another kind of filesystem link — not a real, standalone folder/file. |

## Decoding my own examples

- **`d----`** (`.agent`) → just a normal directory. Nothing special.
- **`d-r--`** (`Downloads`) → a directory with the read-only attribute set.
  This is completely standard for Windows' built-in shell folders
  (Downloads, Documents, Music, etc.) — Windows sets `r` on these by default
  for its own internal folder-customization tracking, not to lock you out.
- **`-a---`** (`.gitconfig`) → an ordinary file, just flagged as "changed
  since last archive/backup" (true of almost every file).
- **`dar--`** (`OneDrive`) → directory, archive-flagged, read-only, *and*
  (per the fuller attribute set) a reparse point — the telltale sign of a
  sync folder, since OneDrive's local folder is a sync junction rather than
  an ordinary directory.

## Where these come from

These are **NTFS/FAT file attributes**, exposed by the Win32 API
(`GetFileAttributes`) and predating modern Windows entirely. PowerShell's
`Get-ChildItem` just renders them as a short string for convenience — it's
the same information `attrib` and Explorer's Properties dialog show, just
formatted differently.

## How to view and change them

```powershell
# View attributes the old-school way
attrib Downloads

# Remove the read-only flag from a folder (recursively)
attrib -R Downloads /S /D

# Add the hidden flag to a file
attrib +H secret.txt

# The PowerShell-native way to toggle read-only on a single file
Set-ItemProperty -Path .\myfile.txt -Name IsReadOnly -Value $false

# See attributes as a raw enum value
(Get-Item .\myfile.txt).Attributes
```

This is almost certainly the "permission" behavior most people remember
touching on Windows — toggling a file's read-only checkbox in Explorer's
Properties dialog, or running `attrib -R`, is what people usually mean by
"changing file permissions on Windows." It's an attribute flip, not a
permission grant.

## What actually controls access on Windows

Attributes are **not** access control. If I ever need real per-user/group
permissions (who can read, write, or delete a given file), that's handled
by **NTFS Access Control Lists (ACLs)** instead — a separate, much more
granular system:

```powershell
# View the ACL on a file or folder
Get-Acl .\myfile.txt | Format-List

# View/modify via the classic command-line tool
icacls .\myfolder /grant "kokok:(OI)(CI)F"   # grant full control, inherited
icacls .\myfolder /remove "Users"             # remove an entry
```

ACLs support per-identity rules (not just "owner/group/everyone"),
inheritance from parent folders, and separate allow/deny entries. That's a
big enough topic to deserve its own page if it ever comes up in practice —
for now, the main thing worth remembering is that **attributes, ACLs, and
Unix permissions (`chmod`) are three separate systems** that happen to look
superficially similar in a terminal listing.

## Quick reference

| | Windows attributes | NTFS ACLs | Unix permissions (`chmod`) |
|---|---|---|---|
| Shown by | PowerShell `Mode` column, `attrib` | `Get-Acl`, Explorer → Properties → Security | `ls -l` on Unix/Linux, `stat` |
| Concept | Flat on/off flags (hidden, read-only, system, archive, directory, link) | Per-identity allow/deny rules with inheritance | Per-owner/group/other read/write/execute bits |
| Set with | `attrib`, `Set-ItemProperty`, Explorer Properties | `icacls`, `Set-Acl`, Explorer → Security tab | `chmod` |
| Is this real access control? | No — cosmetic/bookkeeping flags | Yes — this is Windows' actual permission system | Yes — this is Unix's actual permission system |
| Where it applies | Anywhere on native Windows/NTFS | Anywhere on native Windows/NTFS | WSL, Git Bash (partially), Docker containers, actual Linux boxes |
