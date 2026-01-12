import React from "react";

export default function Button({ children, loading, disabled, style, ...props }) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      style={{
        width: "100%",
        padding: "12px 14px",
        borderRadius: 10,
        border: "none",
        background: disabled ? "#94a3b8" : "linear-gradient(90deg,#2563eb,#7c3aed)",
        color: "white",
        fontSize: 15,
        fontWeight: 600,
        cursor: disabled ? "not-allowed" : "pointer",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        ...style,
      }}
    >
      {loading && (
        <svg
          width="18"
          height="18"
          viewBox="0 0 50 50"
          style={{ marginRight: 6 }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="white"
            d="M43.935,25.145c0-10.318-8.364-18.682-18.682-18.682c-10.318,0-18.682,8.364-18.682,18.682h4.068
              c0-8.064,6.55-14.614,14.614-14.614c8.064,0,14.614,6.55,14.614,14.614H43.935z"
          >
            <animateTransform
              attributeType="xml"
              attributeName="transform"
              type="rotate"
              from="0 25 25"
              to="360 25 25"
              dur="0.8s"
              repeatCount="indefinite"
            />
          </path>
        </svg>
      )}
      {children}
    </button>
  );
}
