---
id: chmod-and-file-mode-basics
title: "Chmod Fundamentals"
sidebar_label: Chmod & File Permissions
description: How chmod and Unix file permissions actually work — symbolic mode, numeric mode, and where chmod applies on a Windows machine.
---

`chmod` ("change mode") is the standard Unix/Linux command for setting
**permission bits** on a file or directory — who can read it, write to it,
or execute it. I've used it a couple of times without fully having the model
down, so this page is the reference for actually understanding it.

---

## The permission model

Every file/directory has three permission **triads** and three permission
**bits** per triad:

```
-rwxr-xr--
 └┬┘└┬┘└┬┘
  │  │  └── other (everyone else): r-- (read only)
  │  └───── group:                 r-x (read + execute)
  └──────── owner:                 rwx (read + write + execute)
```

| Bit | File meaning | Directory meaning |
|---|---|---|
| `r` (read) | Can view file contents | Can list directory contents (`ls`) |
| `w` (write) | Can modify/overwrite the file | Can create/delete/rename files inside it |
| `x` (execute) | Can run it as a program/script | Can `cd` into it / traverse it |

The very first character (before the triads) indicates file **type**, not
permission — `-` for a regular file, `d` for directory, `l` for symlink,
etc.

## Symbolic mode

```bash
chmod u+x script.sh        # add execute for the owner (user)
chmod g-w file.txt         # remove write for the group
chmod o=r file.txt         # set "other" to exactly read-only
chmod a+x script.sh        # add execute for everyone (a = all)
chmod ug+rw shared.txt     # add read+write for owner and group
```

`u` = user/owner, `g` = group, `o` = other, `a` = all.
`+` adds a permission, `-` removes it, `=` sets it exactly (clearing
anything not listed).

## Numeric (octal) mode

Each permission bit has a value: `r=4`, `w=2`, `x=1`. Add them up per triad:

| Number | Permissions | Meaning |
|---|---|---|
| `7` | `rwx` | read + write + execute |
| `6` | `rw-` | read + write |
| `5` | `r-x` | read + execute |
| `4` | `r--` | read only |
| `0` | `---` | nothing |

So a mode is three digits: owner, group, other.

```bash
chmod 755 script.sh    # rwxr-xr-x — owner: full, everyone else: read+execute
chmod 644 file.txt     # rw-r--r-- — owner: read+write, everyone else: read
chmod 600 secrets.env  # rw-------  — owner only, nobody else
chmod 777 folder/      # rwxrwxrwx — everyone, full access (rarely a good idea)
```

**Cheat sheet for what I'll actually reach for:**

- `chmod +x script.sh` → "make this script runnable" (the #1 real-world use)
- `chmod 644 file` → "normal file, owner edits, everyone reads" (typical for
  config files, source files)
- `chmod 600 file` → "private, only I should read/write this" (SSH keys,
  `.env` files with secrets)
- `chmod 755 dir/` → "normal folder, owner manages, everyone can browse into
  it" (typical default for directories)

:::caution Recursive changes
`chmod -R` applies a mode to a folder *and everything inside it*. Be careful
running `chmod -R 777` anywhere — it's a common "just make it work" hack
that quietly turns off all real access control on everything underneath.
:::

## `chmod` vs. `chown`

Worth noting since they're often used together: `chmod` changes **what**
permissions exist; `chown` changes **who** owns the file (and optionally
which group it belongs to) in the first place. `chmod` alone never changes
ownership.

```bash
chown kokok:kokok file.txt   # set owner and group
chmod 644 file.txt            # then set permissions
```

## Where `chmod` actually applies on this machine

Windows doesn't have `chmod` natively — its real access-control system is
NTFS ACLs, not Unix permission bits (`icacls` / `Get-Acl` / `Set-Acl`, a
separate topic). `chmod` only does something meaningful in environments with
a genuine Unix-style filesystem underneath:

- **WSL** (Windows Subsystem for Linux) — a real Linux filesystem/kernel
  interface, where `chmod` works exactly as it would on native Linux.
- **Git Bash / MSYS2** on Windows — an emulation layer. `chmod` here
  **partially** works: it can flip the "user execute" bit that Git tracks in
  its own index (relevant for shebang scripts and git's own file-mode
  tracking), but it can't grant true multi-user Unix permissions, since the
  underlying filesystem is still NTFS.
- **Docker containers** — the container's filesystem is a real Linux
  filesystem (even on a Windows host, via the Linux VM backing Docker
  Desktop/WSL2), so `chmod` inside a container behaves like real Linux.
- **Any actual Linux server** — the genuine, unambiguous use case.

This is very likely where I actually used `chmod` before — most probably
inside WSL, Git Bash, or a Docker container, with `chmod +x script.sh` being
the most common trigger (making a shell script executable before running
it).

:::note Not the same thing as a Windows file listing
If a Windows file listing shows something like `d-r--` or `-a---`, that is
**not** related to `chmod` at all — a completely different system, covered
on its own page: [Windows File Attributes](./windows-file-attributes.md).
:::
