// src/pages/Login.jsx
import React, { useState, useContext } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import api from "../api/axiosClient";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState({});
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const { login, reload } = useContext(AuthContext);
  const navigate = useNavigate();

  const validate = () => {
    const e = {};
    if (!form.email) e.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email";

    if (!form.password) e.password = "Password is required";
    setFieldErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    setMsg(null);

    if (!validate()) return;

    setLoading(true);
    try {
      const res = await api.post("/auth/login", form);

      const token = res.data.token;
      const user = {
        id: res.data.userId,
        email: res.data.email,
        name: res.data.name,
      };

      login(token, user);
      await reload();
      navigate("/dashboard");
    } catch (err) {
      setMsg({
        type: "error",
        text: err.response?.data?.message || "Invalid credentials",
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
            <div style={subTitle}>Sign in to your account</div>
          </div>
        </div>

        <form onSubmit={submit} style={{ marginTop: 18 }}>
          <Input
            id="email"
            label="Email"
            type="email"
            placeholder="you@gmail.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            error={fieldErrors.email}
            autoComplete="email"
          />

          <Input
            id="password"
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            error={fieldErrors.password}
            autoComplete="current-password"
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
                fontSize: 16,
              }}
            >
              {msg.text}
            </div>
          )}

          <div style={{ marginTop: 16 }}>
            <Button type="submit" loading={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </div>
        </form>

        <div style={{ marginTop: 16, textAlign: "center", color: "#6b7280" }}>
          New here?{" "}
          <Link
            to="/signup"
            style={{
              color: "#7c3aed",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            Create an account
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
  position: "relative", // ✅ needed for absolute button
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
  cursor: "pointer",
};

const card = {
  width: 420,
  maxWidth: "95%",
  background: "white",
  borderRadius: 14,
  padding: 20,
  boxShadow: "0 10px 30px rgba(2,6,23,0.08)",
};

const header = {
  display: "flex",
  alignItems: "center",
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
  fontSize: 18,
};

const appTitle = { margin: 0, fontSize: 20, color: "#0f172a" };
const subTitle = { fontSize: 15, color: "#64748b" };