import express from 'express';
import {
  getMenu,
  getItemById,
  addItem,
  deleteItem,
} from '../controllers/menu-controller.js';

const menuRouter = express.Router();

menuRouter.route('/').get(getMenu).post(addItem);
menuRouter.route('/:id').get(getItemById).delete(deleteItem);

export default menuRouter;
