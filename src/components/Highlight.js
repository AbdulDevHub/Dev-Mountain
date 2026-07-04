import React from 'react';

/**
 * Highlight
 *
 * Wraps its children in an inline span with a colored background.
 * Demonstrates a simple, static (stateless) component that accepts
 * a prop and renders children — including Markdown-parsed children
 * passed in from an MDX file.
 *
 * Usage:
 *   <Highlight color="#25c2a0">some text</Highlight>
 */
export default function Highlight({ color, children }) {
  return (
    <span
      style={{
        backgroundColor: color,
        borderRadius: '4px',
        color: '#fff',
        padding: '0.1rem 0.4rem',
        fontWeight: 'bold',
      }}
    >
      {children}
    </span>
  );
}
