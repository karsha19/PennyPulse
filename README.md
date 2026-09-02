# PennyPulse— Full-Stack Expense Tracker

A production-style personal finance tracker built with **React (Vite) + Tailwind CSS** on the frontend and **Node.js + Express + MySQL (Sequelize)** on the backend.

## ✨ Features

- **Auth**: Register/Login with JWT + bcrypt password hashing, protected routes, logout.
- **Dashboard**: Total balance, income, expenses, savings, recent transactions, monthly bar chart (income vs expense) and category pie chart
- **Transactions**: Full CRUD, search, filter (type/category), sort (date/amount), pagination.
- **Budgets**: Per-category monthly budgets with progress bars and over-budget warnings.
- **Analytics**: Highest spending category, total transactions, average monthly spend, category breakdown.
- **Export**: Download transactions as CSV or PDF.
- **UI/UX**: Dark/light mode (auto-detect + manual toggle), fully responsive, loading skeletons, empty states, toast notifications, smooth animations.
-**Pulse Score (0–100)**
A financial wellness score based on:

Savings rate (up to 40 pts)

Budget adherence (up to 35 pts)
Spending consistency (up to 25 pts)
Shown on Dashboard and Analytics with a circular gauge and score breakdown.

-**Emotional Spending Tags**
Expenses can be tagged with a mood:

Necessity, Celebration, Stress, Boredom, Other

Mood picker in the Add/Edit Transaction form (expenses only)

Mood shown on transaction rows

Emotional Spending breakdown on the Analytics page

-**Spending Pace Forecast**
Budget cards now project month-end spending from your current pace:

Pace warning on individual budget cards when you're on track to overspend
Banner alert on the Budgets page when any category is at risk
Files changed

## 🗂️ Project Structure

```
expense-tracker/
├── backend/
│   ├── config/         # Sequelize/MySQL connection
│   ├── controllers/    # Business logic
│   ├── middleware/      # auth, validation, error handling
│   ├── models/          # Sequelize models + associations
│   ├── routes/          # Express routers
│   ├── utils/            # JWT helper, category seeder
│   ├── app.js
│   └── server.js
├── frontend/
│   └── src/
│       ├── api/          # axios instance + endpoint functions
│       ├── components/   # reusable UI components
│       ├── context/      # Auth + Theme context
│       ├── hooks/        # custom hooks (useDebounce)
│       ├── pages/        # route-level pages
│       ├── utils/        # formatting helpers
│       ├── App.jsx
│       └── main.jsx
└── database_schema.sql   # reference SQL (Sequelize auto-creates tables too)
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MySQL 8+ running locally (or a managed instance)

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MySQL credentials and a strong JWT_SECRET
```

Create the database (Sequelize will create the tables automatically on first run):

```sql
CREATE DATABASE expense_tracker;
```

Seed the default categories (Food, Travel, Salary, etc.):

```bash
npm run seed
```

Start the API server:

```bash
npm run dev      # nodemon, auto-restarts
# or
npm start
```

The API runs at `http://localhost:5000`. Health check: `GET /api/health`.

### 2. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
# VITE_API_URL=http://localhost:5000/api
npm run dev
```

Visit `http://localhost:5173`, register a new account, and start tracking.

## 🔑 Environment Variables

**backend/.env**
```
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=expense_tracker
DB_USER=root
DB_PASSWORD=your_mysql_password
JWT_SECRET=change_this_to_a_long_random_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

**frontend/.env**
```
VITE_API_URL=http://localhost:5000/api
```

## 📡 API Overview

| Method | Endpoint                  | Description                          |
|--------|----------------------------|---------------------------------------|
| POST   | /api/auth/register          | Create account                       |
| POST   | /api/auth/login              | Log in, returns JWT                  |
| GET    | /api/auth/me                  | Current user (protected)             |
| GET    | /api/categories               | List categories                      |
| GET    | /api/transactions              | List (search/filter/sort/paginate)   |
| POST   | /api/transactions               | Create transaction                   |
| PUT    | /api/transactions/:id            | Update transaction                   |
| DELETE | /api/transactions/:id              | Delete transaction                   |
| GET    | /api/budgets?month=&year=            | List budgets w/ progress             |
| POST   | /api/budgets                           | Set/update budget                    |
| DELETE | /api/budgets/:id                        | Remove budget                        |
| GET    | /api/dashboard/summary                    | Totals + recent transactions         |
| GET    | /api/dashboard/charts                       | Pie + bar chart data                 |
| GET    | /api/dashboard/analytics                      | Highest category, avg spend, etc.    |
| GET    | /api/export/csv                                | Download CSV                         |
| GET    | /api/export/pdf                                  | Download PDF                         |

All routes except `/auth/register` and `/auth/login` require `Authorization: Bearer <token>`.

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, React Router, Recharts, Axios, react-hot-toast, lucide-react
- **Backend**: Express.js, Sequelize ORM, MySQL2, JWT, bcryptjs, express-validator, json2csv, pdfkit
- **Auth**: JWT-based, bcrypt-hashed passwords, protected route middleware

## 📝 Notes

- `sequelize.sync()` is used for convenience in development. For production, replace with proper migrations (e.g. `sequelize-cli`).
- The category list is global (shared across users); transactions and budgets are scoped per-user via `user_id` foreign keys.
