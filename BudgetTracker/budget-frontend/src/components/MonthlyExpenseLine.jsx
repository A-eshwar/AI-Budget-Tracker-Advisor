import React from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";

export default function MonthlyExpenseLine({ monthlyData }) {
  return (
    <div style={card}>
      <h3 style={title}>Monthly Expense Trend</h3>

      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={monthlyData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="expense"
            stroke="#ef4444"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

const card = {
  background: "#fff",
  padding: 20,
  borderRadius: 14,
  boxShadow: "0 6px 18px rgba(2,6,23,0.08)"
};

const title = { marginBottom: 12 };
