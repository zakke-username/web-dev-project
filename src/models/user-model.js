import pool from '../utils/database.js';

// TODO: return info conditionally: if not auth, only basic public info
export const getUserById = async (id) => {
  const [rows] = await pool.execute('SELECT * FROM users WHERE user_id = ?', [
    id,
  ]);
  if (!rows.length) return false;
  return rows[0];
};

export const getUserByUsername = async (username) => {
  const [rows] = await pool.execute('SELECT * FROM users WHERE username = ?', [
    username,
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

export const updateUser = async (id, user) => {
  const query = pool.format('UPDATE users SET ? WHERE user_id = ?', [user, id]);
  const [result] = await pool.execute(query);
  if (!result.affectedRows) return false;
  return true;
};

export const deleteUser = async (id) => {
  const [result] = await pool.execute('DELETE FROM users WHERE user_id = ?', [
    id,
  ]);
  if (result.affectedRows === 0) return false;
  return true;
};
