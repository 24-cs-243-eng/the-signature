import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { ShoppingBag } from "lucide-react";
import { formatPKR } from "@/lib/currency";

const FloatingCart = () => {
  const { totalItems, totalPrice, setIsCartOpen } = useCart();

  return (
    <AnimatePresence>
      {totalItems > 0 && (
        <motion.button
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", damping: 22, stiffness: 300 }}
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-20 lg:bottom-6 left-1/2 -translate-x-1/2 z-40 bg-primary text-primary-foreground rounded-full px-6 py-3.5 shadow-2xl shadow-primary/40 flex items-center gap-3 hover:bg-primary/90 transition-colors lg:hidden"
          aria-label="View cart"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            <span className="absolute -top-2 -right-2 w-4 h-4 bg-white text-primary text-[10px] font-black rounded-full flex items-center justify-center">
              {totalItems}
            </span>
          </div>
          <span className="font-heading font-black text-sm tracking-wide">View Cart</span>
          <span className="font-heading font-bold text-sm opacity-90">{formatPKR(totalPrice)}</span>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default FloatingCart;
