import Razorpay from 'razorpay';
import { config } from '../config/env';

if (!config.razorpay.keyId || !config.razorpay.keySecret) {
    console.warn('[Razorpay] ⚠️  RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET not set – payment APIs will return mock responses.');
}

export const razorpay = new Razorpay({
    key_id: config.razorpay.keyId || 'rzp_test_placeholder',
    key_secret: config.razorpay.keySecret || 'placeholder_secret',
});
