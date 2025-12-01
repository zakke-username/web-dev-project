import {fetchAllOrders, fetchOrdersById, fetchOrderItemsByOrderId} from '../models/order-model.js';

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
