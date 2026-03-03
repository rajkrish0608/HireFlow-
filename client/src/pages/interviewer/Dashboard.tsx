import {
    Calendar,
    DollarSign,
    Award,
    Play,
    FileText,
    History
} from 'lucide-react';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <motion.div
        whileHover={{ y: -4 }}
        className="glass-card"
        style={{
            padding: '24px',
            flex: 1,
            minWidth: '220px',
            border: `1px solid rgba(${color}, 0.2)`
        }}
    >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div style={{ padding: '10px', borderRadius: 'var(--radius-md)', background: `rgba(${color}, 0.1)`, color: `rgb(${color})` }}>
                <Icon size={20} />
            </div>
        </div>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>{title}</p>
        <h3 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-black)' }}>{value}</h3>
    </motion.div>
);

const InterviewerDashboard = () => {
    const upcomingInterviews = [
        { id: 1, candidate: 'Amit Patel', role: 'Backend Engineer', time: 'Today, 2:00 PM', duration: '60 min', type: 'System Design' },
        { id: 2, candidate: 'Sarah Chen', role: 'Frontend Lead', time: 'Tomorrow, 10:30 AM', duration: '45 min', type: 'React/UI' },
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <header>
                <h1 style={{ fontSize: 'var(--text-4xl)', fontWeight: 'var(--font-black)', marginBottom: '8px' }}>
                    Welcome back, <span className="gradient-text">Expert</span>
                </h1>
                <p style={{ color: 'var(--color-text-secondary)' }}>You have 2 interviews scheduled for the next 24 hours.</p>
            </header>

            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                <StatCard title="Total Earnings" value="$2,450" icon={DollarSign} color="16, 185, 129" />
                <StatCard title="Interviews Done" value="42" icon={Award} color="108, 60, 225" />
                <StatCard title="Average Rating" value="4.9/5" icon={Award} color="245, 158, 11" />
                <StatCard title="Pending Reports" value="1" icon={FileText} color="59, 130, 246" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '32px' }}>
                <section className="glass-card" style={{ padding: '32px' }}>
                    <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Calendar size={20} /> Upcoming Schedule
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {upcomingInterviews.map((item) => (
                            <div key={item.id} className="glass-card" style={{ padding: '20px', background: 'var(--color-bg-primary)', display: 'flex', alignItems: 'center', gap: '20px' }}>
                                <div style={{
                                    width: '50px',
                                    height: '50px',
                                    borderRadius: 'var(--radius-md)',
                                    background: 'var(--color-bg-tertiary)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '1px solid var(--color-border)'
                                }}>
                                    <span style={{ fontSize: '10px', fontWeight: 'bold', color: 'var(--color-accent-tertiary)' }}>MAR</span>
                                    <span style={{ fontSize: '18px', fontWeight: 'var(--font-black)' }}>13</span>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <p style={{ fontWeight: 'var(--font-bold)', fontSize: 'var(--text-md)' }}>{item.candidate}</p>
                                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{item.role} · {item.type}</p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)' }}>{item.time}</p>
                                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{item.duration}</p>
                                </div>
                                <button className="btn btn-primary" style={{ padding: '10px 20px', fontSize: 'var(--text-xs)' }}>
                                    <Play size={14} /> Join Room
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="glass-card" style={{ padding: '32px' }}>
                    <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <History size={20} /> Earning History
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {[
                            { date: 'Mar 10', amount: '$150', status: 'Paid' },
                            { date: 'Mar 08', amount: '$150', status: 'Paid' },
                            { date: 'Mar 05', amount: '$200', status: 'Processing' },
                        ].map((entry, idx) => (
                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--color-border)' }}>
                                <div>
                                    <p style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)' }}>Interview Payment</p>
                                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{entry.date}</p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-bold)', color: 'var(--color-success)' }}>{entry.amount}</p>
                                    <p style={{ fontSize: '10px', color: entry.status === 'Paid' ? 'var(--color-success)' : 'var(--color-warning)' }}>{entry.status}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="btn btn-ghost" style={{ width: '100%', marginTop: '24px' }}>View Full Statement</button>
                </section>
            </div>
        </div>
    );
};

export default InterviewerDashboard;
