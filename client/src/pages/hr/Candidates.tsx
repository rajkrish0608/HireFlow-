import {
    Search,
    Filter,
    Download,
    Mail,
    Calendar,
    Star,
    MoreVertical
} from 'lucide-react';
import { motion } from 'framer-motion';

const Candidates = () => {
    const candidates = [
        { id: 1, name: 'Arjun Sharma', email: 'arjun@example.com', role: 'Senior Backend Engineer', status: 'Interviewing', score: 8.5, date: 'Mar 12, 10:00 AM' },
        { id: 2, name: 'Priya Mehta', email: 'priya@example.com', role: 'Frontend Lead', status: 'Passed', score: 9.2, date: 'Mar 10, 02:00 PM' },
        { id: 3, name: 'Rahul Verma', email: 'rahul@example.com', role: 'AI Specialist', status: 'Scheduled', score: null, date: 'Mar 15, 11:30 AM' },
        { id: 4, name: 'Sneha Kapur', email: 'sneha@example.com', role: 'Fullstack Dev', status: 'Challenge Pending', score: null, date: 'Awaiting completion' },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Passed': return 'var(--color-success)';
            case 'Interviewing': return 'var(--color-accent-tertiary)';
            case 'Scheduled': return 'var(--color-info)';
            case 'Challenge Pending': return 'var(--color-warning)';
            default: return 'var(--color-text-muted)';
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1 style={{ fontSize: 'var(--text-4xl)', fontWeight: 'var(--font-black)', marginBottom: '8px' }}>
                        Candidate <span className="gradient-text">Tracking</span>
                    </h1>
                    <p style={{ color: 'var(--color-text-secondary)' }}>Monitor candidate progress and access interview insights.</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn btn-ghost">
                        <Download size={18} />
                        Export CSV
                    </button>
                    <button className="btn btn-primary">
                        Invite Candidate
                    </button>
                </div>
            </header>

            <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
                <div style={{ padding: '24px', borderBottom: '1px solid var(--color-border)', display: 'flex', gap: '16px' }}>
                    <div style={{ flex: 1, position: 'relative' }}>
                        <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                        <input
                            type="text"
                            placeholder="Search by name, email or role..."
                            style={{
                                width: '100%',
                                background: 'var(--color-bg-secondary)',
                                border: '1px solid var(--color-border)',
                                borderRadius: 'var(--radius-lg)',
                                padding: '12px 16px 12px 48px',
                                color: 'var(--color-text-primary)'
                            }}
                        />
                    </div>
                    <button className="btn btn-ghost" style={{ padding: '0 16px' }}>
                        <Filter size={18} />
                    </button>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--color-border)' }}>
                            <th style={{ textAlign: 'left', padding: '16px 24px', fontSize: 'var(--text-xs)', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>Candidate</th>
                            <th style={{ textAlign: 'left', padding: '16px 24px', fontSize: 'var(--text-xs)', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>Hiring Role</th>
                            <th style={{ textAlign: 'left', padding: '16px 24px', fontSize: 'var(--text-xs)', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>Status</th>
                            <th style={{ textAlign: 'left', padding: '16px 24px', fontSize: 'var(--text-xs)', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>Last Milestone</th>
                            <th style={{ textAlign: 'left', padding: '16px 24px', fontSize: 'var(--text-xs)', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>Score</th>
                            <th style={{ textAlign: 'right', padding: '16px 24px' }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {candidates.map((c) => (
                            <motion.tr
                                key={c.id}
                                whileHover={{ background: 'rgba(255,255,255,0.02)' }}
                                style={{ borderBottom: '1px solid var(--color-border)', cursor: 'pointer', transition: 'background 0.2s' }}
                            >
                                <td style={{ padding: '20px 24px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{
                                            width: '36px',
                                            height: '36px',
                                            borderRadius: 'var(--radius-md)',
                                            background: 'var(--color-bg-tertiary)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'var(--color-accent-tertiary)',
                                            fontWeight: 'bold',
                                            fontSize: 'var(--text-xs)'
                                        }}>
                                            {c.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div>
                                            <p style={{ fontWeight: 'var(--font-bold)', color: 'var(--color-text-primary)' }}>{c.name}</p>
                                            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{c.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td style={{ padding: '20px 24px' }}>
                                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>{c.role}</p>
                                </td>
                                <td style={{ padding: '20px 24px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: getStatusColor(c.status) }}></div>
                                        <span style={{ fontSize: 'var(--text-sm)', color: getStatusColor(c.status), fontWeight: 'var(--font-semibold)' }}>{c.status}</span>
                                    </div>
                                </td>
                                <td style={{ padding: '20px 24px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-muted)' }}>
                                        <Calendar size={14} />
                                        <span style={{ fontSize: 'var(--text-xs)' }}>{c.date}</span>
                                    </div>
                                </td>
                                <td style={{ padding: '20px 24px' }}>
                                    {c.score ? (
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px',
                                            color: 'var(--color-accent-tertiary)',
                                            fontWeight: 'bold'
                                        }}>
                                            <Star size={14} fill="currentColor" />
                                            {c.score}
                                        </div>
                                    ) : (
                                        <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)' }}>pending</span>
                                    )}
                                </td>
                                <td style={{ padding: '20px 24px', textAlign: 'right' }}>
                                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                                        <button style={{ background: 'transparent', border: 'none', color: 'var(--color-accent-primary)', cursor: 'pointer' }}>
                                            <Mail size={16} />
                                        </button>
                                        <button style={{ background: 'transparent', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}>
                                            <MoreVertical size={16} />
                                        </button>
                                    </div>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Candidates;
