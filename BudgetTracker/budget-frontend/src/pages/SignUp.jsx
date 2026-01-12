import React, { useState } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import api from "../api/axiosClient";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: ""
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const validate = () => {
    const e = {};

    if (!form.name || form.name.trim().length < 2)
      e.name = "Please enter your name (min 2 characters)";

    if (!form.email) e.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email))
      e.email = "Enter a valid email";

    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6)
      e.password = "Password must be at least 6 characters";

    if (form.password !== form.confirm)
      e.confirm = "Passwords do not match";

    setFieldErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    setMsg(null);
    if (!validate()) return;

    setLoading(true);
    try {
      await api.post("/auth/signup", {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password
      });

      setMsg({
        type: "success",
        text: "Account created! Redirecting to login..."
      });

      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setMsg({
        type: "error",
        text: err.response?.data?.message || "Signup failed"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={page}>
      {/* 🔙 BACK TO HOME */}
      <button style={backBtn} onClick={() => navigate("/")}>
        ← Back to Home
      </button>

      <div style={card}>
        <div style={header}>
          <div style={logo}>BT</div>
          <div style={{ marginLeft: 12 }}>
            <h1 style={appTitle}>BudgetTracker</h1>
            <div style={subTitle}>Create your account</div>
          </div>
        </div>

        <form onSubmit={submit} style={{ marginTop: 18 }}>
          <Input
            id="name"
            label="Full name"
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Your full name"
            error={fieldErrors.name}
          />

          <Input
            id="email"
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="you@gmail.com"
            error={fieldErrors.email}
          />

          <Input
            id="password"
            label="Password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="Create a password"
            error={fieldErrors.password}
          />

          <Input
            id="confirm"
            label="Confirm password"
            type="password"
            value={form.confirm}
            onChange={(e) => setForm({ ...form, confirm: e.target.value })}
            placeholder="Re-type your password"
            error={fieldErrors.confirm}
          />

          {msg && (
            <div
              role="alert"
              style={{
                marginTop: 12,
                padding: "10px 12px",
                borderRadius: 8,
                background: msg.type === "error" ? "#fff1f0" : "#ecfdf5",
                color: msg.type === "error" ? "#b91c1c" : "#065f46",
                fontSize: 16
              }}
            >
              {msg.text}
            </div>
          )}

          <div style={{ marginTop: 16 }}>
            <Button type="submit" loading={loading}>
              {loading ? "Creating..." : "Create account"}
            </Button>
          </div>
        </form>

        <div style={{ marginTop: 16, textAlign: "center", color: "#6b7280" }}>
          Already have an account?{" "}
          <Link
            to="/login"
            style={{
              color: "#7c3aed",
              textDecoration: "none",
              fontWeight: 600
            }}
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const page = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 24,
  background: "linear-gradient(180deg,#f8fafc 0%, #ffffff 60%)",
  position: "relative" // required for absolute button
};

const backBtn = {
  position: "absolute",
  top: 20,
  right: 24,
  padding: "8px 14px",
  borderRadius: 10,
  border: "1px solid #6366f1",
  background: "#fff",
  color: "#6366f1",
  fontWeight: 600,
  cursor: "pointer"
};

const card = {
  width: 420,
  maxWidth: "95%",
  background: "white",
  borderRadius: 14,
  padding: 20,
  boxShadow: "0 10px 30px rgba(2,6,23,0.08)"
};

const header = {
  display: "flex",
  alignItems: "center"
};

const logo = {
  width: 52,
  height: 52,
  borderRadius: 12,
  background: "linear-gradient(135deg,#2563eb,#7c3aed)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "white",
  fontWeight: 800,
  fontSize: 18
};

const appTitle = { margin: 0, fontSize: 20, color: "#0f172a" };
const subTitle = { fontSize: 15, color: "#64748b" };
