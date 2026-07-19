---
id: design-patterns
title: Design Patterns
sidebar_label: Design Patterns
sidebar_position: 1
tags: [software-design, oop, architecture, reference]
---

> Personal reference notes. Primary source: [refactoring.guru/design-patterns](https://refactoring.guru/design-patterns) — go there for animations and deeper examples. This page exists so that "I read about this once" turns into "I actually know this."

## Why bother with these at all

For a long time my honest opinion was: *this feels like academic overhead for problems I don't have.* That's not entirely wrong — a lot of pattern usage in the wild is over-engineering, applied because someone read a book, not because the code needed it.

The reframe that actually made these click for me:

- A design pattern is **not** a piece of code you copy-paste. It's a *named solution shape* for a recurring problem — a vocabulary word for "oh, this is one of those situations."
- The value isn't in *implementing* the pattern from memory. The value is in **recognizing the shape of the problem** so you don't reinvent (badly) something well understood.
- Most of the time you'll implement a rough, informal version without even naming it. That's fine — that's the pattern working.
- You should be more suspicious of a codebase with patterns *forced* into everything than one with none at all. Patterns solve specific problems; if the problem isn't there, the pattern is just ceremony.

**Rule of thumb:** if you can explain *why* you need the flexibility a pattern provides (not just "it's more OOP-correct"), use it. If not, don't.

## The three families

Design patterns (the classic "Gang of Four" set) split into three categories by what they're solving:

| Category | Question it answers | Examples |
|---|---|---|
| **Creational** | How do I create objects flexibly, without hardcoding the exact class? | Singleton, Factory Method, Builder |
| **Structural** | How do I compose objects/classes into larger structures cleanly? | Adapter, Decorator, Facade |
| **Behavioral** | How do objects communicate and assign responsibility for behavior? | Strategy, Observer, Command |

Below: detailed notes on the patterns I actually run into. Everything else is listed at the bottom so I at least recognize the name and know when to go look it up.

---

## Creational Patterns

### Singleton

**Problem it solves:** You need exactly one instance of a class to exist (e.g. a config manager, a connection pool, a logger), and you need a single well-known global access point to it.

**The catch:** Singleton is the most *overused* and most *criticized* pattern on this list. It's basically a global variable with a fancy name. It makes testing harder (hidden shared state) and creates hidden coupling. Use it deliberately, not by default.

```ts
class AppConfig {
  private static instance: AppConfig;
  private constructor(public readonly env: string) {}

  static getInstance(): AppConfig {
    if (!AppConfig.instance) {
      AppConfig.instance = new AppConfig(process.env.NODE_ENV ?? "development");
    }
    return AppConfig.instance;
  }
}

const config = AppConfig.getInstance();
```

**When to actually use it:** Truly singular, stateless-ish resources — logging, a single DB connection pool, a cache client. In modern practice this is often replaced by **dependency injection** (pass the single instance in explicitly instead of reaching for a global), which keeps the "one instance" guarantee without the hidden-global downside.

---

### Factory Method

**Problem it solves:** You have a base class/interface, and the exact subclass to instantiate should be decided by a subclass or config, not hardcoded with `new SpecificThing()` scattered everywhere.

**Analogy:** A logistics company that ships by `Truck` by default. If it expands into sea freight, you don't want to rewrite every place that calls `new Truck()` — you want one place that decides *which* transport to create.

```ts
interface Notification {
  send(message: string): void;
}

class EmailNotification implements Notification {
  send(message: string) { console.log(`Email: ${message}`); }
}

class SmsNotification implements Notification {
  send(message: string) { console.log(`SMS: ${message}`); }
}

abstract class NotifierCreator {
  abstract createNotification(): Notification;

  notify(message: string) {
    const notification = this.createNotification();
    notification.send(message);
  }
}

class EmailNotifier extends NotifierCreator {
  createNotification(): Notification { return new EmailNotification(); }
}
```

**When to actually use it:** When object creation logic is nontrivial (branching, config-driven) and repeated in multiple places. If you're only ever creating one type of object, you don't need this — just call the constructor.

---

### Builder

**Problem it solves:** An object needs many optional parameters, and a constructor with 8 optional args (or a giant config object with unclear required-vs-optional fields) is unreadable and error-prone.

```ts
class HttpRequestBuilder {
  private url = "";
  private method = "GET";
  private headers: Record<string, string> = {};
  private body?: string;

  setUrl(url: string) { this.url = url; return this; }
  setMethod(method: string) { this.method = method; return this; }
  addHeader(key: string, value: string) { this.headers[key] = value; return this; }
  setBody(body: string) { this.body = body; return this; }

  build() {
    return { url: this.url, method: this.method, headers: this.headers, body: this.body };
  }
}

const request = new HttpRequestBuilder()
  .setUrl("/api/users")
  .setMethod("POST")
  .addHeader("Content-Type", "application/json")
  .setBody(JSON.stringify({ name: "Alex" }))
  .build();
```

**When to actually use it:** Objects with many optional fields, or when you want step-by-step construction that reads clearly (this is basically what fluent APIs like query builders, test-data factories, and request builders are). You've almost certainly used this pattern already without naming it.

---

## Structural Patterns

### Adapter

**Problem it solves:** You have two interfaces that don't match (your code expects `.getData()`, a third-party library gives you `.fetchPayload()`), and you can't or don't want to modify either side.

**Analogy:** A power plug adapter. It doesn't change the wall socket or your laptop — it sits between them and translates.

```ts
// Third-party class you can't change
class LegacyPaymentGateway {
  makePayment(amountInCents: number) { /* ... */ }
}

// Interface your app expects
interface PaymentProcessor {
  pay(amountInDollars: number): void;
}

class PaymentGatewayAdapter implements PaymentProcessor {
  constructor(private legacyGateway: LegacyPaymentGateway) {}

  pay(amountInDollars: number) {
    this.legacyGateway.makePayment(Math.round(amountInDollars * 100));
  }
}
```

**When to actually use it:** Integrating third-party/legacy code, wrapping an old API while migrating to a new one, or normalizing multiple providers (e.g. different payment gateways) behind one interface your app talks to.

---

### Decorator

**Problem it solves:** You want to add behavior to an individual object dynamically, without subclassing every possible combination (imagine `Coffee`, `CoffeeWithMilk`, `CoffeeWithMilkAndSugar`, `CoffeeWithMilkAndSugarAndCream`... this explodes fast).

```ts
interface Coffee {
  cost(): number;
  description(): string;
}

class SimpleCoffee implements Coffee {
  cost() { return 2; }
  description() { return "Coffee"; }
}

abstract class CoffeeDecorator implements Coffee {
  constructor(protected wrapped: Coffee) {}
  cost(): number { return this.wrapped.cost(); }
  description(): string { return this.wrapped.description(); }
}

class MilkDecorator extends CoffeeDecorator {
  cost() { return super.cost() + 0.5; }
  description() { return super.description() + " + Milk"; }
}

class SugarDecorator extends CoffeeDecorator {
  cost() { return super.cost() + 0.2; }
  description() { return super.description() + " + Sugar"; }
}

const order = new SugarDecorator(new MilkDecorator(new SimpleCoffee()));
console.log(order.description(), order.cost()); // "Coffee + Milk + Sugar", 2.7
```

**When to actually use it:** Middleware chains (Express/Koa middleware is literally this pattern), stream wrappers, UI component composition (higher-order components in React are a decorator variant). Very common in the wild, rarely named out loud.

---

### Facade

**Problem it solves:** A subsystem has a complicated set of classes/steps to use correctly. You want to expose one simple interface that hides that complexity for the common case.

```ts
class AudioEncoder { encode() { /* ... */ } }
class VideoEncoder { encode() { /* ... */ } }
class SubtitleMerger { merge() { /* ... */ } }
class FileCompressor { compress() { /* ... */ } }

// Facade
class VideoConverter {
  convert(inputFile: string) {
    const audio = new AudioEncoder();
    const video = new VideoEncoder();
    const subs = new SubtitleMerger();
    const compressor = new FileCompressor();

    audio.encode();
    video.encode();
    subs.merge();
    compressor.compress();

    return "output.mp4";
  }
}

// Caller just does this:
new VideoConverter().convert("input.mov");
```

**When to actually use it:** Any time you'd otherwise be exposing every internal class of a subsystem to callers who just want "the simple 90% use case." Most well-designed SDK entry points/`index.ts` files are informal facades.

---

### Proxy

**Problem it solves:** You want to control access to an object — lazy-load it, cache its results, log calls to it, check permissions — without the caller knowing the difference.

```ts
interface ImageLoader {
  display(): void;
}

class HighResImage implements ImageLoader {
  constructor(private path: string) {
    console.log(`Loading expensive image from ${path}...`);
  }
  display() { console.log(`Displaying ${this.path}`); }
}

class LazyImageProxy implements ImageLoader {
  private realImage?: HighResImage;
  constructor(private path: string) {}

  display() {
    if (!this.realImage) {
      this.realImage = new HighResImage(this.path); // only loads when actually needed
    }
    this.realImage.display();
  }
}
```

**When to actually use it:** Lazy initialization, access control/auth checks, caching layers, logging/monitoring wrappers. If you've used an ORM's "lazy loaded relation," you've used a proxy.

*Note: Proxy and Decorator look structurally similar (both wrap an object behind the same interface). The difference is intent — Decorator **adds** behavior/responsibility, Proxy **controls access** to the same behavior.*

---

## Behavioral Patterns

### Strategy

**Problem it solves:** You have several interchangeable algorithms for doing the same job (e.g. different sorting methods, different pricing rules, different payment methods) and want to swap between them at runtime without a pile of `if/else` or `switch` statements.

```ts
interface DiscountStrategy {
  apply(price: number): number;
}

class NoDiscount implements DiscountStrategy {
  apply(price: number) { return price; }
}

class PercentageDiscount implements DiscountStrategy {
  constructor(private percent: number) {}
  apply(price: number) { return price * (1 - this.percent / 100); }
}

class Cart {
  constructor(private strategy: DiscountStrategy) {}
  checkout(price: number) { return this.strategy.apply(price); }
}

new Cart(new PercentageDiscount(10)).checkout(100); // 90
```

**When to actually use it:** This is probably the single most useful everyday pattern. Any time you see a big `switch` statement picking between behaviors based on a type/flag, that's a strategy pattern trying to happen.

---

### Observer

**Problem it solves:** One object's state changes, and a variable number of other objects need to know about it, without the source object needing to know who they are.

```ts
type Listener<T> = (data: T) => void;

class EventEmitter<T> {
  private listeners: Listener<T>[] = [];

  subscribe(listener: Listener<T>) {
    this.listeners.push(listener);
    return () => { this.listeners = this.listeners.filter(l => l !== listener); };
  }

  emit(data: T) {
    this.listeners.forEach(listener => listener(data));
  }
}

const onUserCreated = new EventEmitter<{ id: string }>();
onUserCreated.subscribe(user => console.log(`Send welcome email to ${user.id}`));
onUserCreated.subscribe(user => console.log(`Log signup for ${user.id}`));

onUserCreated.emit({ id: "u_123" });
```

**When to actually use it:** This is the backbone of event-driven systems — DOM events, Node's `EventEmitter`, pub/sub systems, React state subscriptions, RxJS. If you've ever called `.on()`, `.addEventListener()`, or `.subscribe()`, you've used this pattern.

---

### Command

**Problem it solves:** You want to turn "a request to do something" into a standalone object — so it can be queued, logged, undone, or passed around like data instead of being an immediate function call.

```ts
interface Command {
  execute(): void;
  undo(): void;
}

class AddTextCommand implements Command {
  constructor(private document: string[], private text: string) {}
  execute() { this.document.push(this.text); }
  undo() { this.document.pop(); }
}

class CommandHistory {
  private history: Command[] = [];

  run(command: Command) {
    command.execute();
    this.history.push(command);
  }

  undoLast() {
    this.history.pop()?.undo();
  }
}
```

**When to actually use it:** Undo/redo stacks, task queues/job systems, macro recording, transactional operations. Redux actions are basically Command objects — a plain description of "what should happen" separated from "what actually does it."

---

## The rest (know the name, look up the details when you need them)

These come up less often day-to-day. Keeping the one-liners here so I recognize the shape of the problem when it shows up, and can go read the [refactoring.guru](https://refactoring.guru/design-patterns) page for the one I need at that moment.

### Creational
- **Abstract Factory** — a factory of factories; produces families of related objects (e.g. a whole UI kit: `WindowsButton` + `WindowsCheckbox` vs `MacButton` + `MacCheckbox`) without specifying their concrete classes.
- **Prototype** — create new objects by cloning an existing instance instead of building from scratch, useful when construction is expensive or the object's exact class is unknown ahead of time.

### Structural
- **Composite** — treat individual objects and groups of objects uniformly through a shared interface; classic for tree structures like file systems or UI component trees.
- **Bridge** — decouple an abstraction from its implementation so the two can vary independently (e.g. separating a `Shape` hierarchy from a `Renderer` hierarchy so you don't get a class explosion of `VectorCircle`, `RasterCircle`, `VectorSquare`...).
- **Flyweight** — share common, immutable parts of many similar objects to save memory (e.g. sharing character glyph data across millions of rendered text characters).

### Behavioral
- **Chain of Responsibility** — pass a request along a chain of handlers until one handles it (e.g. middleware pipelines, event bubbling, support-ticket escalation).
- **Iterator** — provide a standard way to traverse a collection without exposing its internal structure. If you've used a `for...of` loop or implemented `[Symbol.iterator]`, you've used this.
- **Mediator** — centralize how a set of objects communicate, so they talk to a mediator instead of directly to each other (e.g. an air traffic control tower; chat room server).
- **Memento** — capture and restore an object's internal state without violating encapsulation, typically for undo functionality (pairs well with Command).
- **State** — let an object change its behavior when its internal state changes, by delegating to state-specific objects instead of a giant conditional (e.g. a `TrafficLight` with `RedState`/`GreenState`/`YellowState` objects).
- **Template Method** — define the skeleton of an algorithm in a base class, letting subclasses override specific steps without changing the overall structure (common in test framework `setUp`/`test`/`tearDown` hooks).
- **Visitor** — separate an algorithm from the object structure it operates on, so you can add new operations without modifying the objects themselves (common in compilers/ASTs).

---

## Practical takeaways

1. **Don't reach for a pattern first.** Write the straightforward version. If you notice the same awkward shape (giant switch statement, exploding subclass hierarchy, tangled object creation) showing up more than once, *then* reach for the matching pattern.
2. **Strategy, Observer, Decorator, Factory Method, and Adapter** are the ones I'll actually use regularly. The rest are worth recognizing by name so I don't reinvent them badly, but I won't force them in.
3. Frameworks and libraries already implement most of these for you (middleware = Decorator/Chain of Responsibility, event emitters = Observer, DI containers = Factory + Singleton done properly). Recognizing the pattern under the hood makes the framework's API make *sense* instead of feeling arbitrary.
4. Revisit [refactoring.guru/design-patterns](https://refactoring.guru/design-patterns) whenever a pattern from the reference list above actually shows up in a real problem — that's the moment it'll actually stick.
