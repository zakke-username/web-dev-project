import express from 'express';
import cors from 'cors';
import apiRouter from './routes/index.js';
import { notFoundHandler, errorHandler } from './middlewares/error.js';

const app = express();
app.use(cors());
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', apiRouter);

app.use((req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
