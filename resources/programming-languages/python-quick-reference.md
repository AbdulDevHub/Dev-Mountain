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
s.isalpha()                                # True only if all chars are letters AND string is non-empty
                                            # "" -> False, "abc123" -> False, "abc" -> True

f"{s} has {len(s)} chars"                  # f-string formatting - embed expressions directly in a string
```

### f-strings

```python
name = "Ada"
score = 91.567

f"Hi {name}"                     # "Hi Ada"                - drop any expression in {}
f"{name} scored {score:.1f}"       # "Ada scored 91.6"        - format spec after a colon
f"{score:.2%}"                       # "9156.70%"                - percentage formatting
f"{1 + 2}"                             # "3"                        - expressions work, not just variables
f"{name!r}"                              # "'Ada'"                     - !r calls repr() on the value

# multi-line f-string / string, built with triple quotes (see "Multi-line strings" below)
msg = f"""
Name: {name}
Score: {score}
"""
```

### Multi-line comments and strings

```python
# Python has no real "block comment" syntax - # only comments a single line.
# The common workaround is a triple-quoted string used as a "comment":

"""
This whole block is technically a string literal,
not a real comment - but if it isn't assigned to
anything and isn't the first line of a function/class
(where it would become a docstring), it's effectively
ignored at runtime and reads like a multi-line comment.
"""

# Triple quotes are also the normal way to build an actual
# multi-line STRING value (this one IS meant to be used):
paragraph = """Line one.
Line two.
Line three."""

def greet(name):
    """This one IS a docstring - first statement in a function/class,
    used by help(greet) and tooling. Not just a comment."""
    return f"Hello, {name}"
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

## Assertions

```python
price = 10
assert price >= 0                        # passes silently, does nothing if True
assert price >= 0, "price cannot be negative"   # raises AssertionError with this message if False

# assert <condition>, <optional message>
# - used to sanity-check assumptions / invariants (fail fast + loud if something is impossible)
# - NOT for validating user input in production - asserts can be stripped out
#   entirely if Python is run with the -O (optimize) flag, so don't rely on
#   them for logic your program actually needs to run correctly
# - handy in LeetCode/debugging to double-check an assumption mid-function:
def divide(a, b):
    assert b != 0, "division by zero"
    return a / b
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

### Sorting with a comparator (`cmp_to_key`)

Sometimes `key=` isn't enough - you need to compare two elements *against each other* to decide order (classic example: arrange numbers to form the largest possible concatenated result).

```python
from functools import cmp_to_key

nums = ["3", "30", "34", "5", "9"]

def compare(n1, n2):
    if n1 + n2 > n2 + n1:
        return -1   # n1 should come BEFORE n2
    else:
        return 1    # n1 should come AFTER n2

nums = sorted(nums, key=cmp_to_key(compare))

# comparator function rules:
#   return negative -> n1 comes first
#   return positive -> n2 comes first
#   return 0        -> leave order unchanged
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

**Comparing two lists with sets** (e.g. "which elements are only in each list"):

```python
nums1 = [1, 2, 3]
nums2 = [2, 3, 4]

set1 = set(nums1)
set2 = set(nums2)
[list(set1 - set2), list(set2 - set1)]   # [[1], [4]] - unique-to-each side, in one line
```

### random

```python
import random

random.randint(1, 100)     # random INT between 1 and 100, INCLUSIVE on both ends
random.choice(some_list)     # random single element from a non-empty sequence (list/tuple/string)
random.choice(list(some_set))  # sets aren't indexable/sequenced, so convert to a list first
random.shuffle(some_list)        # shuffles a list in place, returns None
```

### Bitwise tricks in conditionals

`^` (XOR) is handy for combining two boolean-ish conditions where you want the result to be true only when exactly one of them is true - a common shortcut in wiggle-sort / alternating-pattern problems:

```python
# True only when parity of i and the "is ascending" check disagree
if (i % 2) ^ (nums[i] > nums[i - 1]):
    ...
```

### min/max over a slice

```python
# picks the smallest value from everything before index i on odd i,
# or the largest value from everything before index i on even i
smallLargeIndex = min(nums[:i]) if i % 2 else max(nums[:i])

# watch your slice direction - nums[i:0] is EMPTY (start after end),
# you almost always want nums[:i] (everything up to i) here instead
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

### Default / optional constructor args

```python
class Node:
    def __init__(self, val: int = None):    # val defaults to None if not passed
        self.val = val
        self.next = None

Node()          # val = None
Node(5)         # val = 5
```

The `: int` is a type hint (documentation for humans/tools, not enforced at runtime) - since the default is `None`, the more precise hint is `Optional[int]` from the `typing` module, but plenty of code (and LeetCode starter templates) leaves it as a plain `int` hint for brevity.

### Magic (dunder) methods

"Magic methods" are methods surrounded by double underscores (`__like_this__`, hence "dunder") that Python calls automatically for you in response to built-in syntax or functions - you rarely call them directly yourself.

```python
__init__(self, ...)     # constructor - runs automatically when you write ClassName(...)
__repr__(self)            # developer-facing string, used by print() and in lists/debuggers
__str__(self)               # user-facing string (falls back to __repr__ if not defined)
__eq__(self, other)           # controls ==
__lt__(self, other)             # controls <  (needed if you sort a list of custom objects)
__len__(self)                     # controls len(obj)
__hash__(self)                      # needed if you want instances usable in a set/dict key
__dict__                              # not a method - an attribute every instance has,
                                       # a dict of all its instance attributes: p.__dict__
                                       # -> {'x': 3, 'y': 4}, handy for quickly inspecting an object
```

`__init__` is the one you'll write constantly; the rest you implement only when you need that specific built-in behavior (e.g. implement `__lt__` so `sorted()` knows how to compare your objects).

### Instance attribute vs. class attribute

```python
class Counter:
    total_created = 0        # CLASS attribute - lives on the class, shared across ALL instances

    def __init__(self):
        Counter.total_created += 1   # modify via the class, not an instance
        self.count = 0                  # INSTANCE attribute - unique per object, set in __init__

a = Counter()
b = Counter()
Counter.total_created       # 2 - shared, both instances see the same value
a.count                       # 0 - only belongs to `a`
b.count                        # 0 - only belongs to `b`, changing a.count won't affect b.count
```

- **Class attribute:** defined directly in the class body (not inside `__init__`), one copy shared by every instance and the class itself. Good for constants/counters/defaults.
- **Instance attribute:** defined with `self.name = ...`, usually inside `__init__`, a separate copy per object. This is what you'll use 95% of the time for an object's actual data.
- Reading `a.total_created` also works (Python looks up the instance first, then falls back to the class) - but *assigning* `a.total_created = 5` creates a brand-new instance attribute on `a` that shadows the class one, it does NOT change the shared value. Assign through the class name when you mean to change the shared value.

### Decorators

A decorator is a function that wraps another function/method to add behavior without changing its source code - written with `@` on the line above a `def`.

```python
def shout(func):
    def wrapper(*args, **kwargs):
        result = func(*args, **kwargs)
        return result.upper()
    return wrapper

@shout
def greet(name):
    return f"hello, {name}"

greet("ada")     # "HELLO, ADA" - shout() wrapped greet() automatically
```

Inside classes, decorators are how you mark special kinds of methods (see `@property`, `@classmethod`, `@staticmethod` below). `@decorator_name` right above a `def` is just shorthand for `func = decorator_name(func)`.

```python
class Item:
    def __init__(self, price):
        self._price = price

    @property                    # lets you call it like an attribute: item.price (no parens)
    def price(self):
        return self._price

    @price.setter                 # enables item.price = 50 while still running validation
    def price(self, value):
        assert value >= 0, "price cannot be negative"
        self._price = value

item = Item(100)
item.price          # 100 - looks like a plain attribute access
item.price = 50        # runs the validation in the setter
item.price = -10        # raises AssertionError
```

### Class method vs. static method vs. instance method

```python
class Item:
    all_items = []

    def __init__(self, name, price):
        self.name = name
        self.price = price
        Item.all_items.append(self)

    def apply_discount(self, percent):        # INSTANCE method - takes `self`,
        self.price -= self.price * percent      # needs a specific instance's data
        return self.price

    @classmethod
    def instantiate_from_csv(cls, name, price_str):   # CLASS method - takes `cls`,
        return cls(name, float(price_str))               # works with the class itself,
                                                           # often used as an alternate constructor

    @staticmethod
    def is_valid_price(price):                # STATIC method - takes neither self nor cls,
        return price >= 0                        # just lives inside the class namespace
                                                   # because it's logically related to it

item = Item("Phone", 500)
item.apply_discount(0.1)                       # needs `self` -> call on an instance
Item.instantiate_from_csv("Laptop", "999.99")    # needs `cls` -> call on the class (or instance)
Item.is_valid_price(-5)                            # needs neither -> call on the class (or instance)
```

| | first param | called on | typical use |
|---|---|---|---|
| instance method | `self` | an instance | reads/writes that instance's data |
| `@classmethod` | `cls` | class or instance | alternate constructors, anything touching the class itself |
| `@staticmethod` | neither | class or instance | a utility function that's related but doesn't need `self`/`cls` |

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

Use `super()` inside a child class to call the parent's version of a method (e.g. `super().__init__(name)`) instead of duplicating its logic - common when a subclass needs everything the parent's `__init__` does, plus a bit more.

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

### Recommended: OOP course

A course by *FreeCodeCamp* covers Python OOP in depth using a practical, step-by-step build of a store management system. Rough outline of what it covers:

- **Fundamentals of classes** - why classes exist, moving from plain variables to custom data types
- **Constructors and attributes** - `__init__`, assigning attributes dynamically, inspecting objects via `__dict__`
- **Instance vs. class vs. static methods** - the role of `self` and `cls`
- **Inheritance** - building a child class (e.g. `Phone`) from a parent (`Item`) using `super()`
- **Getters/setters** - `@property` for read-only attributes and validation/encapsulation
- **The four pillars of OOP** - Encapsulation, Abstraction, Inheritance, Polymorphism
