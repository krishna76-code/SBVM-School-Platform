# 🏫 Saraswati Bal Vidya Mandir (SBVM) School Platform

[![Stack](https://img.shields.io/badge/Stack-MERN%20%2B%20AI%20%2B%20VectorDB-blueviolet)](https://github.com)
[![License](https://img.shields.io/badge/License-MIT-green)](https://opensource.org/licenses/MIT)
[![Node](https://img.shields.io/badge/Node-v18%2B%20%2F%20v22%20Recommended-blue)](https://nodejs.org/)

An institutional-grade, modern school administration, admission, and student engagement platform built for **Saraswati Bal Vidya Mandir (SBVM) School, Sikar, Rajasthan**. 

This system merges a glassmorphic React frontend with an intelligent administrative core powered by **local Vector Embeddings**, **ChromaDB RAG context routing**, and **Gemini API** integrations.

---

## 🚀 Key Features

### 1. 🤖 Artificial Intelligence Core
*   **AI Admission Counselor (RAG Chat)**: A 24/7 client-facing counselor chat grounded in the school's official prospectus. It reads semantic queries, executes vector searches inside a local **ChromaDB** database, and coordinates with the **Gemini API (`gemini-2.5-flash`)** to return grounded, accurate school details (fees, CBSE affiliation, boarding rules) without hallucinations.
*   **AI Study Assistant**: A student-only learning workspace. Students can ask curriculum-aligned questions (CBSE standard) and receive explanations along with dynamic self-test MCQs.
*   **Transient Load Resilience**: Integrates automatic exponential backoff retry routines on the backend to elegantly bypass free-tier API request peaks (503 Service Unavailable / 429 Rate Limits), falling back to clean inline user notifications if quotas are fully reached.

### 2. 📊 Administrative Pipeline & Automations
*   **Visual Admission Pipeline**: Admin Kanban dashboard to drag-and-drop applicants from initial `Submitted` status ➔ `Documents Verified` ➔ `Interview Scheduled` ➔ `Approved` / `Rejected`.
*   **Auto-Account Provisioning**: Upon administrator approval of an application:
    1.  A new **Parent** profile and user account are generated.
    2.  A new **Student** profile and standard school email (`student.first.last@sbvm.edu.in`) are generated.
    3.  A secure relative link connects the Parent to the Student.
    4.  Unique credentials are saved as temporary login parameters and automatically distributed.
*   **Scholarship Eligibility Calculator**: A rules engine that evaluates percentage concessions on annual tuition fees based on previous marks, entrance exams, sports achievements, and household income.

### 3. 📝 Portal Modules
*   **Student Portal**: Noticeboard alerts, homework trackers, marks tables, and printable PDF term report cards.
*   **Parent Portal**: Live calendar sync for child attendance (marked present/absent), notices, and outstanding fee payment simulations.
*   **Teacher Panel**: Grid interfaces to mark attendance for classes in under two minutes and batch-input term test marks.

---

## 🛠️ Architecture & Tech Stack

```
+-------------------------------------------------------------------------------+
|                                 CLIENT PORTAL                                 |
|   Vite (React SPA) + TailwindCSS + Lucide Icons + Glassmorphism UI (Dark/Light)|
+-------------------------------------------------------------------------------+
                                        │
                           HTTPS REST API Calls (JWT)
                                        │
                                        ▼
+-------------------------------------------------------------------------------+
|                                 BACKEND API                                   |
|   Node.js (ESM) + Express Server + Express-Rate-Limit + CORS + Helmet Security|
+-------------------------------------------------------------------------------+
       │                             │                              │
       ▼                             ▼                              ▼
+───────────────+            +───────────────+             +──────────────────+
|  Local Vector |            |  Mongoose DB  |             |  AI LLM Engine   |
|   Database    |            | (Atlas Cloud) |             |   (Gemini API)   |
|   ChromaDB    |            | MongoDB Atlas |             |  gemini-2.5-flash|
+───────────────+            +───────────────+             +──────────────────+
       ▲                                                            ▲
       │                                                            │
  Local Embeddings                                           Grounding Context
(Xenova Transformers)                                         (Prospectus RAG)
```

*   **Frontend**: React (Vite), Axios, TailwindCSS, Recharts.
*   **Backend**: Node.js (ES Module standard), Express.js.
*   **Database**: MongoDB Atlas via Mongoose ORM.
*   **Vector Engine**: ChromaDB (running locally on port `8000`).
*   **Local Embeddings**: `@xenova/transformers` using the `Xenova/all-MiniLM-L6-v2` model (extracts 384-dimensional dense vectors locally inside Node, bypassing external model fees).
*   **Language Model**: Gemini API SDK (`@google/genai` utilizing `gemini-2.5-flash`).

---

## 📁 Repository Structure

```
/sbvm-school-platform
│
├── /backend
│   ├── /src
│   │   ├── /config          # Database (Mongoose) & security middleware initializations
│   │   ├── /controllers     # Route controllers executing models & generating AI payloads
│   │   ├── /middlewares     # JWT token validations, dynamic RBAC checks, rate limiters
│   │   ├── /models          # Mongoose Schemas (User, StudentProfile, ApplicantProfile, etc.)
│   │   ├── /routes          # Express REST endpoints grouped by business feature
│   │   ├── /services        # Core services (Gemini calls, Chroma interactions, local embeddings)
│   │   └── /utils           # Validation schemas, custom logging, asynchronous handlers
│   ├── server.js            # Express application bootstrapping & database seeding
│   ├── package.json
│   └── .env.example
│
├── /frontend
│   ├── /src
│   │   ├── /components      # Reusable layout UI components (Cards, Forms, Navbars)
│   │   ├── /context         # React contexts (Authentication states, App themes)
│   │   ├── /layouts         # Dashboard layouts & landing page structures
│   │   ├── /pages           # Page views (Admissions, Dashboard portals, Public contacts)
│   │   ├── /services        # Axios interceptors mapping API calls to backend
│   │   └── App.jsx
│   ├── vite.config.js
│   └── package.json
│
└── package.json             # Root monorepo workspace configurations
```

---

## ⚙️ Setup & Configuration

### Prerequisites
*   Node.js (v18+ or v22+ recommended)
*   Docker Desktop running locally (to orchestrate ChromaDB)
*   MongoDB Atlas cluster credentials
*   Google AI Studio API Key

---

### Step 1: Clone and Spin Up ChromaDB
Ensure Docker is running, then pull and launch the ChromaDB local container:
```bash
docker run -d -p 8000:8000 chromadb/chroma
```

---

### Step 2: Configure Environment Variables
Create a `.env` configuration file at `backend/.env` and populate it:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<db_user>:<db_password>@cluster.mongodb.net/sbvm_database?appName=Cluster
JWT_SECRET=<cryptographically_secure_random_hex_key>
JWT_REFRESH_SECRET=<cryptographically_secure_random_hex_key>
GEMINI_API_KEY=<your_gemini_api_key_from_google_ai_studio>
CHROMA_URL=http://localhost:8000
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

---

### Step 3: Install Dependencies
Run the root orchestrator installation command in the main directory to install package locks for the root, backend, and frontend concurrently:
```bash
npm run install:all
```

---

### Step 4: Run the Platform
Start both the React development server and Node server concurrently:
```bash
npm run dev
```

*   **Frontend Client**: [http://localhost:5173](http://localhost:5173)
*   **Backend Server**: [http://localhost:5000](http://localhost:5000)
*   **ChromaDB Vector Store**: [http://localhost:8000](http://localhost:8000)

*On startup, the system will automatically seed default Admin credentials, base scholarship categories, and index the school prospectus documents into ChromaDB.*

---

## 🔒 Security & DevOps Features

1.  **Strict JWT Lifespans**: Short-lived Access Tokens (15m in memory) + secure, HttpOnly, SameSite cookies for Refresh Tokens (7d).
2.  **Global Dynamic Population**: Disabled `strictPopulate` globally in Mongoose to support dynamic polymorphic queries mapping User credentials to distinct profiles (Student, Parent, Teacher, Admin).
3.  **Security Headers & Limits**: Helmets configured for custom CSP policies, CORS restricted, and strict rate-limiters assigned to guard AI chat routes from scrapers.

---

## 🔑 Seeding / Demo Credentials
To login as the platform's super administrator and manage rosters or approve admissions:
*   **Username**: `admin@sbvm.edu.in`
*   **Password**: `adminPassword123`
*   **Contact Phone**: `+91 9111111111`
