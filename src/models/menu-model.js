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
  const {
    name,
    isGlutenFree,
    isLactoseFree,
    isVegan,
    category,
    price,
    description = null,
    picture_filename = null,
  } = item;

  const [result] = await pool.execute(
    'INSERT INTO menu (name, gluten_free, lactose_free, vegan, category, price, description, picture_filename) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [
      name,
      isGlutenFree,
      isLactoseFree,
      isVegan,
      category,
      price,
      description,
      picture_filename,
    ]
  );

  if (result.affectedRows === 0) return false;
  return { id: result.insertId };
};

export const deleteItem = async (id) => {
  const [rows] = await pool.execute('DELETE FROM menu WHERE menu_item_id = ?', [
    id,
  ]);
  if (rows.affectedRows === 0) return false;
  return true;
};
