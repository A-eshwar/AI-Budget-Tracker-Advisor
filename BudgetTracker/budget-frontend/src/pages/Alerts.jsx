import React, { useEffect, useState, useContext } from "react";
import api from "../api/axiosClient";
import Sidebar from "../components/Sidebar";
import { AuthContext } from "../context/AuthContext";

// --- NEW SUB-COMPONENT: CONFIRMATION POPUP ---
const ConfirmationModal = ({ title, message, onConfirm, onCancel }) => (
  <div style={styles.modalOverlay}>
    <div style={styles.modalContent}>
      <h3 style={{ margin: "0 0 10px 0", color: "#1e293b" }}>{title}</h3>
      <p style={{ color: "#64748b", fontSize: "0.9rem", marginBottom: "24px" }}>{message}</p>
      <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
        <button style={styles.modalCancelBtn} onClick={onCancel}>Cancel</button>
        <button style={styles.modalConfirmBtn} onClick={onConfirm}>Confirm Delete</button>
      </div>
    </div>
  </div>
);

export default function Alerts() {
  const { user } = useContext(AuthContext);
  const [alerts, setAlerts] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);

  // New states for custom confirmation
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState({ title: "", message: "", action: null });

  useEffect(() => {
    if (!user?.id) return;
    api.get("/budget/alerts", { params: { userId: user.id } }).then(res => {
      setAlerts(res.data);
      setLoading(false);
    });
  }, [user?.id]);

  const toggleSelect = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const selectAll = () => setSelected(alerts.map(a => a.alertId));
  const clearSelection = () => setSelected([]);

  // --- TRIGGER MODAL FOR SELECTED ---
  const requestDeleteSelected = () => {
    if (selected.length === 0) return;
    setConfirmConfig({
      title: "Delete Selected Alerts",
      message: `Are you sure you want to delete ${selected.length} selected alert(s)? This action cannot be undone.`,
      action: executeDeleteSelected
    });
    setShowConfirm(true);
  };

  const executeDeleteSelected = async () => {
    await api.delete("/budget/alerts/delete", {
      params: { userId: user.id },
      data: selected
    });
    setAlerts(prev => prev.filter(a => !selected.includes(a.alertId)));
    setSelected([]);
    setShowConfirm(false);
  };

  // --- TRIGGER MODAL FOR ALL ---
  const requestDeleteAll = () => {
    setConfirmConfig({
      title: "Clear All Alerts",
      message: "Are you sure you want to delete every alert in your history? This action cannot be undone.",
      action: executeDeleteAll
    });
    setShowConfirm(true);
  };

  const executeDeleteAll = async () => {
    await api.delete("/budget/alerts/delete/all", { params: { userId: user.id } });
    setAlerts([]);
    setSelected([]);
    setShowConfirm(false);
  };

  return (
    <div style={styles.layout}>
      <Sidebar />

      {/* RENDER CUSTOM POPUP */}
      {showConfirm && (
        <ConfirmationModal 
          title={confirmConfig.title}
          message={confirmConfig.message}
          onConfirm={confirmConfig.action}
          onCancel={() => setShowConfirm(false)}
        />
      )}

      <main style={styles.page}>
        <div style={styles.header}>
          <h1 style={styles.pageTitle}>Alerts</h1>
          <p style={styles.subText}>Budget warnings and exceeded notifications</p>
        </div>

        {!loading && alerts.length > 0 && (
          <div style={styles.actions}>
            <button style={styles.smallBtn} onClick={selectAll}>Select All</button>
            <button style={styles.smallBtn} onClick={clearSelection}>Clear</button>
            <button
              onClick={requestDeleteSelected}
              disabled={selected.length === 0}
              style={{ 
                ...styles.deleteBtn, 
                opacity: selected.length === 0 ? 0.5 : 1,
                cursor: selected.length === 0 ? "not-allowed" : "pointer"
              }}
            >
              Delete Selected
            </button>
            <button onClick={requestDeleteAll} style={styles.deleteAllBtn}>
              Delete All
            </button>
          </div>
        )}

        {loading && <p style={styles.loadingText}>Loading alerts...</p>}

        {!loading && alerts.length === 0 && (
          <div style={styles.emptyState}>
            <span style={{ fontSize: "2rem", marginBottom: "10px", display: "block" }}>🎉</span>
            No active alerts. You're staying within your budget!
          </div>
        )}

        <div style={styles.listContainer}>
          {alerts.map(alert => (
            <div
              key={alert.alertId}
              style={{
                ...styles.card,
                borderLeft: alert.alertType === "EXCEEDED" ? "6px solid #ef4444" : "6px solid #f59e0b"
              }}
              onClick={() => toggleSelect(alert.alertId)}
            >
              <input
                type="checkbox"
                checked={selected.includes(alert.alertId)}
                onChange={() => toggleSelect(alert.alertId)}
                style={styles.checkbox}
                onClick={(e) => e.stopPropagation()} 
              />
              <div style={{ marginLeft: 20, flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h3 style={{ ...styles.alertType, color: alert.alertType === "EXCEEDED" ? "#ef4444" : "#b45309" }}>
                    {alert.alertType}
                  </h3>
                  <small style={styles.time}>
                    {new Date(alert.createdAt).toLocaleDateString()} at {new Date(alert.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </small>
                </div>
                <p style={styles.message}>{alert.message}</p>
                <div style={styles.meta}>
                  <span style={styles.badge}>Category: <b>{alert.category}</b></span>
                  <span style={{...styles.badge, marginLeft: 10}}>Period: {alert.month}/{alert.year}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

const styles = {
  // ... (keep existing styles)
  layout: { display: "flex", minHeight: "100vh", background: "#f8fafc", fontFamily: "'Inter', sans-serif" },
  page: { flex: 1, padding: "40px 50px", overflowY: "auto" },
  header: { marginBottom: 30 },
  pageTitle: { fontSize: "1.75rem", fontWeight: 800, color: "#1e293b", margin: 0 },
  subText: { color: "#64748b", marginTop: 4, fontSize: "0.875rem", fontWeight: "500" },
  actions: { display: "flex", gap: 12, marginBottom: 25, flexWrap: "wrap" },
  smallBtn: { padding: "8px 16px", borderRadius: "10px", border: "1px solid #e2e8f0", background: "#fff", fontWeight: "600", cursor: "pointer", fontSize: "0.85rem", color: "#475569" },
  deleteBtn: { padding: "8px 16px", borderRadius: "10px", border: "none", background: "#ef4444", color: "#fff", fontWeight: "600", fontSize: "0.85rem", boxShadow: "0 4px 12px rgba(239, 68, 68, 0.2)" },
  deleteAllBtn: { padding: "8px 16px", borderRadius: "10px", border: "1px solid #ef4444", background: "transparent", color: "#ef4444", fontWeight: "600", fontSize: "0.85rem", cursor: "pointer" },
  listContainer: { maxWidth: "900px" },
  card: { display: "flex", alignItems: "center", background: "rgba(255, 255, 255, 0.9)", padding: "20px 24px", borderRadius: "20px", marginBottom: "16px", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.05)", border: "1px solid rgba(255,255,255,0.4)", cursor: "pointer", transition: "transform 0.2s" },
  checkbox: { width: "18px", height: "18px", cursor: "pointer", accentColor: "#4f46e5" },
  alertType: { margin: 0, fontSize: "0.75rem", fontWeight: "800", letterSpacing: "0.05em" },
  message: { margin: "8px 0", color: "#1e293b", fontWeight: "600", fontSize: "1rem" },
  meta: { display: "flex", marginTop: 8 },
  badge: { fontSize: "0.8rem", color: "#64748b", background: "#f1f5f9", padding: "4px 10px", borderRadius: "6px" },
  time: { color: "#94a3b8", fontSize: "0.75rem", fontWeight: "500" },
  loadingText: { color: "#64748b", textAlign: "center", padding: "40px" },
  emptyState: { textAlign: "center", color: "#64748b", padding: "60px 40px", background: "#fff", borderRadius: "24px", border: "1px dashed #e2e8f0" },

  // --- NEW MODAL STYLES ---
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    backdropFilter: "blur(4px)"
  },
  modalContent: {
    background: "#fff",
    padding: "30px",
    borderRadius: "20px",
    width: "400px",
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
    textAlign: "left"
  },
  modalCancelBtn: {
    padding: "10px 18px",
    borderRadius: "10px",
    border: "1px solid #e2e8f0",
    background: "#fff",
    fontWeight: "600",
    cursor: "pointer",
    color: "#475569"
  },
  modalConfirmBtn: {
    padding: "10px 18px",
    borderRadius: "10px",
    border: "none",
    background: "#ef4444",
    color: "#fff",
    fontWeight: "700",
    cursor: "pointer"
  }
};