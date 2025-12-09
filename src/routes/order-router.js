import express from 'express';
import {
  getAllOrders,
  getOrderById,
  postOrder,
  putOrder,
} from '../controllers/order-controller.js';
import { authenticateToken } from '../middlewares/auth.js';

const orderRouter = express.Router();

orderRouter.route('/').get(getAllOrders).post(postOrder);
orderRouter.route('/:id').get(getOrderById).put(authenticateToken, putOrder);

export default orderRouter;
