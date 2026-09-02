PennyPulse— Full-Stack Expense Tracker

A production-style personal finance tracker built with React (Vite) + Tailwind CSS on the frontend and Node.js + Express + MySQL (Sequelize) on the backend.

✨ Features

### Core
- **Auth**: Register/Login with JWT + bcrypt password hashing, protected routes, logout.
- **Dashboard**: Total balance, income, expenses, savings, recent transactions, monthly bar chart (income vs expense) and category pie chart.
- **Transactions**: Full CRUD, search, filter (type/category), sort (date/amount), pagination.
- **Budgets**: Per-category monthly budgets with progress bars and over-budget warnings.
- **Analytics**: Highest spending category, total transactions, average monthly spend, category breakdown.
- **Export**: Download transactions as CSV or PDF.
- **UI/UX**: Dark/light mode (auto-detect + manual toggle), fully responsive, loading skeletons, empty states, toast notifications, smooth animations.

### Signature Features (PennyPulse)
- **Pulse Score (0–100)**: A financial wellness score based on savings rate, budget adherence, and spending consistency. Shown on Dashboard and Analytics with a breakdown of each factor.
- **Emotional Spending Tags**: Tag expenses with a mood — *Necessity*, *Celebration*, *Stress*, *Boredom*, or *Other*. View mood-based spending patterns on the Analytics page.
- **Spending Pace Forecast**: Budget cards project month-end spending from your current daily pace and show early warnings before you overspend.

## 🗂️ Project Structure

expense-tracker/
├── backend/
│   ├── config/         # Sequelize/MySQL connection
│   ├── controllers/    # Business logic
│   ├── middleware/      # auth, validation, error handling
│   ├── models/          # Sequelize models + associations
│   ├── routes/          # Express routers
│   ├── utils/            # JWT helper, category seeder, pulse score calculator
│   ├── utils/            # JWT helper, category seeder, pulse score calculator
│   ├── app.js
│   └── server.js
├── frontend/
│   └── src/
│       ├── api/          # axios instance + endpoint functions
│       ├── components/   # reusable UI components
│       ├── context/      # Auth + Theme context
│       ├── hooks/        # custom hooks (useDebounce)
│       ├── pages/        # route-level pages
│       ├── utils/        # formatting helpers, mood options
│       ├── utils/        # formatting helpers, mood options
│       ├── App.jsx
│       └── main.jsx
└── database_schema.sql   # reference SQL (Sequelize auto-creates tables too)

🚀 Getting Started
Prerequisites
Node.js 18+
MySQL 8+ running locally (or a managed instance)

1. Backend Setup

cd backend
npm install
cp .env.example .env
# Edit .env with your MySQL credentials and a strong JWT_SECRET

Create the database (Sequelize will create the tables automatically on first run):

CREATE DATABASE expense_tracker;

Seed the default categories (Food, Travel, Salary, etc.):

npm run seed

Start the API server:

npm run dev      # nodemon, auto-restarts
# or
npm start

The API runs at http://localhost:5000. Health check: GET /api/health.

2. Frontend Setup

cd frontend
npm install
cp .env.example .env
# VITE_API_URL=http://localhost:5000/api
npm run dev

Visit http://localhost:5173, register a new account, and start tracking.

🔑 Environment Variables

backend/.env

PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=expense_tracker
DB_USER=root
DB_PASSWORD=your_mysql_password
JWT_SECRET=change_this_to_a_long_random_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173

frontend/.env

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
| POST   | /api/transactions               | Create transaction (optional `mood`) |
| PUT    | /api/transactions/:id            | Update transaction (optional `mood`) |
| DELETE | /api/transactions/:id              | Delete transaction                   |
| GET    | /api/budgets?month=&year=            | List budgets w/ progress + pace forecast |
| POST   | /api/budgets                           | Set/update budget                    |
| DELETE | /api/budgets/:id                        | Remove budget                        |
| GET    | /api/dashboard/summary                    | Totals, Pulse Score, recent transactions |
| GET    | /api/dashboard/charts                       | Pie + bar chart data                 |
| GET    | /api/dashboard/analytics                      | Pulse Score, mood breakdown, category stats |
| GET    | /api/export/csv                                | Download CSV                         |
| GET    | /api/export/pdf                                  | Download PDF                         |

All routes except /auth/register and /auth/login require Authorization: Bearer <token>.

🛠️ Tech Stack

Frontend: React 18, Vite, Tailwind CSS, React Router, Recharts, Axios, react-hot-toast, lucide-react

Backend: Express.js, Sequelize ORM, MySQL2, JWT, bcryptjs, express-validator, json2csv, pdfkit

Auth: JWT-based, bcrypt-hashed passwords, protected route middleware

📝 Notes

- `sequelize.sync({ alter: true })` is used in development to auto-add schema changes (e.g. the `mood` column on transactions). For production, replace with proper migrations (e.g. `sequelize-cli`).
- The category list is global (shared across users); transactions and budgets are scoped per-user via `user_id` foreign keys.
- **Transaction mood** (optional): `necessity`, `celebration`, `stress`, `boredom`, `other` — only applies to expense transactions.
- **Pulse Score** weights: savings rate (40 pts), budget adherence (35 pts), spending consistency (25 pts).

### Manual migration (if `mood` column is missing)

```sql
ALTER TABLE transactions
ADD COLUMN mood ENUM('necessity', 'celebration', 'stress', 'boredom', 'other') NULL;
```
