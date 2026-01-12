import api from "./axiosClient";

export const setBudget = (budgetData) => {
  return api.post("/budgets", budgetData);
};
export const checkBudget = ({
  userId,
  category,
  budgetMonth,
  budgetYear
}) => {
  return api.get("/budgets/check", {
    params: {
      userId,
      category,
      budgetMonth,
      budgetYear
    }
  });
};
