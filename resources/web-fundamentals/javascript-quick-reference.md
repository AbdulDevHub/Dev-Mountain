---
id: javascript-quick-reference
title: JavaScript Quick Reference
sidebar_label: JS Quick Reference
description: A cheat sheet for JavaScript array methods, syntax, and common patterns.
tags: [javascript, js, frontend, cheatsheet, reference]
---

A syntax refresher for when you've been away from JS for a while. Focused on array methods and other things that are easy to forget.

## Array Methods

### Iteration (no return value used)

```js
const nums = [1, 2, 3, 4, 5];

nums.forEach((n, i, arr) => {
  console.log(n, i); // value, index
});
```

### `map` — transform each item, same length out

```js
const doubled = nums.map(n => n * 2);
// [2, 4, 6, 8, 10]
```

### `filter` — keep items that pass a test

```js
const evens = nums.filter(n => n % 2 === 0);
// [2, 4]
```

### `find` — first item that matches (or `undefined`)

```js
const firstEven = nums.find(n => n % 2 === 0);
// 2
```

### `findIndex` / `findLastIndex` — index of match (or `-1`)

```js
nums.findIndex(n => n > 3);     // 3
nums.findLastIndex(n => n > 3); // 4
```

### `some` / `every` — boolean checks

```js
nums.some(n => n > 4);  // true  (at least one)
nums.every(n => n > 0); // true  (all of them)
```

### `reduce` — fold into a single value

```js
const sum = nums.reduce((acc, n) => acc + n, 0);
// 15

// Building an object
const byId = items.reduce((acc, item) => {
  acc[item.id] = item;
  return acc;
}, {});
```

### `includes` — does it contain a value?

```js
nums.includes(3); // true
```

### `sort` — mutates in place, sorts as strings by default!

```js
[10, 1, 21].sort();              // [1, 10, 21]  WRONG order (string sort)
[10, 1, 21].sort((a, b) => a - b); // [1, 10, 21] ascending, numeric
[10, 1, 21].sort((a, b) => b - a); // [21, 10, 1] descending
```

### `flat` / `flatMap`

```js
[1, [2, 3], [4, [5]]].flat();      // [1, 2, 3, 4, [5]]
[1, [2, 3], [4, [5]]].flat(2);     // [1, 2, 3, 4, 5]

[1, 2, 3].flatMap(n => [n, n * 2]);
// [1, 2, 2, 4, 3, 6]
```

### `slice` vs `splice`

```js
// slice: non-mutating, returns a copy
arr.slice(1, 3); // items at index 1,2

// splice: MUTATES, can remove/insert
arr.splice(1, 2);        // remove 2 items starting at index 1
arr.splice(1, 0, "new"); // insert "new" at index 1
```

### Other useful ones

```js
Array.isArray(nums);          // true
Array.from({ length: 5 }, (_, i) => i); // [0,1,2,3,4]
Array.of(1, 2, 3);            // [1, 2, 3]
nums.join(", ");               // "1, 2, 3, 4, 5"
nums.reverse();                 // mutates, reverses in place
nums.at(-1);                    // last element
```

### Quick decision guide

| Need to...                        | Use          |
|-----------------------------------|--------------|
| Transform every item               | `map`        |
| Keep some items                    | `filter`     |
| Get one matching item              | `find`       |
| Get index of matching item         | `findIndex`  |
| Check if any/all match             | `some`/`every` |
| Collapse to one value (sum, object)| `reduce`     |
| Just loop, no new array needed     | `forEach`    |

## Destructuring

```js
// Arrays
const [first, second, ...rest] = [1, 2, 3, 4];

// Objects
const { name, age, ...others } = { name: "Al", age: 30, city: "NYC" };

// Renaming + defaults
const { name: userName, role = "guest" } = user;

// Nested
const { address: { city } } = user;

// Function params
function greet({ name, age = 18 }) {
  console.log(`${name} is ${age}`);
}
```

## Spread / Rest

```js
// Spread — expand
const combined = [...arr1, ...arr2];
const cloned = { ...obj };
const merged = { ...obj1, ...obj2 }; // later keys win

// Rest — collect
function sum(...numbers) {
  return numbers.reduce((a, b) => a + b, 0);
}
```

## Template Literals

```js
const name = "world";
console.log(`Hello, ${name}!`);

// Multi-line
const msg = `Line one
Line two`;
```

## Optional Chaining & Nullish Coalescing

```js
user?.address?.city;       // undefined instead of throwing
user?.greet?.();           // safe optional method call
arr?.[0];                  // safe optional index access

const value = input ?? "default"; // only falls back on null/undefined
const value2 = input || "default"; // falls back on any falsy value
```

## Arrow Functions

```js
const add = (a, b) => a + b;          // implicit return
const square = n => n * n;             // single param, no parens needed
const obj = () => ({ key: "value" });  // returning object literal needs parens

// `this` is lexically bound — doesn't rebind inside arrow functions
```

## Promises & Async/Await

```js
// Promise basics
fetch(url)
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));

// async/await
async function getData() {
  try {
    const res = await fetch(url);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
  }
}

// Run in parallel
const [a, b] = await Promise.all([fetchA(), fetchB()]);

// Settle regardless of success/failure
const results = await Promise.allSettled([fetchA(), fetchB()]);
```

## Object Methods

```js
Object.keys(obj);            // ["a", "b"]
Object.values(obj);          // [1, 2]
Object.entries(obj);         // [["a", 1], ["b", 2]]
Object.fromEntries(entries); // back to object
Object.assign({}, obj1, obj2); // merge (spread is usually cleaner)
Object.freeze(obj);          // make immutable (shallow)

// Iterate
for (const [key, value] of Object.entries(obj)) {
  console.log(key, value);
}
```

## String Methods

```js
str.trim();                  // remove whitespace from both ends
str.includes("sub");
str.startsWith("pre");
str.endsWith("suf");
str.padStart(5, "0");        // "007"
str.split(",");
str.replace("a", "b");       // first match only
str.replaceAll("a", "b");
str.slice(0, 3);
str.toUpperCase() / toLowerCase();
```

## Equality & Truthiness

```js
0 == "0";   // true  (loose, avoid)
0 === "0";  // false (strict, prefer this)

// Falsy values: false, 0, "", null, undefined, NaN
// Everything else is truthy — including "0", "false", [], {}
```

## Modules

```js
// Named exports
export const foo = 1;
export function bar() {}

// Default export
export default function App() {}

// Imports
import App from "./App";
import { foo, bar } from "./utils";
import * as utils from "./utils";
```

## `var` vs `let` vs `const`

| Keyword | Scope     | Reassignable | Hoisted            |
|---------|-----------|--------------|---------------------|
| `var`   | function  | yes          | yes (initialized `undefined`) |
| `let`   | block     | yes          | yes (temporal dead zone) |
| `const` | block     | no*          | yes (temporal dead zone) |

\* `const` prevents reassignment, not mutation — `const arr = []; arr.push(1)` is fine.

## Classes

```js
class Animal {
  #privateField = "hidden"; // private field

  constructor(name) {
    this.name = name;
  }

  speak() {
    return `${this.name} makes a sound.`;
  }

  static create(name) {
    return new Animal(name);
  }
}

class Dog extends Animal {
  speak() {
    return `${super.speak()} Specifically, a bark.`;
  }
}
```

## Common Gotchas

```js
// Comparing objects/arrays by reference, not value
[1,2] === [1,2]; // false

// Mutating array/object state directly (bad in React etc.)
arr.push(x);        // mutates
const newArr = [...arr, x]; // doesn't

// Closures capturing loop variables
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0); // logs 3, 3, 3
}
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0); // logs 0, 1, 2 (let is block-scoped)
}
```
