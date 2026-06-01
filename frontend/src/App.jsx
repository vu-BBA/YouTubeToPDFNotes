import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';
import Header from './components/Header';
import UrlForm from './components/UrlForm';
import LanguageSelector from './components/LanguageSelector';
import { GenerateButton, DownloadButton, SuccessMessage } from './components/DownloadButton';
import VideoPreview from './components/VideoPreview';
import { generatePdf, getVideoInfo, validateYouTubeUrl, extractVideoId } from './services/api';
import { FileText, Youtube, Languages, Zap, Shield, Loader2, AlertCircle, X, CheckCircle, Circle, Play } from 'lucide-react';

const STEPS = [
  { key: 'idle', label: 'Ready' },
  { key: 'metadata', label: 'Fetching video info...' },
  { key: 'transcript', label: 'Extracting transcript...' },
  { key: 'ai', label: 'Generating notes with AI...' },
  { key: 'pdf', label: 'Creating PDF...' },
  { key: 'complete', label: 'Complete!' }
];

const FEATURES = [
  { icon: Youtube, title: 'Any YouTube Video', description: 'Support all video types' },
  { icon: FileText, title: 'Smart Notes', description: 'AI-powered extraction' },
  { icon: Languages, title: '8 Languages', description: 'Multi-language support' },
  { icon: Zap, title: 'Fast Processing', description: 'Quick PDF generation' },
];

const App = () => {
  const [url, setUrl] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('idle');
  const [completedSteps, setCompletedSteps] = useState([]);
  const [isPdfReady, setIsPdfReady] = useState(false);
  const [error, setError] = useState('');
  const [videoMetadata, setVideoMetadata] = useState(null);
  const requestLock = useRef(false);

  const isValidUrl = url && validateYouTubeUrl(url).valid;
  const videoId = url ? extractVideoId(url) : null;

  useEffect(() => {
    if (videoId && isValidUrl) {
      fetchVideoMetadata();
    } else {
      setVideoMetadata(null);
    }
  }, [videoId]);

  const fetchVideoMetadata = async () => {
    setIsLoadingPreview(true);
    setError('');
    
    try {
      const metadata = await getVideoInfo(url);
      setVideoMetadata(metadata);
    } catch (err) {
      console.error('Failed to fetch video info:', err);
      setVideoMetadata(null);
    } finally {
      setIsLoadingPreview(false);
    }
  };

  const handleGenerate = async () => {
    if (requestLock.current) return;
    
    setError('');
    
    if (!url.trim()) {
      setError('Please enter a YouTube URL');
      toast.error('Please enter a YouTube URL');
      return;
    }

    if (!isValidUrl) {
      setError('Invalid YouTube URL');
      toast.error('Invalid YouTube URL');
      return;
    }

    if (!videoMetadata) {
      setError('Could not fetch video information. Please check the URL.');
      toast.error('Could not fetch video information');
      return;
    }

    requestLock.current = true;
    setIsLoading(true);
    setIsPdfReady(false);
    setCompletedSteps([]);
    setCurrentStep('metadata');
    setProgress(10);

    try {
      setCurrentStep('transcript');
      setProgress(30);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setCurrentStep('ai');
      setProgress(60);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setCurrentStep('pdf');
      setProgress(85);
      
      await generatePdf(url, selectedLanguage);
      
      setCompletedSteps(['metadata', 'transcript', 'ai', 'pdf']);
      setCurrentStep('complete');
      setProgress(100);
      setIsPdfReady(true);
      toast.success('PDF generated successfully!');
    } catch (err) {
      console.error('Error:', err);
      const errorMsg = err.message || 'Failed to generate PDF';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
      requestLock.current = false;
    }
  };

  const getStepStatus = (stepKey) => {
    if (completedSteps.includes(stepKey)) return 'complete';
    if (currentStep === stepKey) return 'current';
    if (STEPS.findIndex(s => s.key === currentStep) > STEPS.findIndex(s => s.key === stepKey)) return 'complete';
    return 'pending';
  };

  return (
    <div className="min-h-screen pb-12">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: { background: '#1f2937', color: '#fff' },
          success: { duration: 3000, iconTheme: { primary: '#22c55e', secondary: '#fff' } },
          error: { duration: 5000, iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />

      <Header />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-card rounded-2xl p-6 md:p-8"
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-400 to-red-600 rounded-2xl shadow-lg mb-4"
            >
              <FileText className="w-10 h-10 text-white" />
            </motion.div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-2">
              YouTube to PDF Notes
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Transform any YouTube video into detailed PDF notes
            </p>
          </div>

          <div className="space-y-6">
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl"
                >
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <p className="text-sm text-red-600 dark:text-red-400 flex-1">{error}</p>
                  <button 
                    onClick={() => setError('')}
                    className="text-red-400 hover:text-red-600 dark:hover:text-red-300"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <UrlForm url={url} setUrl={setUrl} error={error ? '' : undefined} />

            {/* Video Preview */}
            <AnimatePresence>
              {isLoadingPreview && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-center p-4"
                >
                  <Loader2 className="w-6 h-6 spinner text-red-500" />
                  <span className="ml-2 text-gray-500">Loading video info...</span>
                </motion.div>
              )}

              {videoMetadata && !isLoadingPreview && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <VideoPreview metadata={videoMetadata} />
                </motion.div>
              )}
            </AnimatePresence>

            <LanguageSelector
              selectedLanguage={selectedLanguage}
              onSelect={setSelectedLanguage}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <GenerateButton
                onClick={handleGenerate}
                isLoading={isLoading}
                progress={progress}
                disabled={!isValidUrl || !videoMetadata}
              />
              <DownloadButton
                onClick={handleGenerate}
                isReady={isPdfReady}
              />
            </div>

            <AnimatePresence>
              {isPdfReady && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <SuccessMessage message="Your PDF has been downloaded!" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8"
        >
          {FEATURES.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
              className="glass-card rounded-xl p-4 text-center hover:scale-105 transition-transform duration-200"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl mb-3">
                <feature.icon className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="font-semibold text-gray-800 dark:text-white text-sm">
                {feature.title}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400"
        >
           <p className="flex items-center justify-center gap-2">
           
          @ by bushra basharat - 2024
          </p>   
          <p className="flex items-center justify-center gap-2">
            <Shield className="w-4 h-4" />
            Built with AI • Fast & Secure
          </p>
        </motion.footer>
      </main>
    </div>
  );
};

export default App;
