import express from 'express';
import { generatePdf, getVideoInfo } from '../controllers/pdfController.js';

const router = express.Router();

router.get('/video-info', getVideoInfo);
router.post('/generate-pdf', generatePdf);

export default router;
