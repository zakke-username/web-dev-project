import * as Menu from '../models/menu-model.js';

export const getMenu = async (req, res, next) => {
  try {
    const menu = await Menu.getMenu();

    const boolDiets = menu.map((item) => {
      item.vegan = item.vegan === 1 ? true : false;
      item.gluten_free = item.gluten_free === 1 ? true : false;
      item.lactose_free = item.lactose_free === 1 ? true : false;
      return item;
    });

    return res.status(200).json(boolDiets);
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

export const getItemById = async (req, res, next) => {
  try {
    const item = await Menu.getItemById(req.params.id);

    item.vegan = item.vegan === 1 ? true : false;
    item.gluten_free = item.gluten_free === 1 ? true : false;
    item.lactose_free = item.lactose_free === 1 ? true : false;

    if (!item) {
      const error = new Error('Menu item not found');
      error.status = 404;
      return next(error);
    }
    return res.status(200).json(item);
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

export const addItem = async (req, res, next) => {
  try {
    // auth
    if (!req.user) return res.sendStatus(401);
    if (req.user.role !== 'admin') return res.sendStatus(403);

    // destructure variables from request
    const {
      name,
      gluten_free = null,
      lactose_free = null,
      vegan = null,
      category,
      price,
      description = null,
    } = req.body;

    // check for missing or invalid values
    if (!name || !category || price == null)
      return res.status(400).json({ message: 'Missing required information' });

    if (isNaN(parseFloat(price)))
      return res.status(400).json({ message: 'Invalid price' });

    // checkboxes -> boolean
    const isGlutenFree = gluten_free ? 1 : 0;
    const isLactoseFree = lactose_free ? 1 : 0;
    const isVegan = vegan ? 1 : 0;

    // call model / insert to db
    const result = await Menu.addItem({
      name,
      isGlutenFree,
      isLactoseFree,
      isVegan,
      category,
      price,
      description,
      picture_filename: req.file.filename || null,
    });
    if (!result) return next(new Error('Database error, failed to add item'));

    // success
    return res
      .status(201)
      .json({ message: 'Added new menu item', id: result.id });
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

export const deleteItem = async (req, res, next) => {
  try {
    if (!req.user) return res.sendStatus(401);
    if (req.user.role !== 'admin') return res.sendStatus(403);

    const result = await Menu.deleteItem(req.params.id);
    if (!result) {
      const error = new Error('Item not found');
      error.status = 404;
      return next(error);
    }
    return res.status(200).json({ message: 'Deleted item from menu' });
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

export const putItem = async (req, res, next) => {
  try {
    if (!req.user) {
      const err = new Error('Not logged in');
      err.status = 401;
      return next(err);
    }
    if (req.user.role !== 'admin') {
      const err = new Error('User not an admin');
      err.status = 403;
      return next(err);
    }

    const { id } = req.params;
    const { name, description, category, price } = req.body;

    const item = {};
    if (name) item.name = name;
    if (description) item.description = description;
    if (category) item.category = category;
    if (price) item.price = price;

    const result = await Menu.updateItem(id, item);
    if (!result) return next(new Error('Database error'));

    return res.status(200).json({ ok: true, message: 'Updated menu item' });
  } catch (error) {
    console.error(error);
    return next(error);
  }
};
