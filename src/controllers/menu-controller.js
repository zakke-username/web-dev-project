import * as Menu from '../models/menu-model.js';

export const getMenu = async (req, res) => {
  try {
    const menu = await Menu.getMenu();
    return res.status(200).json(menu);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to retrieve menu' });
  }
};

export const getItemById = async (req, res) => {
  try {
    const item = await Menu.getItemById(req.params.id);
    if (item) {
      return res.status(200).json(item);
    } else {
      return res.status(404).json({ message: 'Did not find item' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const addItem = async (req, res, next) => {
  try {
    const {
      name,
      gluten_free = null,
      lactose_free = null,
      vegan = null,
      category,
      price,
      description = null,
      picture_filename = null,
    } = req.body;

    if (!name || !category || price == null) {
      return res.status(400).json({ message: 'Missing required information' });
    }

    if (isNaN(parseFloat(price)))
      return res.status(400).json({ message: 'Invalid price' });

    const isGlutenFree = gluten_free ? 1 : 0;
    const isLactoseFree = lactose_free ? 1 : 0;
    const isVegan = vegan ? 1 : 0;

    const result = await Menu.addItem({
      name,
      isGlutenFree,
      isLactoseFree,
      isVegan,
      category,
      price,
      description,
      picture_filename,
    });

    if (!result) {
      const error = new Error('Database error: failed to add item');
      error.status = 500;
      return next(error);
    }

    return res
      .status(201)
      .json({ message: 'Added new menu item', id: result.id });
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

export const deleteItem = async (req, res) => {
  try {
    const result = await Menu.deleteItem(req.params.id);
    if (result) {
      return res.status(200).json({ message: 'Deleted item from menu' });
    } else {
      return res.status(404).json({ message: 'Item was not found' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error while deleting item' });
  }
};
