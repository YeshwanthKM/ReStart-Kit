# ReStart Kit – A Guided Path to a Fresh Start

ReStart Kit is a digital platform designed to help marginalized individuals rebuild their lives and reintegrate into society. The platform turns a overwhelming situation into a clear, personalized, step-by-step actionable plan built around five reintegration pillars.

---

## 🌟 Five Reintegration Pillars

1. **DOCUMENTS**: Identity documents, legal documents, and government documentation guidance.
2. **BASIC NEEDS**: Housing, food, health, and essential support resources.
3. **SKILLS**: Skill-development programs, vocational training, and digital skills.
4. **EMPLOYMENT**: Employment support, resume/interview prep, and job opportunities.
5. **COMMUNITY**: Support NGOs, mentorship programs, and community organizations.

---

## 🏗 Project Architecture

```
restart-kit/
├── client/              # React (Vite) + Tailwind CSS Frontend
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Application views & pages
│   │   ├── layouts/     # Layout wrappers
│   │   ├── services/    # API integration services
│   │   ├── hooks/       # Custom React hooks
│   │   ├── context/     # Auth & State contexts
│   │   └── utils/       # Utility functions
│   └── package.json
│
├── server/              # Node.js + Express + Prisma REST API Backend
│   ├── src/
│   │   ├── controllers/ # Route request controllers
│   │   ├── middleware/  # Auth & validation middleware
│   │   ├── routes/      # Express API routes
│   │   ├── services/    # Personalization & business logic rules engine
│   │   ├── utils/       # Server helpers
│   │   └── config/      # DB & server configuration
│   ├── prisma/          # Prisma Schema & Database Migrations
│   └── package.json
│
├── package.json         # Root scripts & runner configuration
└── README.md
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v18.x or higher
- **npm**: v9.x or higher
- **PostgreSQL**: Local instance or cloud database (e.g. Supabase)

### Setup & Installation

1. **Clone repository and navigate into project directory**:
   ```bash
   cd restart-kit
   ```

2. **Configure Backend Environment**:
   ```bash
   cd server
   cp .env.example .env
   ```
   Edit `server/.env` with your PostgreSQL `DATABASE_URL` and `JWT_SECRET`.

3. **Install Server Dependencies & Generate Prisma Client**:
   ```bash
   npm install
   npx prisma generate
   ```

4. **Configure Frontend Environment**:
   ```bash
   cd ../client
   cp .env.example .env
   ```

5. **Install Client Dependencies**:
   ```bash
   npm install
   ```

---

## 🏃 Running the Application

From the root `restart-kit/` directory:

- **Run Server Only**:
  ```bash
  npm run dev:server
  ```
  Backend starts on `http://localhost:5000`

- **Run Client Only**:
  ```bash
  npm run dev:client
  ```
  Frontend starts on `http://localhost:5173`

- **Run Both Client & Server Concurrently**:
  ```bash
  npm install # install concurrently in root if needed
  npm run dev
  ```

---

## 🧪 Testing the Health Check API

To verify the server API health endpoint:

```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "success": true,
  "message": "ReStart Kit API is running",
  "timestamp": "2026-09-02T10:41:41.000Z"
}
```

---

## ⚙ Phase Roadmap

- [x] **Phase 0**: Project Foundation & Health Verification
- [ ] **Phase 1**: Authentication & User Profiles
- [ ] **Phase 2**: Needs & Goals Assessment
- [ ] **Phase 3**: Personalized ReStart Kit Logic Engine
- [ ] **Phase 4**: Dashboard & Progress Tracking
- [ ] **Phase 5**: Resource Directory & Search
- [ ] **Phase 6**: Admin Portal & Management
- [ ] **Phase 7**: End-to-End Testing & Refinement
- [ ] **Phase 8**: Production Deployment
