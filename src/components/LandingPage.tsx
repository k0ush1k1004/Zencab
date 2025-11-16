import { SignIn, SignUp } from '@clerk/clerk-react';
import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LandingPage() {
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [introDone, setIntroDone] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIntroDone(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen bg-transparent text-white flex items-center justify-center overflow-hidden">
      {/* Intro Animation */}
      {!introDone && <IntroAnimation onFinish={() => setIntroDone(true)} />}

      {/* Main Content */}
      {introDone && (
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {/* Video Background */}
          <div className="absolute inset-0 -z-10">
            <video
              className="fixed inset-0 w-full h-full object-cover object-center"
              autoPlay
              muted
              loop
              playsInline
              poster="/zencab-background.png"
            >
              <source src="/ZENCAB Logo.mp4" type="video/mp4" />
            </video>
            {/* Overlay for readability */}
            <div className="absolute inset-0 bg-white/30" />
          </div>

          {/* Glowing background orbs */}
          <motion.div
            className="absolute w-64 h-64 bg-[#00BFA6] rounded-full blur-[120px] opacity-30"
            animate={{ y: [0, 30, 0], x: [0, -30, 0] }}
            transition={{ duration: 10, repeat: Infinity }}
            style={{ top: '10%', left: '15%' }}
          />
          <motion.div
            className="absolute w-80 h-80 bg-[#00E5FF] rounded-full blur-[120px] opacity-30"
            animate={{ y: [0, -30, 0], x: [0, 30, 0] }}
            transition={{ duration: 12, repeat: Infinity }}
            style={{ bottom: '10%', right: '15%' }}
          />

          {/* Hero Section */}
          <motion.div
            className="relative z-10 flex flex-col items-center justify-center px-4"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <div>
            {/* <div className="bg-white/90 border-2 border-gradient-to-r from-[#FFD700] via-[#00BFA6] to-[#00E5FF] shadow-[0_8px_32px_0_rgba(31,38,135,0.18)] rounded-[2.5rem] px-12 py-14 flex flex-col items-center max-w-2xl w-full relative"> */}
              {/* <div className="absolute -top-1 -left-1 w-[calc(100%+2px)] h-[calc(100%+2px)] rounded-[2.5rem] pointer-events-none border-4 border-gradient-to-r from-[#FFD700] via-[#00BFA6] to-[#00E5FF] opacity-60 z-0" /> */}
              <div className="flex flex-col items-center mb-8 z-10">
                <img src="/Zencab_Logo.svg" alt="ZenCab" className="w-64 h-64 drop-shadow-2xl object-contain mb-6" />
                <p className="text-3xl md:text-4xl font-semibold text-black/90 mb-3 font-serif">
                  Your ride. Your vibe. <Sparkles className="inline-block ml-2 w-8 h-8 text-[#FFD700] align-middle" />
                </p>
                <div className="flex justify-center gap-8 mt-4 w-full z-10">
                  <AnimatedButton text="Sign In" onClick={() => setShowSignIn(true)} />
                  <AnimatedButton text="Sign Up" onClick={() => setShowSignUp(true)} variant="alt" />
                </div>
                <p className="text-lg text-gray-700 mb-2 font-medium mt-4">Fast, safe, and affordable rides for students and professionals.</p>
              </div>
            </div>
          </motion.div>

          {/* Sign-in / Sign-up Modals */}
          {showSignIn && (
            <ModalWrapper onClose={() => setShowSignIn(false)}>
              <SignIn
                appearance={{
                  variables: { colorPrimary: '#00796B' },
                  elements: {
                    card: 'shadow-none border-none',
                    headerTitle: 'text-[#00BFA6] font-bold text-3xl',
                    formButtonPrimary: 'bg-[#00BFA6] hover:bg-[#009688]',
                  },
                }}
              />
            </ModalWrapper>
          )}

          {showSignUp && (
            <ModalWrapper onClose={() => setShowSignUp(false)}>
              <SignUp
                appearance={{
                  variables: { colorPrimary: '#00796B' },
                  elements: {
                    card: 'shadow-none border-none',
                    headerTitle: 'text-[#00BFA6] font-bold text-3xl',
                    formButtonPrimary: 'bg-[#00BFA6] hover:bg-[#009688]',
                  },
                }}
              />
            </ModalWrapper>
          )}

          {/* Footer */}
          <motion.div
            className="absolute bottom-5 text-sm text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8 }}
          >
            © {new Date().getFullYear()} ZenCab — Built for speed & comfort
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

/* ==============================================
   SIMPLE INTRO ANIMATION — TEXT ONLY
   ============================================== */
function IntroAnimation({ onFinish }: { onFinish: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onFinish, 4000);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="absolute inset-0 bg-[#0F172A] flex items-center justify-center">
      {/* Intro Text */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.h1
          className="text-6xl font-extrabold bg-gradient-to-r from-[#00E5FF] to-[#00BFA6] bg-clip-text text-transparent mb-2"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        >
          ZenCab
        </motion.h1>

      </motion.div>
    </div>
  );
}

/* ---------- Animated Button Component ---------- */
function AnimatedButton({ text, onClick, variant = 'primary' }: { text: string; onClick: () => void; variant?: 'primary' | 'alt' }) {
  return (
    <motion.button
      onClick={onClick}
      className={`px-10 py-4 rounded-xl font-semibold text-lg shadow-lg transition ${
        variant === 'primary'
          ? 'bg-[#00BFA6] text-white hover:bg-[#009688]'
          : 'bg-[#00BFA6] text-white hover:bg-[#00E5FF]'
      }`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {text}
    </motion.button>
  );
}

/* ---------- Reusable Modal Component ---------- */
function ModalWrapper({
  onClose,
  children,
}: {
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden"
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ duration: 0.4 }}
      >
        {children}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-2xl"
        >
          ✕
        </button>
      </motion.div>
    </motion.div>
  );
}
