import { query } from '../src/db/pool.js';

async function testConnection() {
  try {
    const res = await query('SELECT NOW()');
    console.log('Database connection successful:', res.rows[0]);
    
    const tables = await query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
    console.log('Tables in database:', tables.rows.map(r => r.table_name));
  } catch (err) {
    console.error('Database connection failed:', err.message);
  } finally {
    process.exit();
  }
}

testConnection();
