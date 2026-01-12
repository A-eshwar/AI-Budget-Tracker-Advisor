import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";

const CATEGORY_COLORS = {
  Food: "#22c55e",
  Rent: "#ef4444",
  Salary: "#2563eb",
  Transport: "#f97316",
  Shopping: "#a855f7",
  Entertainment: "#14b8a6",
  Others: "#64748b"
};

const normalizeCategory = (name = "") =>
  name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

export default function IncomeExpenseBar({ title, data }) {
  return (
    <div style={card}>
      <h3>{title}</h3>

      {data.length === 0 ? (
        <p style={{ color: "#64748b" }}>No data available</p>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {data.map((entry, index) => {
                const category = normalizeCategory(entry.name);
                return (
                  <Cell
                    key={index}
                    fill={CATEGORY_COLORS[category] || "#94a3b8"}
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

const card = {
  background: "#fff",
  padding: 20,
  borderRadius: 14,
  boxShadow: "0 6px 18px rgba(2,6,23,0.08)"
};
