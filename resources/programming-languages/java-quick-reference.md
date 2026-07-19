---
id: java-quick-reference
title: Java Quick Reference
sidebar_label: Java Cheat Sheet
description: A quick-refresher cheat sheet for Java syntax, collections, OOP, and common idioms.
tags: [java, cheatsheet, reference]
---

# Java Quick Reference

A no-fluff refresher for when you've been away from Java for a while. Skim the headers, jump to what you forgot.

## Basic Structure

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, world!");
    }
}
```

- File name **must** match the public class name (`Main.java`).
- Entry point is always `public static void main(String[] args)`.

## Variables & Types

```java
int i = 10;
long l = 10_000_000_000L;
double d = 3.14;
float f = 3.14f;
boolean b = true;
char c = 'A';
String s = "hello";

// Constants
final double PI = 3.14159;

// var (type inference, Java 10+)
var list = new ArrayList<String>();
```

### Primitive Types & Defaults

| Type | Size | Default |
|---|---|---|
| `byte` | 8-bit | 0 |
| `short` | 16-bit | 0 |
| `int` | 32-bit | 0 |
| `long` | 64-bit | 0L |
| `float` | 32-bit | 0.0f |
| `double` | 64-bit | 0.0d |
| `char` | 16-bit | '\u0000' |
| `boolean` | 1-bit | false |

### Wrapper Classes & Boxing

```java
Integer boxed = 5;         // autoboxing
int unboxed = boxed;       // auto-unboxing
Integer.parseInt("42");
Integer.valueOf("42");
String.valueOf(42);
```

## Operators

```java
// Arithmetic
+ - * / % 

// Increment/decrement
i++ ; ++i ; i-- ; --i

// Comparison
== != > < >= <=

// Logical
&& || !

// Bitwise
& | ^ ~ << >> >>>

// Ternary
int max = (a > b) ? a : b;
```

## Control Flow

```java
if (x > 0) {
    // ...
} else if (x == 0) {
    // ...
} else {
    // ...
}

switch (day) {
    case MONDAY, FRIDAY -> System.out.println("Busy");
    case SATURDAY, SUNDAY -> System.out.println("Rest");
    default -> System.out.println("Normal");
}

// Traditional switch
switch (day) {
    case 1:
        System.out.println("Mon");
        break;
    default:
        System.out.println("Other");
}
```

### Loops

```java
for (int i = 0; i < 10; i++) { }

for (String item : list) { }   // enhanced for

int i = 0;
while (i < 10) { i++; }

int j = 0;
do {
    j++;
} while (j < 10);

// break / continue with labels
outer:
for (int i = 0; i < 5; i++) {
    for (int j = 0; j < 5; j++) {
        if (j == 2) continue outer;
        if (i == 3) break outer;
    }
}
```

## Arrays

```java
int[] arr = new int[5];
int[] arr2 = {1, 2, 3, 4, 5};
int[][] matrix = new int[3][3];

arr.length;                     // no parens, it's a field
Arrays.sort(arr);
Arrays.toString(arr);
Arrays.fill(arr, 0);
int[] copy = Arrays.copyOf(arr, arr.length);
```

## Strings

```java
String s = "Hello";
s.length();
s.charAt(0);
s.substring(1, 3);
s.indexOf("l");
s.contains("ell");
s.replace("l", "L");
s.split(",");
s.trim();
s.toUpperCase();
s.toLowerCase();
s.equals(other);          // never use == for content comparison
s.equalsIgnoreCase(other);
String.join(", ", list);
"%d-%s".formatted(5, "x"); // Java 15+

// StringBuilder for mutation
StringBuilder sb = new StringBuilder();
sb.append("a").append("b");
sb.insert(0, "x");
sb.reverse();
sb.toString();

// Text blocks (Java 15+)
String block = """
    Line 1
    Line 2
    """;
```

## Collections

### List

```java
List<String> list = new ArrayList<>();
list.add("a");
list.get(0);
list.set(0, "b");
list.remove(0);
list.remove("b");        // by object, watch overload w/ int index
list.size();
list.contains("a");
list.isEmpty();
Collections.sort(list);
List.of("a", "b", "c");  // immutable
```

### Map

```java
Map<String, Integer> map = new HashMap<>();
map.put("a", 1);
map.get("a");
map.getOrDefault("z", 0);
map.containsKey("a");
map.remove("a");
map.forEach((k, v) -> System.out.println(k + "=" + v));

for (Map.Entry<String, Integer> entry : map.entrySet()) {
    entry.getKey();
    entry.getValue();
}

map.merge("a", 1, Integer::sum);
map.computeIfAbsent("b", k -> new ArrayList<>());
Map.of("a", 1, "b", 2);   // immutable
```

### Set

```java
Set<String> set = new HashSet<>();
set.add("a");
set.contains("a");
Set<String> ordered = new LinkedHashSet<>();
Set<String> sorted = new TreeSet<>();
```

### Queue / Deque / Stack

```java
Deque<Integer> stack = new ArrayDeque<>();
stack.push(1);
stack.pop();
stack.peek();

Queue<Integer> queue = new LinkedList<>();
queue.offer(1);
queue.poll();
queue.peek();

PriorityQueue<Integer> pq = new PriorityQueue<>();       // min-heap
PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder());
```

## Streams (java.util.stream)

```java
List<Integer> nums = List.of(1, 2, 3, 4, 5);

nums.stream()
    .filter(n -> n % 2 == 0)
    .map(n -> n * n)
    .sorted()
    .forEach(System.out::println);

int sum = nums.stream().mapToInt(Integer::intValue).sum();
List<Integer> squared = nums.stream().map(n -> n * n).toList();
boolean anyMatch = nums.stream().anyMatch(n -> n > 3);
Optional<Integer> max = nums.stream().max(Integer::compareTo);

Map<Boolean, List<Integer>> partitioned =
    nums.stream().collect(Collectors.partitioningBy(n -> n % 2 == 0));

String joined = nums.stream()
    .map(String::valueOf)
    .collect(Collectors.joining(", "));
```

## OOP Basics

```java
public class Animal {
    private String name;         // field

    public Animal(String name) { // constructor
        this.name = name;
    }

    public String getName() {    // getter
        return name;
    }

    public void speak() {        // method
        System.out.println(name + " makes a sound");
    }
}

public class Dog extends Animal {
    public Dog(String name) {
        super(name);
    }

    @Override
    public void speak() {
        System.out.println(getName() + " barks");
    }
}
```

### Access Modifiers

| Modifier | Class | Package | Subclass | World |
|---|---|---|---|---|
| `public` | ✅ | ✅ | ✅ | ✅ |
| `protected` | ✅ | ✅ | ✅ | ❌ |
| (default) | ✅ | ✅ | ❌ | ❌ |
| `private` | ✅ | ❌ | ❌ | ❌ |

### Interfaces & Abstract Classes

```java
interface Shape {
    double area();                       // abstract by default

    default void describe() {            // default method
        System.out.println("A shape with area " + area());
    }

    static Shape unit() {                // static method
        return () -> 1.0;
    }
}

abstract class Vehicle {
    abstract void move();                // must be implemented

    void honk() {                        // concrete method
        System.out.println("Beep");
    }
}
```

### Records (Java 16+)

```java
record Point(int x, int y) { }

Point p = new Point(1, 2);
p.x();
p.y();
p.toString();   // auto-generated
p.equals(other); // auto-generated
```

### Enums

```java
enum Day {
    MONDAY, TUESDAY, WEDNESDAY;

    boolean isWeekday() {
        return this != SATURDAY && this != SUNDAY;
    }
}

Day d = Day.MONDAY;
d.name();
d.ordinal();
Day.valueOf("MONDAY");
```

### Static vs Instance

```java
class Counter {
    static int count = 0;      // shared across instances
    int id;                    // per-instance

    Counter() {
        id = ++count;
    }

    static void reset() {      // can't access instance members
        count = 0;
    }
}
```

## Generics

```java
class Box<T> {
    private T value;
    void set(T value) { this.value = value; }
    T get() { return value; }
}

<T> T firstElement(List<T> list) {
    return list.get(0);
}

// Bounded types
<T extends Number> double sum(List<T> list) { ... }

// Wildcards
void printAll(List<? extends Number> list) { ... }
void addNumbers(List<? super Integer> list) { ... }
```

## Exception Handling

```java
try {
    riskyMethod();
} catch (IOException e) {
    System.out.println("IO error: " + e.getMessage());
} catch (Exception e) {
    System.out.println("General error: " + e.getMessage());
} finally {
    System.out.println("Always runs");
}

// try-with-resources
try (BufferedReader br = new BufferedReader(new FileReader("f.txt"))) {
    br.readLine();
} catch (IOException e) {
    e.printStackTrace();
}

// Custom exception
class MyException extends RuntimeException {
    public MyException(String message) {
        super(message);
    }
}

// Throwing
throw new IllegalArgumentException("bad input");
```

- **Checked exceptions** (extend `Exception`) must be declared with `throws` or caught.
- **Unchecked exceptions** (extend `RuntimeException`) do not.

## Functional Interfaces & Lambdas

```java
// Common built-ins from java.util.function
Function<Integer, Integer> square = x -> x * x;
Predicate<Integer> isEven = x -> x % 2 == 0;
Consumer<String> printer = System.out::println;
Supplier<String> greeting = () -> "hi";
BiFunction<Integer, Integer, Integer> add = (a, b) -> a + b;

// Method references
list.forEach(System.out::println);
list.stream().map(String::toUpperCase);

// Custom functional interface
@FunctionalInterface
interface Operation {
    int apply(int a, int b);
}
Operation multiply = (a, b) -> a * b;
```

## Optional

```java
Optional<String> opt = Optional.of("value");
Optional<String> empty = Optional.empty();

opt.isPresent();
opt.isEmpty();
opt.get();                          // throws if empty, avoid when possible
opt.orElse("default");
opt.orElseGet(() -> computeDefault());
opt.ifPresent(v -> System.out.println(v));
opt.map(String::toUpperCase);
```

## Common `equals`/`hashCode`/`toString`

```java
@Override
public boolean equals(Object o) {
    if (this == o) return true;
    if (!(o instanceof Person p)) return false;   // pattern matching instanceof
    return age == p.age && Objects.equals(name, p.name);
}

@Override
public int hashCode() {
    return Objects.hash(name, age);
}

@Override
public String toString() {
    return "Person{name='" + name + "', age=" + age + "}";
}
```

## Pattern Matching (Java 16+/21+)

```java
// instanceof pattern
if (obj instanceof String s) {
    System.out.println(s.length());
}

// switch pattern matching (Java 21+)
String result = switch (obj) {
    case Integer i -> "int: " + i;
    case String s -> "string: " + s;
    default -> "unknown";
};
```

## Threads & Concurrency (basics)

```java
Thread t = new Thread(() -> System.out.println("running"));
t.start();
t.join();

ExecutorService executor = Executors.newFixedThreadPool(4);
executor.submit(() -> doWork());
executor.shutdown();

// Synchronized block
synchronized (lock) {
    // critical section
}

AtomicInteger counter = new AtomicInteger(0);
counter.incrementAndGet();
```

## Quick Gotchas

- `==` compares references for objects, values for primitives — use `.equals()` for object content.
- Arrays' `.length` is a field, `String`/`List`'s `.length()`/`.size()` are methods.
- Integer caching means `Integer.valueOf(127) == Integer.valueOf(127)` is `true`, but `128` breaks it — don't rely on `==` for boxed types.
- `ArrayList` remove(int) vs remove(Object) — `list.remove(1)` removes by index, `list.remove(Integer.valueOf(1))` removes the value.
- Static methods can't be overridden, only hidden.
- Interfaces can't have instance fields, only `static final` constants.

---

*Tip: bookmark this page in your Docusaurus sidebar for fast lookup next time you jump back into Java.*
