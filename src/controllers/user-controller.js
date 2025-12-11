import bcrypt from 'bcrypt';
import * as User from '../models/user-model.js';

export const getUserById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const user = await User.getUserById(id);

    if (!user) {
      const error = new Error('User not found');
      error.status = 404;
      return next(error);
    }

    delete user.password_hash;

    if (req.user && (req.user.id === id || req.user.role === 'admin')) {
      return res.status(200).json(user);
    } else {
      // unauthorized: get sanitized info
      return res.status(200).json({
        username: user.username,
        profile_pic_filename: user.profile_pic_filename,
        profile_description: user.profile_description,
        role: user.role,
      });
    }
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

export const postUser = async (req, res, next) => {
  try {
    const {
      username,
      password,
      email,
      address = null,
      phone = null,
    } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await User.postUser({
      username,
      passwordHash,
      email,
      address,
      phone,
    });
    if (!result) {
      const error = new Error('Error: could not add user');
      return next(error);
    }
    res
      .status(201)
      .json({ message: 'Successfully created user', id: result.id });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const putUser = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    // auth
    if (!req.user) {
      const err = new Error();
      err.status = 401;
      return next(err);
    }
    if (req.user.id !== id && req.user.role !== 'admin') {
      const err = new Error();
      err.status = 403;
      return next(err);
    }

    const { first_name, last_name, username, address, phone } = req.body;

    const newUser = {};
    if (first_name) newUser.first_name = first_name;
    if (last_name) newUser.last_name = last_name;
    if (username) newUser.username = username;
    if (address) newUser.address = address;
    if (phone) newUser.phone = phone;

    const result = await User.updateUser(id, newUser);
    if (!result) return next(new Error('Database error'));

    return res.status(200).json({ ok: true, message: 'Updated user info' });
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    if (!req.user) return res.sendStatus(401);
    if (req.user.id !== id && req.user.role !== 'admin')
      return res.sendStatus(403);

    const result = await User.deleteUser(id);
    if (!result) {
      const error = new Error('User not found');
      error.status = 404;
      return next(error);
    }
    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    return next(error);
  }
};
