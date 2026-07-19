---
title: Linux
sidebar_label: Linux
tags: [linux, cli, sysadmin, devops]
---

Personal reference notes on Linux: core concepts, the filesystem, permissions, and the commands I actually reach for day to day.

:::tip Related
Working on Windows instead? See [PowerShell](./powershell.md) for the shell fundamentals, or [Terminal Commands](./terminal-commands.md) for ready-to-use PowerShell / Node.js scripts (project linting, file management, duplicate detection, etc.).
:::

## Core Concepts

- **Everything is a file** — devices, sockets, and pipes are all represented as files under `/dev`, `/proc`, etc.
- **Kernel vs. distro** — the kernel is the core (process/memory/device management); a *distribution* (Ubuntu, Debian, Fedora, Arch, Alpine...) bundles the kernel with a package manager, init system, and userland tools.
- **Shell** — the command interpreter. Most distros default to `bash`; `zsh` and `fish` are popular alternatives. Check with:

```bash
echo $SHELL
```

- **Init system** — most modern distros use `systemd` to manage services/boot. Older or minimal systems may use `SysVinit` or `OpenRC`.

## Filesystem Hierarchy Standard (FHS)

| Path | Purpose |
|---|---|
| `/` | Root of the filesystem |
| `/bin`, `/usr/bin` | Essential user binaries |
| `/sbin`, `/usr/sbin` | System admin binaries |
| `/etc` | System-wide configuration files |
| `/home` | User home directories |
| `/root` | Root user's home directory |
| `/var` | Variable data — logs, caches, spool files |
| `/var/log` | Log files |
| `/tmp` | Temporary files (often cleared on reboot) |
| `/opt` | Optional/third-party software |
| `/proc` | Virtual filesystem exposing kernel/process info |
| `/dev` | Device files |
| `/mnt`, `/media` | Mount points for filesystems/removable media |
| `/lib`, `/usr/lib` | Shared libraries |
| `/boot` | Bootloader files, kernel images |

## File Permissions

Permissions shown by `ls -l` look like `-rwxr-xr--`:

- Position 1: file type (`-` file, `d` directory, `l` symlink)
- Next 3: owner permissions (rwx)
- Next 3: group permissions (rwx)
- Next 3: other permissions (rwx)

Numeric (octal) shorthand: `r=4`, `w=2`, `x=1`, summed per group.

```bash
chmod 755 script.sh      # rwxr-xr-x
chmod u+x script.sh      # add execute for owner
chown user:group file    # change owner and group
chgrp group file         # change group only
```

Special bits:

- **setuid (4000)** — run as file owner
- **setgid (2000)** — run as group owner / inherit group on new files in a dir
- **sticky bit (1000)** — only owner can delete files in a shared dir (e.g. `/tmp`)

```bash
chmod 4755 binary   # setuid example
chmod 1777 /tmp      # sticky bit example
```

## Popular Commands

### Navigation & File Management

```bash
pwd                     # print working directory
ls -la                  # list all files, long format, incl. hidden
cd /path/to/dir         # change directory
cd -                    # jump to previous directory
cp -r src/ dest/        # copy recursively
mv old new               # move/rename
rm -rf dir/             # remove recursively, force (careful!)
mkdir -p a/b/c           # create nested dirs
touch file.txt           # create empty file / update timestamp
find . -name "*.log"     # find files by name
find . -mtime -7         # files modified in last 7 days
locate filename           # fast file search (needs updatedb / mlocate)
tree -L 2                 # show directory tree, 2 levels deep
```

### Viewing & Editing Files

```bash
cat file.txt              # print whole file
less file.txt              # paginated viewer (q to quit)
head -n 20 file.txt          # first 20 lines
tail -n 20 file.txt           # last 20 lines
tail -f app.log                # follow file live (logs)
nano file.txt                   # simple terminal editor
vim file.txt                     # modal editor
```

### Text Processing

```bash
grep -rn "pattern" .        # recursive, show line numbers
grep -i "pattern" file       # case-insensitive
grep -v "pattern" file        # invert match (exclude)
sed 's/foo/bar/g' file         # find & replace
awk '{print $1}' file           # print first column
sort file | uniq -c              # sort + count duplicates
wc -l file                        # count lines
cut -d',' -f2 file.csv             # extract 2nd CSV column
diff file1 file2                    # compare files
xargs                                # build/execute commands from stdin
```

### Permissions & Ownership

```bash
chmod 644 file
chown -R user:group dir/
umask                       # view default permission mask
```

### Process Management

```bash
ps aux                     # list all running processes
ps aux | grep nginx         # find a specific process
top                          # live process viewer
htop                          # nicer live process viewer (if installed)
kill PID                        # terminate a process (SIGTERM)
kill -9 PID                      # force kill (SIGKILL)
killall processname               # kill by name
pkill -f pattern                    # kill by matched command line
bg / fg                              # background/foreground a job
jobs                                  # list background jobs
nohup command &                        # run immune to hangup, in background
disown                                  # detach job from shell
nice -n 10 command                       # run with lower priority
renice 10 -p PID                          # change priority of running process
```

### Disk & Storage

```bash
df -h                     # disk free space, human-readable
du -sh *                   # size of each item in current dir
du -sh dir/                 # total size of a directory
lsblk                        # list block devices
mount /dev/sdb1 /mnt          # mount a device
umount /mnt                    # unmount
fdisk -l                        # list partitions (needs sudo)
mkfs.ext4 /dev/sdb1               # format a partition
```

### Networking

```bash
ip a                       # show IP addresses / interfaces
ip r                        # show routing table
ping host                    # test connectivity
curl -I https://example.com   # fetch headers
curl -o file.zip URL           # download a file
wget URL                        # download a file
ss -tulpn                        # show listening ports (modern netstat)
netstat -tulpn                    # legacy version of the above
dig domain.com                     # DNS lookup
nslookup domain.com                 # DNS lookup, simpler output
traceroute host                      # trace network path
scp file user@host:/path              # copy file over SSH
rsync -avz src/ user@host:/dest/       # efficient sync (local or remote)
ssh user@host                           # remote shell
ssh -i key.pem user@host                 # remote shell with key
```

### Package Management

```bash
# Debian/Ubuntu (APT)
apt update && apt upgrade
apt install package
apt remove package
apt search keyword

# RHEL/Fedora (DNF/YUM)
dnf install package
dnf update

# Arch (Pacman)
pacman -S package
pacman -Syu

# Universal / language-agnostic
snap install package
flatpak install package
```

### Users & Groups

```bash
whoami                    # current user
id                          # current user's UID/GID/groups
sudo command                 # run as root
su - username                 # switch user
adduser username               # create a user (interactive, Debian-style)
useradd -m username              # create a user with home dir
passwd username                    # set/change password
usermod -aG groupname username      # add user to a group
groups username                       # list groups a user belongs to
```

### System Info & Monitoring

```bash
uname -a                  # kernel/system info
hostnamectl                 # hostname & OS info
uptime                        # how long system has been running + load avg
free -h                        # memory usage
lscpu                            # CPU info
dmesg | tail                       # recent kernel messages
journalctl -xe                       # recent systemd logs
journalctl -u service_name             # logs for a specific service
history                                  # command history
history | grep ssh                        # search command history
```

### systemd Services

```bash
systemctl status service_name
systemctl start service_name
systemctl stop service_name
systemctl restart service_name
systemctl enable service_name    # start on boot
systemctl disable service_name
systemctl list-units --type=service
```

### Archiving & Compression

```bash
tar -czvf archive.tar.gz dir/    # create gzip tarball
tar -xzvf archive.tar.gz          # extract gzip tarball
tar -tzvf archive.tar.gz           # list contents without extracting
zip -r archive.zip dir/             # create zip
unzip archive.zip                     # extract zip
```

### Environment & Shell

```bash
export VAR=value           # set env var for session
echo $VAR                    # print env var
env                           # list all env vars
alias ll='ls -la'              # create a shortcut
which command                    # locate a command's binary
type command                      # show how shell resolves a command
man command                        # manual page
command --help                      # quick usage help
```

## Useful Shortcuts (Bash)

| Shortcut | Action |
|---|---|
| `Ctrl+C` | Kill current foreground process |
| `Ctrl+Z` | Suspend current process (resume with `fg`) |
| `Ctrl+R` | Reverse search command history |
| `Ctrl+A` / `Ctrl+E` | Jump to start / end of line |
| `Ctrl+L` | Clear screen |
| `Ctrl+D` | Exit shell / EOF |
| `!!` | Repeat last command |
| `!$` | Last argument of previous command |
| `sudo !!` | Re-run last command with sudo |

## Redirection & Pipes

```bash
command > file        # redirect stdout, overwrite
command >> file         # redirect stdout, append
command 2> file           # redirect stderr
command &> file             # redirect both stdout and stderr
command < file                # use file as stdin
cmd1 | cmd2                     # pipe stdout of cmd1 into cmd2
command &                        # run in background
```

## Things I Keep Forgetting

- `chmod -R` and `chown -R` apply recursively — double check the target directory before running.
- `rm -rf` has no undo. Consider `rm -i` for confirmation prompts, or `trash-cli` as a safer alternative.
- `sudo !!` re-runs the last command with `sudo` prepended — handy after a `Permission denied`.
- Symlinks: `ln -s target linkname` (target first, link name second — easy to mix up).
- `du -sh *` doesn't include hidden files; add `.[!.]*` or use `du -sh .[!.]* *` to catch dotfiles too.
- `ss` is the modern replacement for `netstat` on most current distros.
- Exit status of the last command: `echo $?` (`0` = success).

## Further Reading

- [Linux man pages online](https://man7.org/linux/man-pages/)
- [Arch Wiki](https://wiki.archlinux.org/) — excellent even if not using Arch
- [explainshell.com](https://explainshell.com/) — breaks down what a shell command does, piece by piece
