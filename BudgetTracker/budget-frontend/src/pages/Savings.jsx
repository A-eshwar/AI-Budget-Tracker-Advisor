import React, { useEffect, useState, useContext, useCallback } from "react";
import api from "../api/axiosClient";
import { AuthContext } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";

// --- CUSTOM MODAL COMPONENT ---
const ConfirmationModal = ({ onConfirm, onCancel }) => (
  <div style={styles.modalOverlay}>
    <div style={styles.modalCard}>
      <h3 style={{ margin: "0 0 10px 0", color: "#1e293b" }}>Delete Goal?</h3>
      <p style={{ color: "#64748b", fontSize: "0.9rem", marginBottom: "24px" }}>
        Are you sure you want to remove this goal? This action cannot be undone.
      </p>
      <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
        <button style={styles.modalCancelBtn} onClick={onCancel}>Cancel</button>
        <button style={styles.modalDeleteBtn} onClick={onConfirm}>Delete</button>
      </div>
    </div>
  </div>
);

export default function Savings() {
  const { user } = useContext(AuthContext);

  const [goals, setGoals] = useState([]);
  const [filter, setFilter] = useState("IN_PROGRESS");
  const [form, setForm] = useState({ name: "", targetAmount: "" });
  const [editingGoal, setEditingGoal] = useState(null);
  const [amountToAdd, setAmountToAdd] = useState({});
  const [error, setError] = useState(null);

  // Modal and Delete States
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  /* ================= LOAD GOALS ================= */
  const loadGoals = useCallback(async () => {
    if (!user?.id) return;
    try {
      const res = await api.get("/savings", {
        params: { userId: user.id }
      });
      setGoals(res.data || []);
      setError(null);
    } catch {
      setError("Unable to load savings goals");
    }
  }, [user?.id]);

  useEffect(() => {
    loadGoals();
  }, [loadGoals]);

  /* ================= CREATE GOAL ================= */
  const createGoal = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await api.post("/savings", {
        userId: user.id,
        name: form.name,
        targetAmount: Number(form.targetAmount)
      });
      setForm({ name: "", targetAmount: "" });
      loadGoals();
    } catch {
      setError("Failed to create goal");
    }
  };

  /* ================= UPDATE GOAL ================= */
  const updateGoal = async (e) => {
    e.preventDefault();
    try {
      const newTarget = Number(editingGoal.targetAmount);
      await api.put(`/savings/${editingGoal.goalId}`, {
        name: editingGoal.name,
        targetAmount: newTarget
      });

      // Logic check to auto-switch tab if target is now met
      const isActuallyDone = editingGoal.savedAmount >= newTarget;
      setFilter(isActuallyDone ? "COMPLETED" : "IN_PROGRESS");

      setEditingGoal(null);
      loadGoals();
    } catch {
      setError("Failed to update goal");
    }
  };

  /* ================= DELETE LOGIC (UPDATED) ================= */
  const requestDelete = (goalId) => {
    setDeleteTargetId(goalId);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    if (!deleteTargetId) return;
    try {
      // Using the delete logic you provided
      await api.delete(`/savings/${deleteTargetId}`);
      loadGoals();
      setError(null);
    } catch (err) {
      setError("Unable to delete goal");
    } finally {
      setShowConfirm(false);
      setDeleteTargetId(null);
    }
  };

  /* ================= ADD SAVINGS ================= */
  const addSavings = async (goalId) => {
    const amount = Number(amountToAdd[goalId]);
    if (!amount || amount <= 0) return;
    try {
      await api.put(`/savings/${goalId}/add`, null, { params: { amount } });
      
      // If adding money finishes the goal, move to completed tab
      const targetGoal = goals.find(g => g.goalId === goalId);
      if (targetGoal && (targetGoal.savedAmount + amount) >= targetGoal.targetAmount) {
          setFilter("COMPLETED");
      }

      setAmountToAdd(prev => ({ ...prev, [goalId]: "" }));
      loadGoals();
    } catch {
      setError("Failed to add savings");
    }
  };

  // Re-evaluates status strictly by math to avoid UI getting stuck
  const filteredGoals = goals.filter(goal => {
    const isDone = goal.savedAmount >= goal.targetAmount;
    return filter === "COMPLETED" ? isDone : !isDone;
  });

  return (
    <div style={styles.layout}>
      <Sidebar />

      {showConfirm && (
        <ConfirmationModal 
          onConfirm={confirmDelete} 
          onCancel={() => { setShowConfirm(false); setDeleteTargetId(null); }} 
        />
      )}

      <main style={styles.page}>
        <div style={styles.header}>
          <h1 style={styles.pageTitle}>Savings Goals</h1>
          <p style={styles.subText}>Plan your future, one goal at a time</p>
        </div>

        {error && <div style={styles.errorText}>{error}</div>}

        <div style={styles.glassCardTop}>
          <h2 style={styles.cardTitle}>
            {editingGoal ? "✏️ Edit Goal" : "✨ Create New Goal"}
          </h2>
          <form onSubmit={editingGoal ? updateGoal : createGoal} style={styles.formRow}>
            <input
              required
              placeholder="Goal name"
              value={editingGoal ? editingGoal.name : form.name}
              onChange={(e) => editingGoal ? setEditingGoal({ ...editingGoal, name: e.target.value }) : setForm({ ...form, name: e.target.value })}
              style={{ ...styles.input, flex: 2 }}
            />
            <input
              required
              type="number"
              min="1"
              placeholder="Target (₹)"
              value={editingGoal ? editingGoal.targetAmount : form.targetAmount}
              onChange={(e) => editingGoal ? setEditingGoal({ ...editingGoal, targetAmount: e.target.value }) : setForm({ ...form, targetAmount: e.target.value })}
              style={{ ...styles.input, flex: 1 }}
            />
            <div style={{ display: "flex", gap: 10 }}>
              <button type="submit" style={styles.submitBtn}>{editingGoal ? "Update" : "Add Goal"}</button>
              {editingGoal && <button type="button" onClick={() => setEditingGoal(null)} style={styles.cancelBtn}>Cancel</button>}
            </div>
            {editingGoal && (
              <div style={styles.helperText}>
                Saved: ₹{editingGoal.savedAmount.toLocaleString()} — 
                {editingGoal.savedAmount >= Number(editingGoal.targetAmount) 
                  ? " 🎉 Target met! Goal will move to Completed." 
                  : ` 📈 ₹${(Number(editingGoal.targetAmount) - editingGoal.savedAmount).toLocaleString()} remaining.`}
              </div>
            )}
          </form>
        </div>

        <div style={styles.tabWrapper}>
          <div style={styles.tabContainer}>
            <button 
              onClick={() => setFilter("IN_PROGRESS")} 
              style={{ ...styles.tabBtn, ...(filter === "IN_PROGRESS" ? styles.activeTab : {}) }}
            >
              In Progress ({goals.filter(g => g.savedAmount < g.targetAmount).length})
            </button>
            <button 
              onClick={() => setFilter("COMPLETED")} 
              style={{ ...styles.tabBtn, ...(filter === "COMPLETED" ? styles.activeTab : {}) }}
            >
              Completed ({goals.filter(g => g.savedAmount >= g.targetAmount).length})
            </button>
          </div>
        </div>

        <div style={styles.grid}>
          {filteredGoals.map(goal => {
            const isActuallyDone = goal.savedAmount >= goal.targetAmount;
            const progress = Math.min((goal.savedAmount / goal.targetAmount) * 100, 100);

            return (
              <div key={goal.goalId} style={styles.goalItem}>
                <div style={styles.goalHeader}>
                  <h3 style={styles.goalName}>{goal.name}</h3>
                  <div style={styles.actionGroup}>
                    <button onClick={() => setEditingGoal(goal)} style={styles.iconBtn}>✏️</button>
                    <button onClick={() => requestDelete(goal.goalId)} style={styles.iconBtn}>🗑️</button>
                  </div>
                </div>
                
                <div style={styles.amountDisplay}>
                  <span style={styles.currentAmt}>₹{goal.savedAmount.toLocaleString()}</span>
                  <span style={styles.targetAmt}> / ₹{goal.targetAmount.toLocaleString()}</span>
                </div>

                <div style={styles.progressBar}>
                  <div style={{ ...styles.progressFill, width: `${progress}%`, background: isActuallyDone ? "#10b981" : "#4f46e5" }} />
                </div>

                <div style={styles.progressRow}>
                  <span style={styles.progressStat}>{Math.round(progress)}% Complete</span>
                  <span style={styles.remainingStat}>
                      {isActuallyDone ? "Goal Met! 🎉" : `₹${(goal.targetAmount - goal.savedAmount).toLocaleString()} left`}
                  </span>
                </div>

                {!isActuallyDone && (
                  <div style={styles.addRow}>
                    <input
                      type="number"
                      placeholder="Add amount"
                      value={amountToAdd[goal.goalId] || ""}
                      onChange={(e) => setAmountToAdd({ ...amountToAdd, [goal.goalId]: e.target.value })}
                      style={styles.smallInput}
                    />
                    <button onClick={() => addSavings(goal.goalId)} style={styles.addBtn}>Add</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}

const styles = {
  layout: { display: "flex", minHeight: "100vh", background: "#f8fafc", fontFamily: "'Inter', sans-serif" },
  page: { flex: 1, padding: "40px 50px", overflowY: "auto" },
  header: { marginBottom: 30 },
  pageTitle: { fontSize: "1.75rem", fontWeight: 800, color: "#1e293b", margin: 0 },
  subText: { color: "#64748b", marginTop: 4, fontSize: "0.9rem" },
  errorText: { color: "#ef4444", background: "#fee2e2", padding: "10px 20px", borderRadius: "10px", marginBottom: "20px", fontWeight: "600" },
  glassCardTop: { background: "rgba(255, 255, 255, 0.9)", backdropFilter: "blur(10px)", padding: "30px", borderRadius: "24px", border: "1px solid rgba(255,255,255,0.4)", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.05)", marginBottom: "35px" },
  cardTitle: { fontSize: "1.25rem", fontWeight: "700", color: "#1e293b", marginBottom: "20px" },
  formRow: { display: "flex", gap: 15, flexWrap: "wrap", alignItems: "center" },
  input: { padding: "14px 18px", borderRadius: "14px", border: "1px solid #e2e8f0", fontSize: "1rem", background: "#fff", outline: "none" },
  submitBtn: { padding: "14px 28px", borderRadius: "14px", border: "none", background: "#4f46e5", color: "#fff", fontWeight: "700", cursor: "pointer", boxShadow: "0 4px 12px rgba(79, 70, 229, 0.3)" },
  cancelBtn: { padding: "14px 20px", borderRadius: "14px", border: "1px solid #e2e8f0", background: "#fff", color: "#64748b", fontWeight: "600", cursor: "pointer" },
  helperText: { width: '100%', marginTop: '5px', fontSize: '0.85rem', color: '#4f46e5', fontWeight: '600' },
  tabWrapper: { display: "flex", marginBottom: "25px" },
  tabContainer: { display: "flex", background: "#f1f5f9", padding: "5px", borderRadius: "14px", gap: "5px" },
  tabBtn: { padding: "10px 24px", border: "none", borderRadius: "10px", background: "transparent", color: "#64748b", fontWeight: "600", cursor: "pointer", transition: "all 0.2s" },
  activeTab: { background: "#fff", color: "#1e293b", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "25px" },
  goalItem: { background: "rgba(255, 255, 255, 0.9)", backdropFilter: "blur(10px)", padding: "24px", borderRadius: "24px", border: "1px solid rgba(255,255,255,0.4)", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.05)" },
  goalHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" },
  goalName: { fontSize: "1.15rem", fontWeight: "700", color: "#1e293b", margin: 0 },
  actionGroup: { display: "flex", gap: "8px" },
  iconBtn: { background: "#f8fafc", border: "1px solid #f1f5f9", borderRadius: "8px", padding: "5px 8px", cursor: "pointer", fontSize: "0.9rem" },
  amountDisplay: { marginBottom: "12px" },
  currentAmt: { fontSize: "1.5rem", fontWeight: "800", color: "#1e293b" },
  targetAmt: { fontSize: "0.95rem", fontWeight: "500", color: "#94a3b8" },
  progressBar: { height: "10px", background: "#f1f5f9", borderRadius: "10px", overflow: "hidden", marginBottom: "10px" },
  progressFill: { height: "100%", transition: "width 0.8s ease" },
  progressRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", fontSize: "0.85rem", fontWeight: "600", color: "#64748b" },
  progressStat: { color: "#4f46e5" },
  addRow: { display: "flex", gap: "10px", marginTop: "15px", paddingTop: "15px", borderTop: "1px solid #f1f5f9" },
  smallInput: { flex: 1, padding: "10px 14px", borderRadius: "10px", border: "1px solid #e2e8f0", outline: "none", fontSize: "0.9rem" },
  addBtn: { padding: "10px 18px", borderRadius: "10px", background: "#10b981", color: "#fff", border: "none", fontWeight: "700", cursor: "pointer" },

  // Modal Styles
  modalOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, backdropFilter: "blur(4px)" },
  modalCard: { background: "#fff", padding: "30px", borderRadius: "24px", textAlign: "center", width: "350px", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)" },
  modalCancelBtn: { padding: "10px 20px", borderRadius: "10px", border: "1px solid #e2e8f0", background: "none", cursor: "pointer", fontWeight: "600", color: "#64748b" },
  modalDeleteBtn: { padding: "10px 20px", borderRadius: "10px", border: "none", background: "#ef4444", color: "#fff", cursor: "pointer", fontWeight: "600" }
};