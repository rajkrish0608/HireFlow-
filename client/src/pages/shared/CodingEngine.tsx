import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import {
    Play,
    RotateCcw,
    Settings,
    Terminal,
    Clock,
    CheckCircle2,
    AlertCircle
} from 'lucide-react';

const CodingEngine = () => {
    const [code, setCode] = useState('// Solve: Find the longest palindromic substring in S\nfunction longestPalindrome(s) {\n  \n}');
    const [timeLeft, setTimeLeft] = useState(3600); // 60 minutes
    const [status, setStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle');

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const runCode = () => {
        setStatus('running');
        setTimeout(() => setStatus('success'), 1500);
    };

    return (
        <div style={{
            height: 'calc(100vh - 40px)',
            display: 'grid',
            gridTemplateRows: 'auto 1fr auto',
            background: 'var(--color-bg-primary)',
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
            border: '1px solid var(--color-border)'
        }}>
            {/* Engine Header */}
            <header style={{
                padding: '16px 24px',
                background: 'var(--color-bg-secondary)',
                borderBottom: '1px solid var(--color-border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Terminal size={20} className="gradient-text" />
                        <span style={{ fontWeight: 'var(--font-black)', letterSpacing: '-0.01em' }}>CODE_ENGINE v2</span>
                    </div>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '6px 12px',
                        background: timeLeft < 300 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255,255,255,0.05)',
                        borderRadius: 'var(--radius-sm)',
                        color: timeLeft < 300 ? 'var(--color-error)' : 'var(--color-text-primary)',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 'bold'
                    }}>
                        <Clock size={16} />
                        {formatTime(timeLeft)}
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn btn-ghost" style={{ padding: '8px' }}><Settings size={18} /></button>
                    <button className="btn btn-ghost" onClick={() => setCode('')}><RotateCcw size={18} /></button>
                    <button className="btn btn-primary" onClick={runCode} disabled={status === 'running'}>
                        <Play size={18} />
                        {status === 'running' ? 'Running...' : 'Run Test Cases'}
                    </button>
                </div>
            </header>

            {/* Main Workspace */}
            <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', overflow: 'hidden' }}>
                <aside style={{
                    padding: '24px',
                    borderRight: '1px solid var(--color-border)',
                    overflowY: 'auto',
                    background: 'rgba(255,255,255,0.01)'
                }}>
                    <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', marginBottom: '16px' }}>Problem Statement</h2>
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: '1.6', marginBottom: '24px' }}>
                        Given a string <code>s</code>, return the longest palindromic substring in <code>s</code>.
                        <br /><br />
                        <strong>Example 1:</strong><br />
                        Input: s = "babad"<br />
                        Output: "bab"<br />
                        Note: "aba" is also a valid answer.
                    </p>

                    <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '24px' }}>
                        <h3 style={{ fontSize: 'var(--text-xs)', fontWeight: 'bold', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '16px' }}>Constraints</h3>
                        <ul style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', paddingLeft: '16px' }}>
                            <li>1 {'<='} s.length {'<='} 1000</li>
                            <li>s consists of only digits and English letters.</li>
                        </ul>
                    </div>
                </aside>

                <main style={{ height: '100%', background: '#1e1e1e' }}>
                    <Editor
                        height="100%"
                        defaultLanguage="javascript"
                        theme="vs-dark"
                        value={code}
                        onChange={(val) => setCode(val || '')}
                        options={{
                            fontSize: 14,
                            fontFamily: 'var(--font-mono)',
                            minimap: { enabled: false },
                            padding: { top: 20 },
                            smoothScrolling: true,
                            cursorBlinking: 'smooth',
                        }}
                    />
                </main>
            </div>

            {/* Engine Footer (Console) */}
            <footer style={{
                height: '180px',
                background: '#0a0a0a',
                borderTop: '1px solid var(--color-border)',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'bold', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Terminal size={14} /> CONSOLE_OUTPUT
                    </span>
                    {status !== 'idle' && (
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontSize: 'var(--text-xs)',
                            color: status === 'success' ? 'var(--color-success)' : 'var(--color-accent-primary)'
                        }}>
                            {status === 'success' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                            {status === 'success' ? 'Tests Passed: 5/5' : 'Compiling...'}
                        </div>
                    )}
                </div>
                <div style={{
                    flex: 1,
                    background: 'rgba(255,255,255,0.03)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '12px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 'var(--text-xs)',
                    color: 'var(--color-text-secondary)',
                    overflowY: 'auto'
                }}>
                    {status === 'idle' && '> Ready to run...'}
                    {status === 'running' && '> Compiling source...\n> Executing tests...'}
                    {status === 'success' && '> Longest Palindrome: "bab"\n> Runtime: 42ms\n> Memory: 12.4MB\n\n> All test cases passed!'}
                </div>
            </footer>
        </div>
    );
};

export default CodingEngine;
