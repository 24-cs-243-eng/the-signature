import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { menuItems, categories } from "@/data/menuData";
import { useCart } from "@/context/CartContext";
import { Plus, Star, Flame, Sparkles } from "lucide-react";
import { formatPKR } from "@/lib/currency";
import { toast } from "sonner";

const getBadge = (item: typeof menuItems[0]) => {
  if (item.isBestSeller) return { label: "Best Seller", icon: Flame, color: "bg-orange-500 text-white" };
  if (item.rating >= 4.8) return { label: "Top Rated", icon: Star, color: "bg-yellow-500 text-white" };
  return null;
};

const MenuSection = ({ category, items }: { category: string, items: typeof menuItems }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
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
    
    addItem({ id: finalId, name: finalName, price: price, image: item.image });
    setAddedId(finalId);
    toast.success(`${finalName} added!`, { duration: 1500 });
    setTimeout(() => setAddedId(null), 700);
  };

  return (
    <div ref={ref} className="mb-10 md:mb-14 scroll-mt-24" id={`category-${category.replace(/\s+/g, '-').toLowerCase()}`}>
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        className="flex items-center gap-3 mb-10 border-b border-border/50 pb-4"
      >
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-primary" />
        </div>
        <h2 className="font-heading font-black text-3xl md:text-4xl text-foreground uppercase tracking-wider">{category}</h2>
      </motion.div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
        {items.map((item, i) => {
          const badge = getBadge(item);
          const activeLabel = getActiveLabel(item.id, item.sizes);
          const activePrice = getSizePrice(item.id, item.price, item.sizes);
          const currentId = activeLabel ? `${item.id}-${activeLabel}` : item.id;
          const isAdded = addedId === currentId;

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.4) }}
              className="group"
            >
              <div className="bg-card rounded-xl border border-border mt-10 shadow-sm hover:shadow-xl hover:border-primary/20 hover:-translate-y-1 transition-all duration-300 relative flex flex-col h-full">
                
                {/* Badge */}
                {badge && (
                  <div className={`absolute -top-3 left-4 z-30 flex items-center gap-1 ${badge.color} text-[10px] font-black px-2.5 py-1 rounded-full shadow-md`}>
                    <badge.icon className="w-3 h-3" />
                    {badge.label}
                  </div>
                )}

                {/* Price top-right */}
                <div className="absolute -top-3 right-4 z-30 bg-foreground text-background text-[11px] font-black px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                  {formatPKR(activePrice)}
                  {activeLabel && <span className="text-[8px] opacity-70">({activeLabel})</span>}
                </div>

                {/* Image Pop-out */}
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-32 h-32 flex justify-center z-20 pointer-events-none">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-contain drop-shadow-2xl group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-500"
                  />
                </div>

                {/* Content */}
                <div className="px-4 pt-24 pb-5 flex flex-col flex-1 text-center items-center">
                  <h3 className="font-heading font-black text-base md:text-lg text-foreground line-clamp-1 mb-1.5">
                    {item.name}
                  </h3>
                  
                  {/* Rating */}
                  <div className="flex items-center justify-center gap-1 mb-2.5">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star
                        key={j}
                        className={`w-3 h-3 ${j < Math.floor(item.rating) ? "text-yellow-400 fill-yellow-400" : "text-border fill-border"}`}
                      />
                    ))}
                    <span className="text-[10px] font-bold text-muted-foreground ml-1">{item.rating}</span>
                  </div>

                  <p className="text-muted-foreground text-[11px] md:text-xs line-clamp-2 md:line-clamp-3 leading-relaxed flex-1 mb-4">
                    {item.description}
                  </p>

                  {/* S/M/L Sizes */}
                  {item.sizes && (
                    <div className="flex items-center gap-1.5 mb-4">
                      {item.sizes.map((sz) => (
                        <button
                          key={sz.label}
                          onClick={() => setSelectedSizes((prev) => ({ ...prev, [item.id]: sz.label }))}
                          className={`w-7 h-7 md:w-8 md:h-8 rounded-md text-xs font-heading font-black border transition-all duration-200 ${
                            activeLabel === sz.label
                              ? "bg-primary text-primary-foreground border-primary shadow-md scale-110 relative z-10"
                              : "bg-muted text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
                          }`}
                        >
                          {sz.label}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Add button */}
                  <AnimatePresence mode="wait">
                    <motion.button
                      key={isAdded ? "added" : "add"}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      whileTap={{ scale: 0.92 }}
                      onClick={() => handleAdd(item, activePrice, activeLabel)}
                      className={`w-full max-w-[140px] flex items-center justify-center gap-2 py-2.5 rounded-md font-heading font-black text-xs tracking-wider transition-all duration-300 shadow-md ${
                        isAdded
                          ? "bg-green-500 text-white shadow-green-500/25"
                          : "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-primary/40"
                      }`}
                    >
                      <Plus className="w-4 h-4" />
                      {isAdded ? "ADDED!" : "ADD"}
                    </motion.button>
                  </AnimatePresence>
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
    <section className="py-12 bg-background relative" id="full-menu">
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
