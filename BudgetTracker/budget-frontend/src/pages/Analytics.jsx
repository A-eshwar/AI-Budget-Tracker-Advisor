import React, { useEffect, useState, useContext, useCallback } from "react";
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from "recharts";
import api from "../api/axiosClient";
import { AuthContext } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";

const COLORS = ["#6366f1", "#10b981", "#ef4444", "#f59e0b", "#14b8a6", "#8b5cf6"];
const CATEGORIES = ["All", "Food", "Rent", "Transport", "Shopping", "Entertainment", "Others"];

export default function Analytics() {
  const { user } = useContext(AuthContext);

  const [category, setCategory] = useState("All");
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  const [incomeExpense, setIncomeExpense] = useState({ income: 0, expense: 0 });
  const [categoryData, setCategoryData] = useState([]);
  const [budgetData, setBudgetData] = useState([]);
  const [overallBudget, setOverallBudget] = useState({ totalBudget: 0, totalSpent: 0 });
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);
    const params = {
      userId: user.id,
      month,
      year,
      category: category === "All" ? null : category
    };

    try {
      const [ieRes, catRes, budRes, overallRes] = await Promise.all([
        api.get("/analytics/income-expense", { params }),
        api.get("/analytics/category-expense", { params }),
        api.get("/analytics/budget-vs-spent", { params }),
        api.get("/analytics/overall-budget", { params })
      ]);

      setIncomeExpense(ieRes.data || { income: 0, expense: 0 });
      setCategoryData(Array.isArray(catRes.data) ? catRes.data : []);
      setBudgetData(Array.isArray(budRes.data) ? budRes.data : []);
      setOverallBudget(overallRes.data || { totalBudget: 0, totalSpent: 0 });

    } catch (err) {
      console.error("Analytics load error:", err);
    } finally {
      setLoading(false);
    }
  }, [user, month, year, category]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const incomeExpenseChart = [
    { name: "Income", value: incomeExpense.income },
    { name: "Expense", value: incomeExpense.expense }
  ];

  const remainingBudget = overallBudget.totalBudget - overallBudget.totalSpent;

  return (
    <div style={styles.layout}>
      <Sidebar />

      <main style={styles.page}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.pageTitle}>Financial Analytics</h1>
            <p style={styles.subText}>Filter and visualize your financial trends</p>
          </div>

          {/* FILTER BAR */}
          <div style={styles.filterBar}>
            <select value={category} onChange={(e) => setCategory(e.target.value)} style={styles.select}>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat} Category</option>
              ))}
            </select>

            <select value={month} onChange={(e) => setMonth(Number(e.target.value))} style={styles.select}>
              {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map((m, i) => (
                <option key={i} value={i + 1}>{m}</option>
              ))}
            </select>

            <select value={year} onChange={(e) => setYear(Number(e.target.value))} style={styles.select}>
              <option value="2024">2024</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
            </select>

            <button onClick={fetchAnalytics} style={styles.refreshBtn}>Apply Filters</button>
          </div>
        </div>

        {loading ? (
          <div style={styles.loadingContainer}>
            <p style={{ color: "#64748b", fontWeight: "600" }}>Fetching data...</p>
          </div>
        ) : (
          <div style={styles.mainLayout}>

            {/* CASH FLOW BAR CHART */}
            <div style={styles.glassCard}>
              <h3 style={styles.cardTitle}>Cash Flow</h3>
              <div style={{ height: 280, width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={incomeExpenseChart}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                    <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={styles.tooltip} />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={50}>
                      {incomeExpenseChart.map((_, i) => (
                        <Cell key={i} fill={i === 0 ? "#10b981" : "#ef4444"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* RATIO PIE CHART */}
            <div style={styles.glassCard}>
              <h3 style={styles.cardTitle}>Income vs Expense Ratio</h3>
              <div style={{ height: 280, width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={incomeExpenseChart} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90} paddingAngle={5}>
                      <Cell fill="#10b981" />
                      <Cell fill="#ef4444" />
                    </Pie>
                    <Tooltip contentStyle={styles.tooltip} />
                    <Legend verticalAlign="bottom" iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* CATEGORY BREAKDOWN */}
            <div style={styles.glassCard}>
              <h3 style={styles.cardTitle}>Category Breakdown</h3>
              <div style={{ height: 300, width: '100%' }}>
                {categoryData.length === 0 ? (
                  <div style={styles.noData}>No data for this period.</div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={categoryData} dataKey="amount" nameKey="category" outerRadius={100} stroke="none">
                        {categoryData.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={styles.tooltip} />
                      <Legend iconType="circle" />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* OVERALL BUDGET CARD */}
            <div style={styles.glassCard}>
              <h3 style={styles.cardTitle}>Overall Monthly Budget</h3>
              <div style={styles.summaryGrid}>
                <div style={styles.statBox}>
                  <p style={styles.statLabel}>Total Budget</p>
                  <p style={styles.statValue}>₹{overallBudget.totalBudget.toLocaleString()}</p>
                </div>
                <div style={styles.statBox}>
                  <p style={styles.statLabel}>Spent</p>
                  <p style={{ ...styles.statValue, color: "#ef4444" }}>₹{overallBudget.totalSpent.toLocaleString()}</p>
                </div>
                <div style={styles.statBox}>
                  <p style={styles.statLabel}>Remaining</p>
                  <p style={{ ...styles.statValue, color: remainingBudget < 0 ? "#ef4444" : "#10b981" }}>
                    ₹{remainingBudget.toLocaleString()}
                  </p>
                </div>
              </div>

              <div style={styles.progressContainer}>
                <div
                  style={{
                    ...styles.progressFill,
                    width: overallBudget.totalBudget === 0 ? "0%" : `${Math.min((overallBudget.totalSpent / overallBudget.totalBudget) * 100, 100)}%`,
                    background: remainingBudget < 0 ? "#ef4444" : "#4f46e5",
                  }}
                />
              </div>
              <p style={styles.usageText}>
                Usage: {overallBudget.totalBudget === 0 ? 0 : ((overallBudget.totalSpent / overallBudget.totalBudget) * 100).toFixed(1)}%
              </p>
            </div>

            {/* BUDGET VS ACTUAL */}
            <div style={{ ...styles.glassCard, gridColumn: "1 / -1" }}>
              <h3 style={styles.cardTitle}>Budget vs Actual Spending</h3>
              <div style={{ height: 300, width: '100%' }}>
                {budgetData.length === 0 ? (
                  <div style={styles.noData}>No budget data found.</div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={budgetData} margin={{ top: 10, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="category" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                      <Tooltip contentStyle={styles.tooltip} cursor={{fill: '#f8fafc'}} />
                      <Legend verticalAlign="top" align="right" iconType="circle" />
                      <Bar dataKey="limitAmount" name="Budget" fill="#6366f1" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="spentAmount" name="Spent" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

          </div>
        )}
      </main>
    </div>
  );
}

const styles = {
  layout: { display: "flex", minHeight: "100vh", background: "#f8fafc", fontFamily: "'Inter', sans-serif" },
  page: { flex: 1, padding: "40px 50px", overflowY: "auto" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 35 },
  pageTitle: { fontSize: "1.75rem", fontWeight: 800, color: "#1e293b", margin: 0 },
  subText: { color: "#64748b", marginTop: 4, fontSize: "0.9rem", fontWeight: "500" },

  filterBar: { display: "flex", gap: "10px", background: "rgba(255, 255, 255, 0.8)", padding: "12px", borderRadius: "18px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)", backdropFilter: "blur(10px)" },
  select: { padding: "10px 14px", borderRadius: "12px", border: "1px solid #e2e8f0", background: "#fff", color: "#1e293b", fontWeight: "600", outline: "none", cursor: "pointer" },
  refreshBtn: { padding: "10px 24px", borderRadius: "12px", border: "none", background: "#4f46e5", color: "#fff", fontWeight: "700", cursor: "pointer", transition: "all 0.2s" },

  mainLayout: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(480px, 1fr))", gap: "30px", maxWidth: "1400px" },
  glassCard: { background: "rgba(255, 255, 255, 0.9)", backdropFilter: "blur(10px)", padding: "30px", borderRadius: "24px", border: "1px solid rgba(255,255,255,0.4)", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.05)" },
  cardTitle: { fontSize: "1.1rem", fontWeight: "700", color: "#334155", marginBottom: "20px" },
  
  summaryGrid: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "15px", marginBottom: "20px" },
  statBox: { background: "#f8fafc", padding: "12px", borderRadius: "16px", border: "1px solid #f1f5f9" },
  statLabel: { fontSize: "0.75rem", color: "#64748b", fontWeight: "600", marginBottom: "4px" },
  statValue: { fontSize: "1.1rem", fontWeight: "800", color: "#1e293b", margin: 0 },

  progressContainer: { height: 10, background: "#e2e8f0", borderRadius: 20, overflow: "hidden" },
  progressFill: { height: "100%", transition: "width 0.8s ease", borderRadius: 20 },
  usageText: { textAlign: "right", fontSize: "0.8rem", fontWeight: "700", color: "#64748b", marginTop: "8px" },

  tooltip: { borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)", padding: "10px", fontWeight: "600" },
  noData: { height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", fontWeight: "500" },
  loadingContainer: { height: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }
};