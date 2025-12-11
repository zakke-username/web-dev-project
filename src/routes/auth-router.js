import express from 'express';
import { body } from 'express-validator';
import { validationErrors } from '../middlewares/validation.js';
import { login } from '../controllers/auth-controller.js';
// import { authenticateToken } from '../middlewares/auth.js';

const authRouter = express.Router();

/**
 * @api {post} /auth/login Log in user
 * @apiName Login
 * @apiGroup Auth
 * @apiBody {String} username
 * @apiBody {String} password
 */
authRouter
  .route('/login')
  .post(
    body('username').exists(),
    body('password').exists(),
    validationErrors,
    login
  );

export default authRouter;
