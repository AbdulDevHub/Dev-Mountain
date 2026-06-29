---
sidebar_label: Browser Console Scripting
title: Browser Console Scripting
description: A practical guide to using the browser console to automate tasks, inspect pages, and run useful scripts — no extensions required.
---

The browser console is one of the most underutilized tools available to developers and power users alike. If you know your way around DevTools, you already have access to a scriptable interface that can automate tedious tasks, extract data, and bend web pages to your will — all without installing anything.

This guide covers the core concepts and a collection of practical, reusable scripts for common scenarios.

---

## How the Browser Console Works

Every modern browser ships with a set of developer tools (DevTools) that expose the internals of a loaded web page. The **Console** tab within DevTools is a live JavaScript execution environment — it runs in the context of the current page, meaning you have direct read/write access to the DOM, JavaScript variables, and event listeners on that page.

### Opening the Console

| OS | Shortcut |
|----|----------|
| Windows / Linux | `F12` or `Ctrl+Shift+I`, then click **Console** |
| macOS | `Cmd+Option+I`, then click **Console** |

Paste any script from this guide into the prompt at the bottom and press **Enter** to run it.

:::note Ephemeral by design
Any changes you make via the console are temporary. They live in the browser's in-memory DOM and disappear the moment you refresh or navigate away. Nothing you do here modifies the server or the original source files.
:::

---

## A Note on Framework State

If you're working on a React, Vue, or Angular app, be aware that simply setting `input.value = "something"` may not be enough — these frameworks maintain their own internal state tree, and a raw DOM mutation won't trigger a re-render or state update.

To properly trigger framework-aware updates, simulate user events:

```javascript
const input = document.querySelector('#my-input');
input.value = 'new value';
input.dispatchEvent(new Event('input', { bubbles: true }));
```

Using `.click()` on buttons and checkboxes has the same effect — it fires the full event pipeline rather than just flipping a property.

---

## Scripts

### 1. Extract a Table to CSV

Copying data out of a large HTML table cell by cell is painful. This script grabs the first table on the page, formats it as CSV, and triggers a browser download.

```javascript
(function () {
  const table = document.querySelector('table');
  if (!table) return console.error('No table found on this page.');

  let csvContent = '';
  table.querySelectorAll('tr').forEach(row => {
    const cols = Array.from(row.querySelectorAll('th, td')).map(col => {
      const text = col.innerText.replace(/"/g, '""');
      return `"${text}"`;
    });
    csvContent += cols.join(',') + '\n';
  });

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', `table_export_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
})();
```

**Tip:** If the page has multiple tables, swap `querySelector` for `querySelectorAll('table')[n]` where `n` is the zero-based index of the table you want.

---

### 2. Reveal Masked Password Fields

Useful when you're auditing saved credentials or debugging an autofill issue and need to confirm what value is actually in a password input.

```javascript
document.querySelectorAll('input[type="password"]').forEach(input => {
  input.type = 'text';
  console.log(`Revealed: name="${input.name || ''}" id="${input.id || ''}"`);
});
```

This changes the visual rendering only — the value itself is unchanged.

---

### 3. Bulk-Check All Checkboxes

Handy for permissions matrices, delete-all confirmation screens, or any UI with a long list of opt-in boxes and no "select all" button.

```javascript
const checkboxes = document.querySelectorAll('input[type="checkbox"]');
checkboxes.forEach(box => {
  if (!box.checked) box.click(); // .click() ensures framework state updates
});
console.log(`Checked ${checkboxes.length} checkbox(es).`);
```

Swap `!box.checked` for `box.checked` if you want to uncheck everything instead.

---

### 4. Override Video Playback Speed

Many video players cap their speed controls at `2x`. The underlying `<video>` element has no such restriction — you can set `playbackRate` to any value directly.

```javascript
const targetSpeed = 2.5; // change this to whatever you need

const videos = document.querySelectorAll('video');
if (videos.length === 0) {
  console.warn('No HTML5 video element found on this page.');
} else {
  videos.forEach(video => (video.playbackRate = targetSpeed));
  console.log(`Set playback rate to ${targetSpeed}x on ${videos.length} video(s).`);
}
```

Values below `1` slow the video down; values above `1` speed it up. Most browsers support rates between `0.0625` and `16`.

---

### 5. Remove Intrusive Overlays and Cookie Banners

When a modal or consent banner blocks the page and the close button does nothing, you can remove it directly from the DOM and restore scroll access.

```javascript
// Inspect the overlay element and replace the selector below with its class or ID
const overlaySelector = '.cookie-banner, #consent-modal, .modal-backdrop';

document.querySelectorAll(overlaySelector).forEach(el => el.remove());

// Restore scroll if the modal locked the page
document.body.style.overflow = 'auto';
document.documentElement.style.overflow = 'auto';

console.log('Overlay removed and scroll restored.');
```

**How to find the right selector:** Right-click the overlay → **Inspect** → look at the `class` or `id` attribute of the element in the Elements panel, then paste it in above.

---

### 6. Copy All Links on a Page

Useful for link audits, SEO checks, or scraping a list of URLs from a directory or index page. Logs every unique href to the console and copies them to your clipboard as a newline-separated list.

```javascript
(function () {
  const links = [...document.querySelectorAll('a[href]')]
    .map(a => a.href)
    .filter((href, index, self) => href && self.indexOf(href) === index); // deduplicate

  console.log(`Found ${links.length} unique link(s):\n` + links.join('\n'));

  navigator.clipboard.writeText(links.join('\n')).then(() => {
    console.log('✅ All links copied to clipboard.');
  }).catch(() => {
    console.warn('Clipboard write failed — links are still logged above.');
  });
})();
```

**Tip:** To filter for only internal links (same origin), add `.filter(href => href.startsWith(window.location.origin))` before the deduplication step.

---

### 7. Toggle Dark Mode on Any Page

Injects a CSS dark mode onto pages that don't have one built in. Run it again to toggle it back off.

```javascript
(function () {
  const STYLE_ID = 'console-dark-mode';
  const existing = document.getElementById(STYLE_ID);

  if (existing) {
    existing.remove();
    console.log('Dark mode off.');
    return;
  }

  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    html {
      filter: invert(1) hue-rotate(180deg) !important;
    }
    img, video, canvas, picture, svg {
      filter: invert(1) hue-rotate(180deg) !important;
    }
  `;
  document.head.appendChild(style);
  console.log('Dark mode on.');
})();
```

This uses a CSS `invert + hue-rotate` trick to flip colors while keeping images looking natural.

---

### 8. Highlight Broken Images

Finds every `<img>` on the page that failed to load and outlines it in red, making broken assets easy to spot during QA or debugging.

```javascript
(function () {
  const images = document.querySelectorAll('img');
  let brokenCount = 0;

  images.forEach(img => {
    if (!img.complete || img.naturalWidth === 0) {
      img.style.outline = '3px solid red';
      img.style.opacity = '0.5';
      console.warn(`Broken image: src="${img.src || '[no src]'}"`);
      brokenCount++;
    }
  });

  console.log(`Scan complete — ${brokenCount} broken image(s) found out of ${images.length} total.`);
})();
```

---

### 9. Inspect Local Storage and Session Storage

Pretty-prints everything stored in `localStorage` and `sessionStorage` for the current origin — handy for debugging auth tokens, cached state, or feature flags.

```javascript
(function () {
  function printStorage(label, storage) {
    console.group(label);
    if (storage.length === 0) {
      console.log('(empty)');
    } else {
      for (let i = 0; i < storage.length; i++) {
        const key = storage.key(i);
        let value = storage.getItem(key);
        try { value = JSON.parse(value); } catch (_) {} // pretty-print JSON if possible
        console.log(key, value);
      }
    }
    console.groupEnd();
  }

  printStorage('localStorage', localStorage);
  printStorage('sessionStorage', sessionStorage);
})();
```

Values that are valid JSON are automatically parsed so they display as objects rather than raw strings.

---

### 10. Auto-Scroll to Bottom

Repeatedly scrolls to the bottom of the page at a set interval — useful for triggering lazy-loaded content or infinite scroll feeds. Stops after a configurable number of iterations.

```javascript
(function () {
  const maxScrolls = 20;   // how many times to scroll
  const intervalMs = 1500; // milliseconds between each scroll
  let count = 0;

  const timer = setInterval(() => {
    window.scrollTo(0, document.body.scrollHeight);
    count++;
    console.log(`Scroll ${count}/${maxScrolls}`);

    if (count >= maxScrolls) {
      clearInterval(timer);
      console.log('Auto-scroll complete.');
    }
  }, intervalMs);

  // To stop early at any time, run: clearInterval(timer)
  window._autoScrollTimer = timer;
})();
```

To cancel it early, run `clearInterval(window._autoScrollTimer)` in the console.

---

### 11. Font and Color Inspector

Click any element on the page and get its computed font family, size, weight, text color, and background color logged to the console. Press `Escape` to deactivate.

```javascript
(function () {
  function inspect(e) {
    const el = e.target;
    const styles = window.getComputedStyle(el);
    console.group(`Inspected: <${el.tagName.toLowerCase()}>`);
    console.log('Font family:  ', styles.fontFamily);
    console.log('Font size:    ', styles.fontSize);
    console.log('Font weight:  ', styles.fontWeight);
    console.log('Color:        ', styles.color);
    console.log('Background:   ', styles.backgroundColor);
    console.groupEnd();
  }

  function cleanup(e) {
    if (e.key === 'Escape') {
      document.removeEventListener('click', inspect);
      document.removeEventListener('keydown', cleanup);
      console.log('Inspector deactivated.');
    }
  }

  document.addEventListener('click', inspect);
  document.addEventListener('keydown', cleanup);
  console.log('Inspector active — click any element. Press Escape to stop.');
})();
```

---

## Limitations

**Same-Origin Policy:** The console runs with the permissions of the current page. You can't fetch data from a different domain unless that domain explicitly allows it via CORS headers.

**No persistence:** Console changes reset on refresh. If you need something permanent, look into browser extensions or userscripts (e.g., via Tampermonkey).

**CSP restrictions:** Some sites enforce a Content Security Policy that restricts what scripts can execute. If you see a CSP error in the console, the site is actively blocking inline script execution.