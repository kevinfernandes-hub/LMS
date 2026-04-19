import { query } from '../src/db/pool.js';

async function checkSchema() {
  try {
    const res = await query("SELECT column_name FROM information_schema.columns WHERE table_name = 'users'");
    console.log('Columns in users table:', res.rows.map(r => r.column_name));
  } catch (err) {
    console.error('Error fetching schema:', err.message);
  } finally {
    process.exit();
  }
}

checkSchema();
