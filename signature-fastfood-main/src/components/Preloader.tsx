import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Preloader = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [fading, setFading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsLoading(true);
    setFading(false);

    // Show for at least 1.2s on first load, 600ms on route change
    const showDuration = performance.now() < 3000 ? 1200 : 600;

    const fadeTimer = setTimeout(() => setFading(true), showDuration);
    const hideTimer = setTimeout(() => setIsLoading(false), showDuration + 350);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, [location.pathname]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          animate={{ opacity: fading ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="fixed inset-0 bg-white dark:bg-black flex flex-col items-center justify-center"
          style={{ zIndex: 9999 }}
        >
          {/* Logo with spin glow */}
          <div className="relative w-24 h-24 mb-5">
            <img
              src="/media/signature-logo.jpeg"
              alt="Signature"
              className="w-full h-full object-cover rounded-full border-2 border-red-600/40 shadow-2xl"
              style={{
                animation: "flip-3d 2.4s ease-in-out infinite",
                transformStyle: "preserve-3d",
              }}
            />
            <div
              className="absolute -inset-2 rounded-full pointer-events-none"
              style={{
                animation: "pulse-glow 2s ease-in-out infinite",
              }}
            />
          </div>

          {/* Brand name */}
          <h2 className="font-heading font-black text-2xl text-gray-900 dark:text-white tracking-widest uppercase mb-1">
            Signature
          </h2>
          <p className="text-red-600 text-[10px] font-heading font-black uppercase tracking-[0.3em]">
            Fast Food
          </p>

          {/* Loading bar */}
          <div className="mt-6 w-32 h-1 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-red-600 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.1, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;
