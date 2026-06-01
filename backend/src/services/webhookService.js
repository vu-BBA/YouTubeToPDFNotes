import 'dotenv/config';
import axios from 'axios';

const WEBHOOK_URL = process.env.WEBHOOK_URL || 'https://automatwork.app.n8n.cloud/webhook/youtube-to-pdf';

export const generatePdfFromWebhook = async (youtubeUrl, language = 'English') => {
  console.log('\n========== WEBHOOK PDF GENERATION ==========');
  console.log('Calling webhook:', WEBHOOK_URL);
  console.log('YouTube URL:', youtubeUrl);
  console.log('Language:', language);

  try {
    const response = await axios({
      method: 'POST',
      url: WEBHOOK_URL,
      data: { youtube_url: youtubeUrl, language },
      responseType: 'arraybuffer',
      timeout: 300000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const contentType = response.headers['content-type'] || '';

    if (!response.data || response.data.byteLength === 0) {
      throw new Error(
        'Webhook returned an empty response. The n8n workflow needs a "Respond to Webhook" node that returns the PDF.'
      );
    }

    if (contentType.includes('application/json')) {
      const raw = Buffer.from(response.data).toString('utf-8');
      if (raw.trim()) {
        const json = JSON.parse(raw);
        throw new Error(json.error || json.message || 'Webhook returned an error');
      }
    }

    console.log('✓ PDF received from webhook, size:', response.data.byteLength, 'bytes');
    console.log('==============================================\n');

    return Buffer.from(response.data);
  } catch (error) {
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;
      let message = `Webhook returned status ${status}`;
      try {
        const json = JSON.parse(Buffer.from(data).toString('utf-8'));
        message = json.error || json.message || message;
      } catch {}
      throw new Error(message);
    }
    if (error.code === 'ECONNABORTED') {
      throw new Error('Webhook request timed out. Please try again.');
    }
    if (error.code === 'ECONNREFUSED') {
      throw new Error('Webhook service is not reachable. Please ensure the n8n workflow is active.');
    }
    throw new Error(`Webhook request failed: ${error.message}`);
  }
};
