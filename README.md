# 🚀 ReStart Kit – A Guided Path to a Fresh Start

**ReStart Kit** is a personalized reintegration and life-planning platform designed to help individuals undergoing major life transitions rebuild their lives with clarity, confidence, and structure.

The platform transforms overwhelming challenges into an interactive, step-by-step actionable roadmap supported by verified local community resources across **5 Core Reintegration Pillars** in **Chennai & Tamil Nadu**, featuring multi-lingual support in **English**, **Tamil (தமிழ்)**, and **Hindi (हिंदी)**.

---

## 🌟 The 5 Reintegration Pillars

1. 📄 **DOCUMENTS**: Identity recovery (Aadhaar registration, Passport issuance, certified birth certificates, and free legal aid).
2. 🏠 **BASIC NEEDS**: Emergency housing shelters, Amma Unavagam meal centers, food banks, and healthcare services.
3. 🎓 **SKILLS & EDUCATION**: TNSDC vocational trade academies, Government ITI trade certification, digital literacy, and GED preparation.
4. 💼 **EMPLOYMENT**: District employment exchanges (Mylapore), fair-chance hiring employers, resume building, and mock interviews.
5. 🤝 **COMMUNITY & SUPPORT**: Reentry support networks (The Banyan NGO), 1-on-1 mentorship circles, and community welfare organizations.

---

## ✨ Key Features & Highlights

- **Multi-Lingual Support**: 1-click header language switcher supporting **English**, **Tamil (தமிழ்)**, and **Hindi (हिंदी)**.
- **Needs & Goals Assessment Wizard**: 4-step interactive survey mapping personal situations, immediate needs, goals, and neighborhood circles (*Anna Nagar, T. Nagar, Tambaram, Guindy*).
- **Transparent Recommendation Engine**: 100% deterministic rule engine (`personalization.service.js`) matching assessment answers against 20+ master task templates with duplicate task prevention.
- **Interactive Roadmap Checklist**: Priority badges (`HIGH`, `MEDIUM`, `LOW`), target completion timelines, and optimistic checkmark toggles.
- **Analytics Dashboard**: Progress percentage ring, 5-pillar breakdown meters, and **Top 3 Recommended Next Steps** action cards.
- **Verified Local Resource Directory**: 12+ verified institutions in Chennai with direct phone, address, and website links.
- **Admin Portal & Oversight**: Real-time registered users table, platform KPI metrics, Task Templates inspection, and **Delete Account & Cascade History Reset** controls.

---

## 🔑 Pre-Seeded Demo Accounts

| Role | Email | Password | Location | Capabilities |
| :--- | :--- | :--- | :--- | :--- |
| 🛡️ **System Admin** | `admin@restartkit.com` | `adminpassword123` | **Chennai Central** | Full Admin Portal access, user directory, statistics, template inspection |
| 👤 **Demo User 1** | `jordan@example.com` | `password123` | **Anna Nagar** | Active account with 8 generated 5-pillar checklist tasks & dashboard metrics |
| 👤 **Demo User 2** | `alex@example.com` | `password123` | **T. Nagar** | Fresh user profile ready for new assessment testing |

---

## 🛠️ Architecture & Technology Stack

```
restart-kit/
├── client/              # React 18 + Vite + Tailwind CSS Frontend
│   ├── src/
│   │   ├── components/  # Navbar, ProtectedRoute, UI controls
│   │   ├── context/     # AuthContext, LanguageContext
│   │   ├── pages/       # Home, Dashboard, Roadmap, Assessment, Resource, Admin, Profile
│   │   ├── utils/       # Multilingual translations (EN, TA, HI)
│   │   └── services/    # Axios API client
│
├── server/              # Node.js + Express + Prisma REST API Backend
│   ├── src/
│   │   ├── controllers/ # Auth, Task, Assessment, Dashboard, Admin, Resource controllers
│   │   ├── services/    # Rule-based personalization engine
│   │   ├── routes/      # Express REST routes
│   │   └── utils/       # DB connection & auto-seeding helpers
│   └── prisma/          # SQLite schema & dev.db master file
```

---

## 🏃 Quickstart Guide (Local Development)

### 1. Prerequisites
- **Node.js**: v18.x or higher
- **npm**: v9.x or higher

### 2. Installation & Setup
```bash
# Clone the repository
git clone https://github.com/YeshwanthKM/ReStart-Kit.git
cd restart-kit

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 3. Running the Project
```bash
# Start backend server (Port 5001)
cd server
node src/index.js

# Start frontend Vite dev server (Port 5173) in a new terminal window
cd client
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## 🧪 Health Check API Verification

```bash
curl http://localhost:5001/api/health
```

Expected Response:
```json
{
  "success": true,
  "message": "ReStart Kit API is running"
}
```

---

## 🌐 Production Deployment

The project is configured for cloud deployment on **Vercel** serverless functions with automated SQLite database handling.

- **GitHub Repository**: [YeshwanthKM/ReStart-Kit](https://github.com/YeshwanthKM/ReStart-Kit)
- **Baseline Version Tag**: `v1.0-perfect-working-checkpoint`

---

## 📄 License

Built with ❤️ for community support and social reintegration.
