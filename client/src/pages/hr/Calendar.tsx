import { useState } from 'react';
import Calendar from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import {
    ChevronLeft,
    ChevronRight,
    Plus,
    Clock,
    User
} from 'lucide-react';

const CalendarView = () => {
    const [startDate, setStartDate] = useState<Date | null>(new Date());

    const events = [
        { id: 1, title: 'Interview: Arjun Sharma', time: '10:00 AM - 11:00 AM', expert: 'Rajesh K.' },
        { id: 2, title: 'Interview: Priya Mehta', time: '02:00 PM - 03:00 PM', expert: 'Sunita M.' },
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1 style={{ fontSize: 'var(--text-4xl)', fontWeight: 'var(--font-black)', marginBottom: '8px' }}>
                        Interview <span className="gradient-text">Schedule</span>
                    </h1>
                    <p style={{ color: 'var(--color-text-secondary)' }}>Manage and synchronize all upcoming sessions.</p>
                </div>
                <button className="btn btn-primary">
                    <Plus size={20} />
                    Manual Schedule
                </button>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '32px' }}>
                <aside style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div className="glass-card" style={{ padding: '24px' }}>
                        <Calendar
                            selected={startDate}
                            onChange={(date: Date | null) => setStartDate(date)}
                            inline
                            calendarClassName="premium-calendar"
                        />
                    </div>

                    <div className="glass-card" style={{ padding: '24px' }}>
                        <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 'bold', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Clock size={16} /> Day Overview
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {events.map((e) => (
                                <div key={e.id} style={{ padding: '12px', background: 'var(--color-bg-primary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                                    <p style={{ fontSize: 'var(--text-sm)', fontWeight: 'bold' }}>{e.title}</p>
                                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: '4px' }}>{e.time}</p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px', color: 'var(--color-accent-tertiary)' }}>
                                        <User size={12} />
                                        <span style={{ fontSize: 'var(--text-xs)' }}>{e.expert}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>

                <main className="glass-card" style={{ minHeight: '600px', padding: '32px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <button style={{ background: 'transparent', border: 'none', color: 'var(--color-text-primary)' }}><ChevronLeft size={20} /></button>
                            <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-black)' }}>March 12 - 18, 2026</h2>
                            <button style={{ background: 'transparent', border: 'none', color: 'var(--color-text-primary)' }}><ChevronRight size={20} /></button>
                        </div>
                        <div className="glass-card" style={{ padding: '4px', borderRadius: 'var(--radius-md)', display: 'flex', background: 'var(--color-bg-secondary)' }}>
                            <button style={{ padding: '6px 16px', borderRadius: 'var(--radius-sm)', background: 'var(--color-bg-tertiary)', border: 'none', color: 'white', fontSize: 'var(--text-xs)', fontWeight: 'bold' }}>Week</button>
                            <button style={{ padding: '6px 16px', borderRadius: 'var(--radius-sm)', background: 'transparent', border: 'none', color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)' }}>Month</button>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px', background: 'var(--color-border)' }}>
                        {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(d => (
                            <div key={d} style={{ background: 'var(--color-bg-secondary)', padding: '12px', textAlign: 'center', fontSize: 'var(--text-xs)', fontWeight: 'bold', color: 'var(--color-text-muted)' }}>{d}</div>
                        ))}
                        {Array.from({ length: 35 }).map((_, i) => (
                            <div key={i} style={{
                                background: 'var(--color-bg-primary)',
                                height: '100px',
                                padding: '12px',
                                position: 'relative',
                                opacity: i < 5 || i > 25 ? 0.3 : 1
                            }}>
                                <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'bold' }}>{((i + 25) % 31) + 1}</span>
                                {i === 12 && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '35px',
                                        left: '8px',
                                        right: '8px',
                                        background: 'var(--color-accent-primary)',
                                        padding: '4px 8px',
                                        borderRadius: 'var(--radius-sm)',
                                        fontSize: '9px',
                                        fontWeight: 'bold',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                                    }}>
                                        Interview (2)
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default CalendarView;
