# 🌾 Khakhra Co. — Frontend

React 19 SPA with Vite, TailwindCSS, React Query, React Hook Form, Zod validation, and JWT-based auth.

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| React | ^19.2.4 | UI framework |
| Vite | ^8.0.4 | Build tool & dev server |
| React Router DOM | ^7.14.2 | Client-side routing |
| TailwindCSS | ^3.4.19 | Utility-first styling |
| @tanstack/react-query | ^5.100.5 | Server state, caching, mutations |
| React Hook Form | ^7.75.0 | Form state management |
| Zod | ^4.4.3 | Schema validation |
| @hookform/resolvers | ^5.2.2 | Zod ↔ React Hook Form bridge |
| Axios | ^1.15.2 | HTTP client with interceptors |
| Sonner | ^2.0.7 | Toast notifications |
| React Icons | ^5.6.0 | Icon library |
| Socket.io Client | ^4.8.3 | Real-time chat |

---

## Project Structure

```
frontend/
├── layout.jsx                      # Root layout (Navbar + Outlet + Footer)
├── src/
│   ├── main.jsx                    # App entry, routes, providers
│   ├── components/
│   │   ├── navbar.jsx              # Responsive navbar with profile dropdown
│   │   ├── footer.jsx
│   │   ├── productCard.jsx
│   │   ├── ProductDetail.jsx
│   │   ├── productlistLayout.jsx
│   │   ├── AuthPromptModal.jsx     # Auth gate modal (sign in / sign up)
│   │   ├── ProtectedRoute.jsx      # Redirects unauthenticated users
│   │   └── RoleProtectedRoute.jsx  # Blocks users without required role
│   ├── context/
│   │   ├── AuthContext.jsx         # user, login, logout, updateUser
│   │   └── AuthPromptContext.jsx   # openAuthPrompt() global trigger
│   ├── pages/
│   │   ├── SignIn.jsx
│   │   ├── SignUp.jsx
│   │   ├── VerifyEmail.jsx         # 6-digit OTP input with resend
│   │   ├── ForgotPassword.jsx
│   │   ├── ResetPassword.jsx       # Reads ?token= from URL
│   │   ├── Products.jsx            # Product listing
│   │   ├── SingleProduct.jsx       # Product detail + auth-gated actions
│   │   ├── AddProduct.jsx          # Seller/admin only
│   │   ├── Profile.jsx
│   │   ├── EditProfile.jsx
│   │   ├── Cart.jsx
│   │   ├── Wishlist.jsx
│   │   ├── Orders.jsx
│   │   ├── AdminDashboard.jsx      # Admin only — stats, users, products
│   │   └── NotFound.jsx            # 404 fallback
│   ├── helpers/
│   │   └── apiRequest.js           # All axios API calls
│   ├── constants/
│   │   ├── url.js                  # API endpoint constants
│   │   └── serviceBaseUrl.js       # VITE_BACKEND_URL
│   ├── schemas/
│   │   ├── signinSchema.js         # Zod schema
│   │   ├── signupSchema.js
│   │   └── addproductSchema.js
│   ├── plugin/
│   │   └── axios.js                # Axios instance + token refresh interceptors
│   ├── hooks/
│   │   └── fetchUsers.js
│   └── context/
│       ├── AuthContext.jsx
│       └── AuthPromptContext.jsx
```

---

## Environment Variables

Create a `.env` file in the `frontend/` root:

```env
VITE_BACKEND_URL=http://localhost:8000
```

---

## Getting Started

```bash
cd frontend
npm install
npm run dev      # starts on http://localhost:5173
```

---

## Routing

| Path | Component | Auth | Role |
|---|---|---|---|
| `/` | Products | ❌ | any |
| `/products` | Products | ❌ | any |
| `/products/:id` | SingleProduct | ❌ | any |
| `/signin` | SignIn | ❌ | any |
| `/signup` | SignUp | ❌ | any |
| `/verify-email` | VerifyEmail | ❌ | any |
| `/forgot-password` | ForgotPassword | ❌ | any |
| `/reset-password` | ResetPassword | ❌ | any |
| `/profile` | Profile | ✅ | any |
| `/profile/edit` | EditProfile | ✅ | any |
| `/cart` | Cart | ✅ | any |
| `/wishlist` | Wishlist | ✅ | any |
| `/orders` | Orders | ✅ | any |
| `/products/add` | AddProduct | ✅ | seller, admin |
| `/admin` | AdminDashboard | ✅ | admin |
| `*` | NotFound | ❌ | any |

---

## Full User Flows

### 1. Sign Up
```
/signup → fill form (name, email, mobile, address, password)
       → POST /api/auth/signup
       → navigate to /verify-email with email in route state
       → enter 6-digit OTP from email
       → POST /api/auth/verify-email
       → navigate to /signin
```

### 2. Sign In
```
/signin → fill email + password
        → POST /api/auth/signin
        → stores accessToken (memory), refreshToken (localStorage), user (localStorage)
        → redirects to intended page (via location.state.from) or /
```

### 3. Forgot Password
```
/signin → "Forgot Password?" link → /forgot-password
        → enter email
        → POST /api/auth/forgot-password
        → email arrives with link: /reset-password?token=...
        → enter new password + confirm
        → POST /api/auth/reset-password
        → navigate to /signin
```

### 4. Token Refresh
```
On app load:
  → reads refreshToken from localStorage
  → if expired → clears session, stays logged out
  → if valid   → POST /api/auth/refresh → stores new accessToken in memory

On every API request (axios interceptor):
  → if accessToken is expired/near-expiry → refresh proactively
  → if 401 response → retry with new token
  → if refresh fails → clear session, redirect to /signin
```

### 5. Protected Actions (Add to Cart, Wishlist, etc.)
```
User not logged in → clicks "Add to Cart" or "Wishlist"
  → AuthPromptModal opens (no redirect)
  → user clicks "Sign In" or "Create Account"
  → navigated to /signin or /signup with state.from set
  → after login, redirected back to original page

User navigates directly to /cart, /orders, /wishlist (not logged in)
  → ProtectedRoute opens AuthPromptModal
  → same flow as above
```

### 6. Admin Dashboard (`/admin`)
```
Admin logs in → navbar shows "Admin Dashboard" link
             → /admin → AdminDashboard

Overview tab:
  → GET /api/admin/stats
  → shows: Total Users, Total Sellers, Total Products

Users tab:
  → GET /api/admin/users
  → table: name, email, contact, role (dropdown), verified, delete
  → change role → PUT /api/admin/users/:id/role
  → delete user → DELETE /api/admin/users/:id (with confirm modal)

Products tab:
  → GET /api/admin/products
  → table: title, category, price, stock, seller, delete
  → delete product → DELETE /api/admin/products/:id (with confirm modal)
```

---

## Auth Architecture

```
AuthProvider (context)
  ├── user          — current user object (from localStorage)
  ├── login(data)   — sets token, stores refreshToken + user
  ├── logout()      — clears everything
  └── updateUser()  — updates user in state + localStorage

AuthPromptContext
  ├── open          — boolean
  ├── redirectTo    — path to redirect after login
  ├── openAuthPrompt(path)
  └── closeAuthPrompt()

axios.js (plugin)
  ├── setToken / getToken / clearToken  — in-memory token store
  ├── Request interceptor               — attaches Bearer token, proactive refresh
  └── Response interceptor              — handles 401, queues concurrent requests
```

---

## Role-Based UI

| Feature | user | seller | admin |
|---|---|---|---|
| Browse products | ✅ | ✅ | ✅ |
| Cart / Wishlist / Orders | ✅ | ✅ | ✅ |
| Add product | ❌ | ✅ | ✅ |
| Admin Dashboard | ❌ | ❌ | ✅ |
| Manage users & roles | ❌ | ❌ | ✅ |
| Delete any product | ❌ | ❌ | ✅ |

> Admin can promote any user to `seller` or `admin` directly from the Users tab in the dashboard.

---

## Form Validation

All forms use **React Hook Form** + **Zod** schemas:

| Form | Schema | Rules |
|---|---|---|
| Sign Up | `signupSchema` | name required, valid email, 10-digit mobile, min 6 char password, passwords match |
| Sign In | `signinSchema` | valid email, min 6 char password |
| Forgot Password | inline z.object | valid email |
| Reset Password | inline z.object | min 6 chars, passwords match |
| Add Product | `addproductSchema` | title, category, price, stock required |

---

## Notifications

All success/error feedback uses **Sonner** toasts:
- Top-right position
- `richColors` enabled (green for success, red for error)
- Triggered via `toast.success()` / `toast.error()` in mutation callbacks
