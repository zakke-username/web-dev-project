import express from 'express';
import menuRouter from './menu-router.js';
import reviewRouter from './review-router.js';

const router = express.Router();

router.use('/menu', menuRouter);
router.use('/review', reviewRouter);

export default router;
