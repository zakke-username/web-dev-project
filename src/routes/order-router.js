import express from 'express';
import { body } from 'express-validator';
import { validationErrors } from '../middlewares/validation.js';
import {
  getAllOrders,
  getOrderById,
  postOrder,
  putOrder,
} from '../controllers/order-controller.js';
import { authenticateToken } from '../middlewares/auth.js';

const orderRouter = express.Router();

/**
 * @api {get} /order Get all orders
 * @apiName GetAllOrders
 * @apiGroup Order
 * @apiHeader {String} Authorization Bearer token
 * @apiSuccess {Object[]} orders
 */
orderRouter
  .route('/')
  .get(authenticateToken, getAllOrders)

  /**
   * @api {post} /order Send new order
   * @apiName PostOrder
   * @apiGroup Order
   * @apiBody {String} user_id
   * @apiBody {String} food_modification
   * @apiBody {String} delivery_instruction
   * @apiBody {Object[]} items
   */
  .post(
    authenticateToken,
    body('user_id').exists(),
    body('items').exists(),
    body('food_modification')
      .optional({ checkFalsy: true })
      .trim()
      .isLength({ max: 10000 }),
    body('delivery_instruction')
      .optional({ checkFalsy: true })
      .trim()
      .isLength({ max: 10000 }),
    validationErrors,
    postOrder
  );

/**
 * @api {get} /order/:id Get order by ID
 * @apiName GetOrderById
 * @apiGroup Order
 * @apiHeader {String} Authorization Bearer token
 * @apiParam {Number} id Order ID
 * @apiSuccess {Number} order_id
 * @apiSuccess {Number} user_id Customer's user ID
 * @apiSuccess {String} status Pending / Delivered / Cancelled
 * @apiSuccess {String} food_modification
 * @apiSuccess {String} delivery_instruction
 * @apiSuccess {Number} total_price
 */
orderRouter
  .route('/:id')
  .get(getOrderById)

  /**
   * @api {put} /order/:id Update order status
   * @apiName UpdateOrder
   * @apiGroup Order
   * @apiHeader {String} Authorization Bearer token
   * @apiParam {Number} id Order ID
   * @apiBody {Object} order
   */
  .put(authenticateToken, body('status').exists(), validationErrors, putOrder);

export default orderRouter;
