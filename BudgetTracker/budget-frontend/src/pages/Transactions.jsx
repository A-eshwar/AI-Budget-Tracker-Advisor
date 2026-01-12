import React, { useEffect, useState, useContext } from "react";
import api from "../api/axiosClient";
import { AuthContext, useAuth } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";

const CATEGORIES = ["Food", "Rent", "Salary", "Transport", "Shopping", "Entertainment", "Others"];

const ConfirmModal = ({ onConfirm, onCancel }) => (
  <div style={styles.modalOverlay}>
    <div style={styles.modalCard}>
      <h3 style={{ margin: "0 0 10px 0", color: "#1e293b" }}>Are you sure?</h3>
      <p style={{ color: "#64748b", marginBottom: "20px", fontSize: "0.9rem" }}>This action cannot be undone.</p>
      <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
        <button onClick={onCancel} style={styles.modalCancelBtn}>Cancel</button>
        <button onClick={onConfirm} style={styles.modalDeleteBtn}>Delete</button>
      </div>
    </div>
  </div>
);

export default function Transactions() {
  const { user } = useContext(AuthContext);
  const { refreshAlertCount } = useAuth();

  const [transactions, setTransactions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const today = new Date().toISOString().split("T")[0];
  const [filters, setFilters] = useState({ category: "", fromDate: "", toDate: "" });

  const [form, setForm] = useState({
    type: "EXPENSE",
    category: "",
    amount: "",
    transactionDate: "",
    description: ""
  });

  const load = async () => {
    try {
      const res = await api.get("/transactions");
      setTransactions(res.data || []);
      setFiltered(res.data || []);
    } catch (err) {
      console.error("Failed to fetch transactions");
    }
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    let data = [...transactions];
    if (filters.category) data = data.filter(t => t.category === filters.category);
    if (filters.fromDate) data = data.filter(t => new Date(t.transactionDate) >= new Date(filters.fromDate));
    if (filters.toDate) data = data.filter(t => new Date(t.transactionDate) <= new Date(filters.toDate));
    setFiltered(data);
  }, [filters, transactions]);

  const income = transactions.filter(t => t.type === "INCOME").reduce((s, t) => s + Number(t.amount), 0);
  const expense = transactions.filter(t => t.type === "EXPENSE").reduce((s, t) => s + Number(t.amount), 0);
  const savings = transactions
    .filter(t => t.category === "Savings")
    .reduce((s, t) => s + Math.abs(Number(t.amount)), 0);

  const submit = async (e) => {
    e.preventDefault();
    const payload = { ...form, amount: Number(form.amount) };
    try {
      if (editingId) {
        await api.put(`/transactions/${editingId}`, payload);
      } else {
        await api.post("/transactions", payload);
        refreshAlertCount();
      }
      resetForm();
      load();
    } catch (err) {
      alert("Failed to save transaction");
    }
  };

  const resetForm = () => {
    setForm({ type: "EXPENSE", category: "", amount: "", transactionDate: "", description: "" });
    setEditingId(null);
  };

  const edit = (t) => {
    setEditingId(t.id);
    setForm({ ...t, description: t.description || "" });
  };

  const requestDelete = (id) => {
    setDeleteTargetId(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    if (deleteTargetId) {
      await api.delete(`/transactions/${deleteTargetId}`);
      load();
    }
    setShowConfirm(false);
    setDeleteTargetId(null);
  };

  const downloadExcel = async () => {
    try {
      const res = await api.get("/dashboard/export/excel", { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "transactions.xlsx");
      document.body.appendChild(link);
      link.click();
    } catch (err) { alert("Failed to download Excel"); }
  };

  const downloadCSV = async () => {
    try {
      const res = await api.get("/dashboard/export/csv", { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "transactions.csv");
      document.body.appendChild(link);
      link.click();
    } catch (err) { alert("Failed to download CSV"); }
  };

  return (
    <div style={styles.layout}>
      <Sidebar />
      {showConfirm && <ConfirmModal onConfirm={confirmDelete} onCancel={() => setShowConfirm(false)} />}

      <main style={styles.page}>
        <div style={styles.header}>
          <h1 style={styles.pageTitle}>Transactions</h1>
          <div style={styles.headerActions}>
            <button onClick={downloadExcel} style={styles.exportBtnTop}>Export Excel</button>
            <button onClick={downloadCSV} style={styles.exportBtnTop}>Export CSV</button>
          </div>
        </div>

        <div style={styles.summaryGrid}>
          <SummaryCard title="Total Income" value={income - savings} color="#10b981" icon="💰" />
          <SummaryCard title="Total Expense" value={expense} color="#ef4444" icon="💸" />
          <SummaryCard title="Savings" value={savings} color="#6366f1" icon="💾" />
        </div>

        <div style={styles.mainLayout}>
          <div style={styles.glassCard}>
            <h2 style={styles.cardTitle}>{editingId ? "Edit Transaction" : "New Transaction"}</h2>
            <div style={styles.toggleContainer}>
              <button onClick={() => setForm({ ...form, type: "INCOME" })}
                style={{ ...styles.toggleBtn, ...(form.type === "INCOME" ? styles.incomeActive : {}) }}>Income</button>
              <button onClick={() => setForm({ ...form, type: "EXPENSE" })}
                style={{ ...styles.toggleBtn, ...(form.type === "EXPENSE" ? styles.expenseActive : {}) }}>Expense</button>
            </div>

            <form onSubmit={submit} style={styles.formStack}>
              <select required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} style={styles.input}>
                <option value="">Select category</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <input type="number" required placeholder="Amount (₹)" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} style={styles.input} />
              <input type="date" required max={today} value={form.transactionDate} onChange={(e) => setForm({ ...form, transactionDate: e.target.value })} style={styles.input} />
              <textarea placeholder="Notes (optional)" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} style={{ ...styles.input, minHeight: 80, resize: 'none' }} />
              <div style={{ display: 'flex', gap: 10 }}>
                <button type="submit" style={styles.submitBtn}>{editingId ? "Save Changes" : "Add Transaction"}</button>
                {editingId && <button type="button" onClick={resetForm} style={styles.cancelBtn}>Cancel</button>}
              </div>
            </form>
          </div>

          <div style={styles.glassCard}>
            <div style={styles.listHeader}>
              <h2 style={styles.cardTitle}>History</h2>
              <div style={styles.filterRow}>
                <select value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })} style={styles.smallInput}>
                  <option value="">All Categories</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={styles.filterLabel}>From:</span>
                  <input type="date" max={today} style={styles.smallInput} value={filters.fromDate} onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={styles.filterLabel}>To:</span>
                  <input type="date" max={today} style={styles.smallInput} value={filters.toDate} onChange={(e) => setFilters({ ...filters, toDate: e.target.value })} />
                </div>
              </div>
            </div>

            <div style={styles.scrollArea}>
              {filtered.length === 0 ? <p style={styles.emptyText}>No transactions found.</p> :
                filtered.map(t => (
                  <div key={t.id} style={styles.transactionItem}>
                    <div style={styles.txInfo}>
                      <span style={styles.txCategory}>{t.category}</span>
                      <span style={styles.txDate}>{t.transactionDate}</span>
                    </div>
                    <div style={styles.txActions}>
                      <div style={{ fontSize: '1.1rem', fontWeight: '800', color: t.type === "INCOME" ? "#059669" : "#dc2626", marginBottom: 8, textAlign: 'right' }}>
                        {t.type === "INCOME" ? "+" : "-"} ₹{t.amount.toLocaleString()}
                      </div>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={() => edit(t)} style={styles.iconBtnEdit}>Edit</button>
                        <button onClick={() => requestDelete(t.id)} style={styles.iconBtnDelete}>Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

const SummaryCard = ({ title, value, color, icon }) => (
  <div style={styles.summaryCard}>
    <div style={{ ...styles.iconCircle, backgroundColor: `${color}15`, color: color }}>{icon}</div>
    <div>
      <div style={styles.summaryLabel}>{title}</div>
      <div style={styles.summaryValue}>₹{value.toLocaleString()}</div>
    </div>
  </div>
);

const styles = {
  layout: { display: "flex", minHeight: "100vh", background: "#f8fafc", fontFamily: "'Inter', sans-serif" },
  page: { flex: 1, padding: "40px 50px", overflowY: "auto" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 30 },
  headerActions: { display: "flex", gap: "10px" },
  pageTitle: { fontSize: "1.75rem", fontWeight: 800, color: "#1e293b", margin: 0 },
  exportBtnTop: { padding: "10px 18px", borderRadius: "12px", border: "none", background: "#4f46e5", color: "#fff", fontWeight: "700", cursor: "pointer", boxShadow: "0 4px 12px rgba(79, 70, 229, 0.2)", fontSize: "0.85rem" },
  
  summaryGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px", marginBottom: 35 },
  summaryCard: { background: "#fff", padding: "16px 20px", borderRadius: "16px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)", display: "flex", alignItems: "center", gap: "12px" },
  iconCircle: { width: "36px", height: "36px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem" },
  summaryLabel: { color: "#64748b", fontSize: "0.75rem", fontWeight: "600", marginBottom: "2px" },
  summaryValue: { fontSize: "1.15rem", fontWeight: "800", color: "#1e293b" },

  modalOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, backdropFilter: "blur(4px)" },
  modalCard: { background: "#fff", padding: "30px", borderRadius: "24px", textAlign: "center", width: "350px", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)" },
  modalCancelBtn: { padding: "10px 20px", borderRadius: "10px", border: "1px solid #e2e8f0", background: "none", cursor: "pointer", fontWeight: "600", color: "#64748b" },
  modalDeleteBtn: { padding: "10px 20px", borderRadius: "10px", border: "none", background: "#ef4444", color: "#fff", cursor: "pointer", fontWeight: "600" },

  mainLayout: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "30px", maxWidth: 1200 },
  glassCard: { background: "rgba(255, 255, 255, 0.9)", backdropFilter: "blur(10px)", padding: "30px", borderRadius: "24px", border: "1px solid rgba(255,255,255,0.4)", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.05)" },
  cardTitle: { fontSize: "1.25rem", fontWeight: "700", color: "#1e293b", marginBottom: "20px" },
  toggleContainer: { display: "flex", background: "#f1f5f9", padding: "5px", borderRadius: "14px", marginBottom: "24px" },
  toggleBtn: { flex: 1, padding: "10px", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "600", background: "transparent", color: "#64748b", transition: "all 0.2s" },
  incomeActive: { background: "#10b981", color: "#fff", boxShadow: "0 4px 12px rgba(16,185,129,0.3)" },
  expenseActive: { background: "#ef4444", color: "#fff", boxShadow: "0 4px 12px rgba(239,68,68,0.3)" },
  formStack: { display: "flex", flexDirection: "column", gap: "16px" },
  input: { padding: "14px", borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: "1rem", outline: "none", backgroundColor: "#fff", color: "#1e293b" },
  smallInput: { padding: "8px 12px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "0.85rem", color: "#475569", outline: 'none' },
  filterLabel: { fontSize: '0.75rem', fontWeight: '600', color: '#64748b' },
  submitBtn: { padding: "14px", borderRadius: "12px", border: "none", background: "#4f46e5", color: "#fff", fontWeight: "700", cursor: "pointer", boxShadow: "0 4px 12px rgba(79, 70, 229, 0.3)" },
  cancelBtn: { padding: "14px", borderRadius: "12px", border: "1px solid #e2e8f0", background: "#fff", fontWeight: "600", cursor: "pointer" },
  listHeader: { display: "flex", flexDirection: "column", gap: "5px", marginBottom: "20px", paddingBottom: "15px", borderBottom: "1px solid #f1f5f9" },
  filterRow: { display: "flex", gap: "10px", flexWrap: 'wrap', alignItems: 'center' },
  scrollArea: { maxHeight: "480px", overflowY: "auto", paddingRight: "10px" },
  transactionItem: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px", borderRadius: "16px", background: "#fff", marginBottom: "12px", border: "1px solid #f1f5f9" },
  txCategory: { display: "block", fontWeight: "700", color: "#1e293b", fontSize: "1rem" },
  txDate: { fontSize: "0.8rem", color: "#94a3b8" },
  iconBtnEdit: { color: "#4f46e5", background: "none", border: "none", fontWeight: "700", cursor: "pointer", fontSize: "0.85rem" },
  iconBtnDelete: { color: "#ef4444", background: "none", border: "none", fontWeight: "700", cursor: "pointer", fontSize: "0.85rem" },
  emptyText: { textAlign: "center", color: "#94a3b8", padding: "40px 0" }
};