import express from 'express';
import menuRouter from './menu-router.js';

const router = express.Router();

router.use('/menu', menuRouter);

export default router;
