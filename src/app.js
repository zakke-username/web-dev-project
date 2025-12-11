import express from 'express';
import cors from 'cors';
import router from './routes/index.js';
import { notFoundHandler, errorHandler } from './middlewares/error.js';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', router);

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../public/index.html'));
});

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
