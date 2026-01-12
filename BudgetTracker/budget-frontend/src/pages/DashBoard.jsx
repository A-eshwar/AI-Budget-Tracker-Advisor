import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosClient";
import { AuthContext } from "../context/AuthContext";
import TransactionCard from "../components/TransactionCard";
import Sidebar from "../components/Sidebar";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [transactions, setTransactions] = useState([]);

  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    Promise.all([
      api.get("/dashboard/summary"),
      api.get("/transactions")
    ])
      .then(([summaryRes, txRes]) => {
        setData(summaryRes.data);
        setTransactions(txRes.data || []);
      })
      .catch(() => {
        setData({ totalIncome: 0, totalExpense: 0, balance: 0 });
        setTransactions([]);
      });
  }, []);

  if (!data) return <div style={styles.loading}>Loading Dashboard...</div>;
  const savings = transactions
  .filter(t => t.category === "Savings")
  .reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0);
  const budgetUtilization = data.totalIncome > 0 
    ? Math.round((data.totalExpense / data.totalIncome) * 100) 
    : 0;

  return (
    <div style={styles.layout}>
      <Sidebar />

      <main style={styles.page}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.pageTitle}>Financial Dashboard</h1>
            <p style={{ color: "#64748b", marginTop: 4 }}>Welcome back, <strong>{user?.name}</strong> 👋</p>
          </div>
          <button style={styles.addBtn} onClick={() => navigate("/transactions")}>
            + Add Transaction
          </button>
        </div>

        {/* SUMMARY GRID - MATCHES TRANSACTIONS.JSX */}
        <div style={styles.summaryGrid}>
          <SummaryCard title="Total Income" value={data.totalIncome-savings} color="#10b981" icon="💰" />
          <SummaryCard title="Total Expense" value={data.totalExpense} color="#ef4444" icon="💸" />
          <SummaryCard title="Savings" value={savings} color="#6366f1" icon="💾" />
          <SummaryCard title="Utilization" value={`${budgetUtilization}%`} color="#f59e0b" icon="📊" isPercent />
        </div>

        <div style={styles.glassCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={styles.cardTitle}>Recent Activity</h2>
            <span style={{ color: '#4f46e5', cursor: 'pointer', fontWeight: 600 }} onClick={() => navigate("/transactions")}>View All</span>
          </div>

          {transactions.length === 0 ? (
            <div style={styles.emptyState}>No transactions recorded yet 🚀</div>
          ) : (
            <div style={styles.txList}>
              {transactions.slice(0, 5).map((t) => (
                <TransactionCard
                  key={t.id}
                  t={t}
                  onEdit={() => navigate(`/transactions?edit=${t.id}`)}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

const SummaryCard = ({ title, value, color, icon, isPercent }) => (
  <div style={styles.summaryCard}>
    {/* Matches iconCircle size from Transactions.jsx */}
    <div style={{...styles.iconCircle, backgroundColor: `${color}15`, color: color}}>{icon}</div>
    <div>
      <div style={styles.summaryLabel}>{title}</div>
      <div style={styles.summaryValue}>
        {isPercent ? value : `₹${value.toLocaleString()}`}
      </div>
    </div>
  </div>
);

const styles = {
  layout: { display: "flex", minHeight: "100vh", background: "#f8fafc", fontFamily: "'Inter', sans-serif" },
  page: {
    flex: 1,
    padding: "40px 50px",
    height: "100vh",
    overflow: "hidden"
  },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 30 },
  pageTitle: { fontSize: "1.75rem", fontWeight: 800, color: "#1e293b" },
  addBtn: { padding: "12px 20px", borderRadius: 12, background: "#4f46e5", color: "#fff", border: "none", fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 12px rgba(79,70,229,0.3)" },
  
  /* --- EXACT SIZES FROM YOUR UPDATED TRANSACTIONS.JSX --- */
  summaryGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px", marginBottom: 35 },
  summaryCard: { 
    background: "#fff", 
    padding: "16px 20px", 
    borderRadius: "16px", 
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)", 
    display: "flex", 
    alignItems: "center", 
    gap: "12px" 
  },
  iconCircle: { 
    width: "36px", 
    height: "36px", 
    borderRadius: "10px", 
    display: "flex", 
    alignItems: "center", 
    justifyContent: "center", 
    fontSize: "1.1rem" 
  },
  summaryLabel: { color: "#64748b", fontSize: "0.75rem", fontWeight: "600", marginBottom: "2px" },
  summaryValue: { fontSize: "1.15rem", fontWeight: "800", color: "#1e293b" },
  /* ------------------------------------------------------ */
  
  glassCard: { background: "#fff", padding: "30px", borderRadius: "24px", border: "1px solid #e2e8f0", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.05)" },
  cardTitle: { fontSize: "1.25rem", fontWeight: "700", color: "#1e293b" },
  txList: { display: "flex", flexDirection: "column", gap: 12 },
  emptyState: { padding: "40px", textAlign: "center", color: "#94a3b8", background: "#f8fafc", borderRadius: 16 },
  loading: { padding: 50, textAlign: 'center', fontSize: 18, color: '#64748b' }
};  