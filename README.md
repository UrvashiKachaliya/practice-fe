# 🌾 Khakhra Co. — Multi-Vendor Snack Store

A full-stack multi-vendor e-commerce platform for khakhras (Indian crispy snacks) built with React + Node.js + MySQL.

---

## Project Structure

```
practice-fe/
├── frontend/    # React 19 + Vite + TailwindCSS
└── backend/     # Node.js + Express + MySQL
```

---

## Quick Start

### 1. Clone & Install

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure Environment

**backend/.env**
```env
PORT=8000
DB_HOST=localhost
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=multi_vendor_store

JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret

EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password

FRONTEND_URL=http://localhost:5173
```

**frontend/.env**
```env
VITE_BACKEND_URL=http://localhost:8000
```

### 3. Setup Database

```sql
CREATE DATABASE multi_vendor_store;
USE multi_vendor_store;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  contact VARCHAR(15),
  address VARCHAR(255),
  role ENUM('user', 'seller', 'admin') DEFAULT 'user',
  is_verified BOOLEAN DEFAULT FALSE,
  otp VARCHAR(6),
  otp_expires_at DATETIME,
  reset_token VARCHAR(64),
  reset_token_expires_at DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category VARCHAR(100) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  image VARCHAR(500),
  seller_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### 4. Run

```bash
# Terminal 1 — Backend
cd backend && npm start       # http://localhost:8000

# Terminal 2 — Frontend
cd frontend && npm run dev    # http://localhost:5173
```

---

## Features

### 👤 Authentication
- Sign up with email OTP verification (6-digit code, 10 min expiry)
- Sign in with JWT (access token 15m + refresh token 7d)
- Proactive token refresh via axios interceptors
- Forgot password → reset link via email (1hr expiry)
- Blocked login for unverified accounts

### 🛍️ Shopping
- Browse & search products
- Product detail page
- Add to cart / wishlist (auth-gated with modal prompt)
- Place orders
- View order history
- Save delivery address

### 🔐 Role-Based Access
| Role | Can Do |
|---|---|
| `user` | Browse, cart, wishlist, orders, profile |
| `seller` | All above + add products |
| `admin` | All above + admin dashboard |

### 🛠️ Admin Dashboard (`/admin`)
- **Overview** — stats: total users, sellers, products
- **Users** — view all users, change roles (user/seller/admin), delete users
- **Products** — view all products, delete any product

### 🔒 Route Protection
- `ProtectedRoute` — shows auth modal instead of hard redirect
- `RoleProtectedRoute` — redirects to `/` if role not allowed
- `AuthPromptModal` — triggered globally for inline actions (add to cart, wishlist)

### 🔔 UX
- Sonner toasts for all feedback
- 404 NotFound page for unknown routes
- Confirm modal before destructive actions
- Responsive navbar with mobile drawer

---

## API Overview

| Base | Description |
|---|---|
| `POST /api/auth/signup` | Register |
| `POST /api/auth/verify-email` | OTP verify |
| `POST /api/auth/signin` | Login |
| `POST /api/auth/refresh` | Refresh token |
| `POST /api/auth/forgot-password` | Send reset link |
| `POST /api/auth/reset-password` | Reset password |
| `GET /api/products` | All products |
| `GET /api/products/:id` | Single product |
| `POST /api/products/add` | Add product (seller/admin) |
| `GET /api/admin/stats` | Dashboard stats (admin) |
| `GET /api/admin/users` | All users (admin) |
| `PUT /api/admin/users/:id/role` | Change role (admin) |
| `DELETE /api/admin/users/:id` | Delete user (admin) |
| `GET /api/admin/products` | All products (admin) |
| `DELETE /api/admin/products/:id` | Delete product (admin) |

---

## Detailed Docs

- [Frontend README](./frontend/README.md)
- [Backend README](./backend/README.md)
