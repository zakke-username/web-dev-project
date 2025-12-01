import express from 'express';
import { authenticateToken } from '../middlewares/auth.js';
import {
  getMenu,
  getItemById,
  addItem,
  deleteItem,
} from '../controllers/menu-controller.js';

const menuRouter = express.Router();

menuRouter.route('/').get(getMenu).post(authenticateToken, addItem);
menuRouter.route('/:id').get(getItemById).delete(authenticateToken, deleteItem);

export default menuRouter;
