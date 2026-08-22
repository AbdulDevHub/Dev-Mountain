---
id: copying-network-requests-for-ai
title: "Cheat Sheet: Copying Network Requests for AI"
sidebar_label: "Copying Network Requests for AI"
description: "Quick reference for copying network requests from DevTools to share with AI tools."
---

Use this quick reference to grab network request data from your browser's DevTools and share it with an AI assistant for debugging.

## 1. Copy as cURL (Best Overall)

Captures URL, headers, and payload in one clean command.

1. **Right-click** the request.
2. Hover over **Copy**.
3. Select **Copy as cURL** (bash for Mac/Linux, cmd for Windows).
4. Paste into AI.

## 2. Copy as HAR (Best for Full Context)

Captures highly detailed JSON logs of the request or entire page.

1. **Right-click** the request.
2. Hover over **Copy**.
3. Select **Copy all as HAR** (or *Save as HAR with content*).
4. Paste into a text file or directly to AI.

## 3. Copy Specific Tabs (Best for Quick Fixes)

Captures only part of the communication.

- **Payload Tab:** Copy this to show AI what data you *sent*.
- **Response Tab:** Copy this to show AI what data you *received*.

:::warning Important
Delete passwords, API keys, or session tokens from the text before sharing it with AI.
:::
