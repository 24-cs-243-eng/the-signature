import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Moon, Star, ShoppingCart, Sparkles, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ramadanDeals } from "@/data/menuData";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/hooks/useFavorites";

const RamadanDeals = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const { addItem } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

  return (
    <section ref={ref} className="py-12 bg-background relative overflow-hidden">
      {/* Warm radial gradient background */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse at center top, hsl(35 60% 50% / 0.06) 0%, transparent 60%)"
      }} />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary font-heading font-bold text-sm mb-4">
            <Moon className="w-4 h-4" /> RAMADAN SPECIALS <Star className="w-4 h-4" />
          </div>
          <h2 className="font-heading font-black text-3xl md:text-5xl text-foreground mb-3">
            Iftar <span className="text-gradient">Deals</span>
          </h2>
          <p className="text-muted-foreground text-base max-w-xl mx-auto">
            Celebrate the blessed month with our special Iftar packages
          </p>
        </motion.div>

        {/* Deal Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
          {ramadanDeals.map((deal, index) => (
            <motion.div
              key={deal.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1 }}
              className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg hover:border-primary/20 hover:-translate-y-1 transition-all duration-200 group relative"
            >
              {/* Badge & Favorite */}
              <div className="absolute top-3 left-3 z-10">
                <span className="bg-gradient-brand text-primary-foreground px-3 py-1 rounded-full text-xs font-heading font-bold">
                  {deal.badge}
                </span>
              </div>
              <button
                onClick={() => toggleFavorite(deal.id)}
                className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform border border-border"
              >
                <Heart className={`w-4 h-4 ${isFavorite(deal.id) ? 'fill-destructive text-destructive' : 'text-muted-foreground'}`} />
              </button>

              {/* Image */}
              <div className="relative p-6 pt-12 bg-muted/30 flex justify-center">
                <img
                  src={deal.image}
                  alt={deal.title}
                  className="w-32 h-32 object-contain drop-shadow-lg"
                />
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="font-heading font-bold text-lg text-foreground mb-3">{deal.title}</h3>
                
                <ul className="space-y-1 mb-4">
                  {deal.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Sparkles className="w-3 h-3 text-primary flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="flex items-end gap-2 mb-4">
                  <span className="font-heading font-black text-2xl text-primary">
                    Rs. {deal.price.toLocaleString()}/-
                  </span>
                </div>

                <Button
                  className={`w-full bg-gradient-brand text-primary-foreground font-heading font-semibold rounded-lg ${index === 0 ? 'animate-pulse-glow' : ''}`}
                  onClick={() =>
                    addItem({
                      id: deal.id,
                      name: deal.title,
                      price: deal.price,
                      image: deal.image,
                    })
                  }
                >
                  <ShoppingCart className="w-4 h-4 mr-2" /> Order Now
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RamadanDeals;
