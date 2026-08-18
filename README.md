# DesignPulse - Student Design Competition Platform

DesignPulse is a full-stack web application for discovering design competitions, managing student submissions, and helping admins review competition entries. It is built for students who want one place to find UI/UX, product, branding, sustainability, and innovation challenges.

## Features

- Browse featured and upcoming design competitions
- Filter and search competitions by category, status, tags, and organizer
- View detailed competition pages with prizes, eligibility, deliverables, deadlines, and judging criteria
- Student authentication with profile management
- Save/bookmark competitions
- Submit projects with summaries, file metadata, and external links
- Track submission status such as Draft, Submitted, Under Process, Confirmed, and Rejected
- Admin panel for creating, updating, and deleting competitions
- Admin submission review with status updates and evaluator notes
- MongoDB-backed API with JWT authentication
- Local demo fallback data for a smooth frontend preview

## Tech Stack

**Frontend**

- React
- Vite
- Tailwind CSS
- Lucide React icons

**Backend**

- Node.js
- Express
- MongoDB
- Mongoose
- JSON Web Tokens
- bcryptjs

## Project Structure

```text
Student/
├── public/              # Static assets
├── src/                 # React frontend
│   ├── components/      # Reusable UI components
│   ├── context/         # App state and API integration
│   └── pages/           # Main application screens
├── server/              # Express backend
│   ├── middleware/      # Auth middleware
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   ├── index.js         # API server entry
│   └── seed.js          # Demo database seed script
├── package.json         # Frontend dependencies and scripts
└── vite.config.js       # Vite config with API proxy
```

## Getting Started

### Prerequisites

- Node.js
- npm
- MongoDB connection string, local or cloud

### 1. Install Frontend Dependencies

```bash
npm install
```

### 2. Install Backend Dependencies

```bash
cd server
npm install
```

### 3. Configure Environment Variables

Create `server/.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173,http://127.0.0.1:5173
```

Optional frontend environment variable:

```env
VITE_API_BASE_URL=/api
```

The frontend is configured to proxy `/api` requests to `http://localhost:5000` during development.

### 4. Seed Demo Data

From the `server` folder:

```bash
node seed.js
```

Demo accounts created by the seed script:

```text
Student: rahul.student@designpulse.edu / student123
Admin:   admin@designpulse.org / admin123
```

### 5. Run the Backend

From the `server` folder:

```bash
npm run dev
```

The API runs at:

```text
http://localhost:5000
```

### 6. Run the Frontend

From the project root:

```bash
npm run dev
```

The app runs at:

```text
http://localhost:5173
```

## Available Scripts

Frontend:

```bash
npm run dev      # Start Vite development server
npm run build    # Build production frontend
npm run lint     # Run Oxlint
npm run preview  # Preview production build
```

Backend:

```bash
npm start        # Start Express server
npm run dev      # Start server with nodemon
node seed.js     # Seed demo competitions and users
```

## API Overview

```text
GET    /api/health
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
PUT    /api/auth/profile
POST   /api/auth/saved-competitions/:id
GET    /api/competitions
GET    /api/competitions/:id
POST   /api/competitions
PUT    /api/competitions/:id
DELETE /api/competitions/:id
GET    /api/submissions
GET    /api/submissions/:id
POST   /api/submissions
PUT    /api/submissions/:id
PUT    /api/submissions/:id/status
```

Admin-only routes require an authenticated admin token.

## Notes

- `server/.env` is ignored by git and should not be pushed to GitHub.
- `node_modules` and `dist` are ignored.
- The app includes default local demo data, but the full backend flow requires MongoDB and the Express API.

## Author

Rahul Mahto
#
