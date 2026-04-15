import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User, MapPin, Store, ChevronRight, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useOrderMode } from "@/context/OrderModeContext";
import { Button } from "@/components/ui/button";
import { LoginModal, UserMenu } from "@/components/AuthUI";
import DeliveryPickupSelector from "@/components/DeliveryPickupSelector";
import { ThemeToggle } from "@/components/ThemeToggle";

const signatureLogo = "/media/signature-logo.jpeg";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [showModeSelector, setShowModeSelector] = useState(false);
  const [pendingMode, setPendingMode] = useState<"delivery" | "pickup">("delivery");
  const { totalItems, setIsCartOpen } = useCart();
  const { user } = useAuth();
  const { mode } = useOrderMode();
  const location = useLocation();

  // Auto-close login modal when user is detected
  useEffect(() => {
    if (user && isLoginOpen) {
      setIsLoginOpen(false);
      // Clean up the URL fragment (access_token) after successful login
      if (window.location.hash.includes("access_token")) {
        window.history.replaceState(null, "", window.location.pathname + window.location.search);
      }
    }
  }, [user, isLoginOpen]);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/menu", label: "Menu" },
    { to: "/deals", label: "Deals" },
    { to: "/custom-deal", label: "Custom" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ];

  const openModeSelector = (m: "delivery" | "pickup") => {
    setPendingMode(m);
    setShowModeSelector(true);
  };

  const isActive = (to: string) => {
    if (to.includes("#")) return location.pathname + location.hash === to;
    return location.pathname === to;
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50">

        {/* ── Main bar ── */}
        <div className="bg-white dark:bg-black border-b border-gray-200 dark:border-white/10 shadow-sm">
          <div className="container mx-auto px-4 h-14 flex items-center justify-between">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
              <div className="relative">
                <img
                  src={signatureLogo}
                  alt="Signature"
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-red-600/30 group-hover:ring-red-600/60 transition-all"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-black" />
              </div>
              <div className="hidden sm:block leading-none">
                <span className="font-heading font-black text-base text-gray-900 dark:text-white tracking-tight">
                  Signature
                </span>
                <span className="block text-[9px] text-red-600 font-heading font-black uppercase tracking-[0.2em]">
                  Fast Food
                </span>
              </div>
            </Link>

            {/* Desktop nav links */}
            <div className="hidden lg:flex items-center gap-0.5">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3.5 py-2 rounded-full text-sm font-heading font-bold uppercase tracking-wide transition-all ${
                    isActive(link.to)
                      ? "bg-red-600 text-white shadow-sm"
                      : "text-gray-600 dark:text-white/60 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-1">

              {/* Delivery/Pickup — desktop only */}
              <div className="hidden lg:flex bg-gray-100 dark:bg-white/10 rounded-full p-0.5 border border-gray-200 dark:border-white/10 mr-1">
                <button
                  onClick={() => openModeSelector("delivery")}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-heading font-bold uppercase tracking-wide transition-all ${
                    mode === "delivery"
                      ? "bg-red-600 text-white shadow-sm"
                      : "text-gray-600 dark:text-white/60 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <MapPin className="w-3 h-3" /> Delivery
                </button>
                <button
                  onClick={() => openModeSelector("pickup")}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-heading font-bold uppercase tracking-wide transition-all ${
                    mode === "pickup"
                      ? "bg-red-600 text-white shadow-sm"
                      : "text-gray-600 dark:text-white/60 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <Store className="w-3 h-3" /> Pickup
                </button>
              </div>

              <div className="hidden lg:block h-5 w-px bg-gray-200 dark:bg-white/10 mx-0.5" />

              {/* Theme Toggle */}
              <div className="hidden lg:block">
                <ThemeToggle />
              </div>

              {/* Cart */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors group"
              >
                <ShoppingBag className="w-5 h-5 text-gray-700 dark:text-white/70 group-hover:text-red-600 transition-colors" />
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 min-w-[1.1rem] min-h-[1.1rem] bg-red-600 text-white text-[9px] rounded-full flex items-center justify-center font-black shadow-sm px-0.5"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </button>

              {/* User — desktop only */}
              <div className="hidden lg:block">
                {user ? (
                  <UserMenu />
                ) : (
                  <button
                    onClick={() => setIsLoginOpen(true)}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors group"
                  >
                    <User className="w-5 h-5 text-gray-700 dark:text-white/70 group-hover:text-red-600 transition-colors" />
                  </button>
                )}
              </div>

              {/* Order Now — desktop only */}
              <Link to="/menu" className="hidden lg:block ml-1">
                <Button
                  size="sm"
                  className="bg-red-600 hover:bg-red-700 text-white font-heading font-black text-xs uppercase tracking-wide rounded-full px-5 shadow-md transition-all"
                >
                  Order Now <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                </Button>
              </Link>

              {/* Mobile hamburger */}
              <button
                className="lg:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Menu"
              >
                {isMenuOpen
                  ? <X className="w-5 h-5 text-gray-800 dark:text-white" />
                  : <Menu className="w-5 h-5 text-gray-800 dark:text-white" />
                }
              </button>
            </div>
          </div>
        </div>

        {/* ── Mobile slide-out menu ── */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden overflow-hidden bg-white dark:bg-black border-b border-gray-200 dark:border-white/10 shadow-xl"
            >
              <div className="px-4 py-4 space-y-1">

                {/* Delivery / Pickup toggle */}
                <div className="flex bg-gray-100 dark:bg-white/10 rounded-2xl p-1 border border-gray-200 dark:border-white/10 mb-3">
                  <button
                    onClick={() => { openModeSelector("delivery"); setIsMenuOpen(false); }}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-heading font-bold uppercase tracking-wide transition-all ${
                      mode === "delivery"
                        ? "bg-red-600 text-white shadow-md"
                        : "text-gray-600 dark:text-white/60"
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5" /> Delivery
                  </button>
                  <button
                    onClick={() => { openModeSelector("pickup"); setIsMenuOpen(false); }}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-heading font-bold uppercase tracking-wide transition-all ${
                      mode === "pickup"
                        ? "bg-red-600 text-white shadow-md"
                        : "text-gray-600 dark:text-white/60"
                    }`}
                  >
                    <Store className="w-3.5 h-3.5" /> Pickup
                  </button>
                </div>

                {/* Nav links */}
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center justify-between py-3 px-4 rounded-2xl text-sm font-heading font-bold uppercase tracking-wide transition-all ${
                      isActive(link.to)
                        ? "bg-red-600/10 text-red-600 border border-red-600/20"
                        : "text-gray-700 dark:text-white/70 hover:bg-gray-100 dark:hover:bg-white/10"
                    }`}
                  >
                    {link.label}
                    <ChevronRight className="w-4 h-4 opacity-40" />
                  </Link>
                ))}

                {/* Theme & Auth & CTA */}
                <div className="pt-2 space-y-2">
                  <div className="flex justify-between items-center py-2 px-1">
                    <span className="text-sm font-heading font-bold text-gray-700 dark:text-gray-300">Theme</span>
                    <ThemeToggle />
                  </div>
                  {!user && (
                    <Button
                      onClick={() => { setIsLoginOpen(true); setIsMenuOpen(false); }}
                      variant="outline"
                      className="w-full border-red-600/20 text-gray-800 dark:text-white rounded-full font-heading font-bold"
                    >
                      <User className="w-4 h-4 mr-2" /> Sign In
                    </Button>
                  )}
                  <Link to="/menu" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full bg-red-600 hover:bg-red-700 text-white font-heading font-black uppercase tracking-wide rounded-full shadow-md">
                      Order Now
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      <DeliveryPickupSelector
        isOpen={showModeSelector}
        onClose={() => setShowModeSelector(false)}
        initialMode={pendingMode}
      />
    </>
  );
};

export default Navigation;
