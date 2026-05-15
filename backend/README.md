# 🌾 Khakhra Co. — Backend

Node.js + Express REST API with MySQL, JWT auth, email OTP verification, and role-based access control.

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| Node.js | 18+ | Runtime |
| Express | ^5.2.1 | HTTP framework |
| MySQL2 | ^3.22.0 | Database driver |
| bcrypt | ^6.0.0 | Password hashing |
| jsonwebtoken | ^9.0.3 | Access & refresh tokens |
| nodemailer | ^8.0.7 | Email OTP & reset links |
| socket.io | ^4.8.1 | Real-time chat |
| dotenv | ^17.4.2 | Environment variables |
| nodemon | ^3.1.14 | Dev auto-restart |

---

## Project Structure

```
backend/
├── index.js                        # Entry point
└── src/
    ├── config/
    │   └── db.js                   # MySQL connection
    ├── controllers/
    │   ├── auth.controllers.js     # signup, verifyEmail, resendOTP
    │   ├── signin.Controllers.js   # signin
    │   ├── token.Controllers.js    # refresh token
    │   ├── updateProfile.Controllers.js
    │   ├── product.Controller.js
    │   ├── admin.Controllers.js    # admin CRUD
    │   └── passwordReset.Controllers.js
    ├── middleware/
    │   ├── auth.js                 # verifyToken (JWT)
    │   └── role.js                 # requireRole(...roles)
    ├── routes/
    │   ├── AuthRoutes.js
    │   ├── productRoutes.js
    │   └── adminRoutes.js
    ├── services/
    │   ├── signup.Services.js
    │   ├── signin.Services.js
    │   ├── emailService.js         # nodemailer OTP + reset link
    │   ├── passwordReset.Services.js
    │   ├── product.Services.js
    │   ├── admin.Services.js
    │   └── updateProfile.Services.js
    ├── sockets/
    │   └── chatSocket.js           # socket.io chat
    └── utils/
        ├── hashpassword.js         # bcrypt hash/compare
        └── jwttoken.js             # generate/verify JWT
```

---

## Environment Variables

Create a `.env` file in the `backend/` root:

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

RAZORPAY_KEY_ID=rzp_test_xxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret

FRONTEND_URL=http://localhost:5173
```

> For `EMAIL_PASS`, use a [Gmail App Password](https://myaccount.google.com/apppasswords), not your regular Gmail password.

---

## Database Setup

Run the following SQL to create the required tables:

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

---

## Getting Started

```bash
cd backend
npm install
npm start        # runs with nodemon
```

Server starts on `http://localhost:8000`

---

## API Reference

### Auth Routes — `/api/auth`

| Method | Endpoint | Auth | Body | Description |
|---|---|---|---|---|
| POST | `/signup` | ❌ | `name, email, password, contact, address` | Register user, sends OTP email |
| POST | `/verify-email` | ❌ | `email, otp` | Verify email with 6-digit OTP |
| POST | `/resend-otp` | ❌ | `email` | Resend OTP (new 10-min expiry) |
| POST | `/signin` | ❌ | `email, password` | Login, returns access + refresh tokens |
| POST | `/refresh` | ❌ | `refreshToken` | Get new access token |
| POST | `/forgot-password` | ❌ | `email` | Send password reset link to email |
| POST | `/reset-password` | ❌ | `token, password` | Reset password using token from email |
| PUT | `/profile` | ✅ | `name, contact, address` | Update logged-in user's profile |

---

### Product Routes — `/api/products`

| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| GET | `/` | ❌ | any | Get all products |
| GET | `/:id` | ❌ | any | Get single product |
| POST | `/add` | ✅ | seller, admin | Add new product |

---

### Admin Routes — `/api/admin`

All routes require: `Authorization: Bearer <token>` + role `admin`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/stats` | Total users, sellers, products |
| GET | `/users` | All users list |
| PUT | `/users/:id/role` | Change user role (`user`/`seller`/`admin`) |
| DELETE | `/users/:id` | Delete a user |
| GET | `/products` | All products with seller info |
| DELETE | `/products/:id` | Delete any product |

---

## Authentication Flow

```
1. POST /signup
   → inserts user (is_verified = false)
   → generates 6-digit OTP (10 min expiry)
   → sends OTP via Gmail
   → returns { requiresVerification: true, email }

2. POST /verify-email
   → validates OTP + expiry
   → sets is_verified = true, clears OTP
   → returns { success: true }

3. POST /signin
   → checks is_verified (blocks if false)
   → validates password with bcrypt
   → returns { accessToken (15m), refreshToken (7d), user }

4. POST /refresh
   → validates refreshToken
   → returns new accessToken

5. POST /forgot-password
   → generates crypto token (1hr expiry)
   → emails link: FRONTEND_URL/reset-password?token=...

6. POST /reset-password
   → validates token + expiry
   → hashes new password, clears reset token
```

---

## Role System

| Role | Permissions |
|---|---|
| `user` | Browse products, cart, wishlist, orders, profile |
| `seller` | All user permissions + add products |
| `admin` | All seller permissions + admin dashboard (manage users, roles, delete products) |

Roles are enforced via:
- **Backend**: `requireRole("admin")` middleware on all `/api/admin/*` routes
- **Frontend**: `RoleProtectedRoute` component wrapping admin pages

---

## Real-time Chat

Socket.io is set up at `src/sockets/chatSocket.js` and mounted on the HTTP server. Connects via `http://localhost:8000`.
