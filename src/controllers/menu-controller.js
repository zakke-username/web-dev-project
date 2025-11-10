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

export const addItem = async (req, res) => {
  try {
    const { name, description = null, category = null, price } = req.body;

    if (!name || price == null) {
      return res.status(400).json({ message: 'Missing required information' });
    }

    const result = await Menu.addItem({
      name,
      description,
      category,
      price,
    });

    if (result) {
      return res.status(201).json({ message: 'Added new menu item' });
    } else {
      return res.status(500).json({ message: 'Failed to add item' });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: 'Server error while adding menu item' });
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
