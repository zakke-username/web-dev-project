import express from 'express';
import { authenticateToken } from '../middlewares/auth.js';
import { upload, createImage, createThumbnail } from '../middlewares/images.js';
import {
  getMenu,
  getItemById,
  addItem,
  deleteItem,
  putItem,
} from '../controllers/menu-controller.js';

const menuRouter = express.Router();

// TODO: menu post input validation
menuRouter
  .route('/')
  .get(getMenu)
  .post(
    authenticateToken,
    upload.single('menu-item-image'),
    createImage,
    createThumbnail,
    addItem
  );
menuRouter
  .route('/:id')
  .get(getItemById)
  .put(authenticateToken, putItem)
  .delete(authenticateToken, deleteItem);

export default menuRouter;
