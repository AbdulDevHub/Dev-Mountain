---
id: html-quick-reference
title: HTML Quick Reference
sidebar_label: HTML Quick Reference
---

A cheat sheet for HTML syntax, semantics, and the stuff that's easy to forget.

## Boilerplate

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Page Title</title>
  <meta name="description" content="Short page description for SEO" />
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <script src="script.js" defer></script>
</body>
</html>
```

## Document Structure & Semantics

```html
<header> </header>     <!-- intro/nav content, page or section level -->
<nav> </nav>          <!-- navigation links -->
<main> </main>         <!-- the primary content, one per page -->
<article> </article>     <!-- self-contained, independently distributable content -->
<section> </section>     <!-- thematic grouping, usually with a heading -->
<aside> </aside>        <!-- tangential content, sidebars -->
<footer> </footer>      <!-- footer content, page or section level -->
<div> </div>          <!-- generic block, no semantic meaning -->
<span> </span>         <!-- generic inline, no semantic meaning -->
```

**Rule of thumb:** reach for a semantic tag first; fall back to `<div>`/`<span>` only when nothing fits.

## Headings & Text

```html
<h1>Main heading</h1>       <!-- one per page, ideally -->
<h2>Subheading</h2>
<h3>...</h3>            <!-- down to h6, don't skip levels -->

<p>Paragraph text.</p>
<br />                <!-- line break -->
<hr />                <!-- thematic break -->

<strong>important</strong>    <!-- bold + semantic emphasis -->
<em>emphasized</em>        <!-- italic + semantic emphasis -->
<b>bold</b>             <!-- bold, no semantic weight -->
<i>italic</i>            <!-- italic, no semantic weight -->
<mark>highlighted</mark>
<small>fine print</small>
<sub>subscript</sub> <sup>superscript</sup>
<code>inline code</code>
<pre>preformatted
  whitespace preserved</pre>
<blockquote cite="https://source.com">Quoted text</blockquote>
<abbr title="HyperText Markup Language">HTML</abbr>
```

## Links & Navigation

```html
<a href="https://example.com">External link</a>
<a href="https://example.com" target="_blank" rel="noopener noreferrer">New tab</a>
<a href="/about">Relative link</a>
<a href="#section-id">Jump to section on page</a>
<a href="mailto:someone@example.com">Email link</a>
<a href="tel:+15551234567">Call link</a>
<a href="file.pdf" download>Download link</a>
```

`rel="noopener noreferrer"` is important with `target="_blank"` — prevents the new page from accessing `window.opener` and improves privacy/security.

## Lists

```html
<ul>                <!-- unordered -->
  <li>Item</li>
</ul>

<ol>                <!-- ordered -->
  <li>First</li>
</ol>
<ol start="5" reversed> </ol>

<dl>                <!-- description list -->
  <dt>Term</dt>
  <dd>Definition</dd>
</dl>
```

## Images & Media

```html
<img src="photo.jpg" alt="Description for accessibility" width="600" height="400" />

<!-- responsive images -->
<img
  src="small.jpg"
  srcset="small.jpg 480w, medium.jpg 800w, large.jpg 1200w"
  sizes="(max-width: 600px) 480px, 800px"
  alt="Description"
/>

<picture>
  <source srcset="photo.webp" type="image/webp" />
  <source srcset="photo.jpg" type="image/jpeg" />
  <img src="photo.jpg" alt="Description" />
</picture>

<figure>
  <img src="photo.jpg" alt="Description" />
  <figcaption>Caption text</figcaption>
</figure>

<video src="movie.mp4" controls width="600" poster="thumb.jpg"></video>
<audio src="song.mp3" controls></audio>

<iframe src="https://example.com" title="Embedded content" width="600" height="400"></iframe>
```

`alt` is required for accessibility — use `alt=""` (empty, not omitted) for purely decorative images.

## Tables

```html
<table>
  <caption>Table caption</caption>
  <thead>
    <tr>
      <th scope="col">Name</th>
      <th scope="col">Age</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Alice</td>
      <td>30</td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <td>Total</td>
      <td>1</td>
    </tr>
  </tfoot>
</table>
```

`colspan="2"` and `rowspan="2"` on `<td>`/`<th>` merge cells.

## Forms

```html
<form action="/submit" method="POST">
  <label for="name">Name</label>
  <input type="text" id="name" name="name" placeholder="Jane Doe" required />

  <label for="email">Email</label>
  <input type="email" id="email" name="email" required />

  <input type="password" name="password" minlength="8" />
  <input type="number" name="qty" min="1" max="10" step="1" />
  <input type="date" name="dob" />
  <input type="checkbox" id="agree" name="agree" checked />
  <input type="radio" name="plan" value="basic" />
  <input type="range" min="0" max="100" />
  <input type="file" accept="image/*" multiple />
  <input type="hidden" name="token" value="abc123" />

  <label for="country">Country</label>
  <select id="country" name="country">
    <option value="ca">Canada</option>
    <option value="us" selected>United States</option>
  </select>

  <label for="bio">Bio</label>
  <textarea id="bio" name="bio" rows="4" cols="30"></textarea>

  <fieldset>
    <legend>Preferences</legend>
    <!-- grouped inputs -->
  </fieldset>

  <button type="submit">Submit</button>
  <button type="reset">Reset</button>
  <button type="button">Just a button (no form action)</button>
</form>
```

**Common `<input type>` values:** `text`, `email`, `password`, `number`, `tel`, `url`, `search`, `date`, `time`, `checkbox`, `radio`, `file`, `range`, `color`, `hidden`.

**Useful attributes:** `required`, `disabled`, `readonly`, `placeholder`, `pattern`, `autocomplete`, `autofocus`, `min`/`max`/`step`, `minlength`/`maxlength`.

## Buttons vs Links

- `<a href="...">` — navigates to a URL. Use for anything that changes the page/location.
- `<button>` — triggers an action (JS handler, form submit). Use for anything that doesn't navigate.
- Don't use `<div onclick>` for either — you lose keyboard access and semantics for free.

## Semantic Attributes for Accessibility

```html
<button aria-label="Close dialog">×</button>
<div role="alert">Error message</div>
<input aria-describedby="hint" />
<span id="hint">Must be 8+ characters</span>
<img alt="" />                <!-- decorative image -->
<div aria-hidden="true"></div>   <!-- hide from screen readers -->
<button aria-expanded="false" aria-controls="menu">Menu</button>
```

## Meta Tags Worth Knowing

```html
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta name="description" content="..." />
<meta name="robots" content="noindex, nofollow" />

<!-- Open Graph (social previews) -->
<meta property="og:title" content="Page Title" />
<meta property="og:description" content="..." />
<meta property="og:image" content="https://example.com/image.jpg" />
<meta property="og:url" content="https://example.com" />

<!-- Favicon -->
<link rel="icon" href="/favicon.ico" />
```

## Void (Self-Closing) Elements

These never have children or a closing tag:

```
<br> <hr> <img> <input> <meta> <link> <source> <col> <area> <embed> <track> <wbr>
```

## Comments

```html
<!-- This is a comment, not rendered -->
```

## Common Gotchas

- **`<label for="id">` must match the input's `id`**, not its `name` — this is what makes clicking the label focus the input (and matters a lot for accessibility).
- **Block vs inline**: elements like `<div>`, `<p>`, `<section>` stack vertically by default; `<span>`, `<a>`, `<strong>` flow inline. This is a default, not a rule — CSS `display` can override it.
- **Don't nest block elements inside inline elements** (e.g. `<div>` inside `<span>`) — browsers will often "fix" it in ways you don't expect.
- **`id` must be unique per page**; `class` can repeat freely.
- **Self-closing syntax (`<img />`) is optional in HTML5** — `<img>` alone is valid — but pick one style and stay consistent.
- **Script placement**: put `<script src="...">` right before `</body>`, or use `defer` in `<head>`, so it doesn't block page rendering.
- **`target="_blank"` without `rel="noopener"`** is a known security/performance footgun.
- **Buttons inside forms default to `type="submit"`** — if you want a button that doesn't submit the form, set `type="button"` explicitly.
