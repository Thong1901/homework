// test-pg.ts
import { Pool } from 'pg';

console.log('Testing PG import...');
console.log('Pool:', Pool);

const pool = new Pool({
    connectionString: 'postgresql://neondb_owner:npg_jtF7PXbKQAz0@ep-proud-base-a1kgqq0z-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
    ssl: { rejectUnauthorized: false }
});


export default pool;