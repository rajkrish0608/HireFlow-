import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';

/**
 * Derives a 32-byte key from the app's JWT_SECRET using SHA-256.
 * This means no separate ENCRYPTION_KEY env var is needed.
 */
function getEncryptionKey(): Buffer {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET not set – cannot derive encryption key');
    return crypto.createHash('sha256').update(secret).digest();
}

/**
 * Encrypts a plaintext string.
 * Returns a colon-delimited string: `iv:authTag:ciphertext` (all hex-encoded).
 * Safe to store in a database TEXT column.
 */
export function encrypt(plaintext: string): string {
    const key = getEncryptionKey();
    const iv = crypto.randomBytes(12); // 96-bit IV for GCM
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

    const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
    const authTag = cipher.getAuthTag();

    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted.toString('hex')}`;
}

/**
 * Decrypts a string produced by `encrypt()`.
 * Throws if the data has been tampered with (auth tag mismatch).
 */
export function decrypt(encryptedData: string): string {
    const key = getEncryptionKey();
    const parts = encryptedData.split(':');
    if (parts.length !== 3) throw new Error('Invalid encrypted data format');

    const [ivHex, authTagHex, ciphertextHex] = parts;
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    const ciphertext = Buffer.from(ciphertextHex, 'hex');

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    return Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString('utf8');
}

/**
 * Hash a value (e.g. email) with SHA-256 for deterministic lookup
 * without storing plaintext. Use for non-reversible lookups.
 */
export function hashForLookup(value: string): string {
    const secret = process.env.JWT_SECRET || '';
    return crypto.createHmac('sha256', secret).update(value.toLowerCase().trim()).digest('hex');
}
