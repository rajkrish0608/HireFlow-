import React from 'react';
import { Search, Bell, Settings, HelpCircle, LayoutGrid } from 'lucide-react';
import { motion } from 'framer-motion';

const Header = () => {
    return (
        <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            style={{
                height: '72px',
                margin: '20px 20px 0 320px',
                padding: '0 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                position: 'relative',
                zIndex: 50,
            }}
        >
            <div style={{
                flex: 1,
                maxWidth: '400px',
                position: 'relative'
            }}>
                <div style={{
                    position: 'absolute',
                    left: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--color-text-muted)',
                    pointerEvents: 'none'
                }}>
                    <Search size={18} />
                </div>
                <input
                    type="text"
                    placeholder="Search candidates, roles, or scores..."
                    style={{
                        width: '100%',
                        height: '44px',
                        background: 'var(--color-bg-secondary)',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-lg)',
                        padding: '0 16px 0 48px',
                        color: 'var(--color-text-primary)',
                        fontSize: 'var(--text-sm)',
                        outline: 'none',
                        transition: 'border-color 0.2s',
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--color-accent-primary)'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
                />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button className="glass-card" style={{ padding: '10px', borderRadius: 'var(--radius-md)', color: 'var(--color-text-secondary)', border: 'none', cursor: 'pointer' }}>
                    <Bell size={18} />
                </button>
                <button className="glass-card" style={{ padding: '10px', borderRadius: 'var(--radius-md)', color: 'var(--color-text-secondary)', border: 'none', cursor: 'pointer' }}>
                    <LayoutGrid size={18} />
                </button>
                <button className="glass-card" style={{ padding: '10px', borderRadius: 'var(--radius-md)', color: 'var(--color-text-secondary)', border: 'none', cursor: 'pointer' }}>
                    <Settings size={18} />
                </button>
                <div style={{ width: '1px', height: '24px', background: 'var(--color-border)', margin: '0 8px' }}></div>
                <button className="btn btn-primary" style={{ padding: '10px 16px', fontSize: 'var(--text-xs)' }}>
                    Quick Action
                </button>
            </div>
        </motion.header>
    );
};

export default Header;
