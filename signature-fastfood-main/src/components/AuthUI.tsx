import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { X, ChefHat, Heart, User, Phone, CheckCircle2, LogOut, Chrome } from "lucide-react";

// ─── Google Brand Icon ────────────────────────────────────────────────────────
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

// ─── Two-tab Login Modal ──────────────────────────────────────────────────────
const LoginModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { guest, saveGuest, signInWithGoogle, googleUser } = useAuth();
  const [tab, setTab] = useState<"google" | "guest">("google");
  const [name, setName] = useState(guest?.name ?? "");
  const [phone, setPhone] = useState(guest?.phone ?? "");
  const [saved, setSaved] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    if (guest) { setName(guest.name); setPhone(guest.phone); }
  }, [guest]);

  // Auto-close if Google login completed
  useEffect(() => {
    if (googleUser && isOpen) {
      setTimeout(onClose, 800);
    }
  }, [googleUser, isOpen, onClose]);

  const handleGuestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    saveGuest({ name: name.trim(), phone: phone.trim() });
    setSaved(true);
    setTimeout(onClose, 1100);
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    await signInWithGoogle();
    // Page will redirect; loading state is visual only
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ type: "spring", damping: 22, stiffness: 200 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-card border border-border rounded-2xl p-7 w-full max-w-sm relative overflow-hidden"
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-md bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-2 mb-6">
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                <ChefHat className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-heading font-black text-xl text-foreground leading-tight">
                  Welcome! 👋
                </h2>
                <p className="text-muted-foreground text-xs">Sign in or continue as guest</p>
              </div>
            </div>

            {/* Tab switcher */}
            <div className="flex bg-muted rounded-lg p-1 mb-6">
              <button
                onClick={() => setTab("google")}
                className={`flex-1 py-2 rounded-md text-xs font-heading font-bold transition-all ${tab === "google"
                    ? "bg-card shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                Google Sign-In
              </button>
              <button
                onClick={() => setTab("guest")}
                className={`flex-1 py-2 rounded-md text-xs font-heading font-bold transition-all ${tab === "guest"
                    ? "bg-card shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                Continue as Guest
              </button>
            </div>

            <AnimatePresence mode="wait">
              {/* ── Google Tab ── */}
              {tab === "google" && (
                <motion.div
                  key="google"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.18 }}
                  className="space-y-4"
                >
                  {googleUser ? (
                    <div className="flex flex-col items-center py-4 gap-3">
                      <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary">
                        {googleUser.user_metadata?.avatar_url ? (
                          <img src={googleUser.user_metadata.avatar_url} alt="avatar" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-primary flex items-center justify-center text-primary-foreground font-black text-xl">
                            {(googleUser.user_metadata?.full_name ?? googleUser.email ?? "U")[0].toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="text-center">
                        <p className="font-heading font-black text-lg text-foreground">
                          {googleUser.user_metadata?.full_name ?? "Signed in!"}
                        </p>
                        <p className="text-muted-foreground text-xs">{googleUser.email}</p>
                      </div>
                      <div className="flex items-center gap-2 text-green-500">
                        <CheckCircle2 className="w-5 h-5" />
                        <span className="text-sm font-heading font-bold">You're signed in</span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-muted-foreground text-sm text-center leading-relaxed">
                        Sign in with your Google account for a faster, personalised ordering experience.
                      </p>
                      <button
                        onClick={handleGoogleSignIn}
                        disabled={googleLoading}
                        className="w-full flex items-center justify-center gap-3 bg-white border border-border rounded-lg py-3 px-4 font-heading font-bold text-sm text-gray-700 hover:bg-gray-50 hover:shadow-md transition-all duration-200 disabled:opacity-60"
                      >
                        <GoogleIcon />
                        {googleLoading ? "Redirecting…" : "Continue with Google"}
                      </button>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-px bg-border" />
                        <span className="text-muted-foreground text-xs">or</span>
                        <div className="flex-1 h-px bg-border" />
                      </div>
                      <button
                        onClick={() => setTab("guest")}
                        className="w-full text-center text-xs text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Skip — continue as guest instead
                      </button>
                    </>
                  )}
                </motion.div>
              )}

              {/* ── Guest Tab ── */}
              {tab === "guest" && (
                <motion.div
                  key="guest"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.18 }}
                >
                  <AnimatePresence mode="wait">
                    {saved ? (
                      <motion.div
                        key="saved"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="flex flex-col items-center py-6 gap-3"
                      >
                        <div className="w-14 h-14 rounded-full bg-green-500/15 flex items-center justify-center">
                          <CheckCircle2 className="w-8 h-8 text-green-500" />
                        </div>
                        <p className="font-heading font-black text-lg text-foreground">
                          Got it, {name.split(" ")[0]}! 🎉
                        </p>
                        <p className="text-muted-foreground text-sm text-center">
                          We'll remember you for next time
                        </p>
                      </motion.div>
                    ) : (
                      <motion.form
                        key="form"
                        onSubmit={handleGuestSubmit}
                        className="space-y-4"
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <p className="text-muted-foreground text-xs text-center mb-3">
                          No account needed — just tell us your name & number.
                        </p>
                        {/* Name */}
                        <div className="relative">
                          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your name"
                            required
                            className="w-full bg-muted border border-border rounded-lg pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                          />
                        </div>
                        {/* Phone */}
                        <div className="relative">
                          <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value.replace(/[^0-9+\-\s]/g, "").slice(0, 15))}
                            placeholder="03XX XXXXXXX"
                            required
                            className="w-full bg-muted border border-border rounded-lg pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                          />
                        </div>
                        <button
                          type="submit"
                          className="w-full bg-primary text-primary-foreground font-heading font-black py-3.5 rounded-lg hover:bg-primary/90 transition-all duration-200 shadow-lg shadow-primary/20 mt-2 flex items-center justify-center gap-2"
                        >
                          <Heart className="w-4 h-4" />
                          Let's Order!
                        </button>
                        <p className="text-center text-[11px] text-muted-foreground leading-relaxed">
                          Saved only on your device for faster checkout 🛡️
                        </p>
                      </motion.form>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ─── User Avatar pill in the navigation ──────────────────────────────────────
const UserMenu = () => {
  const { googleUser, guest, clearGuest, signOut } = useAuth();
  const [open, setOpen] = useState(false);

  const isGoogle = !!googleUser;
  const displayName = isGoogle
    ? (googleUser.user_metadata?.full_name ?? googleUser.email ?? "User")
    : guest?.name ?? "";
  const avatarUrl = googleUser?.user_metadata?.avatar_url;
  const firstName = displayName.split(" ")[0];

  if (!isGoogle && !guest) return null;

  const handleSignOut = async () => {
    if (isGoogle) await signOut();
    else clearGuest();
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 bg-primary/10 hover:bg-primary/20 transition-colors rounded-full pl-1.5 pr-3 py-1.5"
      >
        {avatarUrl ? (
          <img src={avatarUrl} alt={firstName} className="w-6 h-6 rounded-full object-cover ring-1 ring-primary" />
        ) : (
          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-black text-[11px]">
            {firstName[0]?.toUpperCase()}
          </div>
        )}
        <span className="font-heading font-bold text-sm text-foreground text-nowrap">{firstName}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.95 }}
            className="absolute right-0 top-11 bg-card border border-border rounded-xl p-4 min-w-[210px] shadow-2xl z-50"
          >
            <div className="flex items-center gap-3 mb-3">
              {avatarUrl ? (
                <img src={avatarUrl} alt={firstName} className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black">
                  {firstName[0]?.toUpperCase()}
                </div>
              )}
              <div>
                <p className="font-heading font-black text-foreground text-sm leading-tight">{displayName}</p>
                <p className="text-muted-foreground text-xs mt-0.5">
                  {isGoogle ? googleUser.email : guest?.phone}
                </p>
              </div>
            </div>
            <div className="h-px bg-border mb-3" />
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-2 text-xs text-destructive hover:text-destructive/80 font-heading font-semibold py-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              {isGoogle ? "Sign out" : "Sign out / Change"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export { LoginModal, UserMenu };
