import express from 'express';
import {
  getAllOrders,
  getOrderById,
  postOrder,
} from '../controllers/order-controller.js';

const orderRouter = express.Router();

orderRouter.route('/').get(getAllOrders).post(postOrder);

orderRouter.route('/:id').get(getOrderById);

export default orderRouter;
