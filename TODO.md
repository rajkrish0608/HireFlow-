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

## Phase 4 – Payments & Monetization (Complete)

### 14. Payment Integration
- [x] Set up payment gateway (Razorpay – `server/src/lib/razorpay.ts`)
- [x] Per-interview payment flow (₹3,000 Standard / ₹6,000 Premium)
- [x] Bulk package purchasing (5-pack ₹12,500 / 10-pack ₹20,000)
- [x] Monthly subscription management (Starter ₹15k / Growth ₹25k/mo)
- [x] Payment record data model + history view (`GET /api/payments/history`)
- [x] Interviewer payout system (`POST /api/payments/payout` with IFSC validation)
- [x] Billing UI page for HR dashboard (Billing.tsx + Billing.css)
- [x] Razorpay webhook handler for server-side payment confirmation
- [ ] (Future) Hybrid per-hire commission model

---

## Phase 5 – DevOps, Security & Monitoring (Complete)

### 15. Security Hardening
- [x] Enforce HTTPS everywhere (Helmet middleware)
- [x] Rate limiting – 3 tiers: API (100/15m), Auth (10/15m), Payments (20/15m)
- [x] Request ID tracing (X-Request-ID) for distributed log correlation
- [x] Docker sandbox isolation for code execution (`docker-compose.sandbox.yml` – JS/Python/Java/C++)
- [x] Encrypted storage for recordings & PII (`server/src/lib/crypto.ts` – AES-256-GCM)
- [x] Implement audit logs for key actions
- [x] Anti-cheat middleware for coding sessions (tab-switch, copy-paste, speed detection, devtools – Redis-backed)

### 16. Scalability & Reliability
- [x] Graceful shutdown handler (SIGTERM/SIGINT – pool/redis cleanup)
- [x] Structured request logger with timing + color-coded output
- [x] Stateless backend (JWT, no server-side sessions)

### 17. Monitoring & Analytics (Admin Dashboard)
- [x] `GET /api/admin/health` – DB/Redis latency, memory usage, uptime
- [x] `GET /api/admin/stats` – Users, companies, interviews, completion rate
- [x] `GET /api/admin/revenue` – Total/30-day revenue, by-type breakdown
- [x] `GET /api/admin/failures` – Cancellation rate, recent failures
- [x] `GET /api/admin/audit-logs` – Paginated audit log viewer
- [x] `GET /api/admin/anticheat/:sessionId` – Anti-cheat violation report

---

## Phase 6 – V2 Features (Complete)

### 18. ML & Intelligence Layer
- [x] Hire success prediction engine – weighted rule-based scoring (rubric 40%, recommendation 25%, skill alignment 20%, experience 15%)
- [x] `POST /api/ml/predict` – returns score (0–100), confidence (HIGH/MEDIUM/LOW), and recommendation (PROCEED/REVIEW/PASS)

### 19. Skill Performance Tracking
- [x] Per-skill timeline analysis with trend detection (IMPROVING/STABLE/DECLINING)
- [x] `GET /api/skills/performance?candidateId=` – aggregated skill scores over time
- [x] `GET /api/skills/leaderboard` – top interviewers by rating

### 20. Enterprise Analytics Dashboard
- [x] `GET /api/enterprise/analytics?companyId=` – hiring funnel, cost-per-hire, time-to-hire, top skills, conversion rate

### 21. Multi-Currency Payment Support
- [x] INR, USD, EUR, GBP support with exchange rates (`server/src/lib/currency.ts`)
- [x] `GET /api/currencies` – returns supported currencies + rates
- [x] `getMultiCurrencyPrice()` – converts any package price to all currencies

### 22. Multi-Timezone Full Support
- [x] `X-Timezone` header parsing middleware (`server/src/middleware/timezone.ts`)
- [x] `toClientTimezone()` – UTC → client timezone conversion
- [x] `GET /api/timezones` – curated IANA timezone dropdown options

### 23. LinkedIn / GitHub OAuth Login
- [x] Passport.js with GitHub + LinkedIn strategies (`server/src/lib/oauth.ts`)
- [x] `GET /api/auth/github` & `/api/auth/linkedin` – OAuth redirect
- [x] Callback routes → JWT token → frontend redirect
- [x] Auto-creates user accounts on first OAuth login

