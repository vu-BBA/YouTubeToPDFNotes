import { getVideoMetadata } from '../services/videoService.js';
import { generatePdfFromWebhook } from '../services/webhookService.js';
import { cacheService } from '../services/cacheService.js';

export const getVideoInfo = async (req, res) => {
  try {
    const { videoUrl } = req.query;

    if (!videoUrl) {
      return res.status(400).json({ error: 'Video URL is required' });
    }

    const videoId = extractVideoId(videoUrl);
    if (!videoId) {
      return res.status(400).json({ error: 'Invalid YouTube URL' });
    }

    const cachedMetadata = cacheService.getMetadata(videoId);
    if (cachedMetadata) {
      console.log('✓ Metadata from cache');
      return res.json(cachedMetadata);
    }

    const metadata = await getVideoMetadata(videoId);
    cacheService.setMetadata(videoId, metadata);
    res.json(metadata);
  } catch (error) {
    console.error('Error getting video info:', error);
    res.status(500).json({ error: error.message });
  }
};

export const generatePdf = async (req, res) => {
  console.log('\n================================================');
  console.log('REQUEST: Generate PDF (via webhook)');
  console.log('================================================');

  const language = req.body?.language || 'English';
  const youtubeUrl = req.body?.youtubeUrl;

  if (!youtubeUrl) {
    return res.status(400).json({ error: 'YouTube URL is required' });
  }

  const videoId = extractVideoId(youtubeUrl);
  if (!videoId) {
    return res.status(400).json({ error: 'Invalid YouTube URL' });
  }

  try {
    const pdfBuffer = await generatePdfFromWebhook(youtubeUrl, language);

    res.setHeader('Content-Type', 'application/pdf');
    const filename = `youtube_notes_${videoId}.pdf`;
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(pdfBuffer);

    console.log('✓ PDF sent to client');
    console.log('================================================\n');
  } catch (error) {
    console.error('\n!!! ERROR !!!');
    console.error('Error:', error.message);
    console.error('================================================\n');

    const errorMessage = error.message || 'An unexpected error occurred';

    if (errorMessage.includes('timed out') || errorMessage.includes('timeout')) {
      return res.status(408).json({ error: 'Request timed out. Please try again.', code: 'TIMEOUT' });
    }

    if (errorMessage.includes('not reachable') || errorMessage.includes('ECONNREFUSED')) {
      return res.status(503).json({ error: 'Service temporarily unavailable. Please try again later.', code: 'SERVICE_UNAVAILABLE' });
    }

    return res.status(500).json({ error: errorMessage, code: 'INTERNAL_ERROR' });
  }
};

function extractVideoId(url) {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}
