# Splitter (Full-Stack)

A simple Splitwise-like app to create groups, add expenses, see balances, and suggested settlements.

- Server: Node.js + Express + Mongoose
- Client: React + Vite + Tailwind CSS (v4 PostCSS plugin) + Axios

## Folder Structure

```
server/
  src/
    config/
      db.js
      .env (not checked in)
    controllers/
      authController.js
      groupController.js
      expenseController.js
      summaryController.js
      settlementController.js
    middleware/
      auth.js
    models/
      User.js
      Group.js
      Expense.js
    routes/
      authRoutes.js
      groupRoutes.js
      expenseRoutes.js
      summaryRoutes.js
      settlementRoutes.js
    utils/
      calculationUtils.js
    server.js
  package.json

client/
  index.html
  vite.config.js
  postcss.config.mjs
  tailwind.config.js
  package.json
  src/
    index.css
    main.jsx
    App.jsx
    api/
      api.js
    components/
      auth/LoginForm.jsx
      auth/RegisterForm.jsx
      common/Modal.jsx
      common/LoadingSpinner.jsx
      dashboard/GroupCard.jsx
      dashboard/CreateGroupModal.jsx
      dashboard/EditGroupModal.jsx
      details/AddExpenseForm.jsx
      details/BalanceSummary.jsx
      details/ExpenseList.jsx
      details/SettlementList.jsx
    pages/
      GroupDashboardPage.jsx
      GroupDetailPage.jsx
      JoinPage.jsx
      LandingPage.jsx
      LoginPage.jsx
      RegisterPage.jsx
```

## Prerequisites
- Node.js 18+
- MongoDB running locally (or a MongoDB URI)

## Server Setup
1. Create env file `server/src/config/.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/splitter
```

2. Install and run:

```bash
cd server
npm i
npm run dev   # or: npm start
```

Server runs on `http://localhost:5000`.

## Client Setup
1. Environment (optional). Create `client/.env` if your API is not on the default URL:

```bash
VITE_API_URL=http://localhost:5000
```

2. Install and run:

```bash
cd client
npm i
npm run dev
```

Client runs on `http://localhost:3000` (Vite). A dev proxy forwards `/api` to the server.

## Tailwind CSS (v4 + PostCSS plugin)
- Config: `client/postcss.config.mjs` uses `"@tailwindcss/postcss"` plugin
- Entry CSS: `client/src/index.css` contains `@import "tailwindcss";`
- Content paths: `client/tailwind.config.js` includes `./index.html` and `./src/**/*.{js,jsx,ts,tsx}`

If styles don’t appear, restart Vite and ensure the CSS is imported in `src/main.jsx`.

## API Summary
- `POST /api/auth/register` → register a new user `{ username, email, password }`
- `POST /api/auth/login` → login a user `{ email, password }`
- `GET /api/groups` → list groups
- `POST /api/groups` → create group `{ name, members[] }`
- `GET /api/groups/:id` → group details with `expenses[]`
- `POST /api/expenses` → create expense `{ groupId, title, amount, paidBy, participants[] }`
- `GET /api/expenses/:groupId` → list expenses for group
- `GET /api/summary/:groupId` → balances `{ summary, net }`
- `GET /api/settlements/:groupId` → suggested settlements

## Tech Notes
- **Authentication:** Uses JWT for user authentication. Tokens are sent with requests via `Authorization` header.
- Axios client at `client/src/api/api.js` with baseURL from `VITE_API_URL`.
- Vite dev server proxies `/api` to `http://localhost:5000` (see `client/vite.config.js`).
- Mongoose models in `server/src/models`.
- Calculation utilities in `server/src/utils/calculationUtils.js`.

## Common Scripts
Server:
```bash
cd server
npm run dev   # nodemon
npm start     # node
```

Client:
```bash
cd client
npm run dev       # vite
npm run build     # vite build
npm run preview   # serve built files
```

## Troubleshooting
- 404 on `http://localhost:3000/`: Ensure `client/index.html` exists at the client root and Vite is running from the `client/` directory.
- Tailwind not rendering: Verify `index.css` imported in `main.jsx`, restart Vite, and check content paths.
- Slow responses: Confirm local MongoDB, consider adding compression on server, and ensure indexes for `Expense.groupId` if dataset grows.
