import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 3600 });

export const cacheService = {
  getMetadata: (videoId) => {
    const key = `metadata_${videoId}`;
    return cache.get(key);
  },

  setMetadata: (videoId, metadata) => {
    const key = `metadata_${videoId}`;
    cache.set(key, metadata, 7200);
  },

  clearAll: () => {
    cache.flushAll();
  }
};
