import React from "react";

export default function Input({
  label,
  id,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  autoComplete,
  ...rest
}) {
  return (
    <div style={{ marginBottom: 14 }}>
      {label && (
        <label htmlFor={id} style={{ display: "block", marginBottom: 6, fontSize: 16, color: "#374151" }}>
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        {...rest}
        style={{
          width: "100%",
          padding: "12px 14px",
          paddingRight: 44,                 
          boxSizing: "border-box",         
          borderRadius: 10,
          border: error ? "1.5px solid #ef4444" : "1px solid #e6e9ee",
          outline: "none",
          fontSize: 14,
          transition: "box-shadow .15s ease, border-color .15s ease",
        }}
        onFocus={(e) => (e.target.style.boxShadow = "0 6px 18px rgba(15,23,42,0.06)")}
        onBlur={(e) => (e.target.style.boxShadow = "none")}
      />
      {error && <div style={{ marginTop: 8, color: "#ef4444", fontSize: 13 }}>{error}</div>}
    </div>
  );
}
