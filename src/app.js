import express from 'express';
import cors from 'cors';
import router from './routes/index.js';
import { notFoundHandler, errorHandler } from './middlewares/error.js';
import path from 'path';

const app = express();

app.use(cors());
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('*', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public', 'index.html'));
});

app.use('/api', router);

router.use(notFoundHandler);
router.use(errorHandler);

export default app;
