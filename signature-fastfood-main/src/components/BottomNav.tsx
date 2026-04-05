import { Link, useLocation } from "react-router-dom";
import { Home, UtensilsCrossed, Tag, Info, Phone } from "lucide-react";

const tabs = [
  { to: "/", label: "Home", icon: Home },
  { to: "/menu", label: "Menu", icon: UtensilsCrossed },
  { to: "/deals", label: "Deals", icon: Tag },
  { to: "/contact", label: "Contact", icon: Phone },
];

const BottomNav = () => {
  const { pathname } = useLocation();

  return (
    <nav className="fixed bottom-4 left-4 right-4 z-50 lg:hidden bg-[#2a2a2a]/40 backdrop-blur-md border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] rounded-[32px] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-orange-300/10 via-amber-500/5 to-purple-500/10 pointer-events-none mix-blend-overlay"></div>
      <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-[32px]"></div>
      
      <div className="relative flex items-center justify-around py-3 px-2">
        {tabs.map(({ to, label, icon: Icon }) => {
          const active = pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`relative flex flex-col items-center justify-center min-w-[3rem] h-[3.5rem] rounded-2xl transition-all duration-500 ease-out-expo ${
                active
                  ? "bg-gradient-to-tr from-orange-400/80 to-amber-200/80 text-black shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),_0_4px_12px_rgba(251,146,60,0.4)] transform -translate-y-2 scale-110"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon className={`w-5 h-5 transition-transform duration-300 ${active ? "stroke-[2.5] scale-110 drop-shadow-sm" : ""}`} />
              <span className={`absolute -bottom-5 text-[9px] uppercase tracking-wider font-mono whitespace-nowrap opacity-0 transition-opacity duration-300 ${active ? "opacity-100 text-orange-200 font-bold drop-shadow-md" : ""}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
