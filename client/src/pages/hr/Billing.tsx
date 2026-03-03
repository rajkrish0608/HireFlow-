import { useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import {
    CreditCard,
    Zap,
    Package,
    BarChart2,
    CheckCircle2,
    Clock,
    ArrowRight,
    Star,
    TrendingUp,
    ShieldCheck
} from 'lucide-react';
import './Billing.css';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Package {
    id: string;
    name: string;
    type: 'PER_INTERVIEW' | 'BULK' | 'SUBSCRIPTION';
    amountPaise: number;
    description: string;
    quantity?: number;
    interviewsIncluded?: number;
}

interface PaymentRecord {
    id: string;
    amount: number;
    type: string;
    status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
    gatewayOrderId: string | null;
    createdAt: string;
}

const TYPE_ICONS: Record<string, ReactNode> = {
    PER_INTERVIEW: <Zap size={16} />,
    BULK: <Package size={16} />,
    SUBSCRIPTION: <Star size={16} />,
};

const TYPE_LABELS: Record<string, string> = {
    PER_INTERVIEW: 'Per Interview',
    BULK: 'Bulk Pack',
    SUBSCRIPTION: 'Subscription',
};

// ─── Mock data (replace with real API calls) ──────────────────────────────────
const MOCK_PACKAGES: Package[] = [
    { id: 'pkg_per_standard', name: 'Standard Interview', type: 'PER_INTERVIEW', amountPaise: 300000, description: '60-min technical interview with a senior interviewer' },
    { id: 'pkg_per_premium', name: 'Premium Interview', type: 'PER_INTERVIEW', amountPaise: 600000, description: '90-min full-stack evaluation with a lead interviewer' },
    { id: 'pkg_bulk_5', name: 'Bulk Pack – 5', type: 'BULK', amountPaise: 1250000, description: '5 standard interviews at ₹2,500 each (save ₹2,500)', quantity: 5 },
    { id: 'pkg_bulk_10', name: 'Bulk Pack – 10', type: 'BULK', amountPaise: 2000000, description: '10 standard interviews at ₹2,000 each (save ₹10,000)', quantity: 10 },
    { id: 'pkg_sub_starter', name: 'Starter Plan', type: 'SUBSCRIPTION', amountPaise: 1500000, description: 'Up to 5 interviews/month with dedicated support', interviewsIncluded: 5 },
    { id: 'pkg_sub_growth', name: 'Growth Plan', type: 'SUBSCRIPTION', amountPaise: 2500000, description: 'Up to 15 interviews/month with priority matching', interviewsIncluded: 15 },
];

const MOCK_HISTORY: PaymentRecord[] = [
    { id: '1', amount: 300000, type: 'PER_INTERVIEW', status: 'COMPLETED', gatewayOrderId: 'order_abc123', createdAt: '2026-03-01T10:00:00Z' },
    { id: '2', amount: 1250000, type: 'BULK', status: 'COMPLETED', gatewayOrderId: 'order_def456', createdAt: '2026-02-15T10:00:00Z' },
    { id: '3', amount: 600000, type: 'PER_INTERVIEW', status: 'PENDING', gatewayOrderId: null, createdAt: '2026-03-02T10:00:00Z' },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function Billing() {
    const [activeTab, setActiveTab] = useState<'packages' | 'history'>('packages');
    const [selectedType, setSelectedType] = useState<'ALL' | 'PER_INTERVIEW' | 'BULK' | 'SUBSCRIPTION'>('ALL');
    const [selectedPackage, setSelectedPackage] = useState<string | null>(null);

    const filteredPackages = MOCK_PACKAGES.filter((p) =>
        selectedType === 'ALL' ? true : p.type === selectedType
    );

    const totalSpent = MOCK_HISTORY
        .filter((r) => r.status === 'COMPLETED')
        .reduce((s, r) => s + r.amount, 0);

    const formatINR = (paise: number) =>
        new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(paise / 100);

    const handleBuyNow = (pkg: Package) => {
        setSelectedPackage(pkg.id);
        // In production: call POST /api/payments/order, then open Razorpay checkout
        alert(`Razorpay checkout will open for: ${pkg.name}\n\nIn production, integrate the Razorpay JS SDK here.`);
        setSelectedPackage(null);
    };

    const statusColor: Record<string, string> = {
        COMPLETED: '#22c55e',
        PENDING: '#f59e0b',
        FAILED: '#ef4444',
        REFUNDED: '#6b7280',
    };

    return (
        <div className="billing-page">
            {/* ─── Page Header ─── */}
            <motion.div className="billing-header" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="billing-header__icon"><CreditCard size={22} /></div>
                <div>
                    <h1>Billing & Packages</h1>
                    <p>Choose the plan that fits your hiring velocity.</p>
                </div>
            </motion.div>

            {/* ─── Stats Strip ─── */}
            <motion.div className="billing-stats" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
                <div className="billing-stat">
                    <TrendingUp size={18} />
                    <div>
                        <span className="stat-value">{formatINR(totalSpent)}</span>
                        <span className="stat-label">Total Spent</span>
                    </div>
                </div>
                <div className="billing-stat">
                    <BarChart2 size={18} />
                    <div>
                        <span className="stat-value">{MOCK_HISTORY.filter((r) => r.status === 'COMPLETED').length}</span>
                        <span className="stat-label">Paid Orders</span>
                    </div>
                </div>
                <div className="billing-stat">
                    <ShieldCheck size={18} />
                    <div>
                        <span className="stat-value">Razorpay</span>
                        <span className="stat-label">Secure Payments</span>
                    </div>
                </div>
            </motion.div>

            {/* ─── Tabs ─── */}
            <div className="billing-tabs">
                <button className={`billing-tab ${activeTab === 'packages' ? 'active' : ''}`} onClick={() => setActiveTab('packages')}>
                    <Package size={15} /> Packages
                </button>
                <button className={`billing-tab ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>
                    <Clock size={15} /> Payment History
                </button>
            </div>

            {activeTab === 'packages' && (
                <>
                    {/* ─── Type Filter ─── */}
                    <div className="package-filter">
                        {(['ALL', 'PER_INTERVIEW', 'BULK', 'SUBSCRIPTION'] as const).map((t) => (
                            <button key={t} className={`filter-chip ${selectedType === t ? 'active' : ''}`} onClick={() => setSelectedType(t)}>
                                {t === 'ALL' ? 'All Plans' : TYPE_LABELS[t]}
                            </button>
                        ))}
                    </div>

                    {/* ─── Package Cards Grid ─── */}
                    <div className="packages-grid">
                        {filteredPackages.map((pkg, i) => (
                            <motion.div
                                key={pkg.id}
                                className={`package-card ${pkg.type === 'SUBSCRIPTION' ? 'package-card--featured' : ''}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                            >
                                {pkg.type === 'SUBSCRIPTION' && (
                                    <div className="package-badge">Most Popular</div>
                                )}
                                <div className="package-type-chip">
                                    {TYPE_ICONS[pkg.type]} {TYPE_LABELS[pkg.type]}
                                </div>
                                <h3 className="package-name">{pkg.name}</h3>
                                <div className="package-price">
                                    <span className="price-amount">{formatINR(pkg.amountPaise)}</span>
                                    {pkg.type === 'SUBSCRIPTION' && <span className="price-period">/month</span>}
                                </div>
                                <p className="package-desc">{pkg.description}</p>

                                {pkg.quantity && (
                                    <div className="package-feature">
                                        <CheckCircle2 size={14} /> {pkg.quantity} interviews included
                                    </div>
                                )}
                                {pkg.interviewsIncluded && (
                                    <div className="package-feature">
                                        <CheckCircle2 size={14} /> {pkg.interviewsIncluded} interviews/month
                                    </div>
                                )}
                                <div className="package-feature"><CheckCircle2 size={14} /> Razorpay secure checkout</div>
                                <div className="package-feature"><CheckCircle2 size={14} /> Instant confirmation email</div>

                                <motion.button
                                    className="package-cta"
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    disabled={selectedPackage === pkg.id}
                                    onClick={() => handleBuyNow(pkg)}
                                >
                                    {selectedPackage === pkg.id ? 'Processing...' : (<>Buy Now <ArrowRight size={14} /></>)}
                                </motion.button>
                            </motion.div>
                        ))}
                    </div>
                </>
            )}

            {activeTab === 'history' && (
                <div className="payment-history">
                    {MOCK_HISTORY.length === 0 ? (
                        <div className="empty-state">No payments yet.</div>
                    ) : (
                        MOCK_HISTORY.map((record, i) => (
                            <motion.div key={record.id} className="history-row" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                                <div className="history-left">
                                    <div className="history-icon">{TYPE_ICONS[record.type]}</div>
                                    <div>
                                        <p className="history-type">{TYPE_LABELS[record.type]}</p>
                                        <p className="history-id">{record.gatewayOrderId || '—'}</p>
                                    </div>
                                </div>
                                <div className="history-right">
                                    <span className="history-amount">{formatINR(record.amount)}</span>
                                    <span className="history-status" style={{ color: statusColor[record.status] }}>
                                        ● {record.status}
                                    </span>
                                    <span className="history-date">{new Date(record.createdAt).toLocaleDateString('en-IN')}</span>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
