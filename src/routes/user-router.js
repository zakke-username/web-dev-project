import express from 'express';
import { body } from 'express-validator';
import {
  authenticateToken,
  authenticateTokenOptional,
} from '../middlewares/auth.js';
import { validationErrors } from '../middlewares/validation.js';
import {
  getUserById,
  postUser,
  putUser,
  deleteUser,
} from '../controllers/user-controller.js';

const userRouter = express.Router();

/**
 * @api {post} /user Register new user
 * @apiName PostUser
 * @apiGroup User
 * @apiBody {String} username
 * @apiBody {String} password
 * @apiBody {String} email
 */
userRouter
  .route('/')
  .post(
    body('username').trim().isLength({ min: 3, max: 20 }).isAlphanumeric(),
    body('password').isLength({ min: 8 }),
    body('email').trim().isEmail(),
    validationErrors,
    postUser
  );

/**
 * @api {get} /user/:id Get user by ID
 * @apiName GetUser
 * @apiGroup User
 * @apiParam id
 * @apiHeader Authorization Bearer token (optional)
 * @apiSuccess {Object} user
 * @apiSuccess {String} user.username
 * @apiSuccess {String} user.profile_pic_filename
 * @apiSuccess {String} user.profile_description
 */
userRouter
  .route('/:id')
  .get(authenticateTokenOptional, getUserById)

  /**
   * @api {put} /user/:id Update user info
   * @apiName UpdateUser
   * @apiHeader Authorization Bearer token
   * @apiGroup User
   * @apiParam id
   * @apiBody {Object} user Object containing info to be updated
   */
  .put(authenticateToken, validationErrors, putUser)

  /**
   * @api {delete} /user/:id Delete user by ID
   * @apiName DeleteUser
   * @apiGroup User
   * @apiHeader Authorization Bearer token
   * @apiParam id
   */
  .delete(authenticateToken, deleteUser);
export default userRouter;
