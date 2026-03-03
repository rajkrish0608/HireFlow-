/**
 * Multi-Currency Support
 *
 * Manages exchange rates and currency conversion for payments.
 * Supports INR, USD, EUR, GBP. Rates are refreshed from config
 * (connect to a live FX API like Open Exchange Rates in production).
 */

export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP';

interface CurrencyInfo {
    code: CurrencyCode;
    name: string;
    symbol: string;
    rateToINR: number; // How many INR paise = 1 smallest unit of this currency
}

// Base rates: 1 unit of foreign = X paise of INR
// In production: fetch from https://api.exchangerate-api.com
const CURRENCIES: Record<CurrencyCode, CurrencyInfo> = {
    INR: { code: 'INR', name: 'Indian Rupee', symbol: '₹', rateToINR: 1 },
    USD: { code: 'USD', name: 'US Dollar', symbol: '$', rateToINR: 83.50 },
    EUR: { code: 'EUR', name: 'Euro', symbol: '€', rateToINR: 90.75 },
    GBP: { code: 'GBP', name: 'British Pound', symbol: '£', rateToINR: 105.80 },
};

/**
 * Convert amount from INR paise to target currency (smallest unit).
 * E.g. 300000 INR paise (₹3,000) → ~3593 USD cents ($35.93)
 */
export function convertFromINR(amountPaise: number, to: CurrencyCode): number {
    if (to === 'INR') return amountPaise;
    const rate = CURRENCIES[to].rateToINR;
    return Math.round(amountPaise / rate);
}

/**
 * Convert amount from source currency (smallest unit) to INR paise.
 */
export function convertToINR(amount: number, from: CurrencyCode): number {
    if (from === 'INR') return amount;
    const rate = CURRENCIES[from].rateToINR;
    return Math.round(amount * rate);
}

/**
 * Format an amount in the smallest unit to a display string.
 */
export function formatCurrency(amount: number, currency: CurrencyCode): string {
    const info = CURRENCIES[currency];
    const major = amount / 100;
    return `${info.symbol}${major.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/**
 * Returns all supported currencies and their INR rates.
 */
export function getSupportedCurrencies(): CurrencyInfo[] {
    return Object.values(CURRENCIES);
}

/**
 * Returns a price list for a package in all currencies.
 */
export function getMultiCurrencyPrice(amountPaise: number): Record<CurrencyCode, { amount: number; display: string }> {
    const result: Record<string, { amount: number; display: string }> = {};
    for (const currency of Object.keys(CURRENCIES) as CurrencyCode[]) {
        const converted = convertFromINR(amountPaise, currency);
        result[currency] = {
            amount: converted,
            display: formatCurrency(converted, currency),
        };
    }
    return result as Record<CurrencyCode, { amount: number; display: string }>;
}
