# HireFlow – Master Todo List

> Derived from PRD, Tech Stack, and TRD documents.
> Legend: `[ ]` = Todo | `[/]` = In Progress | `[x]` = Done

---

## Phase 1 – Foundation & Core Infrastructure

### 1. Project Setup & Architecture
- [x] Initialize React + Vite project
- [x] Set up TypeScript across frontend and backend
- [x] Configure CSS Modules / Styled Components (Vanilla CSS + Framer Motion)
- [x] Define folder structure (modular microservice-ready layout)
- [x] Set up Node.js backend (Express) with TypeScript
- [x] Configure PostgreSQL database connection (Drizzle ORM)
- [x] Configure Redis for caching/sessions
- [x] Set up Docker for local development (docker-compose.yml with health checks)
- [x] Configure Nginx reverse proxy (client/nginx.conf + client Dockerfile)
- [x] Set up CI/CD pipeline (GitHub Actions – .github/workflows/ci.yml)
- [ ] Set up cloud provider (AWS or GCP) for deployment

---

### 2. Authentication & Role Management
- [x] Design User data model (User, Company, Interviewer, Candidate)
- [x] Implement JWT-based authentication
- [x] Implement role-based access control (RBAC):
  - [x] HR role
  - [x] Interviewer role
  - [x] Admin role
- [x] Build `POST /api/auth/login` API endpoint
- [x] Build `POST /api/auth/register` API endpoint
- [x] Add HTTPS enforcement (via Helmet)
- [x] Add audit logging for auth events
- [ ] (Future) OAuth integration – LinkedIn / GitHub

---

### 3. Database & Data Models
- [x] Design and create schema for all entities (9 tables defined)
- [x] Set up database migrations (Drizzle Kit)
- [x] Seed data for development/testing
- [x] Set up encrypted storage for sensitive data (AES-256-GCM via server/src/lib/crypto.ts)
- [x] Configure daily automated backups (scripts/backup.sh + db-backup Docker service, 7-day retention)

---

## Phase 2 – Core Features (MVP)

### 4. HR Dashboard
- [x] Build HR dashboard layout and navigation
- [x] Job Role creation & management:
  - [x] `POST /api/jobs/create` API
  - [x] Required skills input (tag-based UI)
  - [x] Job role listing and status view
- [x] Interview scheduling module:
  - [x] `POST /api/interviews/schedule` API
  - [x] Calendar integration (date/time picker UI)
  - [x] Timezone handling (UTC storage + Local display)
  - [x] Automated email notifications on scheduling (Nodemailer)
- [x] Candidate status tracking view
- [x] Access to interview recordings
- [x] Access to scorecards and reports
- [x] Dashboard load time optimization (Skeleton loaders implemented)

---

### 5. Interviewer Dashboard
- [x] Build Interviewer dashboard layout
- [x] Accept / Decline interview requests (Backend + UI)
- [x] View upcoming interview schedule
- [x] Evaluation form submission:
  - [x] Structured rubric scoring UI
  - [x] Weighted scoring logic (Backend)
  - [x] `POST /api/scorecard/submit` API
- [x] Earnings dashboard (per interview + history aggregation)

---

### 6. Interviewer Matching Engine
- [x] Design skill-tag mapping system
- [x] Build `GET /api/interviewer/match` API
- [x] Implement rule-based matching logic:
  - [x] Skill-tag matching against job role
  - [x] Rating-based ranking (>= 3.5 filtered)
  - [x] Availability filter
- [x] Build Admin interface to manage interviewer profiles and skills
- [ ] (Future Phase) Migrate to Neo4j skill graph

---

### 7. Coding Challenge Engine
- [x] Integrate Monaco Editor on frontend
- [ ] Set up Docker sandbox containers for code execution
- [ ] Implement isolated container runtime
- [x] Add language support (JS, Python, Java, C++ flags)
- [x] Implement auto execution + result capture (Mocked result logic)
- [x] Implement time-bound session enforcement (Redis TTL)
- [ ] Add anti-cheating mechanisms
- [ ] Sandbox spin-up time optimization

---

### 8. Video & Recording
- [x] Integrate WebRTC for live interview sessions (UI + PeerJS integration)
- [x] Set up cloud storage bucket for recordings (Config added)
- [x] Implement async explanation video upload (Link API built)
- [x] Link recordings to interview session records
- [x] Allow HR to replay recordings from dashboard

---

### 9. Evaluation & Scoring
- [x] Build structured rubric evaluation form
- [x] Implement weighted scoring calculation logic
- [x] Generate scorecard on interview completion
- [x] Display scorecard + recommendation to HR
- [x] `GET /api/report/:sessionId` API
- [x] (Future) PDF export for reports

---

## Phase 3 – Premium Frontend & UI (Complete)

### 10. Design System & Global Styles
- [x] Set up global design tokens (colors, typography, spacing)
- [x] Implement dark mode as default premium theme
- [x] Configure Google Fonts (Inter + Outfit)
- [x] Build glassmorphism component library
- [x] Build base components: Button, Card, Input, Modal, Tabs, Badge

---

### 11. Animated Loader
- [x] Build 3D animated loader (SVG + Morphs)
- [x] Implement SVG morphing animation
- [x] Add smooth fade-in transition to main app
- [x] Brand the loader with HireFlow identity

---

### 12. Landing Page (3D Hero)
- [x] Set up Three.js + React Three Fiber
- [x] Build interactive 3D network graph hero
- [x] Add floating interview nodes
- [x] Implement dynamic camera movement
- [x] Add particle background (Stars/Cyberpunk)
- [x] Build motion-based hero section (GSAP)
- [x] Add entrance reveal animations (Framer Motion)
- [x] Implement parallax multi-layer scroll effects (Lenis)
- [x] Add animated stats counters section
- [x] Add scroll-driven section transitions

---

### 13. UI Interactions & Micro-Animations
- [x] Implement dynamic cursor distortion/reveal
- [x] Add button ripple/hover interactions
- [x] Add hover effects on all interactive elements
- [x] Implement glass hover cards for features
- [x] Add motion-based page transitions
- [x] Add dynamic gradient transitions on scroll
- [x] Build floating UI elements
- [x] Implement interactive skill graph visualization

---

## Phase 4 – Payments & Monetization (Next)

### 14. Payment Integration
- [ ] Set up payment gateway (Razorpay / Stripe)
- [ ] Per-interview payment flow (₹3,000–₹6,000)
- [ ] Bulk package purchasing
- [ ] Monthly subscription management
- [ ] Payment record data model + history view
- [ ] Interviewer payout system
- [ ] (Future) Hybrid per-hire commission model

---

## Phase 5 – DevOps, Security & Monitoring

### 15. Security Hardening
- [/] Enforce HTTPS everywhere (Helmet middleware)
- [ ] Docker isolation for code execution
- [ ] Encrypted storage for recordings
- [x] Implement audit logs for key actions
- [ ] Anti-cheating mechanisms for coding sessions

### 16. Monitoring & Analytics
- [ ] Set up error logging service (Sentry)
- [ ] Implement interview failure tracking
- [ ] Build system health dashboard (Admin)
- [ ] Basic revenue analytics view
- [ ] Track key success metrics (Booking rate, MRR, etc.)

---

## Phase 6 – Future / V2 Features
- [ ] XGBoost for hire success prediction
- [ ] Skill performance tracking
- [ ] Enterprise analytics dashboard
- [ ] Multi-currency payment support
- [ ] Multi-timezone full support
- [ ] LinkedIn / GitHub OAuth login
