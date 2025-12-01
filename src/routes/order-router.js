import express from 'express';
import {
  getAllOrders, getOrderById,
} from '../controllers/order-controller.js';

const orderRouter = express.Router();

orderRouter.route('/').get(getAllOrders);

orderRouter.route('/:id').get(getOrderById);

export default orderRouter;
