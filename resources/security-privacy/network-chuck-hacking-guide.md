---
title: NetworkChuck Hacking Guide
description: Personal notes from three NetworkChuck cybersecurity videos covering password cracking, Tor, Tails, and malware fundamentals.
tags:
  - cybersecurity
  - kali-linux
  - hashcat
  - hydra
  - tor
  - tails
  - malware
  - python
  - networkchuck
---

> **Purpose**
>
> These are my personal learning notes from three NetworkChuck videos. The goal is to understand **how these technologies work** from a defensive and educational perspective.
>
> ⚠️ These notes **are not authorization to perform attacks**. Only test security techniques against systems you own or have explicit permission to assess.

---

## Videos

1. Password Cracking with Kali Linux & HashCat
2. How to Access the Dark Web Safely (3 Levels)
3. Creating Malware with Python

---

## 1. Password Cracking with Kali Linux & HashCat

### Core Concepts

Password attacks generally fall into two categories:

| Online Attacks | Offline Attacks |
|---------------|----------------|
| Attack a live service | Attack stolen password hashes locally |
| Limited by network speed | Limited by hardware performance |
| Easy to detect | Much harder to detect once hashes are stolen |
| Can trigger lockouts | No account lockouts |

Offline attacks are significantly faster because no network communication is required.

---

## Online Dictionary Attacks (Hydra)

### What is Hydra?

Hydra is a login brute-force tool that automates authentication attempts against many protocols, including:

- SSH
- FTP
- HTTP
- HTTPS
- SMB
- RDP
- Telnet
- MySQL
- PostgreSQL
- and many more

Instead of manually entering passwords, Hydra reads a wordlist and attempts each password automatically.

---

### Dictionary Attack

A dictionary attack tests passwords from a predefined list instead of trying every possible combination.

Advantages:

- Faster than brute force
- More realistic
- Works well because many users reuse common passwords

Example wordlists:

- `rockyou.txt`
- SecLists
- Custom company-specific wordlists

---

### rockyou.txt

Kali Linux includes one of the most famous password lists:

```text
/usr/share/wordlists/rockyou.txt
```

It contains over **14 million** leaked passwords from the 2009 RockYou breach.

Because it comes from real users, it is much more effective than randomly generated passwords.

---

### Hydra Example

```bash
hydra -l dwight.schrute -P wordlist.txt 45.x.x.x ssh
```

#### Arguments

| Flag | Meaning |
|-------|---------|
| `-l` | Single username |
| `-L` | Username file |
| `-p` | Single password |
| `-P` | Password file |
| `ssh` | Target service |

---

### Limitations of Online Attacks

Online attacks are usually poor choices because they are:

- Slow
- Noisy
- Logged
- Detectable
- Blocked by firewalls
- Prevented by rate limiting
- Prevented by account lockouts
- Prevented by MFA

---

## Password Hashing

### Why Hash Passwords?

Websites should **never** store passwords directly.

Instead they store a **hash**.

Example:

```
Password
↓

Hash Function

↓

Hash Value
```

Example algorithms:

- MD5 (obsolete)
- SHA-1 (obsolete)
- SHA-256
- SHA-512
- NTLM (Windows)
- bcrypt
- scrypt
- Argon2 (modern recommendation)

---

### Properties of Hash Functions

Good cryptographic hashes are:

- Deterministic
- One-way
- Fixed output length
- Collision resistant
- Fast (or intentionally slow in password hashing algorithms)

Example:

```
hello

↓

2cf24dba...
```

Changing even one character produces a completely different hash.

---

### Login Verification

Instead of comparing passwords:

```
User enters password

↓

Server hashes password

↓

Compare against stored hash

↓

Match?

Yes → Login
No → Reject
```

The server never needs to know the original password again.

---

## Offline Password Cracking

Offline cracking begins after an attacker has already obtained password hashes (for example from a compromised database or password dump).

Rather than attacking the server, the attacker repeatedly hashes candidate passwords locally until a matching hash is found.

Because everything happens on the attacker's own hardware, there are:

- no login attempts
- no account lockouts
- no rate limits
- no network delays

This is why protecting stored password hashes is critical.

---

## HashCat

HashCat is one of the fastest password recovery tools available.

It supports:

- CPU cracking
- GPU cracking
- Multiple attack modes
- Hundreds of hash formats

---

### Dictionary Attack

```bash
sudo hashcat -a 0 -m 1800 -o crackpasswords.txt hashes.txt wordlist.txt
```

#### Options

| Option | Meaning |
|---------|---------|
| `-a 0` | Dictionary attack |
| `-m 1800` | SHA-512 Unix |
| `-o` | Output cracked passwords |

---

### NTLM Example

```bash
sudo hashcat -a 0 -m 1000 -o crackpasswords.txt "HASH_STRING" wordlist.txt
```

`1000` specifies NTLM hashes.

---

### Common Hash Modes

| Mode | Hash Type |
|-------|-----------|
| 0 | MD5 |
| 100 | SHA1 |
| 1400 | SHA256 |
| 1700 | SHA512 |
| 1000 | NTLM |
| 1800 | SHA512 Unix |

(HashCat supports hundreds more.)

---

### GPU Acceleration

Modern GPUs excel at password cracking because they perform millions or even billions of similar mathematical operations in parallel.

Compared to CPUs, GPUs often provide orders-of-magnitude higher hash throughput, making offline attacks dramatically faster.

---

### Defensive Takeaways

Use:

- Long passwords
- Unique passwords
- Password managers
- Multi-factor authentication (MFA)
- Slow password hashing algorithms (bcrypt, scrypt, Argon2)
- Salting to prevent rainbow table attacks

---

## 2. Accessing the Dark Web Safely

### Internet Layers

Although often simplified into layers, the important distinction is:

| Layer | Description |
|--------|-------------|
| Surface Web | Indexed by Google |
| Deep Web | Not indexed (email, banking, private databases) |
| Dark Web | Requires special software like Tor |

---

### Common Misconception

The Deep Web and Dark Web are **not** the same thing.

Deep Web:

- Gmail
- Online banking
- Company portals
- Medical records

Dark Web:

- `.onion` websites
- Accessible via Tor
- Hidden services

---

## Tor (The Onion Router)

Tor anonymizes traffic by routing it through multiple volunteer-operated nodes.

Typical path:

```
You

↓

Guard Node

↓

Middle Relay

↓

Exit Node

↓

Destination
```

Each hop only knows the previous and next hop, not the full route.

---

### Onion Routing

Data is encrypted in multiple layers.

Each relay removes one layer before forwarding the traffic.

Like peeling an onion.

This design helps prevent any single relay from knowing both the source and destination.

---

### .onion Domains

Characteristics:

- Not indexed
- Random-looking names
- Require Tor
- Hidden services

Example:

```
abcdefgh123456789.onion
```

---

## Level 1 Security

Simply download Tor Browser.

```
Windows

↓

Tor Browser

↓

Tor Network
```

#### Advantages

- Easy
- Free

#### Disadvantages

ISP can see:

- you're using Tor

Browser exploits remain possible if unsafe content is allowed.

---

## Level 2 Security

VPN first.

Then Tor.

```
You

↓

VPN

↓

Tor

↓

Internet
```

Advantages:

- ISP sees VPN instead of Tor
- Guard node sees VPN IP
- Better privacy

---

### Harden Tor Browser

Recommended settings:

```
Privacy & Security

↓

Security Level

↓

Safest
```

This disables:

- JavaScript
- Some fonts
- Certain media features
- Many browser APIs that can aid fingerprinting

Trade-off: some websites may not function correctly.

---

## Level 3 Security

### Tails OS

Tails is a live Linux operating system focused on privacy and anonymity.

Characteristics:

- Runs entirely from USB
- Uses RAM
- Leaves minimal traces after shutdown
- Routes traffic through Tor by default

---

### Tails Installation Workflow

1. Download Tails.
2. Download Balena Etcher.
3. Flash the ISO to a USB drive (8 GB or larger).
4. Boot from the USB using your BIOS/UEFI boot menu.
5. Use the live environment.

---

### Why RAM Matters

Tails is described as "amnesic" because most activity occurs in volatile memory (RAM). When the system shuts down, the RAM contents are cleared, reducing persistent traces on the computer.

---

## Level 3.75 — Cloud Browsing

Instead of running Tor locally:

```
Your Browser

↓

Remote Sandbox

↓

Tor

↓

Dark Web
```

Benefits:

- Local machine isolated
- Disposable environment
- Malware remains inside the remote container (assuming proper isolation)

---

## Legitimate Uses of Tor

Tor is not inherently malicious.

Legitimate uses include:

- Journalism
- Whistleblowing
- Circumventing censorship
- Privacy protection
- Research
- Anonymous communication

---

## Operational Security (OpSec)

**Operational Security (OpSec)** is the practice of reducing information leakage that could identify or compromise you.

Examples include:

- Using separate identities
- Avoiding personal logins while researching
- Keeping software updated
- Using privacy-focused browsers
- Disabling unnecessary scripts
- Understanding your threat model

---

## 3. Creating Malware with Python

> **Educational Note**
>
> This video demonstrates how ransomware works internally. Understanding these concepts helps security professionals analyze, detect, and defend against real-world threats.

---

## Lab Environment

Testing destructive code on your personal computer is risky.

Instead, isolate experiments in disposable virtual machines or cloud lab environments.

The video uses:

- Ubuntu VPS
- SSH
- Python

Setup:

```bash
sudo apt update
sudo apt install python3-pip -y
```

---

## Required Libraries

```python
import os
from cryptography.fernet import Fernet
```

### os

Used for:

- listing files
- checking directories
- interacting with the operating system

---

### Fernet

Fernet provides authenticated symmetric encryption.

Properties:

- AES-based encryption
- Same key encrypts and decrypts
- Authentication to detect tampering
- URL-safe keys

---

## Symmetric Encryption

```
Secret Key

↓

Encrypt

↓

Ciphertext

↓

Same Secret Key

↓

Decrypt

↓

Original File
```

Unlike hashing, encrypted data **can** be recovered with the correct key.

---

## Encryption Script Overview

The ransomware example performs the following high-level steps:

1. Enumerate files in the current directory.
2. Exclude its own program files.
3. Generate a new encryption key.
4. Save the key locally.
5. Encrypt each target file.
6. Replace the originals with encrypted versions.
7. Display a ransom message.

The example is intentionally simplified for educational purposes and omits many techniques found in real malware.

---

## Decryption Script Overview

The companion script reverses the process by:

1. Locating the encrypted files.
2. Loading the saved key.
3. Asking for a passphrase.
4. Verifying the passphrase.
5. Decrypting the files with the same symmetric key.

---

## Real-World Malware vs Educational Example

The demo is intentionally simple.

Real malware often adds capabilities such as:

- Recursive directory traversal
- Multiple encryption threads
- Network communication with command-and-control servers
- Persistence mechanisms
- Anti-analysis and anti-debugging techniques
- Obfuscation
- Virtual machine detection
- Privilege escalation
- Modular architectures

Security researchers study these techniques to improve detection and defenses.

---

## Malware Showcase Repository

The video briefly explores an educational malware repository to examine how larger projects are organized.

Typical characteristics of mature malware projects include:

- Modular codebases
- Classes
- Helper functions
- Shared libraries
- Configuration files
- Multiple payload components

Studying project structure can improve understanding of software architecture as well as malware analysis.

---

## Key Cybersecurity Concepts Learned

### Password Attacks

- Dictionary attacks
- Brute-force attacks
- Online vs offline attacks
- Wordlists
- Password reuse
- GPU acceleration

---

### Authentication

- Password hashing
- SHA-512
- NTLM
- Password verification
- Salting
- Modern password hashing algorithms

---

### Privacy

- Tor
- Onion routing
- VPNs
- Tails
- Operational Security (OpSec)
- Hidden services

---

### Malware

- Symmetric encryption
- Fernet
- File enumeration
- Python scripting
- Secure lab environments
- Malware architecture

---

## Important Commands Mentioned

### Hydra

```bash
hydra -l USERNAME -P WORDLIST TARGET_IP ssh
```

---

### HashCat (SHA-512)

```bash
hashcat -a 0 -m 1800 hashes.txt wordlist.txt
```

---

### HashCat (NTLM)

```bash
hashcat -a 0 -m 1000 HASH wordlist.txt
```

---

### Linux Setup

```bash
sudo apt update
sudo apt install python3-pip -y
```

---

## Key Takeaways

- Online password attacks are slow and detectable.
- Offline password cracking becomes feasible if password hashes are stolen.
- Modern authentication depends on secure password hashing rather than plaintext storage.
- GPUs dramatically accelerate password recovery operations.
- Tor improves anonymity through layered routing but is not a guarantee of complete anonymity.
- VPNs, browser hardening, and Tails can improve privacy depending on the user's threat model.
- Malware commonly uses symmetric encryption to lock files, making secure key management a central part of ransomware.
- Safe cybersecurity learning should always be done in isolated lab environments under proper authorization.

---

## References

### Videos

- [Password Cracking with Kali Linux & HashCat](https://www.youtube.com/watch?v=z4_oqTZJqCo)
- [How to Access the Dark Web Safely (3 Levels)](https://www.youtube.com/watch?v=U2-JPqrALsA)
- [Creating Malware with Python](https://www.youtube.com/watch?v=UtMMjXOlRQc)

### Additional Reading

- [HashCat Documentation](https://hashcat.net/hashcat/)
- [THC Hydra](https://github.com/vanhauser-thc/thc-hydra)
- [Tor Project](https://www.torproject.org/)
- [Tails](https://tails.net/)
- [OWASP Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)
- [MITRE ATT&CK](https://attack.mitre.org/)
