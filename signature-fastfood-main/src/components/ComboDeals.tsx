import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { comboDeals } from "@/data/menuData";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/hooks/useFavorites";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart } from "lucide-react";
import { formatPKR } from "@/lib/currency";

const ComboDeals = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const { addItem } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

  return (
    <section ref={ref} className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="mb-14"
        >
          <span className="text-primary font-heading font-semibold text-sm uppercase tracking-wider">Special Offers</span>
          <h2 className="font-heading font-black text-4xl md:text-5xl mt-2 mb-3 text-foreground">
            Combo <span className="text-gradient">Deals</span> You'll Love
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl">
            More food, less money — perfect for sharing with your favorite people.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
          {comboDeals.map((deal, i) => (
            <motion.div
              key={deal.id}
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: i * 0.08 }}
              className="relative w-full min-h-[300px] md:min-h-[360px] border border-white/15 rounded-[1.75rem] overflow-hidden group"
            >
              {/* ── Liquid Glass Background ── */}
              {/* Outer gradient border shell */}
              <div className="absolute inset-0 p-[1.5px] rounded-[1.75rem] z-0 bg-gradient-to-br from-accent/70 via-orange-400/50 to-accent/20 pointer-events-none">
                <div className="w-full h-full rounded-[1.7rem] rounded-tr-[80px] rounded-br-[36px] bg-card"></div>
              </div>

              {/* Spinning orb — themed to red/orange brand */}
              <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none overflow-hidden">
                <div
                  className="w-48 h-48 rounded-full bg-gradient-to-tr from-accent/25 to-orange-400/20 animate-spin blur-3xl mix-blend-screen dark:mix-blend-lighten"
                  style={{ animationDuration: '14s' }}
                />
              </div>

              {/* Glass sheen highlights */}
              <div className="absolute top-0 left-0 right-0 h-1/2 rounded-t-[1.75rem] bg-gradient-to-b from-foreground/5 to-transparent z-0 pointer-events-none" />
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent z-0 pointer-events-none" />

              {/* ── Card Content ── */}
              <div className="relative w-full h-full p-3.5 flex flex-col z-10">

                {/* Title + Price glass info panel */}
                <div className="w-[78%] p-2.5 flex flex-col rounded-xl backdrop-blur-md bg-foreground/5 border border-foreground/10 text-left shadow-md ring-1 ring-inset ring-foreground/5">
                  <span className="text-sm md:text-base font-heading font-black text-foreground leading-tight line-clamp-2">{deal.title}</span>
                  <div className="flex items-end gap-1.5 mt-1">
                    <span className="text-base text-accent font-black leading-none">{formatPKR(deal.price)}</span>
                    {deal.originalPrice && <span className="text-[10px] text-muted-foreground line-through leading-none pb-px">{formatPKR(deal.originalPrice)}</span>}
                  </div>
                </div>

                {/* Favourite button — top right */}
                <div className="absolute top-3.5 right-3.5 z-20">
                  <button
                    onClick={() => toggleFavorite(deal.id)}
                    className="w-9 h-9 flex items-center justify-center rounded-full backdrop-blur-lg bg-foreground/5 border border-foreground/10 hover:bg-accent/20 hover:border-accent/40 transition-all shadow-lg"
                  >
                    <Heart className={`w-4 h-4 transition-colors ${isFavorite(deal.id) ? 'fill-accent text-accent' : 'text-muted-foreground'}`} />
                  </button>
                </div>

                {/* Food image + discount badge */}
                <div className="flex-1 flex flex-col items-center justify-center mt-2 relative">
                  <div className="relative">
                    {deal.discount && (
                      <span className="absolute -top-2 -right-4 z-30 bg-gradient-to-r from-accent to-orange-500 text-primary-foreground text-[9px] uppercase font-black px-2 py-0.5 rounded-full shadow border border-foreground/10 rotate-12">
                        {deal.discount}
                      </span>
                    )}
                    <motion.img
                      src={deal.image}
                      alt={deal.title}
                      className="w-28 h-28 md:w-32 md:h-32 object-contain drop-shadow-2xl group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500 ease-out"
                    />
                  </div>

                  {/* Items list */}
                  <div className="mt-2 text-center space-y-0.5 overflow-hidden max-h-[36px]">
                    {deal.items.map((item, idx) => (
                      <p key={idx} className="text-muted-foreground text-[9px] md:text-[10px] leading-tight">{item}</p>
                    ))}
                  </div>
                </div>

                {/* Add button — glass style matching theme */}
                <div className="mt-3">
                  <Button
                    className="w-full h-10 rounded-xl backdrop-blur-md bg-accent/10 hover:bg-accent/20 text-foreground border border-accent/20 hover:border-accent/40 font-heading font-black text-xs tracking-wide shadow-sm transition-all flex items-center justify-center gap-1.5 group/btn"
                    onClick={() => addItem({ id: deal.id, name: deal.title, price: deal.price, image: deal.image })}
                  >
                    <ShoppingCart className="w-3.5 h-3.5 text-accent group-hover/btn:scale-110 transition-transform" />
                    Add to Bucket
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ComboDeals;
