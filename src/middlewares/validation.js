import { validationResult } from 'express-validator';

export const validationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();

  const messages = errors
    .array()
    .map((e) => `${e.path}: ${e.msg}`)
    .join(', ');
  const error = new Error(messages);
  error.status = 400;
  return next(error);
};
