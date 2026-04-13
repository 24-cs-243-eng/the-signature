import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const Preloader = () => {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    setIsLoading(true);
    // Short preloader on route change
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (!isLoading) return null;

  return (
    <div
      className="fixed inset-0 bg-background/95 backdrop-blur-sm flex flex-col items-center justify-center"
      style={{ zIndex: 200 }}
    >
      <div className="relative w-24 h-24 mb-6">
        <img
          src="/media/signature-logo.jpeg"
          alt="Signature 3D Logo"
          className="w-full h-full object-cover rounded-full border-2 border-primary/50 shadow-2xl animate-flip-3d"
        />
        <div className="absolute -inset-2 rounded-full shadow-[0_0_20px_hsl(349,100%,45%,0.3)] animate-pulse-glow pointer-events-none" />
      </div>
      <h2 className="text-2xl font-heading font-black text-foreground tracking-widest uppercase animate-pulse">
        Signature
      </h2>
    </div>
  );
};

export default Preloader;
