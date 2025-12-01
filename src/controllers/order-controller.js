import {fetchAllOrders, fetchOrdersById, fetchOrderItemsByOrderId, insertOrder, insertOrderItems} from '../models/order-model.js';
import pool from '../utils/database.js';

export const getAllOrders = async (req, res) => {
  try {
    const orders = await fetchAllOrders();
    return res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    return res.status(500).json({})
  }
}

export const getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;
    const orderArray = await fetchOrdersById(orderId);
    const orderItems = await fetchOrderItemsByOrderId(orderId);
    if (!orderArray || orderItems.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    const order = orderArray[0];
    order.items = orderItems;
    res.status(200).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
}

export const postOrder = async (req, res) => {
  try {
    const {
      user_id,
      food_modification = null,
      delivery_instruction = null,
      items
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Item not found' });
    }

    let totalPrice = 0;
    for (const item of items) {
      const [menu] = await pool.execute('SELECT price FROM menu WHERE menu_item_id = ?', [item.menu_item_id]);
      if (menu.length === 0) return res.status(400).json({ error: `Menu item ${item.menu_item_id} not found` });
      totalPrice += menu[0].price * item.quantity;
    }

    const orderData = {
      user_id,
      food_modification,
      delivery_instruction,
      total_price: totalPrice
    };

    const insertedOrder = await insertOrder(orderData);
    const orderId = insertedOrder.id;

    await insertOrderItems(orderId, items);

    res.status(200).json({ message: 'Order created', orderId: orderId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
}
