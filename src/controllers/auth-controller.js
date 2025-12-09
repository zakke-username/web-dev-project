import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { getUserByUsername } from '../models/user-model.js';

export const login = async (req, res, next) => {
  try {
    console.log(req.body);
    const user = await getUserByUsername(req.body.username);
    if (!user) return res.sendStatus(401);

    const passwordCompare = await bcrypt.compare(
      req.body.password,
      user.password_hash
    );
    if (!passwordCompare) return res.sendStatus(401);

    const safeUser = {
      id: user.user_id,
      username: user.username,
      role: user.role,
    };
    const token = jwt.sign(safeUser, process.env.JWT_SECRET, {
      expiresIn: '24h',
    });
    return res.status(200).json({ user: safeUser, token });
  } catch (error) {
    console.error(error);
    return next(error);
  }
};
