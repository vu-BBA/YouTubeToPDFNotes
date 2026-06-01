import axios from 'axios';

export const getVideoMetadata = async (videoId) => {
  console.log('\n========== FETCHING VIDEO METADATA ==========');
  console.log('Video ID:', videoId);
  
  let metadata = {
    videoId,
    title: '',
    channelName: '',
    thumbnail: '',
    duration: '',
    available: false
  };

  // Method 1: YouTube oEmbed API
  try {
    console.log('Trying: YouTube oEmbed API...');
    const response = await axios.get(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`,
      { timeout: 8000 }
    );
    
    if (response.data) {
      console.log('✓ SUCCESS with oEmbed');
      metadata.title = response.data.title;
      metadata.channelName = response.data.author_name;
      metadata.thumbnail = response.data.thumbnail_url.replace('hqdefault', 'maxresdefault');
      metadata.available = true;
    }
  } catch (error) {
    console.log('  ✗ oEmbed failed:', error.message);
  }

  // Method 2: noembed if oEmbed failed
  if (!metadata.available) {
    try {
      console.log('Trying: noembed API...');
      const response = await axios.get(
        `https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`,
        { timeout: 8000 }
      );
      
      if (response.data) {
        console.log('✓ SUCCESS with noembed');
        metadata.title = response.data.title;
        metadata.channelName = response.data.author_name;
        metadata.thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
        metadata.available = true;
      }
    } catch (error) {
      console.log('  ✗ noembed failed:', error.message);
    }
  }

  // Method 3: Fallback to YouTube thumbnail
  if (!metadata.available) {
    console.log('Using fallback thumbnail');
    metadata.title = `YouTube Video`;
    metadata.channelName = 'Unknown Channel';
    metadata.thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    metadata.available = true;
  }

  console.log('============================================');
  console.log('Title:', metadata.title);
  console.log('Channel:', metadata.channelName);
  console.log('Thumbnail:', metadata.thumbnail ? 'Available' : 'Not available');
  console.log('============================================\n');

  return metadata;
};
