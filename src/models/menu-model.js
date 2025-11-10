import pool from '../utils/database.js';

export const getMenu = async () => {
  const [menuItems] = await pool.execute('SELECT * FROM menu');
  return menuItems;
};

export const getItemById = async (id) => {
  const [rows] = await pool.execute(
    'SELECT * FROM menu WHERE menu_item_id = ?',
    [id]
  );
  return rows[0];
};

export const addItem = async (item) => {
  const { name, description = null, category = null, price } = item;
  const rows = await pool.execute(
    'INSERT INTO menu (name, description, category, price) VALUES (?, ?, ?, ?)',
    [name, description, category, price]
  );
  if (rows.affectedRows === 0) {
    return false;
  }
  return true;
};

export const deleteItem = async (id) => {
  const [rows] = await pool.execute('DELETE FROM menu WHERE menu_item_id = ?', [
    id,
  ]);
  if (rows.affectedRows === 0) {
    return false;
  }
  return true;
};
