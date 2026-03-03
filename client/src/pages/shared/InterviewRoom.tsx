import {
    Mic,
    Video as VideoIcon,
    ScreenShare,
    MessageSquare,
    MoreHorizontal,
    Settings,
    PhoneOff,
    Users
} from 'lucide-react';
import CodingEngine from '../shared/CodingEngine';

const InterviewRoom = () => {
    return (
        <div style={{
            height: '100vh',
            background: '#050505',
            display: 'grid',
            gridTemplateColumns: '1fr 450px',
            overflow: 'hidden'
        }}>
            {/* Main Workspace (Left) */}
            <div style={{ display: 'grid', gridTemplateRows: '1fr auto', padding: '12px', gap: '12px' }}>
                <CodingEngine />

                {/* Call Controls */}
                <div style={{
                    height: '80px',
                    background: 'var(--color-bg-secondary)',
                    borderRadius: 'var(--radius-xl)',
                    border: '1px solid var(--color-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 32px'
                }}>
                    <div style={{ display: 'flex', gap: '8px', color: 'var(--color-text-secondary)' }}>
                        <div className="glass-card" style={{ padding: '8px 12px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--text-sm)' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-success)', boxShadow: '0 0 8px var(--color-success)' }}></div>
                            Live Session
                        </div>
                        <div className="glass-card" style={{ padding: '8px 12px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--text-sm)' }}>
                            REC
                            <span style={{ color: 'var(--color-error)' }}>01:24:05</span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '16px' }}>
                        <button className="glass-card" style={{ width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', color: 'white' }}>
                            <Mic size={20} />
                        </button>
                        <button className="glass-card" style={{ width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', color: 'white' }}>
                            <VideoIcon size={20} />
                        </button>
                        <button className="glass-card" style={{ width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', color: 'white' }}>
                            <ScreenShare size={20} />
                        </button>
                        <button style={{ width: '64px', height: '48px', borderRadius: 'var(--radius-full)', background: 'var(--color-error)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', color: 'white' }}>
                            <PhoneOff size={20} />
                        </button>
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button className="glass-card" style={{ padding: '10px', borderRadius: 'var(--radius-md)', border: 'none', color: 'var(--color-text-secondary)' }}><MessageSquare size={20} /></button>
                        <button className="glass-card" style={{ padding: '10px', borderRadius: 'var(--radius-md)', border: 'none', color: 'var(--color-text-secondary)' }}><Settings size={20} /></button>
                    </div>
                </div>
            </div>

            {/* Participants/Video (Right) */}
            <aside style={{
                padding: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                borderLeft: '1px solid var(--color-border)'
            }}>
                {/* Expert Feed */}
                <div style={{
                    flex: 1,
                    background: 'var(--color-bg-secondary)',
                    borderRadius: 'var(--radius-xl)',
                    position: 'relative',
                    overflow: 'hidden',
                    border: '1px solid var(--color-border)'
                }}>
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #1e1e1e, #0a0a0a)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'var(--color-accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--text-3xl)', fontWeight: 'bold' }}>RK</div>
                    </div>
                    <div style={{ position: 'absolute', bottom: '16px', left: '16px', background: 'rgba(0,0,0,0.5)', padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: 'var(--text-xs)' }}>
                        Expert: Raj Krish (You)
                    </div>
                </div>

                {/* Candidate Feed */}
                <div style={{
                    flex: 1,
                    background: 'var(--color-bg-secondary)',
                    borderRadius: 'var(--radius-xl)',
                    position: 'relative',
                    overflow: 'hidden',
                    border: '1px solid var(--color-border)'
                }}>
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #1e1e1e, #0a0a0a)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'var(--color-bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--text-3xl)', fontWeight: 'bold', color: 'var(--color-text-muted)' }}>AS</div>
                    </div>
                    <div style={{ position: 'absolute', bottom: '16px', left: '16px', background: 'rgba(0,0,0,0.5)', padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: 'var(--text-xs)' }}>
                        Candidate: Arjun Sharma
                    </div>
                    <div style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(239, 68, 68, 0.2)', color: 'var(--color-error)', padding: '4px 8px', borderRadius: 'var(--radius-sm)', fontSize: '10px', fontWeight: 'bold' }}>
                        MUTED
                    </div>
                </div>

                {/* Info Card */}
                <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: 'var(--radius-md)',
                        background: 'rgba(108, 60, 225, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--color-accent-tertiary)'
                    }}>
                        <Users size={18} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 'var(--text-sm)', fontWeight: 'bold' }}>Session Participants</p>
                        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>2 members in room</p>
                    </div>
                    <MoreHorizontal size={18} style={{ color: 'var(--color-text-muted)' }} />
                </div>
            </aside>
        </div>
    );
};

export default InterviewRoom;
