# TaskFlow

TaskFlow is a production-style full-stack todo and productivity manager built with React, Vite, Express, MongoDB, JWT authentication, and a premium glassmorphism UI.

## Folder Structure

```text
task_2/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── .gitignore
└── README.md
```

## Features

- JWT auth with registration, login, logout, protected routes, remember-me persistence, and password validation
- CRUD task management with status toggle, search, filters, sort, pagination, due dates, priorities, and custom categories
- Drag-and-drop reordering with backend persistence
- Dashboard analytics for totals, completed, pending, high-priority, today, upcoming, productivity score, and weekly momentum
- Profile page with editable user details and account metrics
- Premium responsive UI with glassmorphism, theme toggle, confetti, skeleton states, modal confirmations, and toast notifications
- PWA-ready manifest scaffold for future installability enhancements

## Recent Improvements

- Fixed the priority dropdown visibility issue so option colors display correctly in the task form.
- Replaced the demo weekly momentum chart data with real task-based analytics.
- Updated weekly momentum to use your actual calendar week, always ordered as `Sun, Mon, Tue, Wed, Thu, Fri, Sat`.
- Weekly momentum now reflects task activity from your own data by counting tasks created and completed per day.
- Updated task pagination to conditionally hide the Previous and Next buttons based on the current page availability.
- Refined the top navbar to lock securely at the top, occupy 100% width, and use space more efficiently.

## Database Schema

### User

```js
{
  name: String,
  email: String,
  password: String,
  timestamps: true
}
```

### Todo

```js
{
  user: ObjectId,
  title: String,
  description: String,
  category: String,
  dueDate: Date,
  priority: "High" | "Medium" | "Low",
  status: "pending" | "completed",
  order: Number,
  timestamps: true
}
```

## API Endpoints

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/profile`
- `PUT /api/auth/profile`

### Todos

- `GET /api/todos`
- `POST /api/todos`
- `PUT /api/todos/reorder`
- `PUT /api/todos/:id`
- `DELETE /api/todos/:id`
- `PATCH /api/todos/:id/status`

## Environment Variables

### Backend `.env`

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/taskflow
JWT_SECRET=replace_with_a_long_secure_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### Frontend `.env`

```env
VITE_API_URL=http://localhost:5000/api
```

## Installation Steps

1. Install MongoDB locally or use MongoDB Atlas.
2. Create `backend/.env` from `backend/.env.example`.
3. Create `frontend/.env` from `frontend/.env.example`.
4. Install backend dependencies:

```bash
cd backend
npm install
```

5. Install frontend dependencies:

```bash
cd frontend
npm install
```

6. Start the backend:

```bash
cd backend
npm run dev
```

7. Start the frontend:

```bash
cd frontend
npm run dev
```

8. Open `http://localhost:5173`.

## Deployment Guide

### Backend

- Deploy to Render, Railway, Fly.io, or a VPS.
- Set environment variables from the backend example file.
- Point `MONGO_URI` to MongoDB Atlas in production.
- Set `CLIENT_URL` to your deployed frontend URL.
- Run `npm start`.

### Frontend

- Deploy the Vite app to Vercel, Netlify, or Cloudflare Pages.
- Set `VITE_API_URL` to the deployed backend API URL.
- Run `npm run build`.
- Serve the generated `dist/` output.

## Notes For Recruiter-Ready Presentation

- The UI is intentionally styled like a modern SaaS dashboard with layered backgrounds, glass surfaces, animated cards, and responsive layouts.
- The codebase is split into reusable contexts, pages, services, controllers, and models to keep the structure beginner-friendly and scalable.
- The current PWA support is scaffolded with a web manifest and can be extended with a service worker if you want offline support next.

## Known Behavior

- The Weekly Momentum chart is now data-driven and calendar-based. It starts on Sunday and ends on Saturday.
- Weekly activity is currently calculated as: `tasks created + tasks completed` for each day.
- If you want a different graph style later, this can easily be changed to `completed only`, `created only`, or `two separate bars` per day.
