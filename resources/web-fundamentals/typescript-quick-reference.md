---
id: typescript-quick-reference
title: TypeScript Quick Reference
sidebar_label: TS Quick Reference
description: A cheat sheet for TypeScript types, syntax, and common patterns.
tags: [typescript, ts, javascript, frontend, cheatsheet, reference]
---

A syntax refresher for when you've been away from TS for a while.

## Basic Types

```ts
let id: number = 5;
let name: string = "Al";
let active: boolean = true;
let tags: string[] = ["a", "b"];
let tuple: [string, number] = ["age", 30];
let anything: any = "avoid me";
let unknown: unknown = "safer than any";
let nothing: void = undefined; // typically a function return type
let never: never; // a function that never returns (throws/loops forever)

// Literal types
let direction: "up" | "down" | "left" | "right";
```

## Interfaces vs Type Aliases

```ts
// Interface — best for objects/classes, can be extended & merged
interface User {
  id: number;
  name: string;
  email?: string;       // optional
  readonly createdAt: Date; // can't be reassigned after creation
}

interface Admin extends User {
  permissions: string[];
}

// Type alias — more flexible, can represent unions, primitives, tuples
type ID = number | string;
type Point = { x: number; y: number };
type Callback = (data: string) => void;

// Merging: interfaces of the same name auto-merge, types do not
interface Box { width: number }
interface Box { height: number } // merges into one Box
```

**Rule of thumb:** use `interface` for object shapes you might extend; use `type` for unions, tuples, or function signatures.

## Functions

```ts
function add(a: number, b: number): number {
  return a + b;
}

// Optional & default params
function greet(name: string, greeting: string = "Hello"): string {
  return `${greeting}, ${name}`;
}

function log(message?: string): void {
  console.log(message ?? "no message");
}

// Arrow function with types
const multiply = (a: number, b: number): number => a * b;

// Function type
type MathOp = (a: number, b: number) => number;
const divide: MathOp = (a, b) => a / b;

// Rest params
function sum(...nums: number[]): number {
  return nums.reduce((a, b) => a + b, 0);
}
```

## Union & Intersection Types

```ts
// Union — one of several types
let value: string | number;

function printId(id: string | number) {
  if (typeof id === "string") {
    console.log(id.toUpperCase()); // narrowed to string here
  } else {
    console.log(id.toFixed(2));    // narrowed to number here
  }
}

// Intersection — combine multiple types into one
type Named = { name: string };
type Aged = { age: number };
type Person = Named & Aged; // must have both name AND age
```

## Generics

```ts
function identity<T>(value: T): T {
  return value;
}

identity<string>("hello");
identity(42); // T inferred as number

// Generic interfaces
interface ApiResponse<T> {
  data: T;
  error: string | null;
}

const response: ApiResponse<User> = { data: user, error: null };

// Generic with constraints
function getLength<T extends { length: number }>(item: T): number {
  return item.length;
}

// Multiple type params
function pair<A, B>(a: A, b: B): [A, B] {
  return [a, b];
}

// Common generic utility patterns
class Box<T> {
  constructor(private value: T) {}
  get(): T {
    return this.value;
  }
}
```

## Utility Types

```ts
interface User {
  id: number;
  name: string;
  email: string;
}

Partial<User>;      // all properties optional
Required<User>;     // all properties required
Readonly<User>;     // all properties readonly
Pick<User, "id" | "name">;    // only id and name
Omit<User, "email">;          // everything except email
Record<string, number>;       // { [key: string]: number }
Exclude<"a" | "b" | "c", "a">; // "b" | "c"
Extract<"a" | "b" | "c", "a" | "d">; // "a"
ReturnType<typeof myFunc>;    // the return type of a function
Parameters<typeof myFunc>;    // tuple of a function's param types
NonNullable<string | null | undefined>; // string
```

## Type Narrowing

```ts
// typeof
if (typeof value === "string") { /* ... */ }

// instanceof
if (error instanceof Error) { /* ... */ }

// in
if ("email" in user) { /* ... */ }

// Truthiness / equality checks also narrow
if (value != null) { /* value is not null or undefined */ }

// Custom type guards
function isUser(obj: unknown): obj is User {
  return typeof obj === "object" && obj !== null && "id" in obj;
}
```

## Enums

```ts
enum Direction {
  Up,
  Down,
  Left,
  Right,
}
// Direction.Up === 0

enum Status {
  Active = "ACTIVE",
  Inactive = "INACTIVE",
}

// const enum — inlined at compile time, no runtime object
const enum Level {
  Low,
  High,
}

// Often preferred alternative: a union of string literals
type Status2 = "ACTIVE" | "INACTIVE";
```

## Classes

```ts
class Animal {
  private name: string;
  protected age: number = 0;
  readonly species: string;

  constructor(name: string, species: string) {
    this.name = name;
    this.species = species;
  }

  speak(): string {
    return `${this.name} makes a sound.`;
  }
}

// Shorthand constructor properties
class Point {
  constructor(public x: number, public y: number) {}
}

// Implementing an interface
interface Shape {
  area(): number;
}

class Circle implements Shape {
  constructor(private radius: number) {}
  area(): number {
    return Math.PI * this.radius ** 2;
  }
}

// Abstract classes
abstract class Base {
  abstract doWork(): void; // must be implemented by subclasses
  run(): void {
    console.log("running...");
  }
}
```

## Type Assertions

```ts
const el = document.getElementById("app") as HTMLDivElement;
const el2 = <HTMLDivElement>document.getElementById("app"); // not allowed in .tsx files

// Non-null assertion — "trust me, this isn't null/undefined"
const value = maybeUndefined!;

// as const — lock down literal types
const config = { mode: "production" } as const; // mode: "production", not string
const tuple = [1, 2] as const; // readonly [1, 2]
```

## Arrays & Tuples

```ts
let list: number[] = [1, 2, 3];
let list2: Array<number> = [1, 2, 3]; // equivalent

let tuple: [string, number] = ["age", 30];
let optionalTuple: [string, number?] = ["age"];
let namedTuple: [name: string, age: number] = ["Al", 30]; // labels for readability

// Readonly array
let readonlyList: readonly number[] = [1, 2, 3];
```

## Modules & Type-only Imports

```ts
// Type-only import — erased at compile time, no runtime cost
import type { User } from "./types";
import { type User, getUser } from "./types"; // mixed

export type { User };
```

## Mapped & Conditional Types (good to recognize)

```ts
// Mapped type
type Optional<T> = {
  [K in keyof T]?: T[K];
};

// Conditional type
type IsString<T> = T extends string ? true : false;

// Template literal types
type EventName = `on${Capitalize<"click" | "hover">}`;
// "onClick" | "onHover"
```

## Common Gotchas

```ts
// `any` disables type checking entirely — prefer `unknown` and narrow it
function process(data: unknown) {
  if (typeof data === "string") {
    console.log(data.toUpperCase()); // safe
  }
}

// Excess property checks only apply to object literals directly assigned
interface Config { name: string }
const c: Config = { name: "x", extra: 1 }; // ERROR: excess property
const obj = { name: "x", extra: 1 };
const c2: Config = obj; // OK — no excess check via a variable

// Structural typing — TS cares about shape, not declared type name
interface Point { x: number; y: number }
function log(p: Point) { console.log(p); }
log({ x: 1, y: 2, z: 3 }); // OK, extra props allowed when not a literal

// Non-null assertion (!) doesn't actually check anything at runtime
const el = document.getElementById("missing")!; // could still be null!
```

## tsconfig.json Essentials

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "noUnusedLocals": true,
    "noImplicitAny": true
  }
}
```

`strict: true` turns on the full set of strict checks (`noImplicitAny`, `strictNullChecks`, etc.) — recommended for all new projects.
