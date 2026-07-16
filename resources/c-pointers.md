---
id: c-pointers
title: C & Pointers
sidebar_label: C & Pointers
description: Personal notes on C fundamentals with a deep focus on pointers, memory, and the classic gotchas.
tags: [c, pointers, memory, systems-programming]
---

Personal reference notes. C itself is a small language — the hard part is almost
entirely **memory**: what it looks like, who owns it, and how pointers let you
reach into it directly. These notes assume you know basic syntax and focus on
the mental model that makes pointers click.

---

## 1. The Mental Model First

A variable is just a **label for a box of bytes at some address**. A pointer is
a variable whose box holds an **address of another box**, plus a *type* that
tells the compiler how many bytes to read/write and how to interpret them.

```c
int x = 42;      // a box of 4 bytes, holding 42
int *p = &x;      // a box holding x's address
```

Three operators you must be fluent in:

| Operator | Meaning | Example |
|---|---|---|
| `&` | "address of" — turns a variable into a pointer | `&x` |
| `*` (unary) | "value at" / dereference — follows a pointer | `*p` |
| `*` (in a declaration) | "this variable is a pointer to..." | `int *p;` |

`*` is overloaded and that's the #1 source of early confusion: in a
**declaration** it's part of the type; in an **expression** it's an operation.

```c
int *p;   // declaration: p is "pointer to int"
*p = 5;   // expression: dereference p, write 5 to what it points to
```

### Read declarations right-to-left (mostly)

```c
int *p;          // p is a pointer to int
int **pp;        // pp is a pointer to a pointer to int
const int *p;    // p is a pointer to a const int (data is const, pointer isn't)
int * const p;   // p is a const pointer to int (pointer is const, data isn't)
const int * const p; // both are const
int *arr[10];    // arr is an array of 10 pointers to int
int (*arr)[10];  // arr is a pointer to an array of 10 int
int (*fp)(int, int); // fp is a pointer to a function(int,int) returning int
```

Rule of thumb for the last few: find the identifier, then alternate "go right
if unparenthesized, go left" (the "spiral rule"). When it gets ugly, use a
`typedef`.

---

## 2. Pointers and Arrays: Related, Not Identical

An array **decays** to a pointer to its first element in most expression
contexts (function arguments, arithmetic), but an array is **not** a pointer:

```c
int arr[5] = {1,2,3,4,5};
int *p = arr;        // decays to &arr[0]

sizeof(arr);          // 20 (5 * sizeof(int)) — arr still "knows" its size here
sizeof(p);             // 8 (on a 64-bit system) — p is just a pointer
```

This is why `sizeof(arr) / sizeof(arr[0])` only works on the *actual array*,
never on a pointer received as a function parameter — inside a function,
`int arr[]` in a parameter list is secretly `int *arr`.

```c
void f(int arr[]) {
  sizeof(arr); // == sizeof(int*), NOT the array size. Classic bug.
}
```

**Always pass the length separately.**

### Pointer arithmetic is scaled by type size

```c
int arr[5];
int *p = arr;
p + 1;        // address advances by sizeof(int), i.e. 4 bytes, not 1
*(p + 2);     // same as arr[2]
p[2];         // same thing — array indexing IS pointer arithmetic + deref
```

`a[i]` is literally defined as `*(a + i)`. This is also why `2[arr]` compiles
and equals `arr[2]` (a fun/horrifying fact, never do this).

---

## 3. Pointers to Pointers

Used when a function needs to modify **what a caller's pointer points to**,
not just the pointee's value.

```c
void allocate(int **out) {
  *out = malloc(sizeof(int));
  **out = 42;
}

int *p = NULL;
allocate(&p);   // p now points to a heap int holding 42
```

Mental model: to let a function change your variable, pass its address. If
the variable *is already a pointer* and you want to change *what it points
to*, you need the address of the pointer — hence `int **`.

Common real use: functions that allocate and hand back a buffer
(`int func(char **out_buf, size_t *out_len)`), and 2D dynamic arrays
(`int **grid` = array of row pointers).

---

## 4. `const` and Pointers

- `const int *p` — **can't** modify `*p` through `p`. Can reassign `p` itself.
- `int * const p` — **can** modify `*p`. **Can't** reassign `p`.
- `const int * const p` — neither.

Function parameters should use `const T *` whenever the function only reads
through the pointer — it documents intent and lets callers pass `const` data.

```c
size_t my_strlen(const char *s) { ... } // promises not to modify *s
```

---

## 5. Dynamic Memory (`malloc` / `free`)

```c
int *p = malloc(n * sizeof(int));
if (p == NULL) { /* handle allocation failure — always check */ }
// ... use p ...
free(p);
p = NULL; // avoid dangling reference to freed memory
```

Rules that prevent 90% of C memory bugs:

1. **Every `malloc`/`calloc`/`realloc` needs exactly one matching `free`.**
   Not zero (leak), not two (double free — undefined behavior, often exploitable).
2. **Check the return value of `malloc`.** It can return `NULL`.
3. **Never use a pointer after `free`ing it** ("use-after-free"). Set it to
   `NULL` immediately after freeing so accidental use crashes loudly instead
   of corrupting memory silently.
4. **`realloc` can move the block.** Always assign to a temp variable first:

   ```c
   int *tmp = realloc(p, new_size);
   if (tmp == NULL) { /* p is still valid, old alloc untouched */ }
   else { p = tmp; }
   ```

   (Assigning directly to `p` leaks the original block if `realloc` fails.)
5. `malloc` does **not** zero memory; `calloc` does.
6. `free(NULL)` is explicitly safe (no-op) — no need to guard it.

### Stack vs. Heap, quickly

| | Stack | Heap |
|---|---|---|
| Lifetime | Ends when function returns | Until you `free()` it |
| Speed | Very fast (pointer bump) | Slower (allocator bookkeeping) |
| Size | Small, fixed limit | Large, limited by system memory |
| Failure mode | Stack overflow | `malloc` returns `NULL` |

**Never return a pointer to a local (stack) variable** — it becomes a
dangling pointer the instant the function returns:

```c
int *bad() {
  int local = 5;
  return &local; // UB: local's storage is gone after return
}
```

---

## 6. Pointers and `struct`s

```c
typedef struct {
  int x, y;
} Point;

Point pt = {1, 2};
Point *p = &pt;

(*p).x = 5;   // works, but clunky
p->x = 5;     // arrow operator: shorthand for (*p).x — always prefer this
```

Passing structs by pointer avoids copying the whole struct and lets the
function mutate the caller's data:

```c
void move(Point *p, int dx, int dy) {
  p->x += dx;
  p->y += dy;
}
```

Linked structures (linked lists, trees) are built entirely from
self-referential struct pointers:

```c
typedef struct Node {
  int value;
  struct Node *next; // must use `struct Node`, not the typedef, here —
                       // the typedef name doesn't exist yet inside its own definition
} Node;
```

---

## 7. Function Pointers

A variable that holds the address of a function, letting you pass behavior
around like data (callbacks, dispatch tables, plugin-style APIs).

```c
int add(int a, int b) { return a + b; }
int sub(int a, int b) { return a - b; }

int (*op)(int, int) = add;
op(2, 3); // 5

op = sub;
op(2, 3); // -1
```

Classic use: `qsort`'s comparator argument.

```c
int cmp(const void *a, const void *b) {
  return (*(int*)a - *(int*)b);
}
qsort(arr, n, sizeof(int), cmp);
```

Typedef these for sanity: `typedef int (*BinOp)(int, int);`

---

## 8. `void *` — the Type-Erased Pointer

`void *` can point to anything but can't be dereferenced directly (the
compiler doesn't know the size/type) — you must cast it first.

```c
void *generic = &someInt;
int val = *(int *)generic; // cast, then dereference
```

Used for generic containers (`qsort`, `memcpy`), and as `malloc`'s return
type (implicitly convertible to any pointer type in C, unlike C++).

```c
void *memcpy(void *dest, const void *src, size_t n);
```

---

## 9. Strings Are Just `char` Pointers/Arrays

C has no string type — a "string" is a `char` array/pointer terminated by a
`\0` byte (the null terminator).

```c
char *s = "hello";      // pointer to a *read-only* string literal — do NOT modify it
char buf[] = "hello";    // buf is a mutable array on the stack, a copy of the literal
```

Modifying a string literal through a `char *` is undefined behavior — it may
live in read-only memory and segfault, or it may silently corrupt shared
literal storage.

Because there's no length field, string functions scan for `\0`:

```c
strlen(s);             // walks until it hits '\0' — O(n), not O(1)
strcpy(dst, src);       // NO bounds checking — classic overflow source
strncpy(dst, src, n);   // safer, but may not null-terminate if src >= n!
snprintf(dst, n, "%s", src); // generally the safest copy/format option
```

**Always ensure buffers are large enough for the string plus the `\0`.**
`char buf[10]` can hold a 9-character string, not 10.

---

## 10. Arrays of Pointers vs. Multi-dimensional Arrays

```c
int matrix[3][4];        // one contiguous block, 3*4 ints, true 2D array
int *jagged[3];           // 3 separate pointers — can point to rows of different lengths
```

`matrix[i][j]` on a true 2D array is computed as
`*(matrix + i*4 + j)` — contiguous and cache-friendly.
`jagged[i][j]` is two separate dereferences (pointer lookup, then index) —
more flexible (ragged rows, dynamic sizing) but an extra indirection and
extra allocations to manage/free.

To allocate a true 2D array dynamically, allocate the whole block and index
manually, or allocate row-by-row for a jagged array — but track which
approach you used, since `free()` differs (one call vs. one call per row
plus one for the row-pointer array).

---

## 11. Pointer Arithmetic Rules & Undefined Behavior Traps

- Arithmetic is only well-defined **within an array** (or one-past-the-end).
  `p + 1` on a pointer to a single (non-array) `int` is technically UB if it
  goes anywhere you dereference.
- Comparing pointers into *different* arrays/objects (`<`, `>`) is UB, even
  though it "usually works."
- Subtracting two pointers gives the number of **elements** between them
  (not bytes), and only makes sense within the same array.
- Dereferencing `NULL`, a dangling pointer, or an uninitialized pointer is
  UB — often a crash, sometimes silent corruption (worse, because it hides).
- Signed integer overflow is UB too, but the pointer-specific one to
  remember: **going out of bounds doesn't reliably crash**. C trusts you; it
  won't stop you from reading/writing past an array, it'll just corrupt
  whatever happens to be next in memory. This is the root cause of most
  security vulnerabilities in C code (buffer overflows).

### Uninitialized pointers are landmines

```c
int *p;      // contains garbage, not NULL!
*p = 5;      // writes to a random address — UB, may "work" for a while then blow up elsewhere
```

Always initialize pointers, even to `NULL`, so a mistaken dereference fails
fast instead of corrupting something far away in memory.

---

## 12. Debugging Toolkit

- **Valgrind** (`valgrind --leak-check=full ./prog`) — catches leaks,
  use-after-free, invalid reads/writes, uninitialized reads.
- **AddressSanitizer** (`gcc -fsanitize=address -g`) — faster than Valgrind,
  great for catching overflows and use-after-free during development.
- **gdb** — `break`, `print`, `watch <var>` (breaks when a value changes —
  invaluable for "something is stomping my memory" bugs), `bt` for a
  backtrace after a segfault.
- Compile with `-Wall -Wextra -Werror` always. Most pointer bugs throw a
  warning before they throw a segfault.

---

## 13. Quick Reference Cheat Sheet

```c
int a = 10;
int *p = &a;        // p points to a
int **pp = &p;       // pp points to p

*p;                   // 10  (value at p)
**pp;                 // 10  (value at value at pp)
&a == p;              // true
&p == pp;             // true

int arr[3] = {1,2,3};
int *q = arr;         // decays to &arr[0]
q[1] == *(q+1);        // true, == 2

char *s = "hi";        // read-only literal
char buf[3] = "hi";     // mutable copy (needs room for '\0' too — this example is actually
                          // too small: "hi" needs 3 bytes: 'h','i','\0', which just fits here)

void *vp = &a;          // generic pointer, must cast before dereferencing
int *ip = (int *)vp;

int (*fp)(int) = someFunc; // function pointer
fp(5);                      // call through it
```

---

## 14. Things I Keep Forgetting

- `sizeof` on a pointer parameter gives the pointer's size, never the
  array's — arrays decay the moment they hit a parameter list.
- `free()` doesn't set your pointer to `NULL` for you — you must do it, or
  risk a dangling/double-free later.
- `realloc` failure keeps the original block alive; don't overwrite your
  only reference to it.
- `const char *` = pointer to unmodifiable data; `char * const` = pointer
  itself can't be reassigned. I mix these up more than I'd like to admit.
- String literals are effectively `const char *` even though C (for legacy
  reasons) lets you assign them to plain `char *` without a warning in some
  configurations. Treat them as read-only regardless.
- `struct Node *next` inside `struct Node`'s own definition must use the
  `struct` tag, not a typedef alias that isn't complete yet.

---
