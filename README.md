# 🛡️ AMD IT SOLUTION — Official Web Platform

> Premium IT Services Platform in Kolkata — CCTV Surveillance, Computer & Laptop Repair, Networking, Biometrics & AMC Contracts.

---

## 📌 Quick Business Contact Info
* **Office Address:** 24 T C Road, Kolkata - 700053
* **Primary Phone / Hotline:** [9635006403](tel:9635006403)
* **Direct WhatsApp:** [Chat on WhatsApp (+91 9635006403)](https://wa.me/919635006403?text=Hello%20AMD%20IT%20SOLUTION,%20I%20would%20like%20to%20inquire%20about%20your%20services.)
* **Official Email:** [itsolutions.amd@gmail.com](mailto:itsolutions.amd@gmail.com)
* **GSTIN:** `19BAAPK5344N1ZD`

---

## 🔑 Default Master Credentials (For Testing & Verification)

| Role | Email | Password | Access Level |
|---|---|---|---|
| **Master Admin** | `admin@amditsolution.in` | `Admin@123456` | Full CRUD, Status Overrides, Delete Bookings, Users, Catalog, Settings |
| **Field Technician** | `technician@amditsolution.in` | `Tech@123456` | Assigned Jobs, On the Way, In Progress, Completed |
| **Customer** | *(Self Register via UI)* | *(Custom)* | Book Service, Track My Bookings, Download Invoices |

---

## 🚀 1-Click Vercel Deployment Guide (Frontend)

The frontend is built with **React 19 + Vite + TailwindCSS** and is fully pre-configured for **0-error Vercel deployment** with SPA routing (`vercel.json`).

### Method A: Deploying from GitHub / GitLab / Bitbucket (Recommended)

1. **Push your repository** to GitHub:
   ```bash
   git add .
   git commit -m "AMD IT SOLUTION: Ready for Vercel Deployment"
   git push origin main
   ```
2. Go to **[vercel.com/new](https://vercel.com/new)** and import your repository.
3. In the **Configure Project** screen:
   * **Framework Preset:** `Vite`
   * **Root Directory:** `./frontend` *(or leave as `./` if using root `vercel.json`)*
   * **Build Command:** `npm run build`
   * **Output Directory:** `dist`
4. In **Environment Variables**, add:
   * **Name:** `VITE_API_URL`
   * **Value:** `https://your-backend-api-url.onrender.com` *(or your deployed backend URL)*
5. Click **Deploy**. Your site will build in seconds with zero routing errors!

---

## ⚙️ Backend Deployment Guide (Render / Railway / VPS)

The backend is an **Express + TypeScript + Mongoose** application.

### Deploying to Render.com (Recommended Free/Starter Host):
1. Create a **New Web Service** on [Render.com](https://render.com).
2. Connect your repository.
3. Configure the service:
   * **Root Directory:** `backend`
   * **Environment:** `Node`
   * **Build Command:** `npm install && npm run build`
   * **Start Command:** `npm start`
4. Add **Environment Variables** in Render Dashboard:
   ```env
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/amd_it_solution?retryWrites=true&w=majority
   JWT_SECRET=your_super_secret_jwt_key_2026_amd
   CORS_ORIGIN=*
   RAZORPAY_KEY_ID=rzp_test_samplekey1234
   RAZORPAY_KEY_SECRET=sample_secret_key_5678
   ```
5. Deploy the backend and copy your live backend URL (e.g. `https://amd-it-backend.onrender.com`).
6. Paste this URL as `VITE_API_URL` in your Vercel Frontend environment settings.

---

## 💻 Local Development Setup

### 1. Clone the repository:
```bash
git clone https://github.com/your-username/amd-it-solution.git
cd amd-it-solution
```

### 2. Install all dependencies:
```bash
# In the root directory:
npm run install:all
```

### 3. Setup Environment Variables:
* **Frontend:** Copy `frontend/.env.example` to `frontend/.env`
  ```env
  VITE_API_URL=http://localhost:5000
  ```
* **Backend:** Copy `backend/.env.example` to `backend/.env`
  ```env
  PORT=5000
  MONGODB_URI=mongodb://127.0.0.1:27017/amd_it_solution
  JWT_SECRET=super_secret_jwt_key_amd_it_solution_2026_secure
  CORS_ORIGIN=http://localhost:5173
  ```

### 4. Run Both Servers Concurrently:
```bash
npm run dev
```
* **Frontend:** [http://localhost:5173](http://localhost:5173)
* **Backend API:** [http://localhost:5000](http://localhost:5000)
* **API Health Check:** [http://localhost:5000/health](http://localhost:5000/health)

---

## 🛠️ Project Structure

```
AMD IT SOLUTION/
├── frontend/                     # React + Vite Client
│   ├── src/
│   │   ├── api/client.js         # Configured Axios with JWT interceptor & base URL
│   │   ├── components/
│   │   │   ├── Navbar.jsx        # Dual-mode navbar (Admin exclusive vs Customer)
│   │   │   ├── FloatingActions.jsx # WhatsApp & Direct Phone Call buttons
│   │   │   ├── Hero.jsx
│   │   │   ├── BookingWizard.jsx # Multi-step smart booking
│   │   │   ├── Footer.jsx
│   │   │   └── ...
│   │   ├── pages/
│   │   │   ├── AdminDashboard.jsx # 11-module Master Admin Console
│   │   │   ├── CustomerDashboard.jsx
│   │   │   ├── TechnicianDashboard.jsx
│   │   │   ├── Services.jsx
│   │   │   └── BookingDetail.jsx
│   │   └── App.jsx
│   ├── vercel.json               # SPA rewrites & security headers for Vercel
│   ├── .env.example
│   └── package.json
│
├── backend/                      # Express + TypeScript Server
│   ├── src/
│   │   ├── config/db.ts          # Resilient MongoDB connection
│   │   ├── controllers/          # Booking, Auth, Tech, Service, Payments
│   │   ├── routes/               # Modular REST endpoints
│   │   ├── models/               # MongoDB Mongoose schemas
│   │   ├── middleware/           # RBAC Authorization, JWT Protection, Error handling
│   │   ├── app.ts                # App initialization & dynamic CORS
│   │   └── server.ts             # Server entry point
│   ├── .env.example
│   ├── tsconfig.json
│   └── package.json
│
├── vercel.json                   # Root monorepo Vercel configuration
├── .env.example
└── README.md
```

---

## 🧪 Build & Verification Commands

Verify everything compiles cleanly with 0 errors:

```bash
# Verify Frontend build:
cd frontend && npm run build

# Verify Backend TypeScript build:
cd ../backend && npm run build
```

---

## 📜 License
© AMD IT SOLUTION — All Rights Reserved. (GSTIN: 19BAAPK5344N1ZD)