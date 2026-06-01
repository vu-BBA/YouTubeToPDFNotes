import { Sparkles, Loader2, Download, CheckCircle, FileCheck, Wand2, FileText, RefreshCw } from 'lucide-react';

const GenerateButton = ({ onClick, isLoading, progress, disabled }) => {
  const getProgressText = () => {
    if (progress < 30) return 'Extracting transcript...';
    if (progress < 60) return 'Analyzing with AI...';
    if (progress < 90) return 'Translating notes...';
    return 'Generating PDF...';
  };

  return (
    <div className="space-y-3">
      <button
        onClick={onClick}
        disabled={isLoading || disabled}
        className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3
          ${disabled || isLoading
            ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed text-gray-500 dark:text-gray-400'
            : 'bg-gradient-to-r from-red-500 via-red-600 to-red-700 hover:from-red-600 hover:via-red-700 hover:to-red-800 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]'
          }`}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-6 h-6 spinner" />
            <span>{getProgressText()}</span>
          </>
        ) : (
          <>
            <Sparkles className="w-6 h-6" />
            <span>Generate PDF Notes</span>
          </>
        )}
      </button>

      {isLoading && (
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <FileText className="w-3 h-3" />
              Transcript
            </span>
            <span className="flex items-center gap-1">
              <Wand2 className="w-3 h-3" />
              AI Analysis
            </span>
            <span className="flex items-center gap-1">
              <FileCheck className="w-3 h-3" />
              PDF Ready
            </span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full progress-bar rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const DownloadButton = ({ onClick, isReady, filename }) => {
  return (
    <button
      onClick={onClick}
      disabled={!isReady}
      className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3
        ${isReady
          ? 'bg-gradient-to-r from-green-500 via-green-600 to-emerald-600 hover:from-green-600 hover:via-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]'
          : 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed text-gray-500 dark:text-gray-400'
        }`}
    >
      {isReady ? (
        <>
          <Download className="w-6 h-6" />
          <span>Download PDF</span>
        </>
      ) : (
        <>
          <RefreshCw className="w-6 h-6" />
          <span>Waiting for PDF...</span>
        </>
      )}
    </button>
  );
};

const SuccessMessage = ({ message }) => {
  return (
    <div className="flex items-center gap-2 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-xl">
      <CheckCircle className="w-6 h-6 text-green-500" />
      <div>
        <p className="font-semibold text-green-700 dark:text-green-400">Success!</p>
        <p className="text-sm text-green-600 dark:text-green-500">{message}</p>
      </div>
    </div>
  );
};

export { GenerateButton, DownloadButton, SuccessMessage };
