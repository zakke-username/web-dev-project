import pool from '../utils/database.js';

export const fetchAllOrders = async () => {
  const [orders] = await pool.execute('SELECT * FROM orders');
  return orders;
};

export const fetchOrdersById = async (orderId) => {
  const [orders] = await pool.execute(
    '' + 'SELECT * FROM orders WHERE order_id = ?',
    [orderId]
  );
  return orders[0];
};

export const fetchOrderItemsByOrderId = async (orderId) => {
  const [orderItems] = await pool.execute(
    'SELECT oi.*, m.name, m.price ' +
      'FROM order_items oi ' +
      'JOIN menu m ' +
      'ON oi.menu_item_id = m.menu_item_id ' +
      'WHERE oi.order_id = ?',
    [orderId]
  );
  return orderItems;
};

export const insertOrder = async (orderData) => {
  const { user_id, food_modification, delivery_instruction, total_price } =
    orderData;
  const [result] = await pool.execute(
    'INSERT INTO orders (user_id, food_modification, delivery_instruction, total_price) VALUES (?, ?, ?, ?)',
    [user_id, food_modification, delivery_instruction, total_price]
  );
  if (result.affectedRows === 0) return false;
  return { id: result.insertId };
};

export const insertOrderItems = async (orderId, items) => {
  const promises = items.map((item) =>
    pool.execute(
      'INSERT INTO order_items (order_id, menu_item_id, quantity) VALUES (?, ?, ?)',
      [orderId, item.menu_item_id, item.quantity]
    )
  );
  await Promise.all(promises);
};

export const updateOrder = async (orderId, order) => {
  const { status } = order;
  const [res] = await pool.execute(
    'UPDATE orders SET status = ? WHERE order_id = ?',
    [status, orderId]
  );

  if (res.affectedRows === 0) return false;
  return true;
};
