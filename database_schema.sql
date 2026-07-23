CREATE DATABASE IF NOT EXISTS expense_tracker;
USE expense_tracker;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  currency VARCHAR(10) DEFAULT 'INR',
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL
);

CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  type ENUM('income', 'expense', 'both') NOT NULL DEFAULT 'expense',
  icon VARCHAR(50) DEFAULT 'Tag',
  color VARCHAR(20) DEFAULT '#6366f1',
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL
);

CREATE TABLE transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  category_id INT NOT NULL,
  title VARCHAR(150) NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  type ENUM('income', 'expense') NOT NULL,
  date DATE NOT NULL,
  notes TEXT,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id),
  INDEX idx_user (user_id),
  INDEX idx_date (date),
  INDEX idx_type (type)
);

CREATE TABLE budgets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  category_id INT NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  month INT NOT NULL,
  year INT NOT NULL,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id),
  UNIQUE KEY unique_budget (user_id, category_id, month, year)
);

INSERT INTO categories (name, type, icon, color, created_at, updated_at) VALUES
('Food', 'expense', 'Utensils', '#f97316', NOW(), NOW()),
('Travel', 'expense', 'Plane', '#0ea5e9', NOW(), NOW()),
('Shopping', 'expense', 'ShoppingBag', '#ec4899', NOW(), NOW()),
('Bills', 'expense', 'Receipt', '#ef4444', NOW(), NOW()),
('Entertainment', 'expense', 'Film', '#a855f7', NOW(), NOW()),
('Health', 'expense', 'HeartPulse', '#22c55e', NOW(), NOW()),
('Education', 'expense', 'GraduationCap', '#6366f1', NOW(), NOW()),
('Salary', 'income', 'Wallet', '#10b981', NOW(), NOW()),
('Freelance', 'income', 'Laptop', '#14b8a6', NOW(), NOW()),
('Others', 'both', 'Tag', '#64748b', NOW(), NOW());
