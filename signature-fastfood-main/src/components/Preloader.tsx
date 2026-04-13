import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const Preloader = () => {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setProgress(0);
    setVisible(true);
    const t1 = setTimeout(() => setProgress(75), 60);
    const t2 = setTimeout(() => setProgress(100), 350);
    const t3 = setTimeout(() => setVisible(false), 600);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [location.pathname]);

  if (!visible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[999] h-[3px] pointer-events-none">
      <div
        className="h-full bg-gradient-to-r from-primary via-orange-400 to-primary shadow-[0_0_8px_hsl(349,100%,45%,0.8)]"
        style={{ width: `${progress}%`, transition: "width 280ms ease-out" }}
      />
    </div>
  );
};

export default Preloader;
