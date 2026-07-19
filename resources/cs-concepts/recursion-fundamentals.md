---
id: recursion-fundamentals
title: Recursion Fundamentals
sidebar_label: Recursion
tags: [algorithms, java, data-structures, recursion]
description: Notes on recursion — mental models, the call stack, classic problems, and optimization techniques (memoization, tail-call recursion).
---

## Why recursion, in one sentence

Recursion is a technique where a method **calls itself** to solve a problem by breaking it into smaller versions of the same problem, until the problem is small enough to answer directly.

Every recursive solution needs exactly two ingredients:

1. **Base case** — the stopping condition. Without it, the recursion never terminates.
2. **Recursive step** — a unit of work that reduces the problem and moves it closer to the base case.

If either piece is missing or wrong, you get infinite recursion → **`StackOverflowError`**.

---

## Building the mental model

### The ATM-line analogy

Think of a line of people waiting for an ATM:

- Each person represents one **call** of the function.
- A person only "finishes" (returns) once the person in front of them is done.
- The very first person in line (no one in front) is the **base case** — they don't wait on anyone, they just use the ATM and leave.

### The essay-revision analogy

Revising an essay recursively: you read a paragraph, decide if it needs work, fix it, then move to the next paragraph — repeating the *same process* on a smaller remaining document each time. The base case is "no paragraphs left to revise."

Both analogies point at the same idea: **recursion = the same procedure applied to a smaller instance of the same problem.**

---

## The call stack, demystified

The call stack is what makes recursion "just work" without you manually tracking state.

- Every method call gets pushed onto the stack as a **stack frame**, holding its local variables, parameters, and the return address (where to resume execution).
- When a method calls itself, a **new** frame is pushed — the previous call is paused, not lost.
- When a call hits its base case and returns, its frame is **popped**, and control resumes in the frame below it, using that frame's own local state.

Analogy used in the course: a to-do list with interruptions. You start task A, get interrupted by task B, get interrupted by task C. You finish C first, then resume B, then resume A. That's Last-In-First-Out (LIFO) — exactly how the call stack behaves.

```java
int factorial(int n) {
    if (n <= 1) return 1;          // base case
    return n * factorial(n - 1);   // recursive step
}
```

Calling `factorial(4)` pushes frames for `factorial(4)`, `factorial(3)`, `factorial(2)`, `factorial(1)`. Once `factorial(1)` returns `1`, each frame below multiplies and pops in reverse order: `1 → 2 → 6 → 24`.

### Trade-offs

**Benefits**

- Naturally expresses problems that are recursive in structure: trees, graphs, divide-and-conquer algorithms.
- Often shorter and closer to the mathematical definition of the problem than an iterative version.

**Costs**

- Each call consumes stack memory → deep recursion risks a **stack overflow**.
- Function-call overhead (pushing/popping frames) can make recursion slower than an equivalent loop for simple cases.
- Naive recursive solutions can duplicate work (see Fibonacci below) unless optimized.

**Rule of thumb:** reach for recursion when the data/problem is naturally recursive (trees, nested structures, divide & conquer). Prefer iteration for simple linear repetition where a loop is just as clear and cheaper.

---

## Practical applications

### Strings & numbers

**String reversal**

```java
String reverse(String s) {
    if (s.isEmpty()) return s;                       // base case
    return reverse(s.substring(1)) + s.charAt(0);     // recursive step
}
```

**Palindrome detection**

```java
boolean isPalindrome(String s, int left, int right) {
    if (left >= right) return true;                  // base case
    if (s.charAt(left) != s.charAt(right)) return false;
    return isPalindrome(s, left + 1, right - 1);      // recursive step
}
```

**Decimal to binary**

```java
String toBinary(int n) {
    if (n == 0) return "";                            // base case
    return toBinary(n / 2) + (n % 2);                  // recursive step
}
```

**Sum of natural numbers**

```java
int sum(int n) {
    if (n == 0) return 0;                              // base case
    return n + sum(n - 1);                              // recursive step
}
```

### Divide & conquer

Divide-and-conquer algorithms split the problem into smaller sub-problems, solve each recursively, then combine the results.

**Binary Search** — repeatedly halves the search space, so it runs in `O(log n)`:

```java
int binarySearch(int[] arr, int target, int lo, int hi) {
    if (lo > hi) return -1;                             // base case: not found
    int mid = lo + (hi - lo) / 2;
    if (arr[mid] == target) return mid;                 // base case: found
    if (arr[mid] < target) return binarySearch(arr, target, mid + 1, hi);
    return binarySearch(arr, target, lo, mid - 1);
}
```

**Merge Sort** — splits the array in half, sorts each half recursively, then merges the sorted halves, giving `O(n log n)`:

```java
void mergeSort(int[] arr, int left, int right) {
    if (left >= right) return;                          // base case
    int mid = left + (right - left) / 2;
    mergeSort(arr, left, mid);
    mergeSort(arr, mid + 1, right);
    merge(arr, left, mid, right);                        // combine step
}
```

### Linked lists

**Reversing a linked list**

```java
Node reverse(Node head) {
    if (head == null || head.next == null) return head; // base case
    Node newHead = reverse(head.next);
    head.next.next = head;
    head.next = null;
    return newHead;
}
```

**Merging two sorted linked lists**

```java
Node merge(Node a, Node b) {
    if (a == null) return b;                             // base case
    if (b == null) return a;                              // base case
    if (a.val <= b.val) {
        a.next = merge(a.next, b);
        return a;
    } else {
        b.next = merge(a, b.next);
        return b;
    }
}
```

### Trees & graphs

**Insert into a Binary Search Tree**

```java
Node insert(Node root, int value) {
    if (root == null) return new Node(value);            // base case
    if (value < root.val) root.left = insert(root.left, value);
    else root.right = insert(root.right, value);
    return root;
}
```

**Print leaf nodes**

```java
void printLeaves(Node node) {
    if (node == null) return;
    if (node.left == null && node.right == null) {       // base case: it's a leaf
        System.out.println(node.val);
        return;
    }
    printLeaves(node.left);
    printLeaves(node.right);
}
```

**Depth-First Search (trees/graphs)**

```java
void dfs(Node node, Set<Node> visited) {
    if (node == null || visited.contains(node)) return;   // base case
    visited.add(node);
    System.out.println(node.val);
    for (Node neighbor : node.neighbors) {
        dfs(neighbor, visited);
    }
}
```

DFS on a graph needs a `visited` set — unlike trees, graphs can have cycles, so without tracking visited nodes the recursion could loop forever.

---

## Optimization techniques

### Memoization & caching

Naive recursive Fibonacci recomputes the same sub-problems exponentially many times:

```java
int fib(int n) {
    if (n <= 1) return n;
    return fib(n - 1) + fib(n - 2);   // O(2^n) — lots of repeated work
}
```

**Memoization** stores previously computed results (usually in a map or array) so each sub-problem is solved once:

```java
int fib(int n, Map<Integer, Integer> memo) {
    if (n <= 1) return n;
    if (memo.containsKey(n)) return memo.get(n);
    int result = fib(n - 1, memo) + fib(n - 2, memo);
    memo.put(n, result);
    return result;   // O(n) with memoization
}
```

This is a form of top-down dynamic programming: same recursive structure, but with caching to eliminate redundant calls.

### Tail-call recursion

A recursive call is a **tail call** when it's the very last operation in the function — nothing happens after it returns.

```java
// NOT tail-recursive: multiplication happens *after* the recursive call returns
int factorial(int n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}

// Tail-recursive: the recursive call is the last thing that happens
int factorialTail(int n, int accumulator) {
    if (n <= 1) return accumulator;
    return factorialTail(n - 1, n * accumulator);
}
```

Because no work remains after the recursive call, a compiler that supports **tail-call optimization (TCO)** can reuse the current stack frame instead of pushing a new one, turning the recursion into an effectively constant-stack loop — preventing stack overflow for deep recursion.

:::caution Java-specific note
The standard JVM does **not** guarantee tail-call optimization the way some functional languages (e.g., Scheme, Elixir) do. Writing tail-recursive Java code is still good practice for clarity, but for very deep recursion in Java, an explicit iterative rewrite (or an explicit stack) is often the safer choice.
:::

---

## Quick reference

| Concept | Key idea |
|---|---|
| Base case | Stopping condition; prevents infinite recursion |
| Recursive step | Unit of work that shrinks the problem |
| Call stack | LIFO structure tracking paused calls (frames) |
| Stack overflow | Happens when recursion depth exceeds available stack memory |
| Divide & conquer | Split → solve recursively → combine (e.g., merge sort) |
| Memoization | Cache sub-problem results to avoid recomputation |
| Tail-call recursion | Recursive call is the last operation; enables stack-frame reuse where supported |
