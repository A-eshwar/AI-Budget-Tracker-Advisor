import React from "react";

export default function TransactionCard({ t, onEdit, onDelete }) {
  const isIncome = t.type === "INCOME";

  return (
    <div style={styles.card}>
      {/* LEFT */}
      <div>
        <div style={styles.category}>{t.category}</div>
        <div style={styles.date}>{t.transactionDate}</div>
      </div>

      {/* RIGHT */}
      <div style={styles.right}>
        <div
          style={{
            ...styles.amount,
            color: isIncome ? "#16a34a" : "#dc2626"
          }}
        >
          {isIncome ? "+" : "-"} ₹{t.amount}
        </div>

        {/* ACTIONS — rendered ONLY if buttons exist */}
        {(onEdit || onDelete) && (
          <div style={styles.actions}>
            {onEdit && (
              <button style={styles.editBtn} onClick={onEdit}>
                Edit
              </button>
            )}

            {onDelete && (
              <button style={styles.deleteBtn} onClick={onDelete}>
                Delete
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  card: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px",
    background: "#fff",
    borderRadius: "14px",
    border: "1px solid #e2e8f0"
  },
  category: {
    fontWeight: 700,
    fontSize: "1rem",
    color: "#1e293b"
  },
  date: {
    fontSize: "0.8rem",
    color: "#94a3b8"
  },
  right: {
    textAlign: "right"
  },
  amount: {
    fontWeight: 800,
    fontSize: "1.1rem"
  },
  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    marginTop: "6px"
  },
  editBtn: {
    background: "none",
    border: "none",
    color: "#4f46e5",
    fontWeight: 600,
    cursor: "pointer"
  },
  deleteBtn: {
    background: "none",
    border: "none",
    color: "#ef4444",
    fontWeight: 600,
    cursor: "pointer"
  }
};
