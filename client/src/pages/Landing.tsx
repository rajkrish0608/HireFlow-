import React, { useEffect, useRef, useState, Suspense, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
    Float,
    Stars,
    Html,
    Line,
    Sphere,
    MeshDistortMaterial,
    MeshWobbleMaterial,
    OrbitControls,
    PerspectiveCamera,
    useCursor,
} from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { motion, useScroll, useTransform, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import './Landing.css';

gsap.registerPlugin(ScrollTrigger);

// ─── 3D LOADER ────────────────────────────────────────────────────────────────

function LoaderScene() {
    const meshRef = useRef<THREE.Mesh>(null!);
    const ringRef = useRef<THREE.Mesh>(null!);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.x = state.clock.elapsedTime * 0.6;
            meshRef.current.rotation.y = state.clock.elapsedTime * 0.9;
        }
        if (ringRef.current) {
            ringRef.current.rotation.z = state.clock.elapsedTime * -1.2;
            ringRef.current.rotation.x = Math.PI / 6;
        }
    });

    return (
        <>
            <ambientLight intensity={0.3} />
            <pointLight position={[3, 3, 3]} intensity={3} color="#A78BFA" />
            <pointLight position={[-3, -3, -3]} intensity={2} color="#EC4899" />

            <mesh ref={meshRef}>
                <octahedronGeometry args={[1.2, 2]} />
                <meshStandardMaterial
                    color="#6C3CE1"
                    wireframe
                    emissive="#6C3CE1"
                    emissiveIntensity={0.8}
                />
            </mesh>

            <mesh ref={ringRef}>
                <torusGeometry args={[2.2, 0.04, 8, 80]} />
                <meshStandardMaterial color="#A78BFA" emissive="#A78BFA" emissiveIntensity={1.5} />
            </mesh>

            <mesh>
                <torusGeometry args={[1.7, 0.02, 8, 80]} />
                <meshStandardMaterial color="#EC4899" emissive="#EC4899" emissiveIntensity={1} />
            </mesh>

            <EffectComposer>
                <Bloom intensity={2.5} luminanceThreshold={0.1} luminanceSmoothing={0.9} />
            </EffectComposer>
        </>
    );
}

function Loader3D({ onDone }: { onDone: () => void }) {
    useEffect(() => {
        const t = setTimeout(onDone, 2400);
        return () => clearTimeout(t);
    }, [onDone]);

    return (
        <motion.div
            className="loader-overlay"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
        >
            <div className="loader-canvas">
                <Canvas camera={{ position: [0, 0, 5], fov: 50 }} dpr={[1, 1.5]}>
                    <LoaderScene />
                </Canvas>
            </div>
            <motion.div
                className="loader-brand"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
            >
                <span className="loader-hex">⬡</span>
                <span className="loader-name gradient-text">HireFlow</span>
            </motion.div>
            <motion.div
                className="loader-bar-wrap"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                <motion.div
                    className="loader-bar"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 2, ease: 'easeInOut' }}
                />
            </motion.div>
        </motion.div>
    );
}

// ─── HOLOGRAPHIC GLOBE ────────────────────────────────────────────────────────

function HolographicGlobe() {
    const groupRef = useRef<THREE.Group>(null!);
    const coreRef = useRef<THREE.Mesh>(null!);
    const wireRef = useRef<THREE.Mesh>(null!);
    const { mouse } = useThree();

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y += 0.004;
            groupRef.current.rotation.x += (mouse.y * 0.15 - groupRef.current.rotation.x) * 0.05;
        }
        if (coreRef.current) {
            const scale = 1 + Math.sin(state.clock.elapsedTime * 0.8) * 0.02;
            coreRef.current.scale.setScalar(scale);
        }
        if (wireRef.current) {
            wireRef.current.rotation.y -= 0.002;
        }
    });

    // Generate node positions on sphere surface
    const nodePositions = useMemo(() => {
        const positions: [number, number, number][] = [];
        const golden = Math.PI * (3 - Math.sqrt(5));
        for (let i = 0; i < 24; i++) {
            const y = 1 - (i / 23) * 2;
            const r = Math.sqrt(1 - y * y);
            const theta = golden * i;
            positions.push([r * Math.cos(theta) * 2.5, y * 2.5, r * Math.sin(theta) * 2.5]);
        }
        return positions;
    }, []);

    // Generate connection pairs
    const connections = useMemo(() => {
        const pairs: [[number, number, number], [number, number, number]][] = [];
        for (let i = 0; i < nodePositions.length; i++) {
            for (let j = i + 1; j < nodePositions.length; j++) {
                const a = new THREE.Vector3(...nodePositions[i]);
                const b = new THREE.Vector3(...nodePositions[j]);
                if (a.distanceTo(b) < 2.2) pairs.push([nodePositions[i], nodePositions[j]]);
            }
        }
        return pairs;
    }, [nodePositions]);

    const labels = ['React', 'DSA', 'System', 'ML', 'Node.js', 'DevOps', 'Python', 'Kafka'];

    return (
        <group ref={groupRef}>
            {/* Inner glowing core */}
            <mesh ref={coreRef}>
                <sphereGeometry args={[1.5, 64, 64]} />
                <MeshDistortMaterial
                    color="#230c4e"
                    distort={0.25}
                    speed={1.5}
                    roughness={0}
                    metalness={1}
                    transparent
                    opacity={0.9}
                />
            </mesh>

            {/* Wireframe outer shell */}
            <mesh ref={wireRef}>
                <sphereGeometry args={[2.55, 32, 32]} />
                <meshBasicMaterial color="#5b21b6" wireframe transparent opacity={0.12} />
            </mesh>

            {/* Equatorial ring */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[2.7, 0.018, 6, 120]} />
                <meshBasicMaterial color="#8B5CF6" transparent opacity={0.5} />
            </mesh>
            <mesh rotation={[Math.PI / 3, 0.4, 0]}>
                <torusGeometry args={[2.7, 0.01, 6, 120]} />
                <meshBasicMaterial color="#EC4899" transparent opacity={0.3} />
            </mesh>

            {/* Nodes on surface */}
            {nodePositions.map((pos, i) => (
                <NodePoint key={i} position={pos} label={i < 8 ? labels[i] : undefined} index={i} />
            ))}

            {/* Connections */}
            {connections.map(([a, b], i) => (
                <Line
                    key={i}
                    points={[a, b]}
                    color="#6C3CE1"
                    lineWidth={0.7}
                    transparent
                    opacity={0.18}
                />
            ))}
        </group>
    );
}

function NodePoint({ position, label, index }: { position: [number, number, number]; label?: string; index: number }) {
    const meshRef = useRef<THREE.Mesh>(null!);
    const [hovered, setHovered] = useState(false);
    useCursor(hovered);

    useFrame((state) => {
        if (meshRef.current) {
            const pulse = 0.07 + Math.sin(state.clock.elapsedTime * 1.2 + index) * 0.03;
            meshRef.current.scale.setScalar(hovered ? 2.5 : 1 + pulse);
        }
    });

    return (
        <mesh
            ref={meshRef}
            position={position}
            onPointerEnter={() => setHovered(true)}
            onPointerLeave={() => setHovered(false)}
        >
            <sphereGeometry args={[0.07, 12, 12]} />
            <meshStandardMaterial
                color={hovered ? '#ffffff' : '#A78BFA'}
                emissive={hovered ? '#A78BFA' : '#6C3CE1'}
                emissiveIntensity={hovered ? 4 : 2}
                roughness={0}
                metalness={0.5}
            />
            {hovered && label && (
                <Html distanceFactor={8} center>
                    <div className="node-label">{label}</div>
                </Html>
            )}
        </mesh>
    );
}

function FloatingOrb({ position, color, size = 0.4, speed = 1 }: {
    position: [number, number, number];
    color: string;
    size?: number;
    speed?: number;
}) {
    const ref = useRef<THREE.Mesh>(null!);
    useFrame((state) => {
        if (ref.current) {
            ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.3;
            ref.current.rotation.x += 0.01;
            ref.current.rotation.y += 0.008;
        }
    });

    return (
        <mesh ref={ref} position={position}>
            <octahedronGeometry args={[size, 0]} />
            <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={0.6}
                wireframe
                transparent
                opacity={0.7}
            />
        </mesh>
    );
}

function HeroScene() {
    return (
        <>
            <PerspectiveCamera makeDefault position={[0, 0, 7]} fov={52} />
            <ambientLight intensity={0.2} />
            <pointLight position={[5, 5, 5]} intensity={3} color="#A78BFA" />
            <pointLight position={[-5, -5, 3]} intensity={2} color="#EC4899" />
            <pointLight position={[0, 0, -5]} intensity={1} color="#3B82F6" />

            <Stars radius={100} depth={60} count={4000} factor={3} saturation={0.8} fade speed={0.6} />

            <HolographicGlobe />

            {/* Floating accent orbs */}
            <FloatingOrb position={[-5, 2, 1]} color="#EC4899" size={0.25} speed={0.7} />
            <FloatingOrb position={[5, -2, 0]} color="#6C3CE1" size={0.3} speed={1.1} />
            <FloatingOrb position={[4, 3, -1]} color="#A78BFA" size={0.2} speed={0.9} />
            <FloatingOrb position={[-4, -3, 2]} color="#8B5CF6" size={0.22} speed={0.8} />
            <FloatingOrb position={[0, 4, -2]} color="#EC4899" size={0.18} speed={1.3} />

            <EffectComposer>
                <Bloom intensity={1.4} luminanceThreshold={0.12} luminanceSmoothing={0.95} mipmapBlur />
                <Vignette eskil={false} offset={0.15} darkness={1.0} />
            </EffectComposer>

            <OrbitControls
                enableZoom={false}
                enablePan={false}
                autoRotate={false}
                maxPolarAngle={Math.PI / 1.4}
                minPolarAngle={Math.PI / 3.5}
                enableRotate={true}
                rotateSpeed={0.25}
            />
        </>
    );
}

// ─── CURSOR ───────────────────────────────────────────────────────────────────

function CustomCursor() {
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);
    const springX = useSpring(cursorX, { stiffness: 700, damping: 30 });
    const springY = useSpring(cursorY, { stiffness: 700, damping: 30 });
    const followerX = useSpring(cursorX, { stiffness: 120, damping: 28 });
    const followerY = useSpring(cursorY, { stiffness: 120, damping: 28 });

    useEffect(() => {
        const move = (e: MouseEvent) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
        };
        window.addEventListener('mousemove', move);
        return () => window.removeEventListener('mousemove', move);
    }, []);

    return (
        <>
            <motion.div
                className="cursor-dot"
                style={{ x: springX, y: springY, translateX: '-50%', translateY: '-50%' }}
            />
            <motion.div
                className="cursor-ring"
                style={{ x: followerX, y: followerY, translateX: '-50%', translateY: '-50%' }}
            />
        </>
    );
}

// ─── ANIMATED COUNTER ─────────────────────────────────────────────────────────

function Counter({ end, suffix = '', label, icon }: { end: number; suffix?: string; label: string; icon: string }) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLDivElement>(null);
    const [active, setActive] = useState(false);

    useEffect(() => {
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setActive(true); }, { threshold: 0.5 });
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, []);

    useEffect(() => {
        if (!active) return;
        let start = 0;
        const step = end / (1800 / 16);
        const t = setInterval(() => {
            start += step;
            if (start >= end) { setCount(end); clearInterval(t); }
            else setCount(Math.floor(start));
        }, 16);
        return () => clearInterval(t);
    }, [active, end]);

    return (
        <motion.div
            ref={ref}
            className="counter-card glass-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
        >
            <span className="counter-icon">{icon}</span>
            <span className="counter-value gradient-text">{count.toLocaleString()}{suffix}</span>
            <span className="counter-label">{label}</span>
        </motion.div>
    );
}

// ─── FEATURE CARD ─────────────────────────────────────────────────────────────

const FeatureCard = ({ icon, title, desc, tag, delay }: {
    icon: string; title: string; desc: string; tag?: string; delay: number
}) => (
    <motion.div
        className="feature-card glass-card"
        initial={{ opacity: 0, y: 48 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.65, delay, ease: [0.19, 1, 0.22, 1] }}
        whileHover={{ y: -10, transition: { duration: 0.25 } }}
    >
        {tag && <span className="feature-tag">{tag}</span>}
        <div className="feature-icon">{icon}</div>
        <h3 className="feature-title">{title}</h3>
        <p className="feature-desc">{desc}</p>
        <div className="feature-glow" />
    </motion.div>
);

// ─── MARQUEE LOGOS ────────────────────────────────────────────────────────────

function MarqueeTrustBar() {
    const logos = ['Razorpay', 'Swiggy', 'Zepto', 'CRED', 'Meesho', 'PhonePe', 'Groww', 'Juspay', 'Slice', 'BrowserStack'];
    return (
        <div className="marquee-wrap">
            <div className="marquee-track">
                {[...logos, ...logos].map((l, i) => (
                    <span key={i} className="marquee-logo">{l}</span>
                ))}
            </div>
        </div>
    );
}

// ─── STEP CARD ────────────────────────────────────────────────────────────────

const StepCard = ({ num, title, desc, icon, delay }: {
    num: string; title: string; desc: string; icon: string; delay: number
}) => (
    <motion.div
        className="step-card"
        initial={{ opacity: 0, x: -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.65, delay, ease: [0.19, 1, 0.22, 1] }}
    >
        <div className="step-icon-wrap">
            <span className="step-icon">{icon}</span>
        </div>
        <div className="step-content">
            <span className="step-number gradient-text">{num}</span>
            <h3 className="step-title">{title}</h3>
            <p className="step-desc">{desc}</p>
        </div>
    </motion.div>
);

// ─── PRICING CARD ─────────────────────────────────────────────────────────────

const PricingCard = ({ plan, price, period, features, highlight, emoji, delay }: {
    plan: string; price: string; period: string; features: string[];
    highlight?: boolean; emoji: string; delay: number;
}) => (
    <motion.div
        className={`pricing-card glass-card ${highlight ? 'pricing-card--highlight' : ''}`}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.65, delay, ease: [0.19, 1, 0.22, 1] }}
        whileHover={{ y: highlight ? -4 : -8, transition: { duration: 0.2 } }}
    >
        {highlight && <div className="pricing-badge">✦ Most Popular</div>}
        <div className="pricing-emoji">{emoji}</div>
        <div className="pricing-plan">{plan}</div>
        <div className="pricing-price gradient-text">{price}</div>
        <div className="pricing-period">{period}</div>
        <ul className="pricing-features">
            {features.map((f, i) => (
                <li key={i}>
                    <span className="check-icon">✦</span>
                    <span>{f}</span>
                </li>
            ))}
        </ul>
        <button className={`btn ${highlight ? 'btn-primary' : 'btn-ghost'} pricing-btn`}>
            {highlight ? 'Get Started →' : 'Choose Plan'}
        </button>
    </motion.div>
);

// ─── TESTIMONIAL ──────────────────────────────────────────────────────────────

const TestimonialCard = ({ name, role, company, text, avatar, delay }: {
    name: string; role: string; company: string; text: string; avatar: string; delay: number
}) => (
    <motion.div
        className="testimonial-card glass-card"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.65, delay, ease: [0.19, 1, 0.22, 1] }}
        whileHover={{ y: -6, transition: { duration: 0.2 } }}
    >
        <div className="testimonial-stars">{'★'.repeat(5)}</div>
        <p className="testimonial-text">"{text}"</p>
        <div className="testimonial-author">
            <div className="author-avatar gradient-text">{avatar}</div>
            <div className="author-info">
                <div className="author-name">{name}</div>
                <div className="author-role">{role} · <span className="author-company">{company}</span></div>
            </div>
        </div>
    </motion.div>
);

// ─── MAIN LANDING PAGE ────────────────────────────────────────────────────────

export default function Landing() {
    const navigate = useNavigate();
    const [loaded, setLoaded] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { scrollY } = useScroll();
    const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);
    const heroScale = useTransform(scrollY, [0, 500], [1, 0.95]);
    const heroY = useTransform(scrollY, [0, 500], [0, -60]);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Removed Lenis smooth scroll to fix native scrolling issues

    // GSAP ScrollTrigger for section reveals
    useEffect(() => {
        if (!loaded) return;
        const ctx = gsap.context(() => {
            gsap.utils.toArray<Element>('.gsap-reveal').forEach((el) => {
                gsap.fromTo(el,
                    { opacity: 0, y: 40 },
                    {
                        opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
                        scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
                    }
                );
            });
        });
        return () => ctx.revert();
    }, [loaded]);

    const features = [
        { icon: '🧠', title: 'AI Interviewer Matching', desc: 'ML engine scores 2,400+ expert interviewers by skill depth, rating, and availability. Zero guesswork.', tag: 'Core' },
        { icon: '🎥', title: 'HD Live Interview Rooms', desc: 'WebRTC-powered video sessions with real-time code collaboration, screen sharing, and automatic cloud recording.', tag: 'Live' },
        { icon: '⚡', title: 'Monaco Coding Engine', desc: '8 language sandbox — Python, Go, Java, TypeScript & more. Anti-cheat monitoring, tabswitch detection, and execution sandbox.', tag: 'Engine' },
        { icon: '📋', title: 'Structured Scorecards', desc: 'Rubric-based evaluation across 6 weighted dimensions. AI-generated summaries with STRONG_HIRE / NO_HIRE decision.', tag: 'Reports' },
        { icon: '🛡️', title: 'Enterprise Security', desc: 'Rate limiting, Docker container isolation, JWT auth, audit logs, and full GDPR-compliant data handling.', tag: 'Security' },
        { icon: '💳', title: 'Multi-Currency Billing', desc: 'Pay-per-interview, subscriptions, or bulk packs. Razorpay-powered with INR, USD, EUR, GBP support.', tag: 'Payments' },
    ];

    const steps = [
        { icon: '📝', num: '01', title: 'Post a Job Role', desc: 'Define required skills, seniority level, and evaluation rubric. Takes under 2 minutes.' },
        { icon: '🤖', num: '02', title: 'AI Matches an Expert', desc: 'Our ML engine ranks the top 3 interviewers by skill-fit, rating, and real availability.' },
        { icon: '🎬', num: '03', title: 'Live Interview', desc: 'HD video + live coding in a fully monitored session. Every moment recorded to the cloud.' },
        { icon: '📊', num: '04', title: 'Scorecard & Decision', desc: 'Instant structured scorecard with rubric scores, strengths, improvement areas, and a hire recommendation.' },
    ];

    const testimonials = [
        { name: 'Priya Sharma', role: 'VP Engineering', company: 'FinTech Corp', avatar: 'P', text: 'HireFlow cut our time-to-hire by 60%. The expert interviewers genuinely understand our stack — no hand-holding required.' },
        { name: 'Arjun Mehta', role: 'CTO', company: 'Series B Startup', avatar: 'A', text: 'The AI matching is uncanny. We completely stopped wasting internal engineering bandwidth on screening interviews.' },
        { name: 'Sofia Laurent', role: 'Head of Talent', company: 'Scale-up', avatar: 'S', text: 'Scorecards are so detailed that hiring managers make confident decisions the same day. Absolute game changer.' },
    ];

    return (
        <div className="landing">
            <AnimatePresence mode="wait">
                {!loaded && <Loader3D key="loader" onDone={() => setLoaded(true)} />}
            </AnimatePresence>

            {loaded && (
                <>
                    <CustomCursor />

                    {/* ─── NAVBAR ──────────────────────── */}
                    <motion.nav
                        className={`landing-nav ${scrolled ? 'landing-nav--scrolled' : ''}`}
                        initial={{ y: -80, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
                    >
                        <div className="nav-container">
                            <div className="nav-logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                                <span className="logo-hex">⬡</span>
                                <span className="logo-text gradient-text">HireFlow</span>
                            </div>
                            <div className="nav-links">
                                {['#features', '#how', '#pricing', '#reviews'].map((href, i) => (
                                    <a key={href} href={href} className="nav-link">
                                        {['Features', 'How it Works', 'Pricing', 'Reviews'][i]}
                                    </a>
                                ))}
                            </div>
                            <div className="nav-actions">
                                <button className="btn btn-ghost nav-btn" onClick={() => navigate('/login')}>Login</button>
                                <button className="btn btn-primary nav-btn" onClick={() => navigate('/login')}>Start Free →</button>
                            </div>
                        </div>
                    </motion.nav>

                    {/* ─── HERO ────────────────────────── */}
                    <section className="hero-section">
                        <motion.div className="hero-content" style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}>
                            <motion.div
                                className="hero-badge"
                                initial={{ opacity: 0, scale: 0.85 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.15, duration: 0.5 }}
                            >
                                <span className="badge-pulse" />
                                AI-Powered Technical Interviewing
                            </motion.div>

                            <motion.h1
                                className="hero-headline"
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.9, ease: [0.19, 1, 0.22, 1] }}
                            >
                                Hire Great Engineers.<br />
                                <span className="gradient-text">Without the Guesswork.</span>
                            </motion.h1>

                            <motion.p
                                className="hero-sub"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5, duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
                            >
                                Expert interviewers. AI-matched to your role. Structured rubrics.
                                Instant scorecards. Bias-free by design.
                            </motion.p>

                            <motion.div
                                className="hero-ctas"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.65, duration: 0.7 }}
                            >
                                <button className="btn btn-primary hero-primary-cta" onClick={() => navigate('/login')}>
                                    Start Hiring Free
                                    <span className="cta-arrow">→</span>
                                </button>
                                <button className="btn btn-ghost hero-ghost-cta" onClick={() => navigate('/hr')}>
                                    <span className="play-ring">▶</span>
                                    See the Dashboard
                                </button>
                            </motion.div>

                            <motion.div
                                className="hero-social-proof"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.9, duration: 0.8 }}
                            >
                                <div className="avatar-stack">
                                    {['P', 'A', 'S', 'K', 'R'].map((l, i) => (
                                        <div key={i} className="avatar-item gradient-text" style={{ zIndex: 5 - i, marginLeft: i ? '-10px' : '0' }}>{l}</div>
                                    ))}
                                </div>
                                <div className="social-proof-text">
                                    <strong>500+ companies</strong> hire smarter with HireFlow
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* 3D Canvas */}
                        <div className="hero-canvas-wrap">
                            <Canvas dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
                                <Suspense fallback={null}>
                                    <HeroScene />
                                </Suspense>
                            </Canvas>
                            <div className="hero-canvas-fade" />
                        </div>

                        {/* Scroll indicator */}
                        <motion.div
                            className="scroll-cue"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.8 }}
                        >
                            <div className="scroll-mouse">
                                <div className="scroll-wheel-inner" />
                            </div>
                            <span>scroll</span>
                        </motion.div>
                    </section>

                    {/* ─── TRUST BAR ─────────────────────── */}
                    <section className="trust-section">
                        <p className="trust-label gsap-reveal">Trusted by engineering teams at</p>
                        <MarqueeTrustBar />
                    </section>

                    {/* ─── STATS ──────────────────────────── */}
                    <section className="stats-section">
                        <div className="container stats-grid">
                            <Counter end={12000} suffix="+" label="Interviews Conducted" icon="🎯" />
                            <Counter end={98} suffix="%" label="Hire Accuracy Rate" icon="✅" />
                            <Counter end={500} suffix="+" label="Companies Onboarded" icon="🏢" />
                            <Counter end={2400} suffix="+" label="Expert Interviewers" icon="👨‍💻" />
                        </div>
                    </section>

                    {/* ─── FEATURES ───────────────────────── */}
                    <section id="features" className="features-section section">
                        <div className="container">
                            <div className="section-header gsap-reveal">
                                <span className="section-label">Platform Features</span>
                                <h2 className="section-title">Everything to <span className="gradient-text">Hire Right</span></h2>
                                <p className="section-sub">Built for modern engineering teams who need precision, speed, and no drama.</p>
                            </div>
                            <div className="features-grid">
                                {features.map((f, i) => <FeatureCard key={i} {...f} delay={i * 0.07} />)}
                            </div>
                        </div>
                    </section>

                    {/* ─── HOW IT WORKS ───────────────────── */}
                    <section id="how" className="how-section section">
                        <div className="container">
                            <div className="section-header gsap-reveal">
                                <span className="section-label">The Process</span>
                                <h2 className="section-title">From Job Post to <span className="gradient-text">Hire Decision</span></h2>
                                <p className="section-sub">Four repeatable steps. Fully instrumented. Completely objective.</p>
                            </div>
                            <div className="steps-grid">
                                {steps.map((s, i) => <StepCard key={i} {...s} delay={i * 0.1} />)}
                            </div>
                        </div>
                    </section>

                    {/* ─── PRICING ──────────────────────────── */}
                    <section id="pricing" className="pricing-section section">
                        <div className="container">
                            <div className="section-header gsap-reveal">
                                <span className="section-label">Pricing</span>
                                <h2 className="section-title">Simple, <span className="gradient-text">Transparent</span> Pricing</h2>
                                <p className="section-sub">No retainers. No hidden fees. Pay exactly for what you use.</p>
                            </div>
                            <div className="pricing-grid">
                                <PricingCard
                                    plan="Starter" emoji="🌱" price="₹999" period="per interview" delay={0}
                                    features={['1 Interview Credit', 'Standard AI Matching', 'Basic Scorecard', '7-day Recording Access', 'Email Delivery']}
                                />
                                <PricingCard
                                    plan="Growth" emoji="🚀" price="₹4,999" period="6 interview pack" delay={0.1} highlight
                                    features={['6 Interview Credits', 'Priority AI Matching', 'Full Rubric Scorecard', '30-day Recording Access', 'HR Dashboard Access', 'Slack Notifications', 'Dedicated Support']}
                                />
                                <PricingCard
                                    plan="Enterprise" emoji="🏛️" price="Custom" period="unlimited scale" delay={0.2}
                                    features={['Unlimited Interviews', 'Dedicated Interviewers', 'Advanced Analytics', '99.9% SLA Guarantee', 'Full API Access', 'White-label Option', 'Custom Integrations']}
                                />
                            </div>
                        </div>
                    </section>

                    {/* ─── TESTIMONIALS ─────────────────────── */}
                    <section id="reviews" className="testimonials-section section">
                        <div className="container">
                            <div className="section-header gsap-reveal">
                                <span className="section-label">Testimonials</span>
                                <h2 className="section-title">Loved by <span className="gradient-text">Engineering Leaders</span></h2>
                            </div>
                            <div className="testimonials-grid">
                                {testimonials.map((t, i) => <TestimonialCard key={i} {...t} delay={i * 0.12} />)}
                            </div>
                        </div>
                    </section>

                    {/* ─── FINAL CTA ────────────────────────── */}
                    <section className="cta-section section">
                        <div className="container">
                            <motion.div
                                className="cta-card glass-card"
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true, amount: 0.4 }}
                                transition={{ duration: 0.7 }}
                            >
                                <div className="cta-glow-1" />
                                <div className="cta-glow-2" />
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.2, duration: 0.7 }}
                                >
                                    <h2 className="cta-headline">Ready to Hire Without Guesswork?</h2>
                                    <p className="cta-body">Join 500+ engineering teams who trust HireFlow to make faster, better, bias-free technical hiring decisions.</p>
                                    <div className="cta-actions">
                                        <button className="btn btn-primary cta-primary" onClick={() => navigate('/login')}>
                                            Start Free — No Credit Card →
                                        </button>
                                        <button className="btn btn-ghost" onClick={() => navigate('/hr')}>
                                            Explore Dashboard
                                        </button>
                                    </div>
                                </motion.div>
                            </motion.div>
                        </div>
                    </section>

                    {/* ─── FOOTER ──────────────────────────── */}
                    <footer className="landing-footer">
                        <div className="container footer-inner">
                            <div className="footer-brand">
                                <div className="footer-logo">
                                    <span className="logo-hex">⬡</span>
                                    <span className="logo-text gradient-text">HireFlow</span>
                                </div>
                                <p className="footer-tagline">The intelligent technical interview platform. AI-matched experts, structured scorecards, zero bias.</p>
                            </div>
                            <div className="footer-cols">
                                {[
                                    { title: 'Product', links: ['Features', 'Pricing', 'How it Works', 'Security'] },
                                    { title: 'Legal', links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy'] },
                                    { title: 'Connect', links: ['GitHub', 'LinkedIn', 'Twitter', 'Contact'] },
                                ].map(col => (
                                    <div key={col.title} className="footer-col">
                                        <span className="footer-col-title">{col.title}</span>
                                        {col.links.map(l => <a key={l} href="#" className="footer-link">{l}</a>)}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="footer-bar container">
                            <span>© 2026 HireFlow. Built with ❤️ for engineering excellence.</span>
                        </div>
                    </footer>
                </>
            )}
        </div>
    );
}
