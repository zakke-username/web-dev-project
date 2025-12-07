import express from 'express';
import { authenticateToken } from '../middlewares/auth.js';
import { upload, createImage, createThumbnail } from '../middlewares/images.js';
import {
  getMenu,
  getItemById,
  addItem,
  deleteItem,
} from '../controllers/menu-controller.js';

const menuRouter = express.Router();

// TODO: menu post input validation
menuRouter
  .route('/')
  .get(getMenu)
  .post(
    upload.single('menu-item-image'),
    createImage,
    createThumbnail,
    authenticateToken,
    addItem
  );
menuRouter.route('/:id').get(getItemById).delete(authenticateToken, deleteItem);

export default menuRouter;
