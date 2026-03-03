import {
    Users,
    Briefcase,
    Calendar,
    TrendingUp,
    Clock,
    CheckCircle2
} from 'lucide-react';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon: Icon, trend, color }: any) => (
    <motion.div
        whileHover={{ y: -4 }}
        className="glass-card"
        style={{
            padding: '24px',
            flex: 1,
            minWidth: '240px',
            position: 'relative',
            overflow: 'hidden'
        }}
    >
        <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.05 }}>
            <Icon size={120} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div style={{
                padding: '10px',
                borderRadius: 'var(--radius-md)',
                background: `rgba(${color}, 0.1)`,
                color: `rgb(${color})`
            }}>
                <Icon size={20} />
            </div>
            {trend && (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    color: 'var(--color-success)',
                    fontSize: 'var(--text-xs)',
                    fontWeight: 'bold'
                }}>
                    <TrendingUp size={14} />
                    {trend}
                </div>
            )}
        </div>

        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>{title}</p>
        <h3 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--font-black)' }}>{value}</h3>
    </motion.div>
);

const HRDashboard = () => {
    const stats = [
        { title: 'Total Candidates', value: '1,284', icon: Users, trend: '+12%', color: '108, 60, 225' },
        { title: 'Active Job Roles', value: '24', icon: Briefcase, trend: '+5%', color: '59, 130, 246' },
        { title: 'Interviews Today', value: '12', icon: Calendar, color: '16, 185, 129' },
        { title: 'Average Score', value: '7.8', icon: CheckCircle2, color: '245, 158, 11' },
    ];

    const recentActivity = [
        { title: 'Senior Backend Engineer Interview', time: '2 hours ago', status: 'Completed', candidate: 'Arjun Sharma' },
        { title: 'Frontend Lead Scorecard Submitted', time: '4 hours ago', status: 'Pending Review', candidate: 'Priya Mehta' },
        { title: 'New Job Role Created: AI Specialist', time: 'Yesterday', status: 'Active', candidate: 'N/A' },
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <header>
                <h1 style={{ fontSize: 'var(--text-4xl)', fontWeight: 'var(--font-black)', marginBottom: '8px' }}>
                    HR <span className="gradient-text">Dashboard</span>
                </h1>
                <p style={{ color: 'var(--color-text-secondary)' }}>Welcome back, Raj. Here is what's happening today.</p>
            </header>

            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                {stats.map((stat, idx) => (
                    <StatCard key={idx} {...stat} />
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '32px' }}>
                <section className="glass-card" style={{ padding: '32px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)' }}>Hiring Pipeline</h2>
                        <button className="btn btn-ghost" style={{ padding: '8px 12px', fontSize: 'var(--text-xs)' }}>View All</button>
                    </div>

                    <div style={{ height: '300px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '20px', padding: '0 20px' }}>
                        {[60, 85, 45, 90, 65, 75, 55].map((h, i) => (
                            <motion.div
                                key={i}
                                initial={{ height: 0 }}
                                animate={{ height: `${h}%` }}
                                transition={{ delay: i * 0.1, duration: 0.8 }}
                                style={{
                                    flex: 1,
                                    background: 'linear-gradient(to top, var(--color-accent-primary), var(--color-accent-tertiary))',
                                    borderRadius: 'var(--radius-sm) var(--radius-sm) 0 0',
                                    position: 'relative'
                                }}
                            >
                                <div style={{ position: 'absolute', bottom: '-24px', left: '50%', transform: 'translateX(-50%)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>M T W T F S S'[i]</div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                <section className="glass-card" style={{ padding: '32px' }}>
                    <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)', marginBottom: '24px' }}>Recent Activity</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {recentActivity.map((activity, idx) => (
                            <div key={idx} style={{ display: 'flex', gap: '16px' }}>
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
                                    <Clock size={18} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <p style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)' }}>{activity.title}</p>
                                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                                        {activity.candidate !== 'N/A' && `${activity.candidate} · `}{activity.time}
                                    </p>
                                </div>
                                <div style={{
                                    fontSize: 'var(--text-xs)',
                                    padding: '4px 8px',
                                    borderRadius: 'var(--radius-sm)',
                                    background: activity.status === 'Completed' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                    color: activity.status === 'Completed' ? 'var(--color-success)' : 'var(--color-warning)',
                                    height: 'fit-content'
                                }}>
                                    {activity.status}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default HRDashboard;
