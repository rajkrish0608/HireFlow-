import React, { useState } from 'react';
import {
    Plus,
    Search,
    Filter,
    MoreVertical,
    Users,
    Briefcase,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CreateJobForm from '../../components/CreateJobForm';

const JobRoles = () => {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [jobs] = useState([
        { id: 1, title: 'Senior Backend Engineer', company: 'Acme Corp', status: 'Active', candidates: 48, skills: ['Node.js', 'PostgreSQL', 'TypeScript'], seniority: 'Senior' },
        { id: 2, title: 'Frontend Lead', company: 'Stark Ind.', status: 'Active', candidates: 32, skills: ['React', 'Three.js', 'Framer Motion'], seniority: 'Lead' },
        { id: 3, title: 'AI Specialist', company: 'Cyberdyne', status: 'Closed', candidates: 124, skills: ['Python', 'PyTorch', 'System Design'], seniority: 'Senior' },
        { id: 4, title: 'Fullstack Developer', company: 'Wayne Ent.', status: 'Draft', candidates: 0, skills: ['Next.js', 'PostgreSQL', 'AWS'], seniority: 'Mid-level' },
    ]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1 style={{ fontSize: 'var(--text-4xl)', fontWeight: 'var(--font-black)', marginBottom: '8px' }}>
                        Job <span className="gradient-text">Roles</span>
                    </h1>
                    <p style={{ color: 'var(--color-text-secondary)' }}>Manage your active job roles and track hiring progress.</p>
                </div>
                <button
                    className="btn btn-primary"
                    style={{ padding: '12px 24px' }}
                    onClick={() => setShowCreateModal(true)}
                >
                    <Plus size={20} />
                    Create New Role
                </button>
            </header>

            <AnimatePresence>
                {showCreateModal && <CreateJobForm onClose={() => setShowCreateModal(false)} />}
            </AnimatePresence>

            <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
                <div style={{ padding: '24px', borderBottom: '1px solid var(--color-border)', display: 'flex', gap: '16px' }}>
                    <div style={{ flex: 1, position: 'relative' }}>
                        <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                        <input
                            type="text"
                            placeholder="Filter by title, company or skill..."
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
                            <th style={{ textAlign: 'left', padding: '16px 24px', fontSize: 'var(--text-xs)', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>Role Info</th>
                            <th style={{ textAlign: 'left', padding: '16px 24px', fontSize: 'var(--text-xs)', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>Skills</th>
                            <th style={{ textAlign: 'left', padding: '16px 24px', fontSize: 'var(--text-xs)', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>Candidates</th>
                            <th style={{ textAlign: 'left', padding: '16px 24px', fontSize: 'var(--text-xs)', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>Status</th>
                            <th style={{ textAlign: 'right', padding: '16px 24px' }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {jobs.map((job) => (
                            <motion.tr
                                key={job.id}
                                whileHover={{ background: 'rgba(255,255,255,0.02)' }}
                                style={{ borderBottom: '1px solid var(--color-border)', cursor: 'pointer', transition: 'background 0.2s' }}
                            >
                                <td style={{ padding: '20px 24px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: 'var(--radius-md)',
                                            background: 'var(--color-bg-tertiary)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'var(--color-accent-tertiary)'
                                        }}>
                                            <Briefcase size={18} />
                                        </div>
                                        <div>
                                            <p style={{ fontWeight: 'var(--font-bold)', color: 'var(--color-text-primary)' }}>{job.title}</p>
                                            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{job.company} · {job.seniority}</p>
                                        </div>
                                    </div>
                                </td>
                                <td style={{ padding: '20px 24px' }}>
                                    <div style={{ display: 'flex', gap: '6px' }}>
                                        {job.skills.map((skill, si) => (
                                            <span key={si} style={{
                                                fontSize: '10px',
                                                padding: '2px 8px',
                                                background: 'var(--color-bg-tertiary)',
                                                border: '1px solid var(--color-border)',
                                                borderRadius: 'var(--radius-full)',
                                                color: 'var(--color-text-secondary)'
                                            }}>{skill}</span>
                                        ))}
                                    </div>
                                </td>
                                <td style={{ padding: '20px 24px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Users size={14} style={{ color: 'var(--color-text-muted)' }} />
                                        <span style={{ fontSize: 'var(--text-sm)' }}>{job.candidates}</span>
                                    </div>
                                </td>
                                <td style={{ padding: '20px 24px' }}>
                                    <span style={{
                                        fontSize: '10px',
                                        fontWeight: 'bold',
                                        padding: '4px 8px',
                                        borderRadius: 'var(--radius-sm)',
                                        textTransform: 'uppercase',
                                        background: job.status === 'Active' ? 'rgba(16, 185, 129, 0.1)' : job.status === 'Closed' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(160, 160, 192, 0.1)',
                                        color: job.status === 'Active' ? 'var(--color-success)' : job.status === 'Closed' ? 'var(--color-error)' : 'var(--color-text-muted)',
                                    }}>
                                        {job.status}
                                    </span>
                                </td>
                                <td style={{ padding: '20px 24px', textAlign: 'right' }}>
                                    <button style={{ background: 'transparent', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}>
                                        <MoreVertical size={18} />
                                    </button>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default JobRoles;
