import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { comboDeals } from "@/data/menuData";
import { useCart } from "@/context/CartContext";
import { ShoppingCart, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPKR } from "@/lib/currency";

const TopDeals = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const { addItem } = useCart();

  return (
    <section ref={ref} className="py-12 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-muted/50 via-background to-primary/[0.02]" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="flex items-center gap-2 mb-8"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <Flame className="w-6 h-6 text-primary" />
          </motion.div>
          <h2 className="font-heading font-bold text-2xl text-foreground">
            TOP DEALS
          </h2>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1.5, delay: 0.3 }}
          >
            <Flame className="w-6 h-6 text-primary" />
          </motion.div>
        </motion.div>

        <div className="grid gap-3">
          {comboDeals.slice(0, 6).map((deal, i) => (
            <motion.div
              key={deal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.08 }}
              className="border border-border rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 bg-card relative group"
            >
              {/* Left accent bar */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-xl" />

              <div className="flex items-center gap-4 p-4 pl-5">
                {/* Image */}
                <div className="flex-shrink-0 w-24 h-24 md:w-28 md:h-28 bg-muted/30 rounded-xl flex items-center justify-center">
                  <img
                    src={deal.image}
                    alt={deal.title}
                    className="w-20 h-20 md:w-24 md:h-24 object-contain group-hover:scale-105 transition-transform"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-heading font-bold text-base text-foreground">{deal.title}</h3>
                    {deal.discount && (
                      <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-0.5 rounded-full">
                        {deal.discount}
                      </span>
                    )}
                  </div>
                  <p className="text-muted-foreground text-xs mb-2 line-clamp-1">
                    {deal.items.join(" + ")}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="font-heading font-black text-lg text-primary">{formatPKR(deal.price)}</span>
                    {deal.originalPrice && (
                      <span className="text-muted-foreground text-sm line-through">{formatPKR(deal.originalPrice)}</span>
                    )}
                  </div>
                </div>

                {/* Add button */}
                <Button
                  size="sm"
                  className="flex-shrink-0 bg-gradient-brand text-primary-foreground rounded-lg font-heading font-bold shadow-md"
                  onClick={() => addItem({ id: deal.id, name: deal.title, price: deal.price, image: deal.image })}
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span className="hidden md:inline ml-1">Add</span>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopDeals;
