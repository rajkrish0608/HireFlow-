import './index.css';

function App() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '2rem', padding: '2rem' }}>
      <div style={{ textAlign: 'center', maxWidth: '640px' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--color-accent-tertiary)', letterSpacing: '0.2em', marginBottom: '1.5rem', textTransform: 'uppercase' }}>
          Technical Interview-as-a-Service
        </p>
        <h1 style={{ fontSize: 'var(--text-6xl)', fontWeight: 'var(--font-black)', lineHeight: 1.05, marginBottom: '1.5rem' }}>
          <span className="gradient-text">HireFlow</span>
        </h1>
        <p style={{ fontSize: 'var(--text-xl)', color: 'var(--color-text-secondary)', marginBottom: '2.5rem', lineHeight: 1.7 }}>
          Hire smarter. Faster. Without compromise.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="#" className="btn btn-primary">Get Started</a>
          <a href="#" className="btn btn-ghost">View Demo</a>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '1.5rem 2rem', marginTop: '2rem' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
          <span style={{ color: 'var(--color-success)' }}>●</span> API running at{' '}
          <span style={{ color: 'var(--color-accent-tertiary)' }}>http://localhost:4000</span>
          {' '}· Phase 1 Foundation Complete
        </p>
      </div>
    </div>
  );
}

export default App;
