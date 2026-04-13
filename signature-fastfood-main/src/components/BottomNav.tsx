import { Link, useLocation } from "react-router-dom";
import { Home, UtensilsCrossed, Tag, Phone, Wand2 } from "lucide-react";

const BottomNav = () => {
  const { pathname, hash } = useLocation();
  const fullPath = pathname + hash;

  const isActive = (to: string) => {
    if (to.includes("#")) return fullPath === to;
    return pathname === to;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-[#1e1e1e]/96 backdrop-blur-xl border-t border-white/15 shadow-[0_-4px_24px_0_rgba(0,0,0,0.4)] rounded-t-3xl overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-orange-300/5 via-amber-500/5 to-purple-500/5 pointer-events-none" />
      <div className="relative flex items-end justify-around px-2 pb-3 pt-2">

        {/* Home */}
        <NavItem to="/" label="Home" icon={Home} active={isActive("/")} />

        {/* Menu */}
        <NavItem to="/menu" label="Menu" icon={UtensilsCrossed} active={isActive("/menu")} />

        {/* Custom Deal — centre prominent button */}
        <Link
          to="/deals#custom"
          className="flex flex-col items-center justify-center -mt-5 relative"
        >
          <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all ${
            isActive("/deals#custom")
              ? "bg-primary shadow-primary/40 scale-110"
              : "bg-gradient-to-br from-primary via-orange-500 to-orange-400 shadow-primary/30 active:scale-95"
          }`}>
            <Wand2 className="w-6 h-6 text-white" />
          </div>
          <span className={`text-[9px] font-heading font-black tracking-widest uppercase mt-1 transition-colors ${
            isActive("/deals#custom") ? "text-primary" : "text-white/70"
          }`}>
            Deals
          </span>
        </Link>

        {/* Deals */}
        <NavItem to="/deals" label="Combos" icon={Tag} active={isActive("/deals")} />

        {/* Contact */}
        <NavItem to="/contact" label="Contact" icon={Phone} active={isActive("/contact")} />

      </div>
    </nav>
  );
};

const NavItem = ({ to, label, icon: Icon, active }: {
  to: string; label: string; icon: React.ElementType; active: boolean;
}) => (
  <Link
    to={to}
    className={`flex flex-col items-center justify-center min-w-[3.5rem] h-14 rounded-2xl transition-all duration-200 ${
      active ? "text-primary -translate-y-0.5" : "text-white/50 hover:text-white/80"
    }`}
  >
    <Icon className={`w-5 h-5 mb-1 transition-all ${active ? "stroke-[2.5]" : "stroke-[1.8]"}`} />
    <span className={`text-[9px] font-heading font-black tracking-widest uppercase ${active ? "text-primary" : ""}`}>
      {label}
    </span>
  </Link>
);

export default BottomNav;
