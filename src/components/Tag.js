import React from "react"

export default function Tag({ children, color }) {
  return (
    <span
      style={{
        backgroundColor: color,
        padding: "0.2rem 0.5rem",
        borderRadius: "4px",
        color: "#fff",
        fontWeight: "bold",
      }}
    >
      {children}
    </span>
  )
}
