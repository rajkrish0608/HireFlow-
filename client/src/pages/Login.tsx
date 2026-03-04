import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Login.css';

export default function Login() {
    const navigate = useNavigate();
    const [tab, setTab] = useState<'login' | 'register'>('login');
    const [form, setForm] = useState({ email: '', password: '', role: 'HR' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const url = `${import.meta.env.VITE_API_URL || 'http://localhost:4000/api'}/auth/${tab}`;
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Authentication failed');
            localStorage.setItem('token', data.data?.token || '');
            localStorage.setItem('role', data.data?.user?.role || 'HR');
            if (data.data?.user?.role === 'INTERVIEWER') navigate('/interviewer');
            else navigate('/hr');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Demo quick-logins
    const quickLogin = (email: string, password: string) => {
        setForm(f => ({ ...f, email, password }));
        setTab('login');
    };

    return (
        <div className="login-page">
            {/* Background glow effects */}
            <div className="login-glow login-glow--1" />
            <div className="login-glow login-glow--2" />

            <motion.div
                className="login-card glass-card"
                initial={{ opacity: 0, y: 32, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
            >
                {/* Logo */}
                <div className="login-logo" onClick={() => navigate('/')}>
                    <span className="logo-icon-lg">⬡</span>
                    <span className="login-brand gradient-text">HireFlow</span>
                </div>

                <h1 className="login-title">
                    {tab === 'login' ? 'Welcome back' : 'Create your account'}
                </h1>
                <p className="login-sub">
                    {tab === 'login' ? 'Sign in to your HireFlow dashboard' : 'Start hiring smarter today'}
                </p>

                {/* Tab switchers */}
                <div className="login-tabs">
                    <button className={`login-tab ${tab === 'login' ? 'login-tab--active' : ''}`} onClick={() => setTab('login')}>Sign In</button>
                    <button className={`login-tab ${tab === 'register' ? 'login-tab--active' : ''}`} onClick={() => setTab('register')}>Register</button>
                    <div className="tab-slider" style={{ transform: `translateX(${tab === 'login' ? '0' : '100%'})` }} />
                </div>

                {/* OAuth Buttons */}
                <div className="oauth-buttons">
                    <a href="http://localhost:4000/api/auth/github" className="oauth-btn">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" /></svg>
                        Continue with GitHub
                    </a>
                    <a href="http://localhost:4000/api/auth/linkedin" className="oauth-btn">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                        Continue with LinkedIn
                    </a>
                </div>

                <div className="divider"><span>or continue with email</span></div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="login-form">
                    {tab === 'register' && (
                        <div className="form-group">
                            <label className="form-label">Role</label>
                            <div className="role-select">
                                {(['HR', 'INTERVIEWER'] as const).map(r => (
                                    <button
                                        key={r}
                                        type="button"
                                        className={`role-btn ${form.role === r ? 'role-btn--active' : ''}`}
                                        onClick={() => setForm(f => ({ ...f, role: r }))}
                                    >
                                        {r === 'HR' ? '🏢 HR Manager' : '👨‍💻 Interviewer'}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            placeholder="you@company.com"
                            className="form-input"
                            value={form.email}
                            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            className="form-input"
                            value={form.password}
                            onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                            required
                        />
                    </div>

                    {error && (
                        <motion.div
                            className="login-error"
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            {error}
                        </motion.div>
                    )}

                    <button type="submit" className="btn btn-primary login-submit" disabled={loading}>
                        {loading ? <span className="login-spinner" /> : (tab === 'login' ? 'Sign In →' : 'Create Account →')}
                    </button>
                </form>

                {/* Quick login hints */}
                <div className="quick-logins">
                    <p className="quick-title">Quick Login (Demo)</p>
                    <div className="quick-btns">
                        <button className="quick-btn" onClick={() => quickLogin('hr@acme.dev', 'Hr@12345')}>HR Manager</button>
                        <button className="quick-btn" onClick={() => quickLogin('admin@hireflow.dev', 'Admin@123')}>Admin</button>
                        <button className="quick-btn" onClick={() => quickLogin('senior.dev@hireflow.dev', 'Inter@123')}>Interviewer</button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
