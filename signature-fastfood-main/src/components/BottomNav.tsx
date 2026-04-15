import { Link, useLocation } from "react-router-dom";
import { Home, UtensilsCrossed, Tag, Phone, Wand2 } from "lucide-react";
import { useCart } from "@/context/CartContext";

const BottomNav = () => {
  const location = useLocation();
  const { totalItems, setIsCartOpen } = useCart();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white dark:bg-black border-t border-gray-200 dark:border-white/10 shadow-[0_-2px_20px_0_rgba(0,0,0,0.12)] dark:shadow-[0_-2px_20px_0_rgba(0,0,0,0.5)]">
      <div className="flex items-end justify-around px-1 pb-2 pt-1.5">

        <NavItem to="/"           label="Home"    icon={Home}           active={isActive("/")} />
        <NavItem to="/menu"       label="Menu"    icon={UtensilsCrossed} active={isActive("/menu")} />

        {/* Custom Deal — center featured button */}
        <Link
          to="/custom-deal"
          className="flex flex-col items-center justify-end -mt-5 relative"
        >
          <div
            className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg border-2 transition-all ${
              isActive("/custom-deal")
                ? "bg-red-600 border-red-600 scale-110"
                : "bg-red-600 border-white dark:border-black"
            }`}
          >
            <Wand2 className="w-6 h-6 text-white" />
          </div>
          <span className={`text-[9px] font-heading font-black tracking-widest uppercase mt-1 ${
            isActive("/custom-deal") ? "text-red-600" : "text-gray-500 dark:text-white/50"
          }`}>
            Custom
          </span>
        </Link>

        <NavItem to="/deals"   label="Combos"  icon={Tag}   active={isActive("/deals")} />
        <NavItem to="/contact" label="Contact" icon={Phone} active={isActive("/contact")} />
      </div>
    </nav>
  );
};

const NavItem = ({
  to,
  label,
  icon: Icon,
  active,
}: {
  to: string;
  label: string;
  icon: React.ElementType;
  active: boolean;
}) => (
  <Link
    to={to}
    className={`flex flex-col items-center justify-center min-w-[3rem] h-12 rounded-2xl transition-all duration-200 ${
      active ? "text-red-600" : "text-gray-400 dark:text-white/40 hover:text-gray-700 dark:hover:text-white/70"
    }`}
  >
    <Icon className={`w-5 h-5 mb-0.5 transition-all ${active ? "stroke-[2.5]" : "stroke-[1.5]"}`} />
    <span className={`text-[9px] font-heading font-black tracking-widest uppercase ${active ? "text-red-600" : ""}`}>
      {label}
    </span>
  </Link>
);

export default BottomNav;
