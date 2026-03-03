import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Briefcase,
    Users,
    Calendar,
    Video,
    FileCheck,
    Layers,
    LogOut,
    ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = () => {
    const menuItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/hr' },
        { name: 'Job Roles', icon: Briefcase, path: '/hr/jobs' },
        { name: 'Candidates', icon: Users, path: '/hr/candidates' },
        { name: 'Schedule', icon: Calendar, path: '/hr/schedule' },
        { name: 'Assessments', icon: Layers, path: '/hr/assessments' },
        { name: 'Interviews', icon: Video, path: '/hr/interviews' },
        { name: 'Scorecards', icon: FileCheck, path: '/hr/scorecards' },
    ];

    return (
        <motion.aside
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="sidebar glass-card"
            style={{
                width: '280px',
                height: 'calc(100vh - 40px)',
                margin: '20px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                position: 'fixed',
                left: 0,
                top: 0,
                zIndex: 100,
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-2xl)',
            }}
        >
            <div style={{ marginBottom: '40px', paddingLeft: '12px' }}>
                <h2 className="gradient-text" style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-black)', letterSpacing: '-0.02em' }}>
                    HireFlow
                </h2>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', marginTop: '4px' }}>
                    SaaS OS v1.0
                </p>
            </div>

            <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {menuItems.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        end={item.path === '/hr'}
                        style={({ isActive }) => ({
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '12px 16px',
                            borderRadius: 'var(--radius-lg)',
                            color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                            background: isActive ? 'var(--color-bg-tertiary)' : 'transparent',
                            textDecoration: 'none',
                            fontSize: 'var(--text-sm)',
                            fontWeight: isActive ? 'var(--font-semibold)' : 'var(--font-medium)',
                            transition: 'all 0.2s var(--ease-smooth)',
                            border: isActive ? '1px solid var(--color-border-accent)' : '1px solid transparent',
                            boxShadow: isActive ? 'var(--shadow-glow)' : 'none',
                        })}
                    >
                        <item.icon size={18} strokeWidth={2} />
                        <span style={{ flex: 1 }}>{item.name}</span>
                        <ChevronRight size={14} style={{ opacity: 0.3 }} />
                    </NavLink>
                ))}
            </nav>

            <div style={{ marginTop: 'auto', borderTop: '1px solid var(--color-border)', paddingTop: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px' }}>
                    <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--color-accent-primary), var(--color-accent-secondary))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 'var(--text-xs)',
                        fontWeight: 'bold'
                    }}>
                        RK
                    </div>
                    <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)' }}>Raj Krish</p>
                        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>HR Manager</p>
                    </div>
                    <button style={{ background: 'transparent', border: 'none', color: 'var(--color-error)', cursor: 'pointer', padding: '4px' }}>
                        <LogOut size={18} />
                    </button>
                </div>
            </div>
        </motion.aside>
    );
};

export default Sidebar;
