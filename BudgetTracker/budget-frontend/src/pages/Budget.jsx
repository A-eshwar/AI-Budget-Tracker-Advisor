import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import api from "../api/axiosClient";
import Sidebar from "../components/Sidebar";
import { AuthContext } from "../context/AuthContext";

export default function Budget() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate(); // Initialize navigation

  const [activeTab, setActiveTab] = useState("SET"); 

  const [form, setForm] = useState({
    budgetId: null,
    category: "",
    limitAmount: "",
    budgetMonth: "",
    budgetYear: new Date().getFullYear().toString()
  });

  const [analysis, setAnalysis] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ---------------- ENABLE EDIT ---------------- */
  const enableEdit = () => {
    setIsEditing(true);
    setActiveTab("SET"); 
    setMessage(null);
    setError(null);
  };

  /* ---------------- SAVE / UPDATE ---------------- */
  const submitBudget = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    try {
      if (isEditing && form.budgetId) {
        await api.put(`/budget/${form.budgetId}`, null, {
          params: { limitAmount: Number(form.limitAmount) }
        });
        setMessage("✏️ Budget updated successfully");
        setIsEditing(false);
      } else {
        await api.post("/budget", {
          userId: user.id,
          category: form.category,
          limitAmount: Number(form.limitAmount),
          budgetMonth: Number(form.budgetMonth),
          budgetYear: Number(form.budgetYear)
        });
        setMessage("🎉 Budget saved successfully");
      }
    } catch (err) {
      setError(err.response?.data?.message || "⚠ Unable to save budget");
    }
  };

  /* ---------------- ANALYZE ---------------- */
  const analyzeBudget = async (e) => {
    e.preventDefault(); 
    setError(null);
    setMessage(null);

    if (!form.category || !form.budgetMonth || !form.budgetYear) {
      setError("Please select category, month and year");
      return;
    }

    try {
      const res = await api.get("/budget/analysis", {
        params: {
          userId: user.id,
          category: form.category,
          month: Number(form.budgetMonth),
          year: Number(form.budgetYear)
        }
      });

      setAnalysis(res.data);
      setForm(prev => ({
        ...prev,
        budgetId: res.data.budgetId,
        limitAmount: res.data.limitAmount
      }));
      setIsEditing(false);
    } catch (err) {
      setAnalysis(null);
      setError(err.response?.data?.message || "Budget not found");
    }
  };

  return (
    <div style={styles.layout}>
      <Sidebar />

      <main style={styles.page}>
        {/* UPDATED HEADER WITH TOP-RIGHT BUTTON */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.pageTitle}>Budget Planning</h1>
            <p style={styles.subText}>Track spending and stay disciplined</p>
          </div>
          <button 
            style={styles.navGoalBtn} 
            onClick={() => navigate("/savings")}
          >
            🎯 Savings Goals
          </button>
        </div>

        <div style={styles.centeredContainer}>
          <div style={styles.glassCard}>
            
            <div style={styles.toggleContainer}>
              <button
                onClick={() => { setActiveTab("SET"); setMessage(null); setError(null); }}
                style={{ ...styles.toggleBtn, ...(activeTab === "SET" ? styles.activeTab : {}) }}
              >Set Budget</button>
              <button
                onClick={() => { setActiveTab("ANALYZE"); setMessage(null); setError(null); }}
                style={{ ...styles.toggleBtn, ...(activeTab === "ANALYZE" ? styles.activeTab : {}) }}
              >Analyze Budget</button>
            </div>

            {activeTab === "SET" && (
              <>
                <h2 style={styles.cardTitle}>{isEditing ? "Edit Budget" : "Save Monthly Budget"}</h2>
                <form onSubmit={submitBudget} style={styles.formStack}>
                  <select name="category" value={form.category} onChange={handleChange} style={styles.input} disabled={isEditing} required>
                    <option value="">Select category</option>
                    <option>Food</option><option>Rent</option><option>Transport</option>
                    <option>Shopping</option><option>Entertainment</option><option>Others</option>
                  </select>
                  <input type="number" name="limitAmount" placeholder="Amount (₹)" value={form.limitAmount} onChange={handleChange} style={styles.input} required />
                  <div style={{ display: "flex", gap: 12 }}>
                    <input type="number" name="budgetMonth" placeholder="Month" value={form.budgetMonth} onChange={handleChange} style={styles.input} disabled={isEditing} required />
                    <input type="number" name="budgetYear" placeholder="Year" value={form.budgetYear} onChange={handleChange} style={styles.input} disabled={isEditing} required />
                  </div>
                  <button type="submit" style={styles.submitBtn}>{isEditing ? "Update Budget" : "Save Budget"}</button>
                  {isEditing && (
                    <button type="button" onClick={() => {setIsEditing(false); setForm({...form, budgetId: null, limitAmount: ""});}} style={styles.cancelBtn}>
                        Cancel
                    </button>
                  )}
                </form>
              </>
            )}

            {activeTab === "ANALYZE" && (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: "20px" }}>
                    <h2 style={styles.cardTitle}>Analyze Your Spending</h2>
                    {analysis && !isEditing && (
                        <button onClick={enableEdit} style={styles.editBtn}>
                            ✏️ Edit
                        </button>
                    )}
                </div>

                <form onSubmit={analyzeBudget} style={styles.formStack}>
                   <select name="category" value={form.category} onChange={handleChange} style={styles.input} required>
                    <option value="">Select category</option>
                    <option>Food</option><option>Rent</option><option>Transport</option>
                    <option>Shopping</option><option>Entertainment</option><option>Others</option>
                  </select>
                  <div style={{ display: "flex", gap: 12 }}>
                    <input type="number" name="budgetMonth" placeholder="Month" value={form.budgetMonth} onChange={handleChange} style={styles.input} required />
                    <input type="number" name="budgetYear" placeholder="Year" value={form.budgetYear} onChange={handleChange} style={styles.input} required />
                  </div>
                  <button type="submit" style={styles.submitBtn}>Analyze Now</button>
                </form>

                {analysis && (
                  <div style={{ marginTop: 30, borderTop: "1px solid #f1f5f9", paddingTop: 20 }}>
                    <div style={styles.statsRow}>
                      <div style={styles.statItem}>
                        <span style={styles.statLabel}>LIMIT</span>
                        <span style={styles.statValue}>₹{analysis.limitAmount.toLocaleString()}</span>
                      </div>
                      <div style={styles.statItem}>
                        <span style={styles.statLabel}>SPENT</span>
                        <span style={{...styles.statValue, color: "#ef4444"}}>₹{analysis.actualExpense.toLocaleString()}</span>
                      </div>
                    </div>
                    <div style={{ marginBottom: 20 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span style={styles.usageLabel}>{analysis.category} Progress</span>
                        <span style={styles.usagePercentage}>{analysis.usagePercentage.toFixed(1)}%</span>
                      </div>
                      <div style={styles.progressBar}>
                        <div style={{...styles.progressFill, width: `${Math.min(analysis.usagePercentage, 100)}%`, background: analysis.alertType === "EXCEEDED" ? "#dc2626" : analysis.alertType === "WARNING" ? "#f59e0b" : "#10b981"}} />
                      </div>
                    </div>
                    <div style={{...styles.alertBadge, background: analysis.alertType === "EXCEEDED" ? "#fee2e2" : analysis.alertType === "WARNING" ? "#fef3c7" : "#dcfce7", color: analysis.alertType === "EXCEEDED" ? "#dc2626" : analysis.alertType === "WARNING" ? "#b45309" : "#166534"}}>
                      {analysis.alertMessage}
                    </div>
                  </div>
                )}
              </>
            )}

            {message && <p style={styles.success}>{message}</p>}
            {error && <p style={styles.error}>{error}</p>}
          </div>
        </div>
      </main>
    </div>
  );
}

const styles = {
  layout: { display: "flex", minHeight: "100vh", background: "#f8fafc", fontFamily: "'Inter', sans-serif" },
  page: { flex: 1, padding: "40px 50px", overflowY: "auto" },
  // Flex header to push button to right
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 30 },
  pageTitle: { fontSize: "1.75rem", fontWeight: 800, color: "#1e293b", margin: 0 },
  subText: { color: "#64748b", marginTop: 4, fontSize: "0.875rem", fontWeight: "500" },
  
  // New navigation button style
  navGoalBtn: { 
    padding: "12px 20px", 
    borderRadius: 12, 
    background: "#4f46e5", 
    color: "#fff", 
    border: "none", 
    fontWeight: 700, 
    cursor: "pointer", 
    boxShadow: "0 4px 12px rgba(79,70,229,0.3)",
    fontSize: "0.9rem"
  },

  centeredContainer: { display: "flex", justifyContent: "center", marginTop: "20px" },
  glassCard: { background: "rgba(255, 255, 255, 0.9)", backdropFilter: "blur(10px)", padding: "40px", borderRadius: "24px", border: "1px solid rgba(255,255,255,0.4)", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.05)", width: "100%", maxWidth: "550px", height: 'fit-content' },
  toggleContainer: { display: "flex", background: "#f1f5f9", padding: "5px", borderRadius: "14px", marginBottom: "30px" },
  toggleBtn: { flex: 1, padding: "10px", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "600", background: "transparent", color: "#64748b", transition: "all 0.2s" },
  activeTab: { background: "#4f46e5", color: "#fff", boxShadow: "0 4px 12px rgba(79, 70, 229, 0.3)" },
  cardTitle: { fontSize: "1.25rem", fontWeight: "700", color: "#1e293b", margin: 0 },
  formStack: { display: "flex", flexDirection: "column", gap: "16px" },
  input: { padding: "14px", borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: "1rem", outline: "none", backgroundColor: "#fff", color: "#1e293b" },
  submitBtn: { padding: "14px", borderRadius: "12px", border: "none", background: "#4f46e5", color: "#fff", fontWeight: "700", cursor: "pointer", boxShadow: "0 4px 12px rgba(79, 70, 229, 0.3)" },
  cancelBtn: { padding: "14px", borderRadius: "12px", border: "1px solid #e2e8f0", background: "#f1f5f9", color: "#475569", fontWeight: "600", cursor: "pointer" },
  editBtn: { padding: "6px 12px", borderRadius: "8px", border: "none", background: "#f59e0b15", color: "#f59e0b", fontWeight: "700", cursor: "pointer", fontSize: "0.85rem" },
  statsRow: { display: 'flex', gap: '15px', marginBottom: '24px' },
  statItem: { flex: 1, background: '#f1f5f9', padding: '16px', borderRadius: '16px', display: 'flex', flexDirection: 'column' },
  statLabel: { fontSize: '0.7rem', color: '#64748b', fontWeight: '700', letterSpacing: '0.05em', marginBottom: '4px' },
  statValue: { fontSize: '1.25rem', fontWeight: '800', color: "#1e293b" },
  progressBar: { height: 12, background: "#e2e8f0", borderRadius: "10px", overflow: 'hidden' },
  progressFill: { height: "100%", borderRadius: "10px", transition: 'width 0.8s ease' },
  usageLabel: { fontWeight: "700", color: '#1e293b', fontSize: "0.9rem" },
  usagePercentage: { fontWeight: "800", color: '#4f46e5' },
  alertBadge: { padding: "14px", borderRadius: "14px", fontWeight: "700", textAlign: 'center', fontSize: '0.85rem' },
  success: { marginTop: 16, color: "#10b981", fontWeight: "700", textAlign: 'center' },
  error: { marginTop: 16, color: "#ef4444", fontWeight: "700", textAlign: 'center' }
};