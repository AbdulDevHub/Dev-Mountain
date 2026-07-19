---
id: electronjs
title: Electron.js
sidebar_label: Electron.js
description: Notes on Electron.js architecture, processes, IPC, APIs, packaging, and security.
tags: [electron, desktop, nodejs, javascript]
---

## What is Electron?

Electron is a framework for building cross-platform desktop apps using web
technologies (HTML, CSS, JS). It works by bundling **Chromium** (for
rendering UI) and **Node.js** (for system-level access) into a single
runtime, so a web app can also read files, spawn processes, create native
menus, etc.

Notable apps built with it: VS Code, Slack, Discord, Figma (desktop), Notion.

**Trade-off to remember:** you get "write once, ship everywhere" desktop
apps, but at the cost of shipping an entire Chromium + Node runtime per app
(~100–200MB installs) and higher memory usage than a native app.

---

## Core architecture: Main vs Renderer

Electron apps are **multi-process**, mirroring Chromium's own architecture.

### Main process

- Entry point of the app (the file referenced in `package.json`'s `"main"`).
- Exactly **one** main process per app.
- Runs in a full Node.js environment.
- Owns app lifecycle, creates/controls `BrowserWindow` instances, has access
  to native OS APIs (menus, tray, dialogs, notifications, file system).
- Think of it as the "backend" of your desktop app.

### Renderer process

- One renderer process per `BrowserWindow` (or `<webview>`).
- Runs the actual web page (your UI) inside a Chromium browser context.
- By default (modern Electron), renderers are **sandboxed** and do **not**
  have direct Node.js or Electron API access — this is a deliberate
  security boundary, not a limitation to "fix" by disabling it.
- Think of it as the "frontend."

### Why the split matters

Chromium's multi-process model means a crash in one renderer (one window/tab)
doesn't take down the whole app. It also means untrusted or remote web
content (if you ever load any) is isolated from OS-level capabilities.

```
┌─────────────────────┐
│   Main Process       │  Node.js, full OS access, app lifecycle
│  (background.js)     │
└─────────┬────────────┘
          │ creates
          ▼
┌─────────────────────┐      ┌─────────────────────┐
│ Renderer Process #1  │      │ Renderer Process #2  │
│ (BrowserWindow, UI)  │      │ (another window)     │
│ Sandboxed, no Node   │      │ Sandboxed, no Node   │
└─────────────────────┘      └─────────────────────┘
```

---

## The preload script (the bridge)

Since renderers can't touch Node/Electron APIs directly, you need a
**preload script** — it runs in a special context that has access to a
limited set of Node APIs *and* the renderer's `window`, before the web page
loads.

The safe pattern is `contextBridge` + `ipcRenderer`, **never** just setting
`nodeIntegration: true` and calling it done.

```js
// preload.js
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('api', {
  openFile: () => ipcRenderer.invoke('dialog:openFile'),
  onUpdateCounter: (callback) =>
    ipcRenderer.on('update-counter', (_event, value) => callback(value)),
})
```

```js
// renderer.js (in your web page, no Node access, but window.api exists)
document.getElementById('open-btn').addEventListener('click', async () => {
  const filePath = await window.api.openFile()
  console.log(filePath)
})
```

**Mental model:** the preload script is like a controlled API surface you
hand to the frontend — you decide exactly which functions it can call,
instead of exposing all of Node.

---

## IPC (Inter-Process Communication)

Because main and renderer are separate processes, they can't just call each
other's functions directly — they talk via message passing.

| Pattern | Direction | API |
|---|---|---|
| Renderer → Main (fire and forget) | one-way | `ipcRenderer.send` / `ipcMain.on` |
| Renderer → Main (request/response) | two-way | `ipcRenderer.invoke` / `ipcMain.handle` |
| Main → Renderer | one-way | `webContents.send` / `ipcRenderer.on` |

```js
// main.js
const { ipcMain, dialog } = require('electron')

ipcMain.handle('dialog:openFile', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog()
  return canceled ? null : filePaths[0]
})
```

`invoke`/`handle` is the modern preferred pattern for anything that returns
a value, since it's promise-based instead of relying on manually named
"reply" channels.

---

## Key building blocks / APIs

- **`app`** — app lifecycle events (`ready`, `window-all-closed`,
  `before-quit`), path helpers (`app.getPath('userData')`), single-instance
  locking.
- **`BrowserWindow`** — creates and controls a native OS window that hosts a
  renderer. Configured via `webPreferences` (this is where
  `preload`, `contextIsolation`, `sandbox`, `nodeIntegration` live).
- **`Menu` / `MenuItem`** — native application and context menus.
- **`Tray`** — system tray / menu bar icon.
- **`dialog`** — native open/save/message boxes.
- **`shell`** — interact with the OS shell (open external URLs/files in the
  default app, move items to trash).
- **`Notification`** — native OS notifications.
- **`autoUpdater`** — built-in auto-update mechanism (commonly paired with
  a service like [electron-builder](https://www.electron.build/) +
  GitHub Releases, or Squirrel).
- **`webContents`** — the underlying renderer content object; used for
  things like `send()`, executing JS, printing to PDF, devtools control.

---

## Security checklist

Electron's security model assumes you'll load your *own* trusted local
files, but the defaults exist because historically many apps got this
wrong. Rules of thumb:

1. **Keep `contextIsolation: true`** (default since Electron 12). Keeps the
   preload script's JS context separate from the page's, so a compromised
   page can't reach into Node internals via prototype pollution.
2. **Keep `nodeIntegration: false`** in renderers (default). Never enable
   this just to avoid writing a preload bridge.
3. **Keep `sandbox: true`** where possible (default since Electron 20).
4. Only expose the *specific* functions a renderer needs via
   `contextBridge`, not entire modules (`ipcRenderer` itself, `fs`, etc).
5. Validate/sanitize anything coming over IPC from the renderer in the main
   process — treat it like input from an untrusted client, especially if
   you ever load remote content.
6. Set a `Content-Security-Policy` if loading any remote/web content.
7. Don't disable `webSecurity`.

---

## Packaging & distribution

Electron itself doesn't produce installers — you use a separate tool:

- **[electron-builder](https://www.electron.build/)** — most popular;
  handles NSIS installers (Windows), DMG (macOS), AppImage/deb/rpm (Linux),
  code signing, and auto-update feeds in one config.
- **[Electron Forge](https://www.electronforge.io/)** — official Electron
  team tool; more "batteries included" scaffolding (webpack/vite templates,
  makers, publishers).
- **electron-packager** — lower-level, just bundles the app without
  installers.

Typical `package.json` scripts:

```json
{
  "scripts": {
    "start": "electron .",
    "package": "electron-builder --dir",
    "dist": "electron-builder"
  }
}
```

Code signing matters in practice: unsigned macOS builds get Gatekeeper
warnings, and unsigned Windows builds trigger SmartScreen warnings.

---

## Common gotchas / lessons learned

- `__dirname` behaves as expected in the main process, but be careful with
  paths after packaging (`app.asar`) — files inside the asar archive aren't
  a normal filesystem path for some Node APIs; use `app.getAppPath()` /
  `path.join` carefully, or `asarUnpack` specific files if needed.
- Opening external links: use `shell.openExternal(url)`, and intercept
  `window.open` / navigation events (`will-navigate`, `setWindowOpenHandler`)
  so links don't hijack your app window or open unsandboxed windows.
- Memory: each `BrowserWindow` is basically a Chrome tab's worth of
  overhead — don't spin up dozens of hidden windows if you can avoid it.
- Dev vs prod loading: typically `win.loadURL('http://localhost:5173')` in
  dev (pointing at a Vite/webpack dev server) and
  `win.loadFile('dist/index.html')` in production.
- Native modules (anything with a `.node` binary, e.g. `better-sqlite3`)
  need to be rebuilt against Electron's Node/ABI version — tools like
  `electron-rebuild` or `@electron/rebuild` handle this.

---

## Minimal working example

```js
// main.js
const { app, BrowserWindow } = require('electron')
const path = require('node:path')

function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })
  win.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
```

---

## Further reading

- [Official Electron docs](https://www.electronjs.org/docs/latest/)
- [Electron security guidelines](https://www.electronjs.org/docs/latest/tutorial/security)
- [electron-builder docs](https://www.electron.build/)
- [Electron Forge docs](https://www.electronforge.io/)
