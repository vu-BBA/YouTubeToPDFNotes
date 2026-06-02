import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export const getVideoInfo = async (videoUrl) => {
  const videoId = extractVideoId(videoUrl);
  if (!videoId) {
    throw new Error('Invalid YouTube URL');
  }

  return {
    videoId,
    title: 'YouTube Video',
    channelName: 'Loading...',
    thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    available: true
  };
};

export const generatePdf = async (youtubeUrl, language = 'English') => {
  try {
    console.log('Calling server...');
    
    const response = await axios({
      method: 'POST',
      url: `${API_BASE_URL}/api/pdf/generate-pdf`,
      data: { youtubeUrl, language },
      timeout: 300000,
      responseType: 'blob',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('Response received, size:', response.data?.size);

    const blob = new Blob([response.data], { type: 'application/pdf' });
    const contentDisposition = response.headers['content-disposition'];
    let filename = `youtube_notes_${Date.now()}.pdf`;
    if (contentDisposition) {
      const match = contentDisposition.match(/filename="?([^"]+)"?/);
      if (match) filename = match[1];
    }
    
    downloadBlob(blob, filename);
    return { success: true, filename };

  } catch (error) {
    console.error('Error:', error);
    if (error.response?.data instanceof Blob) {
      const text = await error.response.data.text();
      try {
        const json = JSON.parse(text);
        throw new Error(json.error || 'Failed to generate notes');
      } catch {
        throw new Error(text || 'Failed to generate notes');
      }
    }
    throw new Error(error.response?.data?.error || error.message || 'Failed to generate notes');
  }
};

function downloadBlob(blob, filename) {
  console.log('Downloading file, size:', blob.size, 'bytes');
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  setTimeout(() => {
    link.remove();
    window.URL.revokeObjectURL(url);
  }, 100);
}

export const extractVideoId = (url) => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([^&\n?#]+)/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
};

export const validateYouTubeUrl = (url) => {
  if (!url || typeof url !== 'string') {
    return { valid: false, error: 'URL is required' };
  }
  
  const videoId = extractVideoId(url);
  if (!videoId) {
    return { valid: false, error: 'Invalid YouTube URL' };
  }
  
  return { valid: true, videoId };
};
