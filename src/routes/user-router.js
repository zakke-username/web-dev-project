import express from 'express';
import { body } from 'express-validator';
// import { authenticateToken } from '../middlewares/auth.js';
import { validationErrors } from '../middlewares/validation.js';
import { getUserById, postUser } from '../controllers/user-controller.js';

const userRouter = express.Router();

userRouter
  .route('/')
  .post(
    body('username').trim().isLength({ min: 3, max: 20 }).isAlphanumeric(),
    body('password').isLength({ min: 8 }),
    body('email').trim().isEmail(),
    validationErrors,
    postUser
  );
userRouter.route('/:id').get(getUserById);

export default userRouter;
