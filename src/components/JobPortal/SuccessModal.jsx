import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCopy, FaExternalLinkAlt, FaArrowLeft, FaCheck } from 'react-icons/fa';
import { RiShareForwardFill } from 'react-icons/ri';
import Confetti from 'react-confetti';
import { useState, useEffect } from 'react';

const SuccessModal = ({ publicUrl, onClose }) => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [showConfetti, setShowConfetti] = useState(true);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(publicUrl);
    toast.success('Link copied to clipboard!');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareViaNative = async () => {
    try {
      await navigator.share({
        title: 'Check out this job opportunity',
        text: 'I found this interesting job posting you might want to apply for',
        url: publicUrl
      });
    } catch (err) {
      console.log('Native sharing not supported', err);
      copyToClipboard();
    }
  };

  return (
    <>
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
          gravity={0.2}
        />
      )}
      
      <AnimatePresence>
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="relative w-[90%] max-w-lg rounded-2xl bg-gradient-to-br from-white to-gray-50 p-10 shadow-2xl border border-white/20 overflow-hidden"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ type: 'spring', damping: 25 }}
          >
            {/* Decorative background gradient */}
            <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-[radial-gradient(circle,rgba(75,181,67,0.1)_0%,transparent_70%)] -z-10"></div>
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle cx="50" cy="50" r="45" fill="#4BB543" />
                <path
                  fill="none"
                  stroke="#FFF"
                  strokeWidth="8"
                  strokeLinecap="round"
                  d="M30 50 l15 15 l30 -30"
                />
              </svg>
            </div>

            <h3 className="mb-1 text-center text-3xl font-bold bg-gradient-to-r from-green-500 to-green-700 bg-clip-text text-transparent">🎉 Job Posted Successfully!</h3>
            <p className="mb-8 text-center text-gray-500">
              Your job listing is now live and ready to receive applications
            </p>

            <div className="mb-8">
              <div className="flex overflow-hidden rounded-lg shadow-md">
                <input
                  type="text"
                  value={publicUrl}
                  readOnly
                  className="flex-1 px-4 py-3 text-gray-700 bg-white border-0 focus:outline-none"
                  aria-label="Public job URL"
                />
                <button
                  onClick={copyToClipboard}
                  className={`flex items-center justify-center gap-2 px-4 py-2 font-medium transition-colors duration-200 ${copied ? 'bg-green-500 text-white' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                  aria-label="Copy to clipboard"
                >
                  {copied ? (
                    <>
                      <FaCheck className="h-4 w-4" /> Copied!
                    </>
                  ) : (
                    <>
                      <FaCopy className="h-4 w-4" /> Copy
                    </>
                  )}
                </button>
              </div>

              <div className="mt-4 flex gap-3">
                <motion.button 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }}
                  onClick={shareViaNative} 
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-500 px-4 py-2.5 font-medium text-white transition-colors hover:bg-blue-600"
                >
                  <RiShareForwardFill className="h-4 w-4" /> Share
                </motion.button>
                <motion.a 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }}
                  href={publicUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gray-100 px-4 py-2.5 font-medium text-gray-700 transition-colors hover:bg-gray-200"
                >
                  <FaExternalLinkAlt className="h-4 w-4" /> View
                </motion.a>
              </div>
            </div>

            <div className="mt-8">
              <motion.button
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  onClose();
                  navigate('/jobportal/dashboard');
                }}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-3 font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:shadow"
              >
                <FaArrowLeft className="h-4 w-4" /> Back to Dashboard
              </motion.button>
            </div>

            <div className="mt-6 rounded-lg bg-blue-50 p-4 text-center text-sm text-blue-700">
              <p>
                <strong className="font-semibold">Pro Tip:</strong> Share this link on social media to reach more candidates
              </p>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default SuccessModal;