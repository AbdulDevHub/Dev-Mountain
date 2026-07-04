---
id: python-quick-reference
title: Python Quick Reference
sidebar_label: Python Quick Reference
---

Quick-scan cheat sheet for Python syntax I keep forgetting, plus a LeetCode toolkit section.

## Lists

```python
nums = [3, 1, 4, 1, 5]

nums.append(9)          # [3, 1, 4, 1, 5, 9]        - adds to end, mutates in place, O(1)
nums.insert(0, 100)     # inserts at index 0, O(n) - shifts everything right
nums.remove(1)          # removes FIRST matching value (not index!), O(n)
nums.pop()               # removes & returns LAST item, O(1)
nums.pop(0)              # removes & returns item at index 0, O(n)
del nums[0]              # removes item at index 0, no return value
nums.clear()             # empties the list

nums = [3, 1, 4, 1, 5]
nums[1:3]                # [1, 4]  - slice, end index excluded
nums[::-1]                # reversed copy (doesn't mutate)
nums.reverse()             # reverses in place
nums.sort()                # sorts in place, returns None
sorted(nums)                # returns NEW sorted list, original untouched

nums.index(4)               # first index of value 4, raises ValueError if missing
4 in nums                    # membership check, O(n) for lists
len(nums)
```

## Dictionaries

```python
d = {"a": 1, "b": 2}

d["c"] = 3                 # add/update key
d.update({"d": 4, "a": 99})  # bulk update, overwrites existing keys
d.pop("a")                   # removes key "a", returns its value, KeyError if missing
d.pop("z", None)              # safe pop with default if key doesn't exist
del d["b"]                     # removes key, no return value

d.get("x")                      # returns None if missing (no KeyError)
d.get("x", 0)                    # returns 0 if missing - common LeetCode pattern

d.keys()                          # dict_keys view
d.values()                         # dict_values view
d.items()                           # dict_items view of (key, value) pairs

for k, v in d.items():
    print(k, v)

"a" in d                             # checks KEYS by default, O(1)
```

### Dict comprehension

```python
squares = {x: x*x for x in range(5)}          # {0:0, 1:1, 2:4, 3:9, 4:16}
filtered = {k: v for k, v in d.items() if v > 1}
```

## Tuples

```python
t = (1, 2, 3)          # immutable - no append/remove/sort
a, b, c = t              # unpacking
a, *rest = t               # a=1, rest=[2, 3]

t + (4,)                     # concatenation returns a NEW tuple
t.count(1)                    # occurrences of value
t.index(2)                     # first index of value
```

## Strings

```python
s = "Hello World"

s[0:5]                  # "Hello"     - substring via slicing
s[-5:]                    # "World"    - last 5 chars
s[::-1]                     # reversed string

s.lower()                    # "hello world"
s.upper()
s.strip()                      # removes leading/trailing whitespace
s.split()                       # ["Hello", "World"] - splits on whitespace by default
s.split(",")                     # split on a specific delimiter
",".join(["a", "b", "c"])          # "a,b,c" - joins iterable of strings

s.replace("World", "There")          # "Hello There"
s.find("World")                        # index of first match, -1 if not found
s.startswith("Hello")
s.endswith("ld")
"world" in s.lower()                     # substring/membership check

f"{s} has {len(s)} chars"                  # f-string formatting
```

## Type conversion

```python
int("42")            # 42        - str -> int
int("3.5")            # ValueError! use float() first
float("3.5")           # 3.5
str(42)                 # "42"
list("abc")              # ['a', 'b', 'c']
tuple([1, 2, 3])          # (1, 2, 3)
set([1, 1, 2])              # {1, 2}
"".join(['a','b','c'])       # "abc" - list of chars back to string

int(True)               # 1
bool(0)                  # False - 0, "", [], {}, None are all falsy
```

---

## LeetCode Toolkit

### Counter

```python
from collections import Counter

c = Counter("mississippi")     # Counter({'i': 4, 's': 4, 'p': 2, 'm': 1})
c = Counter([1, 1, 2, 3])        # Counter({1: 2, 2: 1, 3: 1})

c.most_common(2)                   # [(1, 2), (2, 1)] - top 2 by count
c["z"]                               # 0, NOT KeyError - missing keys default to 0
c.update([1, 4])                      # increments counts

c1 - c2                                 # subtracts counts, keeps only positive results
c1 & c2                                   # min of counts (intersection)
c1 + c2                                     # adds counts
```

### zip

```python
names = ["a", "b", "c"]
nums = [1, 2, 3]

list(zip(names, nums))     # [('a',1), ('b',2), ('c',3)] - stops at shortest iterable

for name, num in zip(names, nums):
    print(name, num)

a, b = zip(*zip(names, nums))    # unzip trick -> a=('a','b','c'), b=(1,2,3)
```

### List comprehension

```python
squares = [x*x for x in range(10)]
evens = [x for x in range(10) if x % 2 == 0]
pairs = [(x, y) for x in range(3) for y in range(3)]     # nested loops
flat = [x for row in matrix for x in row]                   # flatten 2D list
```

### Set comprehension

```python
unique_lengths = {len(w) for w in ["a", "bb", "ccc", "dd"]}    # {1, 2, 3}
```

### Lambda

A lambda is just a **small, unnamed function** written in one line. It's shorthand for a `def` when you need a quick throwaway function, usually to hand to another function.

```python
# these two are equivalent
def add(a, b):
    return a + b

add = lambda a, b: a + b
```

**Syntax:** `lambda arguments: expression`

- No `def`, no function name (unless you assign it to a variable like above)
- No `return` keyword - the expression's result is automatically returned
- Must be a single expression - no loops, no multiple statements, no `if/elif/else` blocks (a ternary is OK, see below)

```python
square = lambda x: x * x
square(5)                   # 25

add = lambda a, b: a + b
add(2, 3)                     # 5

# conditional (ternary) expression inside a lambda
classify = lambda x: "even" if x % 2 == 0 else "odd"
classify(4)                     # "even"
```

You'll rarely assign a lambda to a variable in practice (just use `def` at that point). The real value is passing it **inline** as an argument to another function that expects a function - this is where it shows up constantly in LeetCode:

```python
# key= for sorting, min, max
sorted([-3, 1, -2], key=lambda x: abs(x))         # [1, -2, -3] - sort by absolute value
max(["a", "bbb", "cc"], key=lambda s: len(s))       # "bbb" - longest string
min(points, key=lambda p: p[0] + p[1])                # point with smallest coordinate sum

# map: applies the lambda to every item, returns an iterator (wrap in list())
list(map(lambda x: x * 2, [1, 2, 3]))          # [2, 4, 6]

# filter: keeps items where the lambda returns True, returns an iterator
list(filter(lambda x: x % 2 == 0, [1, 2, 3, 4]))    # [2, 4]

# reduce: rolls the whole iterable down to a single value (needs an import)
from functools import reduce
reduce(lambda acc, x: acc + x, [1, 2, 3, 4])          # 10 - like a running total
```

**Mental model:** anytime a function has a `key=` parameter, or a function's whole job is to take another function as input (`map`, `filter`, `reduce`, `sorted`), a lambda is the quick way to define that "mini function" without writing a separate named `def` above it.

### Sorting with custom keys

```python
words = ["banana", "kiwi", "apple"]

sorted(words, key=len)                        # sort by length
sorted(words, key=lambda w: (len(w), w))         # sort by length, then alphabetically
sorted(words, reverse=True)                        # descending

points = [(1, 2), (3, 0), (2, -1)]
sorted(points, key=lambda p: p[1])                    # sort by 2nd element

# sort in place
words.sort(key=len)
```

### Set operations

```python
a = {1, 2, 3}
b = {2, 3, 4}

a | b        # union -> {1,2,3,4}
a & b          # intersection -> {2,3}
a - b            # difference -> {1}
a ^ b              # symmetric difference -> {1,4}

a.add(5)
a.remove(5)          # KeyError if missing
a.discard(5)           # no error if missing
5 in a                    # O(1) membership check - much faster than list
```

---

## Classes

```python
class Point:
    def __init__(self, x, y):     # constructor, runs when you create an instance
        self.x = x                   # instance attribute
        self.y = y

    def distance_from_origin(self):    # instance method - always takes `self` first
        return (self.x**2 + self.y**2) ** 0.5

    def __repr__(self):                  # controls what print(obj) / repr(obj) shows
        return f"Point({self.x}, {self.y})"

    def __eq__(self, other):               # controls == comparisons between instances
        return self.x == other.x and self.y == other.y

p = Point(3, 4)
p.distance_from_origin()      # 5.0
print(p)                        # Point(3, 4) - thanks to __repr__
```

- `self` refers to the specific instance - always the first parameter of instance methods, but you never pass it explicitly (`p.distance_from_origin()` not `p.distance_from_origin(p)`)
- Attributes set in `__init__` (`self.x = x`) belong to that instance only

### Common dunder (magic) methods

```python
__init__(self, ...)     # constructor
__repr__(self)            # developer-facing string, used by print() and in lists/debuggers
__str__(self)               # user-facing string (falls back to __repr__ if not defined)
__eq__(self, other)           # ==
__lt__(self, other)             # <  (needed if you sort a list of custom objects)
__len__(self)                     # len(obj)
__hash__(self)                      # needed if you want instances usable in a set/dict key
```

### Class variable vs instance variable

```python
class Counter:
    total_created = 0        # CLASS variable - shared across all instances

    def __init__(self):
        Counter.total_created += 1
        self.count = 0          # INSTANCE variable - unique per object

a = Counter()
b = Counter()
Counter.total_created       # 2 - shared
a.count                       # 0 - only belongs to `a`
```

### Inheritance

```python
class Animal:
    def __init__(self, name):
        self.name = name

    def speak(self):
        return f"{self.name} makes a sound"

class Dog(Animal):                  # Dog inherits from Animal
    def speak(self):                   # overrides parent method
        return f"{self.name} barks"

d = Dog("Rex")
d.speak()          # "Rex barks"
isinstance(d, Animal)    # True
```

### Why this matters for LeetCode

Some problems (linked lists, trees, graphs) hand you a pre-defined class to work with:

```python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

# traversal pattern you'll reuse constantly
def traverse(node):
    while node:
        print(node.val)
        node = node.next
```

You're usually just reading `.val`, `.next`, `.left`, `.right` off objects someone else defined - you rarely need to write `__init__` yourself in these problems, just recognize the shape.
