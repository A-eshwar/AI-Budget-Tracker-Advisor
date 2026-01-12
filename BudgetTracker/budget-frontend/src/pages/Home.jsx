import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div style={page}>
      <style>{`
        html { scroll-behavior: smooth; }

        /* Hover colors only (no transitions) */
        .login-btn:hover {
          background: #2563eb !important;
          color: white !important;
        }
        .signup-btn:hover {
          background: #1e40af !important;
        }
        .cta-btn:hover {
          background: #1e3a8a !important;
        }
        .signin-link:hover {
          color: #1e40af !important;
        }
      `}</style>

      {/* ================= HEADER ================= */}
      <header style={topbar}>
        <div style={topbarInner}>
          
          {/* Brand */}
          <div style={brand}>
            <div style={logo}>BT</div>
            <div style={{ marginLeft: 12 }}>
              <div style={brandTitle}>AI Budget Tracker</div>
              <div style={brandSub}>Plan smarter. Save more.</div>
            </div>
          </div>

          {/* Navigation + Auth */}
          <div style={navWrapper}>
            <nav style={navLinks}>
              <a href="#features" style={navLink}>Features</a>
              <a href="#how" style={navLink}>How it works</a>
            </nav>

            <div style={authButtons}>
              <Link to="/login" style={{ textDecoration: "none" }}>
                <button style={loginBtn} className="login-btn">Login</button>
              </Link>

              <Link to="/signup" style={{ textDecoration: "none" }}>
                <button style={signupBtn} className="signup-btn">Signup</button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ================= HERO ================= */}
      <main style={heroWrap}>
        <div style={heroCard}>
          <h1 style={heroTitle}>Smart Budgeting Starts Here</h1>

          <p style={heroLead}>
            Track expenses, understand spending patterns, and receive
            AI-powered suggestions to manage your money better.
          </p>

          <div style={ctaRow}>
            <Link to="/signup" style={{ textDecoration: "none" }}>
              <button style={primaryCta} className="cta-btn">Get Started</button>
            </Link>

            <Link to="/login" style={{ textDecoration: "none" }}>
              <div style={secondaryText}>
                Already using BudgetTracker?{" "}
                <span style={signInText} className="signin-link">
                  Sign in →
                </span>
              </div>
            </Link>
          </div>
        </div>
      </main>

      {/* ================= FEATURES ================= */}
      <section id="features" style={featuresSection}>
        <div style={featuresOverlay}>
          <h2 style={featuresTitle}>Why Choose BudgetTracker?</h2>

          <div style={featuresGrid}>
            <Feature title="💸 Expense Tracking">
              Log income & expenses in seconds
            </Feature>

            <Feature title="📊 Visual Insights">
              Clear summaries & balance overview
            </Feature>

            <Feature title="🤖 AI Advisor">
              Smart suggestions to improve savings
            </Feature>

            <Feature title="🔒 Secure Data">
              JWT-based authentication & privacy
            </Feature>
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section id="how" style={howSection}>
        <h2 style={howTitle}>How It Works</h2>

        <div style={howGrid}>
          <HowStep
            step="01"
            title="Create an Account"
            desc="Sign up securely and set up your personal budgeting profile."
          />
          <HowStep
            step="02"
            title="Add Transactions"
            desc="Record income and expenses or sync them automatically."
          />
          <HowStep
            step="03"
            title="Get AI Insights"
            desc="Receive smart recommendations to save and spend wisely."
          />
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer style={footer}>
        © {new Date().getFullYear()} BudgetTracker
      </footer>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function Feature({ title, children }) {
  return (
    <div style={featureCard}>
      <div style={{ fontSize: 20, fontWeight: 800 }}>{title}</div>
      <div style={{ marginTop: 10, fontSize: 15, color: "#475569", lineHeight: 1.6 }}>
        {children}
      </div>
    </div>
  );
}

function HowStep({ step, title, desc }) {
  return (
    <div style={howCard}>
      <div style={howStepNum}>{step}</div>
      <h3 style={howStepTitle}>{title}</h3>
      <p style={howStepDesc}>{desc}</p>
    </div>
  );
}

const page = {
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  background: "linear-gradient(180deg,#f8fafc 0%, #ffffff 60%)",
  fontFamily: "system-ui, -apple-system, Segoe UI, Roboto",
};

/* Header */
const topbar = {
  position: "sticky",
  top: 0,
  zIndex: 1000,
  width: "100%",
  background: "white",
  borderBottom: "1px solid #e5e7eb",
};

const topbarInner = {
  maxWidth: 1200,
  margin: "0 auto",
  padding: "14px 28px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const brand = { display: "flex", alignItems: "center" };

const logo = {
  width: 52,
  height: 52,
  borderRadius: 14,
  background: "linear-gradient(135deg,#2563eb,#7c3aed)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "white",
  fontWeight: 800,
  fontSize: 18,
};

const brandTitle = { fontSize: 18, fontWeight: 700, color: "#0f172a" };
const brandSub = { fontSize: 12, color: "#64748b" };

const navWrapper = {
  display: "flex",
  alignItems: "center",
  gap: 28,
};

const navLinks = {
  display: "flex",
  gap: 18,
};

const authButtons = {
  display: "flex",
  gap: 12,
};

const navLink = {
  fontSize: 14,
  fontWeight: 600,
  color: "#475569",
  textDecoration: "none",
};

const loginBtn = {
  border: "2px solid #2563eb",
  background: "transparent",
  color: "#2563eb",
  padding: "8px 16px",
  borderRadius: 12,
  fontWeight: 600,
  cursor: "pointer",
};

const signupBtn = {
  border: "2px solid #2563eb",
  background: "#2563eb",
  color: "white",
  padding: "8px 18px",
  borderRadius: 12,
  fontWeight: 700,
  cursor: "pointer",
};

/* Hero */
const heroWrap = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "70px 20px",
};

const heroCard = {
  width: 900,
  maxWidth: "96%",
  background: "linear-gradient(180deg,#ffffff 0%, #f9fafb 100%)",
  borderRadius: 20,
  padding: "48px 40px",
  textAlign: "center",
  boxShadow: "0 30px 80px rgba(2,6,23,0.08)",
};

const heroTitle = {
  fontSize: 38,
  fontWeight: 800,
  color: "#0f172a",
};

const heroLead = {
  marginTop: 18,
  fontSize: 16,
  color: "#475569",
  lineHeight: 1.6,
};

const ctaRow = {
  marginTop: 30,
  display: "flex",
  justifyContent: "center",
  gap: 20,
};

const primaryCta = {
  background: "linear-gradient(135deg,#2563eb,#7c3aed)",
  color: "white",
  border: "none",
  padding: "14px 30px",
  borderRadius: 999,
  fontSize: 16,
  fontWeight: 700,
  cursor: "pointer",
};

const secondaryText = { color: "#475569", fontSize: 15 };

const signInText = {
  color: "#2563eb",
  fontWeight: 700,
  marginLeft: 4,
};

/* Features */
const featuresSection = {
  backgroundImage:
    "linear-gradient(180deg,#eef2ff 0%, #ffffff 60%)",
};

const featuresOverlay = {
  padding: "70px 24px",
};

const featuresTitle = {
  textAlign: "center",
  fontSize: 32,
  fontWeight: 800,
  marginBottom: 40,
};

const featuresGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
  gap: 20,
  maxWidth: 1000,
  margin: "0 auto",
};

const featureCard = {
  background: "#fff",
  padding: "28px 24px",
  borderRadius: 18,
  minHeight: 170,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  textAlign: "center",
  boxShadow: "0 14px 40px rgba(2,6,23,0.08)",
};

/* How it works */
const howSection = {
  padding: "70px 24px",
  background: "linear-gradient(180deg,#f0f9ff 0%, #ffffff 60%)",
  textAlign: "center",
};

const howTitle = {
  fontSize: 32,
  fontWeight: 800,
  marginBottom: 40,
};

const howGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
  gap: 24,
  maxWidth: 1000,
  margin: "0 auto",
};

const howCard = {
  background: "#fff",
  padding: 28,
  borderRadius: 18,
  boxShadow: "0 12px 30px rgba(2,6,23,0.08)",
};

const howStepNum = {
  fontSize: 14,
  fontWeight: 800,
  color: "#2563eb",
  marginBottom: 10,
};

const howStepTitle = {
  fontSize: 18,
  fontWeight: 700,
  marginBottom: 8,
};

const howStepDesc = {
  fontSize: 14,
  color: "#475569",
  lineHeight: 1.6,
};

const footer = {
  padding: "18px",
  textAlign: "center",
  color: "#94a3b8",
  fontSize: 13,
};
