import React, { useState } from "react";
import Button from "./Button";

export default function BudgetForm({ onSubmit }) {
  const [form, setForm] = useState({
    category: "",
    limitAmount: "",
    budgetMonth: "",
    budgetYear: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form);
      }}
      className="card"
    >
      <h3>Set Monthly Budget</h3>

      <input
        name="category"
        placeholder="Category (Food, Rent, Travel)"
        onChange={handleChange}
        required
      />

      <input
        type="number"
        name="limitAmount"
        placeholder="Budget Amount"
        onChange={handleChange}
        required
      />

      <input
        type="number"
        name="budgetMonth"
        placeholder="Month (1-12)"
        onChange={handleChange}
        required
      />

      <input
        type="number"
        name="budgetYear"
        placeholder="Year (2025)"
        onChange={handleChange}
        required
      />

      <Button type="submit">Save Budget</Button>
    </form>
  );
}
