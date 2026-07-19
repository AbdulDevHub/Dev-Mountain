---
id: regex-cheatsheet
title: Regex (JavaScript)
description: Personal reference for regular expressions, focused on JavaScript usage.
tags: [javascript, regex, cheatsheet]
---

Personal notes on regular expressions, with a JavaScript-first focus. The theory
(character classes, quantifiers, groups...) is language-agnostic, but every method,
flag, and gotcha here is verified against JS behavior.

## What a regex actually is

A regex is a pattern-matching engine. You write a pattern, the engine walks a string
left to right (mostly), and tries to find a substring the pattern matches. In JS a
regex is its own type (`RegExp`), not just a string.

Two ways to create one:

```js
const re1 = /foo.bar/gi;      // literal — preferred, compiled at parse time
const re2 = new RegExp("foo.bar", "gi"); // constructor — use when pattern is dynamic
```

Use the constructor when the pattern is built from a variable:

```js
const word = "hello";
const re = new RegExp(`\\b${word}\\b`, "i");
```

:::warning Escaping in the constructor
Inside `new RegExp("...")` the string itself needs `\\` for a literal backslash,
since the string parser eats one level of escaping before the regex engine sees it.
`/\d/` === `new RegExp("\\d")`.
:::

## Flags

| Flag | Name | Effect |
|---|---|---|
| `g` | global | find **all** matches, not just the first |
| `i` | ignoreCase | case-insensitive matching |
| `m` | multiline | `^` and `$` match start/end of each line, not just whole string |
| `s` | dotAll | `.` also matches newlines |
| `u` | unicode | treat pattern/string as full Unicode (proper handling of astral chars, `\p{...}`) |
| `y` | sticky | match must start exactly at `lastIndex`, no scanning ahead |
| `d` | hasIndices | `exec()`/`match()` results include start/end indices per group |

`u` is worth defaulting to almost always — without it, things like emoji or
surrogate pairs get split incorrectly and `\p{Letter}`-style Unicode property
escapes don't work at all.

## Building blocks

### Character classes

```
.        any char except newline (unless /s flag)
\d  \D   digit / non-digit          [0-9]
\w  \W   word char / non-word char  [A-Za-z0-9_]
\s  \S   whitespace / non-whitespace
[abc]    any of a, b, c
[^abc]   none of a, b, c
[a-z]    range
```

### Anchors & boundaries

```
^     start of string (or line, with /m)
$     end of string (or line, with /m)
\b    word boundary
\B    NOT a word boundary
```

### Quantifiers

```
*      0 or more   (greedy)
+      1 or more   (greedy)
?      0 or 1      (greedy)
{n}    exactly n
{n,}   n or more
{n,m}  between n and m
*?  +?  ??  {n,m}?   lazy versions — match as little as possible
```

**Greedy vs lazy** is the single most common source of bugs:

```js
"<a><b>".match(/<.+>/)[0];   // "<a><b>"  (greedy — grabs as much as possible)
"<a><b>".match(/<.+?>/)[0];  // "<a>"     (lazy — stops at first match)
```

### Groups

```
(abc)         capturing group — numbered $1, $2...
(?:abc)       non-capturing group — groups without creating a backreference
(?<name>abc)  named capturing group — access via match.groups.name
(?=abc)       positive lookahead  — must be followed by abc, not consumed
(?!abc)       negative lookahead  — must NOT be followed by abc
(?<=abc)      positive lookbehind — must be preceded by abc, not consumed
(?<!abc)      negative lookbehind — must NOT be preceded by abc
\1  \2        backreference to group 1, 2...
\k<name>      backreference to a named group
```

Lookbehind (`(?<=...)`, `(?<!...)`) is fully supported in all modern JS engines
(V8/Node, Firefox, Safari 16.4+) — no need to avoid it anymore.

Example — extract a price without capturing the currency symbol:

```js
"Price: $42.50".match(/(?<=\$)\d+\.\d+/)[0]; // "42.50"
```

Named groups example:

```js
const re = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/;
const m = "2026-07-16".match(re);
m.groups.year;  // "2026"
m.groups.month; // "07"
```

## JavaScript regex methods

There are two families: string methods that take a regex, and regex methods
that take a string. Easy to mix these up.

| Method | Called on | Returns |
|---|---|---|
| `str.match(re)` | string | array of matches (or captured groups if not `/g`), or `null` |
| `str.matchAll(re)` | string | iterator of match objects — **requires `/g` flag** |
| `str.replace(re, repl)` | string | new string, first match only (unless `/g`) |
| `str.replaceAll(re, repl)` | string | new string, all matches — regex **must** have `/g` |
| `str.search(re)` | string | index of first match, or `-1` |
| `str.split(re)` | string | array split on matches |
| `re.test(str)` | regex | boolean |
| `re.exec(str)` | regex | match array, or `null`; stateful with `/g`/`/y` |

### `match` vs `matchAll`

```js
"a1 b2 c3".match(/\d/g);       // ["1", "2", "3"]  — flat array, no group info
[..."a1 b2 c3".matchAll(/(\w)(\d)/g)]
  .map(m => [m[1], m[2]]);     // [["a","1"], ["b","2"], ["c","3"]] — full detail
```

`matchAll` gives you a full match object (with groups, index) for every match,
`match` with `/g` throws that detail away and just gives you the substrings.

### `replace` with a function

The replacer function receives `(match, ...capturedGroups, offset, fullString, groups)`:

```js
"2026-07-16".replace(/(\d{4})-(\d{2})-(\d{2})/, (_, y, m, d) => `${d}/${m}/${y}`);
// "16/07/2026"
```

Named-group substitution string syntax (no function needed):

```js
"2026-07-16".replace(/(?<y>\d{4})-(?<m>\d{2})-(?<d>\d{2})/, "$<d>/$<m>/$<y>");
// "16/07/2026"
```

### `test()` / `exec()` statefulness gotcha ⚠️

If a regex has the `g` or `y` flag, it's **stateful** — it remembers `lastIndex`
between calls on the *same regex object*. This bites people constantly:

```js
const re = /foo/g;
re.test("foo foo"); // true, lastIndex now 3
re.test("foo foo"); // true, lastIndex now 7
re.test("foo foo"); // false! lastIndex reset to 0 — looks like it "randomly" fails
```

Fixes:

- Don't reuse a `/g` regex across independent `test()` calls — declare it fresh
  or reset `re.lastIndex = 0`.
- If you only want a yes/no check, drop the `g` flag entirely.
- This is also why `const re = /foo/g;` declared at module scope and reused
  across function calls is a classic source of intermittent bugs.

## Common patterns I actually use

```js
// Trim whitespace (native .trim() is better, but for reference)
str.replace(/^\s+|\s+$/g, "");

// Collapse multiple spaces into one
str.replace(/\s+/g, " ");

// Split on comma, allowing optional surrounding spaces
str.split(/\s*,\s*/);

// camelCase -> kebab-case
str.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();

// Extract all hashtags
str.match(/#\w+/g);

// Basic (NOT RFC-perfect) email check — good enough for form UX, not validation
/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// URL-ish check
/^https?:\/\/[^\s]+$/i.test(url);

// Strip HTML tags (fine for simple cases; don't use on untrusted input — use a real parser)
str.replace(/<[^>]*>/g, "");

// Digits only
str.replace(/\D/g, "");

// Numeric string (int or float, optional sign)
/^-?\d+(\.\d+)?$/.test(str);
```

:::danger Don't parse HTML/XML with regex for real
The tag-stripping example above is fine for quick cleanup of trusted strings.
For anything user-facing or security-relevant, use `DOMParser` or a proper
HTML parser — regex can't correctly handle nested/malformed markup.
:::

## Escaping special characters

These 12 characters are "special" and need `\` to be literal:
`. * + ? ^ $ { } ( ) | [ ] \`

To escape a dynamically-built string before dropping it into a regex:

```js
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
new RegExp(escapeRegex(userInput));
```

(As of newer JS engines, `RegExp.escape()` is landing as a built-in — check
support before relying on it; the manual version above always works.)

## Performance: catastrophic backtracking

Nested quantifiers over the same characters can blow up combinatorially:

```js
// DANGER — exponential time on non-matching input
/^(a+)+$/.test("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa!");
```

Each `a` can be grouped in multiple ways by the outer `+`, and when the final
match fails, the engine backtracks through all of them. This can freeze a
Node process (a real ReDoS vector if the pattern runs on user input).

Rules of thumb:

- Avoid nested quantifiers on overlapping character sets (`(a+)+`, `(a*)*`, `(a|a)*`).
- Prefer specific character classes over `.` where possible — less ambiguity to backtrack through.
- Prefer lazy quantifiers when you expect short matches.
- For untrusted input, consider a length cap before regex, or a dedicated
  linear-time engine.

## Quick decision cheatsheet

- Need all matches with full detail (groups, index)? → `matchAll` (requires `/g`)
- Need all matches, just the strings? → `match` with `/g`
- Need a yes/no? → `test()`, **no** `/g` flag
- Need to replace all occurrences? → `replaceAll()` (regex needs `/g`) or `replace()` with `/g`
- Need position of first match? → `search()`
- Building the pattern from a variable? → `new RegExp(...)`, remember double escaping
- Matching across multiple lines? → `/m` flag for `^`/`$` per line, `/s` flag for `.` to include `\n`
- Working with emoji/non-Latin scripts? → always add `/u`

## Further reading

- [MDN: Regular expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions)
- [regex101.com](https://regex101.com/) — interactive tester with a JS flavor mode, explains every token
- [MDN: RegExp reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp)
