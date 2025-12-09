import {
  fetchAllOrders,
  fetchOrdersById,
  fetchOrderItemsByOrderId,
  insertOrder,
  insertOrderItems,
  updateOrder,
} from '../models/order-model.js';
import { getItemById } from '../models/menu-model.js';

export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await fetchAllOrders();
    return res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const orderId = req.params.id;
    const order = await fetchOrdersById(orderId);
    const orderItems = await fetchOrderItemsByOrderId(orderId);
    if (!order || !orderItems.length) {
      const error = new Error('Order not found');
      error.status = 404;
      return next(error);
    }
    order.items = orderItems;
    res.status(200).json(order);
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

export const postOrder = async (req, res, next) => {
  try {
    const {
      user_id,
      food_modification = null,
      delivery_instruction = null,
      items,
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Item not found' });
    }

    let totalPrice = 0;
    for (const item of items) {
      const menuItem = await getItemById(item.menu_item_id);
      if (menuItem.length === 0)
        return res
          .status(400)
          .json({ error: `Menu item ${item.menu_item_id} not found` });
      totalPrice += menuItem.price * item.quantity;
    }

    const orderData = {
      user_id,
      food_modification,
      delivery_instruction,
      total_price: totalPrice,
    };

    const insertedOrder = await insertOrder(orderData);
    const orderId = insertedOrder.id;

    await insertOrderItems(orderId, items);

    res.status(200).json({ message: 'Order created', orderId: orderId });
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

// Only status can be modified for now, todo: maybe others?
export const putOrder = async (req, res, next) => {
  try {
    // Auth
    if (!req.user) {
      const err = new Error('Not logged in');
      err.status(401);
      return next(err);
    }
    if (req.user.role !== 'admin') {
      const err = new Error('User not admin');
      err.status(403);
      return next(err);
    }

    // order?
    const orderId = req.params.id;
    if (!orderId) return next(new Error('Missing info'));

    // data object for db
    const { status } = req.body;
    const data = {};
    if (status) data.status = status;

    // db
    const result = await updateOrder(orderId, data);
    if (!result) return next(new Error('Database error'));

    res.status(200).json({ ok: true, message: 'Updated order status' });
  } catch (error) {
    console.error(error);
    return next(error);
  }
};
