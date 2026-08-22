---
id: computer-and-network-fundamentals
title: Computer & Network Fundamentals
sidebar_label: Computer & Network Fundamentals
tags: [system-design, interview-prep, networking]
---

Before you can reason about distributed systems, it helps to know what's happening on a single machine and how machines talk to each other. This is the "below the app layer" foundation.

## Hardware & the Memory Hierarchy

Computers store and move data as **bits** (0 or 1); 8 bits = 1 **byte**. Storage scales up from there: KB → MB → GB → TB.

The closer data lives to the CPU, the faster (and smaller/more expensive) it is:

| Layer | Speed | Persists without power? | Role |
| --- | --- | --- | --- |
| **CPU Cache (L1/L2/L3)** | Nanoseconds — fastest | No (volatile) | Tiny, sits right next to the CPU; checked first |
| **RAM** | 5,000+ MB/s | No (volatile) | Active programs, variables, runtime state |
| **SSD** | 500–3,500 MB/s | Yes | OS, applications, files |
| **HDD** | 80–160 MB/s | Yes | OS, applications, files (older/cheaper tech) |

> **Mental model:** the CPU checks L1 first, then L2, then L3, then falls back to RAM — each miss costs more time. This is the same "cache-aside" idea you see at the application layer (check cache, fall back to slower storage on a miss), just one level down in the stack.

The **CPU** fetches, decodes, and executes machine code. High-level languages (Python, Java, C++) have to be compiled down to machine code before the CPU can run them. The **motherboard** is what physically wires the CPU, RAM, and storage together.

## Networking Basics

- **IP addresses** identify a device on a network. **IPv4** uses 32-bit addresses (~4 billion possible, which is why we're running out) and **IPv6** uses 128-bit addresses (effectively unlimited). IPs can be **public** (routable on the internet) or **private** (only within a local network), and **static** (fixed) or **dynamic** (reassigned periodically).
- **Ports** combine with an IP address to identify a specific service on a machine — e.g., port 80 for HTTP, port 443 for HTTPS, port 22 for SSH.
- **Firewalls** control what traffic is allowed in or out of a network based on rules.

## Transport Layer: TCP vs. UDP

Both sit "under" application protocols like HTTP, and the choice between them is a classic interview trade-off:

| | TCP | UDP |
| --- | --- | --- |
| Connection | Connection-based (3-way handshake before data flows) | Connectionless — just send |
| Reliability | Guaranteed delivery, ordered via sequence numbers, retransmits lost packets | No delivery guarantee, no ordering |
| Speed | Slower (overhead of guarantees) | Faster |
| Typical use | Web pages, APIs, file transfer — anywhere correctness matters | Video calls, live streaming, gaming — anywhere *speed* matters more than a perfect packet |

> **Rule of thumb:** if losing or reordering a packet would break the application (a corrupted file, a wrong bank balance), use TCP. If a dropped packet is just a half-second of pixelation you'd rather not wait to retransmit anyway, use UDP.

## DNS (Domain Name System)

DNS translates human-readable domain names (`example.com`) into IP addresses. The two record types you'll see most:

- **A record** — maps a domain to an IPv4 address.
- **AAAA record** — maps a domain to an IPv6 address.

## Application Layer Protocols — Quick Reference

| Protocol | What it's for |
| --- | --- |
| **HTTP** | Stateless request/response over TCP; the backbone of the web |
| **WebSockets** | Persistent, bi-directional connection — for real-time features (chat, live dashboards) |
| **SMTP** | Sending email |
| **IMAP** | Receiving email, synced across multiple devices |
| **POP3** | Receiving email, downloaded locally to one device |
| **FTP** | Transferring files |
| **SSH** | Encrypted remote administration/shell access |
| **WebRTC** | Peer-to-peer, browser-to-browser real-time communication (video calls) |
| **MQTT** | Lightweight pub/sub messaging for low-bandwidth IoT devices |
| **AMQP** | Enterprise message queuing (e.g., what RabbitMQ implements) |
| **RPC** | Lets a client call a function on a remote server as if it were local |

> Where this connects to your other notes: HTTP is what REST APIs run on; AMQP/MQTT are the "message queue" idea (from *Message Queues and Rate Limiting*) implemented as actual wire protocols; WebSockets are the go-to when a message queue's async delivery isn't real-time *enough* and the client needs a live push channel instead.
