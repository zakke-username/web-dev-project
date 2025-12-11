import express from 'express';
import menuRouter from './menu-router.js';
import reviewRouter from './review-router.js';
import userRouter from './user-router.js';
import authRouter from './auth-router.js';
import orderRouter from './order-router.js';

const apiRouter = express.Router();

apiRouter.use('/menu', menuRouter);
apiRouter.use('/review', reviewRouter);
apiRouter.use('/user', userRouter);
apiRouter.use('/auth', authRouter);
apiRouter.use('/order', orderRouter);
apiRouter.use('/images', express.static('uploads'));

export default apiRouter;
