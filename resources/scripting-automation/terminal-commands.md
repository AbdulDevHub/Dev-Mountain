---
title: Useful Terminal Commands
description: Collection of useful PowerShell, Node.js, and file management commands.
sidebar_label: Terminal Commands (PowerShell)
tags: [powershell, windows, cli, nodejs, file-management]
---

A collection of terminal commands I frequently use for project maintenance, file management, dependency analysis, and PowerShell automation.

:::tip Related
For PowerShell syntax, variables, and pipeline concepts, see [PowerShell](./powershell.md). For the Unix/bash equivalents, see [Linux](./linux.md).
:::

---

## Project Analysis

### Run ESLint

```bash
npx eslint .
```

Lint the current project.

### Find Unused Imports

```bash
npx unimport
```

Detect unused imports in the project.

### Find Unused Dependencies

```bash
npx depcheck
```

Identify dependencies that are not being used.

---

## Directory Tree Commands

### Display Source Tree

```powershell
tree src /F
```

Show the complete file tree under `src`.

### Display Current Directory Tree (ASCII)

```powershell
tree . /F /A
```

Generate an ASCII-compatible tree.

### Save Directory Tree to a File

```powershell
tree . /F /A > tree.txt
```

Export the tree structure to `tree.txt`.

---

## File Operations

### Delete a File

```powershell
Remove-Item src\components\drink_utilities\defaultData.js
```

Delete a specific file.

### Rename a File

```powershell
Rename-Item nelitfy.toml netlify.toml
```

Rename a file.

### Create a New Markdown File

```powershell
New-Item pnpm-guide.md
```

Create a new file.

---

## Recently Modified Files

### Sort Files by Last Modified Date

```powershell
Get-ChildItem | Sort-Object LastWriteTime -Descending
```

Display files ordered by most recently modified.

---

## List Directories and Subdirectories

```powershell
Get-ChildItem -Directory | ForEach-Object {
    Write-Host "`n $($_.Name)" -ForegroundColor Cyan
    Get-ChildItem $_.FullName -Directory | ForEach-Object {
        Write-Host "    $($_.Name)"
    }
}
```

Output top-level directories and their immediate subdirectories.

---

## PowerShell History

### Locate PowerShell History File

```powershell
(Get-PSReadLineOption).HistorySavePath
```

Returns the path where PowerShell command history is stored.

---

## Image Utilities

### Find Images Smaller Than or Equal to 1280px Wide

```powershell
Get-ChildItem -File | ForEach-Object {
    try {
        $img = [System.Drawing.Image]::FromFile($_.FullName)

        if ($img.Width -le 1280) {
            [PSCustomObject]@{
                FileName = $_.Name
                Width    = $img.Width
                Height   = $img.Height
            }
        }

        $img.Dispose()
    }
    catch {
        # Skip files that aren't valid images
    }
}
```

Useful for identifying images that may be too small for certain use cases.

---

## Duplicate File Detection

### Show Duplicate Files

```powershell
Get-ChildItem -Recurse -File |
Get-FileHash -Algorithm MD5 |
Group-Object Hash |
Where-Object { $_.Count -gt 1 } |
ForEach-Object {
    $_.Group | Select-Object Path, Length
}
```

Displays duplicate files grouped by MD5 hash.

### Display Paths of Duplicate Files

```powershell
Get-ChildItem -Recurse -File |
Get-FileHash -Algorithm MD5 |
Group-Object Hash |
Where-Object { $_.Count -gt 1 } |
ForEach-Object { $_.Group.Path }
```

Outputs only duplicate file paths.

---

## Duplicate File Cleanup

### Delete All Duplicate Files

```powershell
Get-ChildItem -Recurse -File |
Get-FileHash -Algorithm MD5 |
Group-Object Hash |
Where-Object { $_.Count -gt 1 } |
ForEach-Object { $_.Group.Path } |
Remove-Item -Force
```

Deletes every file belonging to a duplicate group.

### Keep One Copy and Remove Remaining Duplicates

```powershell
Get-ChildItem -Recurse -File |
Get-FileHash -Algorithm MD5 |
Group-Object Hash |
Where-Object { $_.Count -gt 1 } |
ForEach-Object {
    $_.Group | Select-Object -Skip 1 | ForEach-Object {
        Remove-Item $_.Path -Force
    }
}
```

Preserves the first file in each duplicate set and removes the rest.

---

## Notes

* Most commands are designed for **PowerShell**.
* Duplicate detection uses **MD5 hashes**.
* Always review files before running deletion commands.
* Consider committing changes to Git before performing bulk file operations.
