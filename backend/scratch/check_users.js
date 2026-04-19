import { query } from '../src/db/pool.js';

async function checkUsers() {
  try {
    const res = await query('SELECT id, email, role FROM users');
    console.log('Users in database:', res.rows);
  } catch (err) {
    console.error('Error fetching users:', err.message);
  } finally {
    process.exit();
  }
}

checkUsers();
