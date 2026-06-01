import { Youtube, User, Clock } from 'lucide-react';

const VideoPreview = ({ metadata }) => {
  if (!metadata) return null;

  return (
    <div className="bg-gray-50 dark:bg-slate-800/50 rounded-xl p-4">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Thumbnail */}
        <div className="flex-shrink-0">
          <img
            src={metadata.thumbnail || `https://img.youtube.com/vi/${metadata.videoId}/mqdefault.jpg`}
            alt={metadata.title}
            className="w-full sm:w-48 h-28 object-cover rounded-lg"
            onError={(e) => {
              e.target.src = `https://img.youtube.com/vi/${metadata.videoId}/hqdefault.jpg`;
            }}
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-800 dark:text-white text-lg line-clamp-2 mb-2">
            {metadata.title || 'Loading...'}
          </h3>
          
          <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span className="truncate">{metadata.channelName || 'Unknown'}</span>
            </div>
            
            {metadata.duration && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{metadata.duration}</span>
              </div>
            )}
          </div>

          {metadata.available && (
            <div className="mt-2 inline-flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
              <Youtube className="w-3 h-3" />
              <span>Video found</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoPreview;
