# AMD IT SOLUTION

Premium IT Services Platform — CCTV, Computer & Laptop, Networking, AMC

## Project Structure

```
amd-it-solution/
├── frontend/                 # React + Vite + TailwindCSS
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Page components
│   │   ├── context/          # React Context (Auth)
│   │   ├── api/              # API client (axios)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── .env.example
│
├── backend/                  # Node.js + Express + TypeScript + MongoDB
│   ├── src/
│   │   ├── config/           # Environment & DB config
│   │   ├── controllers/      # Request handlers
│   │   ├── routes/           # API routes
│   │   ├── models/           # Mongoose models
│   │   ├── middleware/       # Auth, validation, errors
│   │   ├── utils/            # Helpers (JWT, hash, Razorpay)
│   │   ├── validators/       # Joi schemas
│   │   ├── app.ts            # Express app setup
│   │   └── server.ts         # Entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── .gitignore
└── README.md
```

## Features

- **Authentication**: JWT-based login/register with role-based access (customer, technician, admin)
- **Booking System**: Multi-step wizard with slot availability, status transitions
- **Payments**: Razorpay integration (mock mode for development) with HMAC verification
- **Admin Dashboard**: Full CRUD for 11 entities (bookings, users, technicians, services, products, payments, AMC, reviews, coupons, quotes, settings)
- **Technician Dashboard**: Assignment tracking with live status updates
- **Customer Dashboard**: Booking history with payment and timeline
- **Coupon System**: Percent/flat discounts with validation
- **AMC Plans**: Annual/monthly maintenance contracts
- **Reviews & Quotes**: Customer feedback and quote requests
- **Site Settings**: Configurable website content

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI and secrets
npm install
npm run dev
# Server runs on http://localhost:5000
```

### Frontend Setup

```bash
cd frontend
cp .env.example .env
# Edit .env if needed (VITE_API_URL)
npm install
npm run dev
# Frontend runs on http://localhost:5173
```

## Environment Variables

### Backend (.env)
| Variable | Description |
|----------|-------------|
| PORT | Server port (default: 5000) |
| MONGO_URI | MongoDB connection string |
| JWT_SECRET | Strong secret for JWT signing |
| JWT_EXPIRE | Token expiry (default: 7d) |
| CORS_ORIGIN | Frontend URL for CORS |
| NODE_ENV | development/production |
| RAZORPAY_KEY_ID | Razorpay test/live key |
| RAZORPAY_KEY_SECRET | Razorpay secret |
| RAZORPAY_WEBHOOK_SECRET | Webhook verification secret |
| FRONTEND_URL | Frontend URL for password reset links |

### Frontend (.env)
| Variable | Description |
|----------|-------------|
| VITE_API_URL | Backend API base URL (e.g., http://localhost:5000) |

## API Endpoints

All endpoints prefixed with `/api/`

### Auth
- `POST /auth/register` - Register user
- `POST /auth/login` - Login
- `GET /auth/me` - Get current user

### Bookings
- `GET /bookings/slots` - Available slots (public)
- `POST /bookings` - Create booking (customer)
- `GET /bookings` - List bookings (role-filtered)
- `GET /bookings/my` - Current user's bookings
- `GET /bookings/:id` - Get booking details
- `PATCH /bookings/:id/status` - Update status (admin/tech)
- `POST /bookings/:id/assign` - Assign technician (admin)
- `PATCH /bookings/:id/cancel` - Cancel booking

### Payments
- `POST /payments/create-order` - Create Razorpay order
- `POST /payments/verify` - Verify payment signature
- `POST /payments/webhook` - Razorpay webhook
- `POST /payments/mark-failed` - Mark payment failed/cancelled

### Services, Technicians, Products, AMC, Coupons, Reviews, Quotes, Settings
- Full CRUD with role-based access

## Deployment

### Frontend (Vercel/Netlify)
1. Connect repository
2. Set build command: `cd frontend && npm run build`
3. Set output directory: `frontend/dist`
4. Add environment variable: `VITE_API_URL=https://your-backend-domain/api`

### Backend (Render/Railway/VPS)
1. Connect repository
2. Set build command: `cd backend && npm run build`
3. Set start command: `cd backend && npm start`
4. Add all backend environment variables
5. Ensure CORS_ORIGIN includes frontend production URL

## Security Notes

- Never commit `.env` files
- Use strong JWT_SECRET in production
- Configure CORS_ORIGIN for production frontend only
- Use real Razorpay keys in production
- Enable MongoDB Atlas IP whitelist
- Keep dependencies updated

## License

Private — AMD IT SOLUTION