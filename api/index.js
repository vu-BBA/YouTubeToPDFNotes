import express from 'express';
import cors from 'cors';
import { generatePdf, getVideoInfo } from '../backend/src/controllers/pdfController.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/pdf/video-info', getVideoInfo);
app.post('/api/pdf/generate-pdf', generatePdf);

export default app;
