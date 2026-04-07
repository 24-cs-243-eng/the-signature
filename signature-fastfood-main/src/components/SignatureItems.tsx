import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { menuItems, categories } from "@/data/menuData";
import { useCart } from "@/context/CartContext";
import { Plus, Star, Flame, Sparkles } from "lucide-react";
import { formatPKR } from "@/lib/currency";
import { toast } from "sonner";

const MenuSection = ({ category, items }: { category: string, items: typeof menuItems }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.05 });
  const { addItem } = useCart();
  const [addedId, setAddedId] = useState<string | null>(null);
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});

  if (items.length === 0) return null;

  const getSizePrice = (itemId: string, basePrice: number, sizes?: { label: string; price: number }[]) => {
    if (!sizes) return basePrice;
    const label = selectedSizes[itemId] ?? sizes[1]?.label ?? sizes[0]?.label;
    return sizes.find((s) => s.label === label)?.price ?? basePrice;
  };

  const getActiveLabel = (itemId: string, sizes?: { label: string; price: number }[]) => {
    if (!sizes) return null;
    return selectedSizes[itemId] ?? sizes[1]?.label ?? sizes[0]?.label;
  };

  const handleAdd = (item: typeof menuItems[0], price: number, label: string | null) => {
    const finalId = label ? `${item.id}-${label}` : item.id;
    const finalName = label ? `${item.name} (${label})` : item.name;
    addItem({ id: finalId, name: finalName, price, image: item.image });
    setAddedId(finalId);
    toast.success(`${finalName} added!`, { duration: 1500 });
    setTimeout(() => setAddedId(null), 700);
  };

  return (
    <div ref={ref} className="mb-8 md:mb-14 scroll-mt-24" id={`category-${category.replace(/\s+/g, '-').toLowerCase()}`}>
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        className="flex items-center gap-3 mb-6 border-b border-border/50 pb-3"
      >
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <Sparkles className="w-4 h-4 text-primary" />
        </div>
        <h2 className="font-heading font-black text-2xl md:text-4xl text-foreground uppercase tracking-wider">{category}</h2>
      </motion.div>

      {/* Grid — extra top padding to accommodate the pop-out image */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-12 md:gap-x-5 md:gap-y-14 px-1">
        {items.map((item, i) => {
          const isBestSeller = item.isBestSeller;
          const isTopRated = !isBestSeller && item.rating >= 4.8;
          const activeLabel = getActiveLabel(item.id, item.sizes);
          const activePrice = getSizePrice(item.id, item.price, item.sizes);
          const currentId = activeLabel ? `${item.id}-${activeLabel}` : item.id;
          const isAdded = addedId === currentId;

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.35, delay: Math.min(i * 0.05, 0.4) }}
              className="group relative"
            >
              {/* Card */}
              <div className="bg-card rounded-2xl border border-border shadow-md hover:shadow-xl hover:border-primary/30 transition-all duration-300 flex flex-col h-full overflow-visible relative">

                {/* Best Seller / Top Rated — small corner pill */}
                {(isBestSeller || isTopRated) && (
                  <span className={`absolute top-2 left-2 z-30 flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[8px] font-black uppercase shadow-md ${isBestSeller ? "bg-primary text-primary-foreground" : "bg-yellow-500 text-white"}`}>
                    <Flame className="w-2 h-2" />
                    {isBestSeller ? "Best" : "Top"}
                  </span>
                )}

                {/* Pop-out food image — reduced overhang */}
                <div className="relative flex justify-center -mt-8 z-10 pointer-events-none">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 md:w-28 md:h-28 object-contain drop-shadow-2xl group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-500"
                  />
                </div>

                {/* Content */}
                <div className="px-3 pt-2 pb-4 flex flex-col flex-1 text-center items-center">
                  {/* Name */}
                  <h3 className="font-heading font-black text-sm md:text-base text-foreground line-clamp-1 mb-1">
                    {item.name}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center justify-center gap-0.5 mb-2">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star
                        key={j}
                        className={`w-2.5 h-2.5 ${j < Math.floor(item.rating) ? "text-yellow-400 fill-yellow-400" : "text-border fill-border"}`}
                      />
                    ))}
                    <span className="text-[9px] font-bold text-muted-foreground ml-0.5">{item.rating}</span>
                  </div>

                  {/* Description */}
                  <p className="text-muted-foreground text-[10px] md:text-[11px] line-clamp-2 leading-relaxed flex-1 mb-3">
                    {item.description}
                  </p>

                  {/* S/M/L Sizes */}
                  {item.sizes && (
                    <div className="flex items-center justify-center gap-1 mb-3">
                      {item.sizes.map((sz) => (
                        <button
                          key={sz.label}
                          onClick={() => setSelectedSizes((prev) => ({ ...prev, [item.id]: sz.label }))}
                          className={`w-7 h-7 rounded-md text-[10px] font-heading font-black border transition-all duration-200 ${
                            activeLabel === sz.label
                              ? "bg-primary text-primary-foreground border-primary shadow-sm scale-110"
                              : "bg-muted text-muted-foreground border-border hover:border-primary/40"
                          }`}
                        >
                          {sz.label}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Price + ADD button row */}
                  <div className="w-full flex items-center justify-between gap-2 border-t border-border/60 pt-3 mt-auto">
                    {/* Price */}
                    <div className="text-left">
                      <span className="font-heading font-black text-sm md:text-base text-primary leading-none">
                        {formatPKR(activePrice)}
                      </span>
                      {activeLabel && (
                        <span className="text-[8px] text-muted-foreground font-bold ml-0.5 block leading-none">
                          ({activeLabel})
                        </span>
                      )}
                    </div>

                    {/* ADD button */}
                    <AnimatePresence mode="wait">
                      <motion.button
                        key={isAdded ? "added" : "add"}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        whileTap={{ scale: 0.92 }}
                        onClick={() => handleAdd(item, activePrice, activeLabel)}
                        className={`flex items-center justify-center gap-1 px-3 py-2 rounded-lg font-heading font-black text-[10px] md:text-xs tracking-wider transition-all duration-300 shadow-sm shrink-0 ${
                          isAdded
                            ? "bg-green-500 text-white"
                            : "bg-primary text-primary-foreground hover:bg-primary/90"
                        }`}
                      >
                        <Plus className="w-3 h-3" />
                        {isAdded ? "ADDED!" : "ADD"}
                      </motion.button>
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

const SignatureItems = () => {
  return (
    <section className="pt-10 pb-20 bg-background relative" id="full-menu">
      <div className="container mx-auto px-4">
        {categories.map((cat) => (
          <MenuSection
            key={cat.name}
            category={cat.name}
            items={menuItems.filter(m => m.category === cat.name)}
          />
        ))}
      </div>
    </section>
  );
};

export default SignatureItems;
