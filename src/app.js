import express from 'express';
import router from './routes/index.js';
import { notFoundHandler, errorHandler } from './middlewares/error.js';

const app = express();

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', router);

router.use(notFoundHandler);
router.use(errorHandler);

export default app;
