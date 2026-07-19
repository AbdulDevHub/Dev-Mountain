---
id: react
title: React
sidebar_label: React
tags: [react, javascript, frontend]
---

Personal reference notes on React — core concepts, hooks, patterns, and gotchas.

## What is React?

React is a JavaScript library (not a full framework) for building user interfaces out of **components**. It was created by Facebook/Meta. Its core idea: describe *what* the UI should look like for a given state, and let React figure out *how* to update the DOM to match (declarative, not imperative).

Key concepts to internalize:

- **Component-based** — UIs are built from small, reusable pieces.
- **Declarative** — you describe the end state, not the steps to get there.
- **Unidirectional data flow** — data flows down via props; events flow up via callbacks.
- **Virtual DOM** — React keeps an in-memory representation of the UI, diffs it against the previous version, and applies only the minimal set of real DOM changes (reconciliation).

## JSX

JSX is syntactic sugar for `React.createElement(...)`. It looks like HTML but is actually JavaScript.

```jsx
const element = <h1 className="title">Hello, {name}!</h1>;

// compiles roughly to:
const element = React.createElement('h1', { className: 'title' }, `Hello, ${name}!`);
```

Rules to remember:

- Use `className` instead of `class`, `htmlFor` instead of `for`.
- Every component must return a **single root element** (or use a Fragment `<>...</>`).
- JavaScript expressions go inside `{}`. Statements (if/for) do **not** work directly inside JSX — use ternaries, `&&`, or move logic above the `return`.
- Self-closing tags need the slash: `<img />`, `<br />`.

## Components

### Function components (the modern default)

```jsx
function Greeting({ name }) {
  return <p>Hello, {name}</p>;
}

// or as an arrow function
const Greeting = ({ name }) => <p>Hello, {name}</p>;
```

Class components still exist (and you'll see them in older code) but are largely legacy since hooks were introduced in React 16.8. New code should default to function components + hooks.

### Props

- Read-only, passed from parent to child.
- Never mutate props inside a component.
- Use destructuring for readability: `function Card({ title, children })`.
- `children` is a special prop for whatever is nested between the opening/closing tags.

### Composition over inheritance

React favors composing components together rather than class inheritance hierarchies. Use `children` or render props / component props to share behavior.

## State & the render cycle

State is data that's local to a component and can change over time. Changing state triggers a **re-render**.

Important mental model: **rendering ≠ DOM update**. "Rendering" means React calls your component function again to get a new description of the UI, then diffs it against the previous render and only touches the real DOM where things changed.

Re-renders happen when:

1. State changes (`useState`/`useReducer` setter is called)
2. Parent re-renders (children re-render by default too, unless memoized)
3. Context value changes (all consumers re-render)

## Hooks

Hooks let function components use state and other React features. Rules of hooks:

- Only call hooks at the **top level** (not inside loops, conditions, or nested functions).
- Only call hooks from **React function components** or **custom hooks**.

### `useState`

```jsx
const [count, setCount] = useState(0);

setCount(count + 1);        // works, but can be stale in closures
setCount(prev => prev + 1); // preferred — functional update, always correct
```

Gotcha: `setState` is **asynchronous and batched**. Don't expect `count` to be updated immediately after calling `setCount`. Multiple `setState` calls in the same event handler are batched into a single re-render (React 18+ batches this everywhere, including timeouts/promises).

### `useEffect`

Runs side effects (data fetching, subscriptions, manual DOM manipulation) after render.

```jsx
useEffect(() => {
  const id = setInterval(() => console.log('tick'), 1000);
  return () => clearInterval(id); // cleanup — runs before next effect & on unmount
}, [dependency]);
```

Dependency array behavior:

- Omitted → runs after **every** render.
- `[]` → runs **once** after mount.
- `[dep1, dep2]` → runs when any listed dependency changes (compared with `Object.is`).

Gotcha: forgetting a dependency causes **stale closures** (the effect "sees" an old value). ESLint's `react-hooks/exhaustive-deps` rule catches most of these — don't silence it without understanding why.

Gotcha: in React 18 Strict Mode (dev only), effects intentionally run twice (mount → cleanup → mount) to surface missing cleanup logic. This does not happen in production builds.

### `useContext`

Avoids prop drilling by letting nested components read a value from a `Context.Provider` higher up the tree.

```jsx
const ThemeContext = createContext('light');

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Toolbar />
    </ThemeContext.Provider>
  );
}

function Toolbar() {
  const theme = useContext(ThemeContext);
  return <div className={theme}>...</div>;
}
```

Gotcha: any component consuming a context re-renders whenever the provider's `value` changes — even if only part of the value object changed. Memoize the `value` object or split contexts to avoid unnecessary re-renders.

### `useReducer`

Alternative to `useState` for more complex state logic (multiple sub-values, next state depends on previous one).

```jsx
function reducer(state, action) {
  switch (action.type) {
    case 'increment': return { count: state.count + 1 };
    case 'decrement': return { count: state.count - 1 };
    default: throw new Error();
  }
}

const [state, dispatch] = useReducer(reducer, { count: 0 });
dispatch({ type: 'increment' });
```

### `useMemo` and `useCallback`

Both are **performance** hooks — they don't change behavior, only avoid unnecessary recomputation/re-creation.

```jsx
const expensiveValue = useMemo(() => computeExpensive(a, b), [a, b]);
const stableFn = useCallback(() => doSomething(a), [a]);
```

- `useMemo` memoizes a **value**.
- `useCallback` memoizes a **function reference** (useful when passing callbacks to memoized children, so they don't re-render unnecessarily).

Don't reach for these by default — they add complexity and have their own overhead. Profile first; optimize only proven bottlenecks.

### `useRef`

Two main uses:

1. Holding a mutable value that **doesn't trigger a re-render** when changed.
2. Getting a direct reference to a DOM node.

```jsx
const inputRef = useRef(null);
useEffect(() => { inputRef.current.focus(); }, []);

<input ref={inputRef} />
```

### Custom hooks

Just JS functions starting with `use` that call other hooks. Great for extracting reusable logic.

```jsx
function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return width;
}
```

## Lists & keys

```jsx
{items.map(item => <li key={item.id}>{item.name}</li>)}
```

- `key` helps React identify which items changed/added/removed between renders.
- Keys must be **stable and unique among siblings** — don't use array `index` if the list can be reordered, filtered, or items inserted/removed (causes subtle bugs with component state getting attached to the wrong item).

## Conditional rendering

```jsx
{isLoggedIn ? <Dashboard /> : <Login />}
{hasError && <ErrorBanner />}
```

Gotcha: `{count && <Badge />}` renders `0` (not nothing) if `count` is `0`, since `0` is falsy but still gets rendered as text. Prefer `{count > 0 && <Badge />}` or `{Boolean(count) && ...}`.

## Forms

Two approaches:

**Controlled components** (React state is the single source of truth):

```jsx
const [value, setValue] = useState('');
<input value={value} onChange={e => setValue(e.target.value)} />
```

**Uncontrolled components** (DOM holds the value, accessed via ref):

```jsx
const inputRef = useRef();
<input ref={inputRef} defaultValue="hello" />
```

Controlled is the more idiomatic React default; uncontrolled is useful for simple forms or integrating non-React code.

## Lifting state up / where state should live

When multiple components need the same state, move it to their closest common ancestor and pass it down via props. This is the classic React answer to "how do sibling components communicate."

For deeply nested trees, prefer Context or a state management library over prop drilling through many layers.

## Performance notes

- `React.memo(Component)` — skips re-rendering a component if its props haven't changed (shallow comparison).
- Split large components so unrelated state changes don't force huge re-renders.
- Avoid creating new objects/arrays/functions inline as props to memoized children (`onClick={() => ...}` defeats `React.memo` unless wrapped in `useCallback`).
- React 18 introduced automatic batching, concurrent rendering features (`useTransition`, `useDeferredValue`) for keeping UI responsive during expensive updates.

## Common ecosystem pieces

| Concern | Common library |
|---|---|
| Routing | React Router, TanStack Router |
| Data fetching / server state | TanStack Query (React Query), SWR |
| Global client state | Zustand, Redux Toolkit, Jotai, Context+useReducer |
| Forms | React Hook Form, Formik |
| Styling | CSS Modules, Tailwind, styled-components |
| Testing | React Testing Library, Vitest/Jest |

## Common pitfalls (quick checklist)

- [ ] Mutating state directly instead of creating a new object/array (`state.push(x)` ❌ → `setState([...state, x])` ✅)
- [ ] Using array index as `key` in dynamic lists
- [ ] Missing dependencies in `useEffect` (stale closures)
- [ ] Calling hooks conditionally or inside loops
- [ ] Overusing `useMemo`/`useCallback` without profiling
- [ ] Forgetting cleanup functions in `useEffect` (memory leaks, duplicate subscriptions)
- [ ] Treating `0` or `''` as "nothing to render" in `&&` conditionals

## Further reading

- [react.dev](https://react.dev) — official docs, now with much better hooks-first explanations than the old docs.
- [react.dev/reference/rules](https://react.dev/reference/rules) — the "rules of React" reference.

---
*Last updated: manually — revisit and expand as I learn more.*
