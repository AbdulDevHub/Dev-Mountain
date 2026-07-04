import React, { useState } from 'react';

/**
 * Counter
 *
 * Demonstrates that MDX pages are real React under the hood: this
 * component holds its own state (via useState) and stays interactive
 * once the site is built and served, unlike plain Markdown content.
 *
 * Usage:
 *   <Counter />
 */
export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button
      onClick={() => setCount((current) => current + 1)}
      style={{
        padding: '0.5rem 1rem',
        borderRadius: '6px',
        border: '1px solid var(--ifm-color-emphasis-300)',
        cursor: 'pointer',
        fontWeight: 'bold',
      }}
    >
      Clicked {count} {count === 1 ? 'time' : 'times'}
    </button>
  );
}
