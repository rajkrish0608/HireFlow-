import { useState } from 'react';
import {
    Star,
    Send,
    Trash2,
    FileText
} from 'lucide-react';

const EvaluationForm = () => {
    const [scores, setScores] = useState({
        problemSolving: 0,
        technicalDepth: 0,
        communication: 0,
        culturalFit: 0
    });

    const categories = [
        { key: 'problemSolving', label: 'Problem Solving', desc: 'Ability to break down complex issues into logical steps.' },
        { key: 'technicalDepth', label: 'Technical Depth', desc: 'Understanding of core concepts and language/framework mastery.' },
        { key: 'communication', label: 'Communication', desc: 'Clarity in explaining logic and technical decisions.' },
        { key: 'culturalFit', label: 'Cultural Fit', desc: 'Alignment with team values and collaborative spirit.' },
    ];

    const updateScore = (key: string, val: number) => {
        setScores({ ...scores, [key]: val });
    };

    return (
        <div className="glass-card" style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
            <header style={{ marginBottom: '32px', borderBottom: '1px solid var(--color-border)', paddingBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <FileText size={24} className="gradient-text" />
                    <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-black)' }}>Structured Evaluation Form</h2>
                </div>
                <p style={{ color: 'var(--color-text-secondary)' }}>Provide a detailed assessment based on the interview rubric.</p>
            </header>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                {categories.map((cat) => (
                    <div key={cat.key} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h3 style={{ fontWeight: 'var(--font-bold)', fontSize: 'var(--text-md)' }}>{cat.label}</h3>
                                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{cat.desc}</p>
                            </div>
                            <div style={{ display: 'flex', gap: '4px' }}>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        size={20}
                                        style={{
                                            cursor: 'pointer',
                                            color: (scores as any)[cat.key] >= star ? 'var(--color-accent-tertiary)' : 'var(--color-bg-tertiary)',
                                            transition: 'all 0.2s transform'
                                        }}
                                        fill={(scores as any)[cat.key] >= star ? 'currentColor' : 'none'}
                                        onClick={() => updateScore(cat.key, star)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                ))}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'bold' }}>Overall Recommendation</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <button className="btn btn-ghost" style={{ border: '1px solid var(--color-success)', color: 'var(--color-success)' }}>
                            Strong Hire
                        </button>
                        <button className="btn btn-ghost" style={{ border: '1px solid var(--color-error)', color: 'var(--color-error)' }}>
                            No Hire
                        </button>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'bold' }}>Detailed Feedback</label>
                    <textarea
                        placeholder="Write your observation here..."
                        style={{
                            width: '100%',
                            height: '150px',
                            background: 'var(--color-bg-primary)',
                            border: '1px solid var(--color-border)',
                            borderRadius: 'var(--radius-md)',
                            padding: '16px',
                            color: 'white',
                            outline: 'none',
                            resize: 'none'
                        }}
                    />
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                    <button className="btn btn-primary" style={{ flex: 1 }}>
                        <Send size={18} />
                        Submit Final Scorecard
                    </button>
                    <button className="btn btn-ghost" style={{ width: '56px' }}>
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EvaluationForm;
