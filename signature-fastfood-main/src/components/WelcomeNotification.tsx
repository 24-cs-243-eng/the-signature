import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Heart, RefreshCw, Tag } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const WelcomeNotification = () => {
  const { user, googleUser, guest } = useAuth();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const firstName = googleUser?.user_metadata?.full_name?.split(" ")[0]
    ?? guest?.name?.split(" ")[0]
    ?? null;

  const avatarUrl = googleUser?.user_metadata?.avatar_url;

  useEffect(() => {
    // Only show once per session
    const alreadyShown = sessionStorage.getItem("sig_welcome_shown");
    if (alreadyShown || dismissed) return;

    const timer = setTimeout(() => {
      setVisible(true);
      sessionStorage.setItem("sig_welcome_shown", "1");
    }, 10000); // 10 seconds after page load

    return () => clearTimeout(timer);
  }, [dismissed]);

  const handleClose = () => {
    setVisible(false);
    setDismissed(true);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, x: -100, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -100, scale: 0.95 }}
          transition={{ type: "spring", damping: 22, stiffness: 250 }}
          className="fixed bottom-20 lg:bottom-6 left-4 z-[999] w-[calc(100vw-2rem)] max-w-[280px]"
        >
          <div className="relative bg-card border border-border rounded-xl shadow-2xl overflow-hidden">
            {/* Red top accent */}
            <div className="h-1 w-full bg-gradient-to-r from-red-600 to-rose-500" />

            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 w-7 h-7 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            <div className="p-3 pt-2">
              {/* Header */}
              <div className="flex items-center gap-2 mb-2">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="avatar" className="w-7 h-7 rounded-full object-cover ring-1 ring-border" />
                ) : firstName ? (
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-xs">
                    {firstName[0].toUpperCase()}
                  </div>
                ) : (
                  <div className="w-7 h-7 rounded-lg bg-red-600/10 flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5 text-red-600" />
                  </div>
                )}
                <div>
                  <p className="font-heading font-black text-xs text-foreground leading-tight">
                    {firstName ? `Hey ${firstName}!` : "Hey there!"}
                  </p>
                  <p className="text-muted-foreground text-[10px]">
                    {user ? "Quick shortcuts" : "Unlock your history"}
                  </p>
                </div>
              </div>

              {/* Action tiles */}
              <div className="grid grid-cols-3 gap-1.5">
                <Link
                  to="/deals"
                  onClick={handleClose}
                  className="flex flex-col items-center gap-1 p-2 rounded-lg bg-muted hover:bg-muted/80 border border-border/50 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Tag className="w-4 h-4 text-amber-500" />
                  </div>
                  <span className="text-[10px] font-heading font-bold text-foreground text-center leading-tight">Custom Deals</span>
                </Link>

                <Link
                  to="/account"
                  onClick={handleClose}
                  className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl bg-muted hover:bg-muted/80 border border-border/50 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Heart className="w-4 h-4 text-red-500" />
                  </div>
                  <span className="text-[10px] font-heading font-bold text-foreground text-center leading-tight">Favourites</span>
                </Link>

                <Link
                  to="/account"
                  onClick={handleClose}
                  className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl bg-muted hover:bg-muted/80 border border-border/50 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <RefreshCw className="w-4 h-4 text-green-500" />
                  </div>
                  <span className="text-[9px] font-heading font-bold text-foreground text-center leading-tight">Reorder</span>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomeNotification;
