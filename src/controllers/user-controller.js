import bcrypt from 'bcrypt';
import * as User from '../models/user-model.js';

export const getUserById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const user = await User.getUserById(id);
    if (!user) {
      const error = new Error('Cannot find user');
      error.status = 404;
      return next(error);
    }
    delete user.password_hash;
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

export const postUser = async (req, res, next) => {
  try {
    const { username, password, email, address, phone = null } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const result = await User.postUser({
      username,
      passwordHash,
      email,
      address,
      phone,
    });
    if (!result) {
      const error = new Error('Database error: could not add user');
      return next(error);
    }
    res
      .status(201)
      .json({ message: 'Successfully created user', id: result.id });
  } catch (error) {
    // todo: duplicate entry message
    console.error(error);
    next(error);
  }
};
