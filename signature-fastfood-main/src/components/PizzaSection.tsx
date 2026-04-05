import { useState } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { menuItems } from "@/data/menuData";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/hooks/useFavorites";
import { Star, ShoppingCart, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPKR } from "@/lib/currency";

const pizzaItems = menuItems.filter((item) => item.category === "Pizza");

const PizzaSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.05 });
  const { addItem } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

  // Track selected size per pizza card
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>(() =>
    Object.fromEntries(pizzaItems.map((p) => [p.id, "M"]))
  );

  const getSizePrice = (itemId: string, itemBasePrice: number) => {
    const item = pizzaItems.find((p) => p.id === itemId);
    if (!item?.sizes) return itemBasePrice;
    const size = item.sizes.find((s) => s.label === selectedSizes[itemId]);
    return size?.price ?? itemBasePrice;
  };

  return (
    <section ref={ref} id="pizza-section" className="py-16 bg-card scroll-mt-24">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          {/* Hero banner strip */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-700 via-red-600 to-orange-500 px-8 py-8 mb-10 flex items-center justify-between shadow-2xl">
            {/* Decorative circles */}
            <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/5" />
            <div className="absolute -bottom-8 -left-6 w-32 h-32 rounded-full bg-white/5" />

            <div className="relative z-10">
              <p className="text-white/70 text-xs font-heading font-bold uppercase tracking-widest mb-1">
                Freshly Baked
              </p>
              <h2 className="font-heading font-black text-3xl md:text-4xl text-white leading-tight">
                Our <span className="text-yellow-300">Pizzas</span> 🍕
              </h2>
              <p className="text-white/70 text-sm mt-2 max-w-xs">
                Hand-stretched dough, premium toppings, baked to perfection
              </p>
            </div>

            {/* Size legend */}
            <div className="relative z-10 hidden sm:flex flex-col gap-1.5 text-right">
              <p className="text-white/60 text-[10px] font-heading font-bold uppercase tracking-wider mb-1">
                Choose Size
              </p>
              {[
                { label: "S", sub: "Small" },
                { label: "M", sub: "Medium" },
                { label: "L", sub: "Large — Best Value" },
              ].map(({ label, sub }) => (
                <div key={label} className="flex items-center gap-2 justify-end">
                  <span className="text-white/60 text-[11px] font-body">{sub}</span>
                  <span className="w-7 h-7 rounded-md bg-white/20 flex items-center justify-center text-white font-heading font-black text-xs border border-white/30">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Pizza Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
          {pizzaItems.map((item, i) => {
            const activeSizeLabel = selectedSizes[item.id] ?? "M";
            const activePrice = getSizePrice(item.id, item.price);

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                whileHover={{ y: -6 }}
                className="bg-background rounded-xl border border-border mt-12 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all group relative flex flex-col h-full"
              >
                {/* Pop-out image */}
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-32 h-32 flex justify-center z-20 pointer-events-none">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-contain drop-shadow-2xl group-hover:scale-110 group-hover:-translate-y-2 transition-transform duration-500"
                  />
                </div>

                {/* Badges */}
                {item.isBestSeller && (
                  <span className="absolute -top-3 left-4 z-30 px-2.5 py-1 bg-primary text-primary-foreground text-[10px] font-black rounded-md shadow-md">
                    🔥 BEST SELLER
                  </span>
                )}
                <button
                  onClick={() => toggleFavorite(item.id)}
                  className="absolute -top-3 right-4 z-30 w-8 h-8 rounded-full bg-card backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform shadow-md border border-border"
                >
                  <Heart className={`w-4 h-4 ${isFavorite(item.id) ? "fill-destructive text-destructive" : "text-muted-foreground"}`} />
                </button>

                <div className="px-4 pt-24 pb-5 flex flex-col flex-1 text-center items-center">
                  <h3 className="font-heading font-black text-foreground text-base mb-1.5">{item.name}</h3>

                  {/* Stars */}
                  <div className="flex items-center justify-center gap-1 mb-2">
                    {[...Array(5)].map((_, s) => (
                      <Star key={s} className={`w-3 h-3 ${s < Math.floor(item.rating) ? "fill-yellow-400 text-yellow-400" : "fill-border text-border"}`} />
                    ))}
                    <span className="text-[10px] font-bold text-muted-foreground ml-1">{item.rating}</span>
                  </div>

                  <p className="text-muted-foreground text-[11px] mb-4 line-clamp-2 leading-relaxed flex-1">
                    {item.description}
                  </p>

                  {/* Size selector */}
                  {item.sizes && (
                    <div className="flex items-center gap-1.5 mb-4">
                      {item.sizes.map((sz) => (
                        <button
                          key={sz.label}
                          onClick={() => setSelectedSizes((prev) => ({ ...prev, [item.id]: sz.label }))}
                          className={`w-8 h-8 rounded-md text-xs font-heading font-black border transition-all duration-200 ${
                            activeSizeLabel === sz.label
                              ? "bg-primary text-primary-foreground border-primary shadow-md scale-110"
                              : "bg-muted text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
                          }`}
                        >
                          {sz.label}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Price + Add to Cart */}
                  <div className="w-full flex items-center justify-between border-t border-border pt-4 mt-auto">
                    <div>
                      <span className="font-heading font-black text-lg text-primary">{formatPKR(activePrice)}</span>
                      {activeSizeLabel && (
                        <span className="ml-1 text-[10px] text-muted-foreground font-bold">({activeSizeLabel})</span>
                      )}
                    </div>
                    <Button
                      size="sm"
                      className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md font-heading font-black text-xs shadow-md transition-all duration-300"
                      onClick={() =>
                        addItem({
                          id: `${item.id}-${activeSizeLabel}`,
                          name: `${item.name} (${activeSizeLabel})`,
                          price: activePrice,
                          image: item.image,
                        })
                      }
                    >
                      ADD <ShoppingCart className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PizzaSection;
