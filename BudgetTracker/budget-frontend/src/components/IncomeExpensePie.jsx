import { PieChart, Pie, Tooltip, Legend, Cell } from "recharts";

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

export default function IncomeExpensePie({ title, data }) {
  return (
    <div style={card}>
      <h3 style={titleStyle}>{title}</h3>

      {data.length === 0 ? (
        <p style={{ color: "#64748b" }}>No data available</p>
      ) : (
        <div style={chartWrapper}>
          <PieChart width={300} height={260}>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"          // ✅ center horizontally
              cy="50%"          // ✅ center vertically
              outerRadius={90}
              label
            >
              {data.map((entry, index) => {
                const category = normalizeCategory(entry.name);
                return (
                  <Cell
                    key={index}
                    fill={CATEGORY_COLORS[category] || "#94a3b8"}
                  />
                );
              })}
            </Pie>
            <Tooltip />
            <Legend
              verticalAlign="bottom"
              align="center" 
            />
          </PieChart>
        </div>
      )}
    </div>
  );
}

const card = {
  background: "#fff",
  padding: 20,
  borderRadius: 16,
  boxShadow: "0 16px 32px rgba(2,6,23,0.08)"
};

const titleStyle = {
  marginBottom: 12
};

const chartWrapper = {
  display: "flex",
  justifyContent: "center",   // ✅ centers chart
  alignItems: "center"
};
