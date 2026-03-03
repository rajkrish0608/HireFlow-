# HireFlow – Master Todo List

> Derived from PRD, Tech Stack, and TRD documents.
> Legend: `[ ]` = Todo | `[/]` = In Progress | `[x]` = Done

---

## Phase 1 – Foundation & Core Infrastructure

### 1. Project Setup & Architecture
- [ ] Initialize React + Vite project
- [ ] Set up TypeScript across frontend and backend
- [ ] Configure CSS Modules / Styled Components (no Tailwind)
- [ ] Define folder structure (modular microservice-ready layout)
- [ ] Set up Node.js backend (Fastify or Express) with TypeScript
- [ ] Configure PostgreSQL database connection
- [ ] Configure Redis for caching
- [ ] Set up Docker for local development
- [ ] Configure Nginx reverse proxy
- [ ] Set up CI/CD pipeline (GitHub Actions or similar)
- [ ] Set up cloud provider (AWS or GCP) for deployment

---

### 2. Authentication & Role Management
- [ ] Design User data model (User, Company, Interviewer, Candidate)
- [ ] Implement JWT-based authentication
- [ ] Implement role-based access control (RBAC):
  - [ ] HR role
  - [ ] Interviewer role
  - [ ] Admin role
- [ ] Build `POST /auth/login` API endpoint
- [ ] Build `POST /auth/register` API endpoint
- [ ] Add HTTPS enforcement
- [ ] Add audit logging for auth events
- [ ] (Future) OAuth integration – LinkedIn / GitHub

---

### 3. Database & Data Models
- [ ] Design and create schema for all entities:
  - [ ] User
  - [ ] Company
  - [ ] Interviewer
  - [ ] Candidate
  - [ ] Job Role
  - [ ] Interview Session
  - [ ] Scorecard
  - [ ] Payment Record
- [ ] Set up database migrations
- [ ] Seed data for development/testing
- [ ] Set up encrypted storage for sensitive data
- [ ] Configure daily automated backups

---

## Phase 2 – Core Features

### 4. HR Dashboard
- [ ] Build HR dashboard layout and navigation
- [ ] Job Role creation & management:
  - [ ] `POST /jobs/create` API
  - [ ] Required skills input (tag-based)
  - [ ] Job role listing and status view
- [ ] Interview scheduling module:
  - [ ] `POST /interview/schedule` API
  - [ ] Calendar integration (date/time picker)
  - [ ] Timezone handling
  - [ ] Automated email notifications on scheduling
- [ ] Candidate status tracking view
- [ ] Access to interview recordings
- [ ] Access to scorecards and reports
- [ ] Dashboard load time optimization (< 2s target)

---

### 5. Interviewer Dashboard
- [ ] Build Interviewer dashboard layout
- [ ] Accept / Decline interview requests
- [ ] View upcoming interview schedule
- [ ] Evaluation form submission:
  - [ ] Structured rubric scoring
  - [ ] Weighted scoring logic
  - [ ] `POST /scorecard/submit` API
- [ ] Earnings dashboard (per interview + history)

---

### 6. Interviewer Matching Engine
- [ ] Design skill-tag mapping system
- [ ] Build `GET /interviewer/match` API
- [ ] Implement rule-based matching logic:
  - [ ] Skill-tag matching against job role
  - [ ] Experience weight scoring
  - [ ] Availability filter
  - [ ] Rating-based ranking
- [ ] Build Admin interface to manage interviewer profiles and skills
- [ ] (Future Phase) Migrate to Neo4j skill graph

---

### 7. Coding Challenge Engine
- [ ] Integrate CodeMirror or Monaco Editor on frontend
- [ ] Set up Docker sandbox containers for code execution
- [ ] Implement isolated container runtime
- [ ] Add language support:
  - [ ] JavaScript
  - [ ] Python
  - [ ] Java
  - [ ] C++
- [ ] Implement auto execution + result capture
- [ ] Implement time-bound session enforcement (30–60 min)
- [ ] Add anti-cheating mechanisms
- [ ] Sandbox spin-up time optimization (< 5s target)

---

### 8. Video & Recording
- [ ] Integrate WebRTC for live interview sessions
- [ ] Set up cloud storage bucket for recordings
- [ ] Implement async explanation video upload
- [ ] Link recordings to interview session records
- [ ] Allow HR to replay recordings from dashboard

---

### 9. Evaluation & Scoring
- [ ] Build structured rubric evaluation form (linked to job role skills)
- [ ] Implement weighted scoring calculation logic
- [ ] Generate scorecard on interview completion
- [ ] Display scorecard + recommendation to HR
- [ ] `GET /report/download` API
- [ ] (Future) PDF export for reports

---

## Phase 3 – Premium Frontend & UI

### 10. Design System & Global Styles
- [ ] Set up global design tokens (colors, typography, spacing)
- [ ] Implement dark mode as default theme
- [ ] Configure Google Fonts (Inter or similar)
- [ ] Build glassmorphism component library
- [ ] Build base components: Button, Card, Input, Modal, Tabs, Badge

---

### 11. Animated Loader
- [ ] Build 3D animated loader
- [ ] Implement SVG morphing animation
- [ ] Add smooth fade-in transition to main app
- [ ] Brand the loader with HireFlow identity

---

### 12. Landing Page (3D Hero)
- [ ] Set up Three.js + React Three Fiber
- [ ] Build interactive 3D globe / network graph
- [ ] Add floating interview nodes
- [ ] Implement dynamic camera movement
- [ ] Add particle background
- [ ] Build motion-based hero section (GSAP)
- [ ] Add entrance reveal animations (Framer Motion)
- [ ] Implement parallax multi-layer scroll effects (Lenis + GSAP ScrollTrigger)
- [ ] Add animated stats counters section
- [ ] Add scroll-driven section transitions

---

### 13. UI Interactions & Micro-Animations
- [ ] Implement dynamic cursor distortion effect
- [ ] Add button ripple interactions
- [ ] Add hover effects on all interactive elements
- [ ] Implement glass hover cards for features/pricing
- [ ] Add motion-based page transitions (React Spring / Framer Motion)
- [ ] Add dynamic gradient transitions on scroll
- [ ] Build floating UI elements for key sections
- [ ] Implement interactive skill graph visualization

---

## Phase 4 – Payments & Monetization

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
- [ ] Enforce HTTPS everywhere
- [ ] Docker isolation for code execution
- [ ] Encrypted storage for recordings and PII
- [ ] Implement audit logs for key actions
- [ ] Anti-cheating mechanisms for coding sessions

### 16. Scalability & Reliability
- [ ] Ensure stateless backend services
- [ ] Configure horizontal scaling via container orchestration
- [ ] Set up load balancing (Phase 2)
- [ ] Implement auto retry logic for critical background tasks
- [ ] 99% uptime monitoring setup

### 17. Monitoring & Analytics
- [ ] Set up error logging service (Sentry or similar)
- [ ] Implement interview failure tracking
- [ ] Build system health dashboard (Admin)
- [ ] Basic revenue analytics view
- [ ] Track key success metrics:
  - [ ] Interview booking rate
  - [ ] Interview completion rate
  - [ ] Time-to-hire
  - [ ] MRR
  - [ ] Cost per hire

---

## Phase 6 – Future / V2 Features

### 18. ML & Intelligence Layer
- [ ] Integrate XGBoost for hire success prediction
- [ ] Skill performance tracking over time
- [ ] ML-based hire recommendation scoring

### 19. Enterprise Features
- [ ] Enterprise analytics dashboard
- [ ] PDF report exports
- [ ] Bulk hiring package management
- [ ] Performance feedback loop integration

### 20. Global Expansion
- [ ] Multi-currency payment support
- [ ] Multi-timezone full support
- [ ] (Future) LinkedIn / GitHub OAuth login
- [ ] Localization / i18n support

---

> **Note:** Phase 1 & 2 are MVP scope. Phase 3 frontend work can run in parallel.
> Phase 4–6 are post-MVP or v2 scope.
