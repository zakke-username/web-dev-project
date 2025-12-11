import jwt from 'jsonwebtoken';
import 'dotenv/config';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
    if (error) return res.sendStatus(403);
    req.user = decoded;
    next();
  });
};

export const authenticateTokenOptional = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    req.user = null;
    return next();
  }
  jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
    req.user = error ? null : decoded;
    return next();
  });
};
