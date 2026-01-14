---
title: Frontend Snippets
description: Handy frontend snippets, visual effects, and asset references
---

## Frontend Snippets

A small collection of useful frontend snippets and visual assets for quick reference.

---

## 🖼️ Fake Filler Images (API)

You can use this API directly in the `src` attribute of an image tag to generate placeholder profile images.

Example:

```

[https://randomuser.me/api/portraits/women/4.jpg](https://randomuser.me/api/portraits/women/4.jpg)

````

Usage:

```html
<img src="https://randomuser.me/api/portraits/women/4.jpg" alt="Profile image" />
````

Great for:

* Mockups
* User cards
* Dashboards
* Prototypes

---

## 🪟 Glassmorphism Effect (CSS)

A reusable **glass effect** using modern CSS.

```css
.glass {
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.1),
    rgba(255, 255, 255, 0)
  );
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
}
```

Best used on:

* Cards
* Modals
* Side panels
* Overlays

---

## 🧭 Snap Scrolling Asset

<img src="/assets/Snap%20Scrolling.png" alt="Snap Scrolling" />

Useful for:

* CSS `scroll-snap`
* UX examples
* Presentation references
* Design inspiration

You can embed it in Markdown like this:

```md
![Snap Scrolling](../src/assets/Snap%20Scrolling.png)
```

---

## 🧠 Notes

* These snippets are **framework-agnostic**
* Safe to reuse across projects
* Ideal for quick prototyping
