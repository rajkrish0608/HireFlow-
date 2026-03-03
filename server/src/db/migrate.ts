import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { db, pool } from '../config/db';
import path from 'path';

async function runMigrations() {
    console.log('[Migration] Running database migrations...');
    try {
        await migrate(db, {
            migrationsFolder: path.join(__dirname, 'migrations'),
        });
        console.log('[Migration] ✅ All migrations applied successfully');
    } catch (error) {
        console.error('[Migration] ❌ Migration failed:', error);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

runMigrations();
