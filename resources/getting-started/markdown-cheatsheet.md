---
id: markdown-cheatsheet
title: Markdown Cheat Sheet
sidebar_label: Markdown Cheat Sheet
description: A quick reference for Markdown syntax, including Docusaurus-flavored extras.
keywords: [markdown, cheatsheet, reference, syntax, docusaurus]
tags: [markdown, cheatsheet, reference, syntax, docusaurus]
---

Quick reference for Markdown syntax. Bookmark this so you never have to Google
"how to do a table in markdown" again.

## Headers

```md
# H1
## H2
### H3
#### H4
##### H5
###### H6
```

## Emphasis

```md
*italic* or _italic_
**bold** or __bold__
***bold italic*** or ___bold italic___
~~strikethrough~~
```

Renders as: *italic*, **bold**, ***bold italic***, ~~strikethrough~~

## Line Breaks & Paragraphs

- A blank line starts a new paragraph.
- Two trailing spaces at the end of a line force a line break `  `.
- Alternatively use `<br />` for an explicit break.

## Lists

**Unordered:**

```md
- Item 1
- Item 2
  - Nested item
* Also works with asterisks
+ Or plus signs
```

**Ordered:**

```md
1. First
2. Second
   1. Nested
3. Third
```

**Task lists (GitHub-flavored, supported by Docusaurus):**

```md
- [x] Done thing
- [ ] Not done thing
```

## Links

```md
[Link text](https://example.com)
[Link with title](https://example.com "Tooltip text")
[Reference link][ref]

[ref]: https://example.com
```

**Internal Docusaurus links (relative, to another doc):**

```md
[See the intro](./intro.md)
[See the guide](../guides/getting-started.md)
```

## Images

```md
![Alt text](https://example.com/image.png)
![Alt text with title](./img/local-image.png "Title text")
```

## Blockquotes

```md
> Single line quote

> Multi-line quote
> continues here
>
> > Nested quote
```

## Code

**Inline:** `` `code` `` → `code`

**Fenced block with language (enables syntax highlighting):**

````md
```js
const x = 1;
console.log(x);
```
````

**Fenced block with a title (Docusaurus extension):**

````md
```js title="src/index.js"
console.log("hello");
```
````

**Line highlighting (Docusaurus extension):**

````md
```js {1,3-4}
const a = 1;
const b = 2;
const c = 3;
const d = 4;
```
````

## Tables

```md
| Left | Center | Right |
| :--- | :----: | ----: |
| a    | b      | c     |
| 1    | 2      | 3     |
```

Colon placement controls alignment: `:---` left, `:---:` center, `---:` right.

## Horizontal Rule

```md
---
***
___
```

## Footnotes

```md
Here's a claim that needs a citation.[^1]

[^1]: This is the footnote text.
```

## Escaping Characters

Prefix with a backslash to show a literal character:

```md
\* not a bullet
\# not a header
```

## Front Matter (Docusaurus page metadata)

Goes at the very top of the file:

```md
---
id: my-doc
title: My Doc Title
sidebar_label: Short Label
sidebar_position: 2
description: Shown in meta tags and search results.
tags: [tag1, tag2]
---
```

## Docusaurus Admonitions

```md
:::note
Some **content** with markdown syntax.
:::

:::tip
A helpful tip.
:::

:::info
Just some info.
:::

:::warning
Be careful here.
:::

:::danger
Take extreme care.
:::

:::note[Custom Title]
Admonition with a custom title.
:::
```

## Details / Collapsible Sections

```md
<details>
<summary>Click to expand</summary>

Hidden content goes here. Remember the blank line above
so Markdown parses the content inside correctly.

</details>
```

## Importing Code from Files (Docusaurus extension)

```md
\```mdx-code-block
import CodeBlock from '@theme/CodeBlock';
import MyComponent from '!!raw-loader!./myComponent';

<CodeBlock language="jsx">{MyComponent}</CodeBlock>
\```
```

## Embedding JSX / Components (MDX only)

If the file is `.mdx`, you can drop in React components directly:

```mdx
import MyButton from '@site/src/components/MyButton';

<MyButton>Click me</MyButton>
```

## Quick Gotchas

- Docusaurus docs use `.md` or `.mdx` — use `.mdx` when you need JSX/components.
- Curly braces `{ }` are special in `.mdx` files (JSX expressions) — escape them
  as `\{` `\}` or wrap in a code span if you just want literal braces.
- Relative links between docs should point to the source `.md`/`.mdx` file,
  not the built URL.
- HTML tags work in both `.md` and `.mdx`, but self-closing tags like `<br />`
  need the closing slash in `.mdx`.
