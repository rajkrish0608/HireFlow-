
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import HRDashboard from './pages/hr/Dashboard';
import JobRoles from './pages/hr/JobRoles';
import Candidates from './pages/hr/Candidates';
import CalendarView from './pages/hr/Calendar';
import ScorecardReport from './pages/hr/ScorecardReport';
import InterviewerDashboard from './pages/interviewer/Dashboard';
import CodingEngine from './pages/shared/CodingEngine';
import EvaluationForm from './pages/shared/EvaluationForm';
import InterviewRoom from './pages/shared/InterviewRoom';

// Handles OAuth redirect tokens from server
function OAuthCallback() {
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');
  if (token) localStorage.setItem('token', token);
  return <Navigate to="/hr" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ─── Public Routes ─────────────────────────────── */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />

        {/* ─── HR Dashboard ──────────────────────────────── */}
        <Route path="/hr" element={<Layout />}>
          <Route index element={<HRDashboard />} />
          <Route path="jobs" element={<JobRoles />} />
          <Route path="candidates" element={<Candidates />} />
          <Route path="schedule" element={<CalendarView />} />
          <Route path="assessments" element={<div className="glass-card" style={{ padding: '32px' }}><h1>Assessments</h1></div>} />
          <Route path="interviews" element={<div className="glass-card" style={{ padding: '32px' }}><h1>Interviews &amp; Recordings</h1></div>} />
          <Route path="scorecards" element={<ScorecardReport />} />
        </Route>

        {/* ─── Interviewer Dashboard ─────────────────────── */}
        <Route path="/interviewer" element={<Layout />}>
          <Route index element={<InterviewerDashboard />} />
          <Route path="eval" element={<EvaluationForm />} />
        </Route>

        {/* ─── Technical / Shared Views ──────────────────── */}
        <Route path="/engine" element={<div style={{ padding: '20px' }}><CodingEngine /></div>} />
        <Route path="/room" element={<InterviewRoom />} />

        {/* ─── OAuth callback ────────────────────────────── */}
        <Route path="/oauth/callback" element={<OAuthCallback />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
