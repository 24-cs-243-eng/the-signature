import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User, MapPin, Store, ChevronRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useOrderMode } from "@/context/OrderModeContext";
import { Button } from "@/components/ui/button";
import { LoginModal, UserMenu } from "@/components/AuthUI";
import DeliveryPickupSelector from "@/components/DeliveryPickupSelector";
import { ThemeToggle } from "@/components/ThemeToggle";
const signatureLogo = "/media/signature-logo.jpeg";;

/* Custom bucket/bag cart icon — unique branding like KFC's bucket */
const BucketIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    {/* Bucket shape */}
    <path d="M4 10 L6 21 H18 L20 10" />
    <path d="M2 10 H22" />
    {/* Handle */}
    <path d="M8 10 C8 5 16 5 16 10" />
    {/* Steam lines */}
    <path d="M10 7 C10 5.5 10.5 4 10 3" strokeWidth="1.5" opacity="0.6" />
    <path d="M14 7 C14 5.5 14.5 4 14 3" strokeWidth="1.5" opacity="0.6" />
  </svg>
);

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [showModeSelector, setShowModeSelector] = useState(false);
  const [pendingMode, setPendingMode] = useState<"delivery" | "pickup">("delivery");
  const { totalItems, setIsCartOpen } = useCart();
  const { user } = useAuth();
  const { mode } = useOrderMode();
  const location = useLocation();

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/menu", label: "Menu" },
    { to: "/deals", label: "Deals" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ];

  const openModeSelector = (m: "delivery" | "pickup") => {
    setPendingMode(m);
    setShowModeSelector(true);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50">

        {/* Top strip for Mobile ONLY — solves the overlapping layout issue */}
        <div className="bg-muted lg:hidden border-b border-border shadow-sm flex items-center justify-center p-2">
           <div className="flex bg-card rounded-full p-0.5 border border-border shadow-inner">
             <button
                onClick={() => openModeSelector("delivery")}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[11px] font-heading font-bold uppercase tracking-wider transition-all ${
                  mode === "delivery" ? "bg-primary text-primary-foreground shadow-md" : "text-foreground/70"
                }`}
              >
                <MapPin className="w-3.5 h-3.5" /> Delivery
              </button>
              <button
                onClick={() => openModeSelector("pickup")}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[11px] font-heading font-bold uppercase tracking-wider transition-all ${
                  mode === "pickup" ? "bg-primary text-primary-foreground shadow-md" : "text-foreground/70"
                }`}
              >
                <Store className="w-3.5 h-3.5" /> Pickup
              </button>
          </div>
        </div>

        {/* Main navbar — White bg with strong bottom shadow */}
        <div className="bg-card/95 backdrop-blur-md border-b border-border shadow-md">
          <div className="container mx-auto px-4 py-2.5 flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group shrink-0">
              <div className="relative">
                <img src={signatureLogo} alt="Signature" className="w-11 h-11 rounded-full object-cover ring-2 ring-primary/20 group-hover:ring-primary/50 transition-all" />
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-card" />
              </div>
              <div className="hidden sm:block">
                <span className="font-heading font-black text-lg text-foreground leading-none tracking-tight">
                  Signature
                </span>
                <span className="block text-[10px] text-primary font-heading font-bold uppercase tracking-[0.2em]">
                  Fast Food
                </span>
              </div>
            </Link>

            {/* Desktop nav links & Mode Selector */}
            <div className="hidden lg:flex items-center gap-4">
              <div className="flex bg-muted rounded-full p-1 border border-border shadow-inner">
                <button
                  onClick={() => openModeSelector("delivery")}
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[11px] font-heading font-bold uppercase tracking-wider transition-all ${
                    mode === "delivery" ? "bg-primary text-primary-foreground shadow-md" : "text-foreground/70 hover:text-foreground"
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" /> Delivery
                </button>
                <button
                  onClick={() => openModeSelector("pickup")}
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[11px] font-heading font-bold uppercase tracking-wider transition-all ${
                    mode === "pickup" ? "bg-primary text-primary-foreground shadow-md" : "text-foreground/70 hover:text-foreground"
                  }`}
                >
                  <Store className="w-3.5 h-3.5" /> Pickup
                </button>
              </div>

              <div className="h-4 w-px bg-border mx-1" />

              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3 py-2 rounded-full text-sm font-heading font-bold uppercase tracking-wider transition-all ${
                    isActive(link.to)
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground/70 hover:text-primary hover:bg-primary/5"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              {/* Cart bucket icon */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 rounded-full hover:bg-primary/5 transition-colors group"
              >
                <BucketIcon className="w-6 h-6 text-foreground/70 group-hover:text-primary transition-colors" />
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary text-primary-foreground text-[10px] rounded-full flex items-center justify-center font-black shadow-sm"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </button>

              {/* Theme toggle */}
              <ThemeToggle />

              {/* User */}
              {user ? (
                <UserMenu />
              ) : (
                <button
                  onClick={() => setIsLoginOpen(true)}
                  className="p-2 rounded-full hover:bg-primary/5 transition-colors group"
                >
                  <User className="w-5 h-5 text-foreground/70 group-hover:text-primary transition-colors" />
                </button>
              )}

              {/* Order Now CTA */}
              <Link to="/menu" className="hidden sm:block">
                <Button
                  className="bg-gradient-brand text-primary-foreground font-heading font-black text-xs uppercase tracking-wider rounded-full px-5 shadow-md hover:shadow-lg hover:opacity-95 transition-all"
                  size="sm"
                >
                  Order Now <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                </Button>
              </Link>

              {/* Mobile hamburger */}
              <button
                className="lg:hidden p-2 rounded-full hover:bg-primary/5 transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="w-5 h-5 text-foreground" /> : <Menu className="w-5 h-5 text-foreground" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile dropdown */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="lg:hidden overflow-hidden bg-card border-b border-border shadow-lg"
            >
              <div className="container mx-auto px-4 py-3 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center justify-between py-3 px-4 rounded-xl text-sm font-heading font-bold uppercase tracking-wider transition-all ${
                      isActive(link.to)
                        ? "bg-primary/10 text-primary"
                        : "text-foreground/70 hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {link.label}
                    <ChevronRight className="w-4 h-4 opacity-40" />
                  </Link>
                ))}
                <div className="pt-2 space-y-2">
                  {!user && (
                    <Button
                      onClick={() => { setIsLoginOpen(true); setIsMenuOpen(false); }}
                      variant="outline"
                      className="w-full border-primary/20 text-foreground rounded-full font-heading font-bold"
                    >
                      <User className="w-4 h-4 mr-2" /> Sign In
                    </Button>
                  )}
                  <Link to="/menu" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full bg-gradient-brand text-primary-foreground font-heading font-black uppercase tracking-wider rounded-full shadow-md">
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
