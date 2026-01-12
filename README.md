# 💰 AI Budget Tracker Advisor

A full-stack web application that helps users track expenses, manage monthly budgets, analyze spending patterns, and set savings goals with smart insights.

Built using **Spring Boot (Microservices)** for backend and **React.js** for frontend.

---

## 🚀 Features

### ✅ User Management
- User Registration & Login (JWT Authentication)
- Secure APIs using Spring Security

### ✅ Expense Tracking
- Add, view, edit, delete transactions
- Categories like Food, Rent, Shopping, Transport, etc.
- Income & Expense separation

### ✅ Budget Planning
- Set monthly category-wise budgets
- Alerts when spending exceeds limits
- Soft limit & warning system

### ✅ Analytics Dashboard
- Income vs Expense Pie Chart
- Category-wise Expense Bar Chart
- Budget vs Actual Spending Comparison

### ✅ Savings Goals
- Create savings targets
- Track progress toward goals

---

## 🛠 Tech Stack

### 🔹 Frontend
- React.js
- Axios
- Recharts
- React Router

### 🔹 Backend
- Java
- Spring Boot
- Spring Security + JWT
- Spring Data JPA
- REST APIs

### 🔹 Database
- MySQL / H2 (Configurable)

---

## 📂 Project 
```
AI-Budget-Tracker-Advisor
│
├── BudgetTracker
│ ├── BudgetTrackerApplication.java
│ ├── config
│ │ ├── SecurityConfig.java
│ │ ├── JwtConfig.java
│ │ └── CorsConfig.java
│ │
│ ├── Budget
│ │ ├── controller
│ │ ├── service
│ │ ├── repository
│ │ └── entity
│ │
│ ├── Client
│ │ ├── controller
│ │ ├── service
│ │ ├── repository
│ │ └── entity
│ │
│ ├── Transaction
│ │ ├── controller
│ │ ├── service
│ │ ├── repository
│ │ └── entity
│ │
│ ├── Analytics
│ │ ├── controller
│ │ ├── service
│ │ └── dto
│ │
│ └── Savings
│ ├── controller
│ ├── service
│ ├── repository
│ └── entity
│
└── budget-frontend
├── public
└── src
├── api
├── components
├── context
├── pages
├── routes
└── App.js
```
### Start React app
- npm start

### Frontend will run at:
- http://localhost:3000
