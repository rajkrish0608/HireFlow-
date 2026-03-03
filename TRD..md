# HireFlow – Technical Requirements Document (TRD)

## 1. System Architecture Overview

Architecture Type: Modular SaaS (Microservice-ready)

Core Layers:
- Frontend (Premium UI)
- Backend API Layer
- Interviewer Matching Engine
- Coding Execution Engine
- Storage Layer
- Analytics Engine

---

## 2. Functional Requirements

### 2.1 Authentication
- JWT-based authentication
- Role-based access control
    - HR
    - Interviewer
    - Admin

### 2.2 Interview Scheduling
- Calendar integration
- Time zone handling
- Auto email notification

### 2.3 Coding Environment
- Secure Docker containers
- Language support (JS, Python, Java, C++)
- Auto execution + result capture
- Time-bound sessions

### 2.4 Evaluation Engine
- Structured rubric scoring
- Weighted scoring logic
- Report generation (PDF export future phase)

### 2.5 Matching Engine
- Skill-tag mapping
- Experience weight
- Availability filter
- Rating-based ranking

---

## 3. Non-Functional Requirements

### 3.1 Performance
- < 2s dashboard load time
- Coding sandbox spin-up < 5s
- Handle 500+ concurrent sessions (Phase 2)

### 3.2 Security
- HTTPS enforced
- Encrypted storage
- Docker isolation
- Anti-cheating mechanisms
- Audit logs

### 3.3 Scalability
- Horizontal scaling via container orchestration
- Stateless backend services

### 3.4 Reliability
- 99% uptime target
- Daily backups
- Auto retry for critical tasks

---

## 4. Data Model Overview

Entities:
- User
- Company
- Interviewer
- Candidate
- Job Role
- Interview Session
- Scorecard
- Payment Record

---

## 5. APIs (High-Level)

- POST /auth/login
- POST /jobs/create
- GET /interviewer/match
- POST /interview/schedule
- POST /scorecard/submit
- GET /report/download

---

## 6. Deployment Strategy

Phase 1:
- Single cloud instance
- Manual scaling

Phase 2:
- Containerized deployment
- Load balancing
- CI/CD pipeline

---

## 7. Monitoring

- Error logging
- Interview failure tracking
- Revenue analytics
- System health dashboard