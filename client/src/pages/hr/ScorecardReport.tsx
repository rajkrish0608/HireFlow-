import {
    Award,
    CheckCircle2,
    Clock,
    Download,
    Share2,
    BarChart3,
    MessageSquare,
    Zap,
    Star as StarIcon
} from 'lucide-react';

const ScorecardReport = () => {
    const scores = [
        { label: 'Technical Depth', value: 92, color: 'var(--color-accent-tertiary)' },
        { label: 'Problem Solving', value: 85, color: 'var(--color-success)' },
        { label: 'Communication', value: 78, color: 'var(--color-info)' },
        { label: 'Cultural Fit', value: 95, color: 'var(--color-warning)' },
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '1000px', margin: '0 auto' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <Award size={32} className="gradient-text" />
                        <h1 style={{ fontSize: 'var(--text-4xl)', fontWeight: 'var(--font-black)' }}>Interview <span className="gradient-text">Report</span></h1>
                    </div>
                    <p style={{ color: 'var(--color-text-secondary)' }}>Final assessment for Arjun Sharma (Senior Backend Engineer)</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn btn-ghost"><Share2 size={18} /></button>
                    <button className="btn btn-primary"><Download size={18} /> Export PDF</button>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '32px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    {/* Summary Card */}
                    <section className="glass-card" style={{ padding: '32px', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: '24px', right: '32px', textAlign: 'right' }}>
                            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 'bold' }}>Recommendation</p>
                            <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-black)', color: 'var(--color-success)' }}>STRONG HIRE</h2>
                        </div>

                        <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)', marginBottom: '24px' }}>Executive Summary</h2>
                        <p style={{ lineHeight: '1.6', color: 'var(--color-text-secondary)', fontSize: 'var(--text-md)' }}>
                            Arjun demonstrated exceptional depth in distributed systems and Node.js performance tuning.
                            His approach to the "Longest Palindrome" challenge was optimal (O(n) time complexity)
                            and he communicated his architectural decisions with high clarity.
                        </p>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginTop: '40px' }}>
                            {scores.map((s, i) => (
                                <div key={i} style={{ textAlign: 'center' }}>
                                    <div style={{ position: 'relative', width: '80px', height: '80px', margin: '0 auto 12px' }}>
                                        <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%' }}>
                                            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                                            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={s.color} strokeWidth="3" strokeDasharray={`${s.value}, 100`} />
                                        </svg>
                                        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--text-sm)', fontWeight: 'bold' }}>
                                            {s.value}%
                                        </div>
                                    </div>
                                    <p style={{ fontSize: 'var(--text-xs)', fontWeight: 'bold', color: 'var(--color-text-muted)' }}>{s.label}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Technical Deep Dive */}
                    <section className="glass-card" style={{ padding: '32px' }}>
                        <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Zap size={20} /> Technical Feedback
                        </h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ padding: '20px', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: 'var(--radius-md)' }}>
                                <p style={{ fontWeight: 'bold', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <CheckCircle2 size={16} color="var(--color-success)" /> Key Strengths
                                </p>
                                <ul style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', paddingLeft: '20px' }}>
                                    <li>Excellent understanding of Node.js Event Loop</li>
                                    <li>Writes highly readable and maintainable TypeScript</li>
                                    <li>Strong grasp of database indexing strategies</li>
                                </ul>
                            </div>
                        </div>
                    </section>
                </div>

                <aside style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    <div className="glass-card" style={{ padding: '24px' }}>
                        <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 'bold', marginBottom: '16px' }}>Interview Metadata</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <Clock size={16} color="var(--color-text-muted)" />
                                <div>
                                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Duration</p>
                                    <p style={{ fontSize: 'var(--text-sm)', fontWeight: 'bold' }}>58 minutes</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <BarChart3 size={16} color="var(--color-text-muted)" />
                                <div>
                                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Percentile</p>
                                    <p style={{ fontSize: 'var(--text-sm)', fontWeight: 'bold' }}>Top 5%</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <StarIcon size={16} color="var(--color-text-muted)" />
                                <div>
                                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Overall Score</p>
                                    <p style={{ fontSize: 'var(--text-sm)', fontWeight: 'bold' }}>9.2 / 10</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card" style={{ padding: '24px' }}>
                        <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 'bold', marginBottom: '16px' }}>Expert Notes</h3>
                        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--color-accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold' }}>RK</div>
                            <div style={{ flex: 1, padding: '12px', background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                                "Highly recommended for the Staff level position."
                            </div>
                        </div>
                        <button className="btn btn-ghost" style={{ width: '100%', fontSize: 'var(--text-xs)' }}><MessageSquare size={14} /> View All Comments</button>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default ScorecardReport;
