import express from 'express';
import { login } from '../controllers/auth-controller.js';
// import { authenticateToken } from '../middlewares/auth.js';

const authRouter = express.Router();

// TODO: validation
authRouter.route('/login').post(login);

export default authRouter;
