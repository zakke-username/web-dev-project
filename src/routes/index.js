import express from 'express';
import menuRouter from './menu-router.js';
import reviewRouter from './review-router.js';
import userRouter from './user-router.js';
// import orderRouter from './order-router.js';

const router = express.Router();

router.use('/menu', menuRouter);
router.use('/review', reviewRouter);
router.use('/user', userRouter);
// router.use('/order', orderRouter);

export default router;
