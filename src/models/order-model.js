import pool from '../utils/database.js';

export const fetchAllOrders = async () => {
  const [orders] = await pool.execute('SELECT * FROM orders');
  return orders;
}

export const fetchOrdersById = async (orderId) => {
  const [orders] = await pool.execute('' +
    'SELECT * FROM orders WHERE order_id = ?',
    [orderId]);
  return orders;
}

export const fetchOrderItemsByOrderId = async (orderId) => {
  const [orderItems] = await pool.execute(
    'SELECT oi.*, m.name, m.price ' +
    'FROM order_items oi ' +
    'JOIN menu m ' +
    'ON oi.menu_item_id = m.menu_item_id ' +
    'WHERE oi.order_id = ?',
    [orderId]);
  return orderItems;
}
