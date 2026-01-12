import React, { useState, useContext} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext, useAuth } from "../context/AuthContext";
import api from "../api/axiosClient";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const { user, logout } = useContext(AuthContext);
  const { alertCount, refreshAlertCount } = useAuth();

  const [showLogout, setShowLogout] = useState(false);
  const [isLogoutHovered, setIsLogoutHovered] = useState(false);

  const handleAlertsClick = async () => {
    if (!user?.id) return;

    try {
      await api.put("/budget/alerts/read", null, {
        params: { userId: user.id }
      });

      refreshAlertCount(); // 🔥 badge becomes 0
      navigate("/alerts");
    } catch (e) {
      console.error("Failed to mark alerts read");
    }
  };

  return (
    <>
      <aside style={styles.sidebar}>
        <div style={styles.sidebarTop}>
          <h2 style={styles.logo}>BudgetWise</h2>

          <div style={styles.profileCard}>
            <div style={styles.avatar}>
              {user?.name?.[0]?.toUpperCase() || "E"}
            </div>
            <div>
              <div style={styles.userName}>{user?.name || "eshwar"}</div>
              <div style={styles.userEmail}>{user?.email || "abcd@gmail.com"}</div>
            </div>
          </div>

          <nav style={styles.nav}>
            <NavItem
              label="🏠 Dashboard"
              onClick={() => navigate("/dashboard")}
              active={location.pathname === "/dashboard"}
            />

            <NavItem
              label="📄 Transactions"
              onClick={() => navigate("/transactions")}
              active={location.pathname === "/transactions"}
            />

            <NavItem
              label="🎯 Budget"
              onClick={() => navigate("/budget")}
              active={location.pathname === "/budget"}
            />
            <NavItem
              label="💾 Savings"
              onClick={() => navigate("/savings")}
              active={location.pathname === "/savings"}
            />
            <NavItem
              label="📊 Analytics"
              onClick={() => navigate("/analytics")}
              active={location.pathname === "/analytics"}
            />
            <NavItem
              label={
                <>
                  🔔 Alerts
                  {alertCount > 0 && (
                    <span style={styles.badge}>{alertCount}</span>
                  )}
                </>
              }
              onClick={handleAlertsClick}
              active={location.pathname === "/alerts"}
            />
          </nav>
        </div>

        <button
          style={{
            ...styles.logoutBtn,
            backgroundColor: isLogoutHovered ? "#fee2e2" : "transparent",
            color: isLogoutHovered ? "#ef4444" : "#64748b"
          }}
          onMouseEnter={() => setIsLogoutHovered(true)}
          onMouseLeave={() => setIsLogoutHovered(false)}
          onClick={() => setShowLogout(true)}
        >
          🚪 Logout
        </button>
      </aside>

      {showLogout && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h3 style={{ marginBottom: 10 }}>Confirm Logout</h3>
            <p style={{ color: "#64748b", marginBottom: 20 }}>
              Are you sure you want to leave?
            </p>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
              <button
                style={styles.cancelBtn}
                onClick={() => setShowLogout(false)}
              >
                Cancel
              </button>
              <button
                style={styles.confirmBtn}
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ---------------- NAV ITEM ---------------- */

function NavItem({ label, onClick, active }) {
  const [hover, setHover] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        ...styles.navItem,
        background: active || hover ? "#f1f5f9" : "transparent",
        color: active || hover ? "#4f46e5" : "#64748b"
      }}
    >
      {label}
    </div>
  );
}

/* ---------------- STYLES ---------------- */

const styles = {
  sidebar: {
    width: 280,
    background: "#fff",
    padding: "30px 24px",
    borderRight: "1px solid #e2e8f0",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "100vh",
    position: "sticky",
    top: 0,
    boxSizing: "border-box",
    fontFamily: "'Inter', sans-serif"
  },
  sidebarTop: { display: "flex", flexDirection: "column", gap: "8px" },
  logo: { fontSize: 24, fontWeight: 800, color: "#1e293b", marginBottom: 40 },
  profileCard: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: 16,
    background: "#f8fafc",
    borderRadius: 16,
    marginBottom: 30
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 12,
    background: "#6366f1",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700
  },
  userName: { fontSize: 15, fontWeight: 700, color: "#1e293b" },
  userEmail: { fontSize: 12, color: "#64748b" },
  nav: { display: "flex", flexDirection: "column", gap: 8 },
  navItem: {
    padding: "12px 16px",
    borderRadius: 12,
    cursor: "pointer",
    fontWeight: 600,
    transition: "0.2s",
    fontSize: 15,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between"
  },
  badge: {
    background: "#ef4444",
    color: "#fff",
    borderRadius: 999,
    padding: "2px 8px",
    fontSize: 12,
    fontWeight: 700
  },
  logoutBtn: {
    padding: "12px 16px",
    borderRadius: 12,
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
    textAlign: "left",
    transition: "0.3s",
    fontSize: 15
  },
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(15, 23, 42, 0.4)",
    backdropFilter: "blur(4px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000
  },
  modal: {
    background: "#fff",
    padding: "30px",
    borderRadius: "24px",
    width: "340px",
    boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)"
  },
  cancelBtn: {
    padding: "10px 20px",
    borderRadius: 12,
    border: "1px solid #e2e8f0",
    background: "none",
    fontWeight: 600,
    cursor: "pointer"
  },
  confirmBtn: {
    padding: "10px 20px",
    borderRadius: 12,
    background: "#ef4444",
    color: "#fff",
    border: "none",
    fontWeight: 600,
    cursor: "pointer"
  }
};
