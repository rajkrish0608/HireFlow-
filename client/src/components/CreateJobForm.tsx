import { useState } from 'react';
import { X, Sparkles, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CreateJobForm = ({ onClose }: any) => {
    const [skills, setSkills] = useState(['Node.js', 'PostgreSQL']);
    const [inputValue, setInputValue] = useState('');

    const addSkill = () => {
        if (inputValue && !skills.includes(inputValue)) {
            setSkills([...skills, inputValue]);
            setInputValue('');
        }
    };

    const removeSkill = (skill: string) => {
        setSkills(skills.filter(s => s !== skill));
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.8)',
                backdropFilter: 'blur(8px)',
                zIndex: 1000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '24px'
            }}
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="glass-card"
                style={{
                    width: '100%',
                    maxWidth: '600px',
                    padding: '40px',
                    background: 'var(--color-bg-secondary)',
                    border: '1px solid var(--color-border-accent)',
                    position: 'relative',
                    maxHeight: '90vh',
                    overflowY: 'auto'
                }}
                onClick={e => e.stopPropagation()}
            >
                <button onClick={onClose} style={{ position: 'absolute', top: '24px', right: '24px', background: 'transparent', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}>
                    <X size={24} />
                </button>

                <header style={{ marginBottom: '32px' }}>
                    <h2 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--font-black)', marginBottom: '8px' }}>
                        New <span className="gradient-text">Job Role</span>
                    </h2>
                    <p style={{ color: 'var(--color-text-secondary)' }}>Define the role and required expertise.</p>
                </header>

                <form style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: 'var(--text-xs)', fontWeight: 'bold', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Job Title</label>
                        <input
                            type="text"
                            placeholder="e.g. Senior Backend Engineer"
                            style={{
                                background: 'var(--color-bg-primary)',
                                border: '1px solid var(--color-border)',
                                borderRadius: 'var(--radius-md)',
                                padding: '12px 16px',
                                color: 'var(--color-text-primary)',
                                outline: 'none'
                            }}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: 'var(--text-xs)', fontWeight: 'bold', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Seniority</label>
                            <select style={{ background: 'var(--color-bg-primary)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '12px 16px', color: 'var(--color-text-primary)' }}>
                                <option>Junior</option>
                                <option>Mid-level</option>
                                <option>Senior</option>
                                <option>Lead / Staff</option>
                            </select>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: 'var(--text-xs)', fontWeight: 'bold', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Experience Range</label>
                            <input type="text" placeholder="e.g. 5-8 years" style={{ background: 'var(--color-bg-primary)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '12px 16px', color: 'var(--color-text-primary)' }} />
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <label style={{ fontSize: 'var(--text-xs)', fontWeight: 'bold', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Required Skills (Tag-based)</label>
                        <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '8px',
                            padding: '8px',
                            background: 'var(--color-bg-primary)',
                            border: '1px solid var(--color-border)',
                            borderRadius: 'var(--radius-md)',
                            minHeight: '48px'
                        }}>
                            <AnimatePresence>
                                {skills.map(skill => (
                                    <motion.span
                                        key={skill}
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0.8, opacity: 0 }}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px',
                                            background: 'var(--color-accent-primary)',
                                            padding: '4px 10px',
                                            borderRadius: 'var(--radius-full)',
                                            fontSize: 'var(--text-xs)',
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        {skill}
                                        <X size={12} style={{ cursor: 'pointer' }} onClick={() => removeSkill(skill)} />
                                    </motion.span>
                                ))}
                            </AnimatePresence>
                            <input
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                                placeholder="Add skill..."
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'white',
                                    flex: 1,
                                    outline: 'none',
                                    fontSize: 'var(--text-sm)'
                                }}
                            />
                        </div>
                    </div>

                    <div style={{
                        background: 'rgba(108, 60, 225, 0.05)',
                        border: '1px dashed var(--color-border-accent)',
                        borderRadius: 'var(--radius-md)',
                        padding: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                    }}>
                        <Sparkles size={20} style={{ color: 'var(--color-accent-tertiary)' }} />
                        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                            AI will match the best domain interviewers based on the skills defined above.
                        </p>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                        <button className="btn btn-primary" style={{ flex: 1, height: '48px' }}>
                            <Check size={18} />
                            Publish Role
                        </button>
                        <button className="btn btn-ghost" style={{ flex: 1, height: '48px' }} type="button">Save Draft</button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
};

export default CreateJobForm;
