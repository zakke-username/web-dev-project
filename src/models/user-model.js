import pool from '../utils/database.js';

export const getUserById = async (id) => {
  const [rows] = await pool.execute('SELECT * FROM users WHERE user_id = ?', [
    id,
  ]);
  if (!rows.length) return false;
  return rows[0];
};

export const postUser = async (user) => {
  const { username, passwordHash, email, address, phone = null } = user;
  const [result] = await pool.execute(
    'INSERT INTO users (username, password_hash, email, address, phone) VALUES (?, ?, ?, ?, ?)',
    [username, passwordHash, email, address, phone]
  );
  if (result.affectedRows === 0) return false;
  return { id: result.insertId };
};
