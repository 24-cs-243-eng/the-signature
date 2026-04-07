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
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-[#2a2a2a]/95 backdrop-blur-xl border-t border-white/20 shadow-[0_-8px_32px_0_rgba(0,0,0,0.37)] rounded-t-[32px] overflow-hidden pb-1 pt-2">
      <div className="absolute inset-0 bg-gradient-to-r from-orange-300/10 via-amber-500/5 to-purple-500/10 pointer-events-none mix-blend-overlay"></div>
      <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-t-[32px] border-b-0"></div>
      
      <div className="relative flex items-center justify-around pb-3 px-1">
        {tabs.map(({ to, label, icon: Icon }) => {
          const active = pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`flex flex-col items-center justify-center min-w-[4rem] h-14 rounded-2xl transition-all duration-300 ${
                active
                  ? "text-primary scale-110 drop-shadow-md -translate-y-1"
                  : "text-white/60 hover:text-white/90 hover:scale-105"
              }`}
            >
              <Icon className={`w-5 h-5 mb-1 transition-all duration-300 ${active ? "stroke-[2.5]" : "stroke-[2]"}`} />
              <span className={`text-[9px] font-heading font-black tracking-widest uppercase transition-all duration-300 ${active ? "text-primary" : ""}`}>
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
