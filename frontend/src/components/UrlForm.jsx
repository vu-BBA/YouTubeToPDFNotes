import { Link, Play, AlertCircle } from 'lucide-react';

const UrlForm = ({ url, setUrl, error }) => {
  const isValidUrl = (url) => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([^&\n?#]+)/,
    ];
    return patterns.some(pattern => pattern.test(url));
  };

  const getVideoId = (url) => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([^&\n?#]+)/,
    ];
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const videoId = url ? getVideoId(url) : null;
  const isValid = videoId && isValidUrl(url);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
        YouTube Video URL
      </label>
      
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Link className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste YouTube URL here..."
          className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 input-glow transition-all duration-200 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-lg"
        />
        {url && (
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
            {isValid ? (
              <div className="flex items-center text-green-500">
                <Play className="h-5 w-5 fill-current" />
              </div>
            ) : (
              <div className="text-red-500">
                <AlertCircle className="h-5 w-5" />
              </div>
            )}
          </div>
        )}
      </div>

      {error && (
        <p className="text-red-500 text-sm flex items-center gap-1">
          <AlertCircle className="h-4 w-4" />
          {error}
        </p>
      )}

      {url && isValid && (
        <div className="mt-4 p-3 bg-gray-50 dark:bg-slate-800/50 rounded-xl">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Video Preview:</p>
          <div className="flex items-center gap-4">
            <img
              src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
              alt="Video thumbnail"
              className="w-32 h-18 object-cover rounded-lg thumbnail-shadow"
            />
            <div className="flex-1">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Video ID: <span className="font-mono text-red-500">{videoId}</span>
              </p>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                ✓ Valid YouTube URL detected
              </p>
            </div>
          </div>
        </div>
      )}

      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
        Supports: youtube.com/watch, youtu.be, youtube.com/shorts, youtube.com/embed
      </p>
    </div>
  );
};

export default UrlForm;
