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

/**
 * @api {get} /menu Get all menu items
 * @apiName GetMenu
 * @apiGroup Menu
 * @apiSuccess {Object[]} items Menu items
 */
menuRouter
  .route('/')
  .get(getMenu)

  /**
   * @api {post} /menu Add new menu item
   * @apiName AddItem
   * @apiGroup Menu
   * @apiHeader {string} Authorization Bearer token
   * @apiBody {String} name
   * @apiBody {String} category Main / Side / Drink
   * @apiBody {Number} price
   * @apiBody {File} menu-item-image Image
   * @apiBody {Boolean} gluten-free
   * @apiBody {Boolean} lactose-free
   * @apiBody {Boolean} vegan
   */
  .post(
    authenticateToken,
    upload.single('menu-item-image'),
    createImage,
    createThumbnail,
    addItem
  );

/**
 * @api {get} /menu/:id Get menu item by ID
 * @apiName GetItemById
 * @apiGroup Menu
 * @apiParam {Number} id
 * @apiSuccess {Number} menu_item_id
 * @apiSuccess {String} name Name / title of item
 * @apiSuccess {String} description
 * @apiSuccess {Boolean} gluten_free
 * @apiSuccess {Boolean} lactose_free
 * @apiSuccess {Boolean} vegan
 * @apiSuccess {String} category Main / Side / Drink
 * @apiSuccess {String} picture_filename
 * @apiSuccess {Number} price
 */
menuRouter
  .route('/:id')
  .get(getItemById)

  /**
   * @api {put} /menu/:id Update item by ID
   * @apiName UpdateItem
   * @apiGroup Menu
   * @apiHeader {String} Authorization Bearer token
   * @apiParam {Number} id
   * @apiBody {Object} item
   */
  .put(authenticateToken, putItem)

  /**
   * @api {delete} /menu/:id Delete item by ID
   * @apiName DeleteItem
   * @apiGroup Menu
   * @apiHeader {String} Authorization Bearer token
   * @apiParam {Number} id
   */
  .delete(authenticateToken, deleteItem);

export default menuRouter;
