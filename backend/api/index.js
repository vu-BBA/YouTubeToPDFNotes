import express from 'express';
import cors from 'cors';
import pdfRoutes from '../src/routes/pdfRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/pdf', pdfRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default app;
