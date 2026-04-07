import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { menuItems, categories } from "@/data/menuData";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/hooks/useFavorites";
import { Star, ShoppingCart, Heart, Flame } from "lucide-react";
import { formatPKR } from "@/lib/currency";

interface FullMenuProps {
  activeCategory?: string;
  onCategoryChange?: (category: string) => void;
  searchQuery?: string;
}

const FullMenu = ({ activeCategory: externalCategory, onCategoryChange, searchQuery = "" }: FullMenuProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.05 });
  const { addItem } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [internalCategory, setInternalCategory] = useState("All");
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});

  const activeCategory = externalCategory ?? internalCategory;
  const setActiveCategory = (cat: string) => {
    onCategoryChange?.(cat);
    setInternalCategory(cat);
  };

  const getSizePrice = (itemId: string, basePrice: number, sizes?: { label: string; price: number }[]) => {
    if (!sizes) return basePrice;
    const label = selectedSizes[itemId] ?? sizes[1]?.label ?? sizes[0]?.label;
    return sizes.find((s) => s.label === label)?.price ?? basePrice;
  };

  const getActiveLabel = (itemId: string, sizes?: { label: string; price: number }[]) => {
    if (!sizes) return null;
    return selectedSizes[itemId] ?? sizes[1]?.label ?? sizes[0]?.label;
  };

  const filteredItems = menuItems.filter((item) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      );
    }
    if (activeCategory === "All") return true;
    return item.category === activeCategory;
  });

  return (
    <section ref={ref} id="full-menu" className="pt-4 pb-20 bg-background scroll-mt-20">
      <div className="container mx-auto px-4">

        {/* Category filter — hidden when search is active */}
        {!searchQuery && (
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            <button
              onClick={() => setActiveCategory("All")}
              className={`px-4 py-2 rounded-full text-xs md:text-sm font-heading font-bold transition-all ${
                activeCategory === "All"
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/40"
              }`}
            >
              All Items
            </button>
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(cat.name)}
                className={`px-4 py-2 rounded-full text-xs md:text-sm font-heading font-bold transition-all ${
                  activeCategory === cat.name
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/40"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}

        {/* Grid — gap-y is larger to give room for pop-out images */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-3 gap-y-12 md:gap-x-5 md:gap-y-14 px-1">
          {filteredItems.map((item, i) => {
            const activeLabel = getActiveLabel(item.id, item.sizes);
            const activePrice = getSizePrice(item.id, item.price, item.sizes);

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.35, delay: i * 0.04 }}
                className="group relative"
              >
                <div className="bg-card rounded-2xl border border-border shadow-md hover:shadow-xl hover:border-primary/30 transition-all duration-300 flex flex-col h-full overflow-visible">

                  {/* Best Seller — small corner pill */}
                  {item.isBestSeller && (
                    <span className="absolute top-2 left-2 z-30 flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-[8px] font-black uppercase shadow-md">
                      <Flame className="w-2 h-2" />
                      Best
                    </span>
                  )}

                  {/* Favourite button — top-right corner INSIDE card */}
                  <button
                    onClick={() => toggleFavorite(item.id)}
                    className="absolute top-2 right-2 z-20 w-7 h-7 rounded-full bg-card/80 backdrop-blur-sm border border-border flex items-center justify-center hover:scale-110 transition-transform shadow-sm"
                  >
                    <Heart className={`w-3.5 h-3.5 ${isFavorite(item.id) ? "fill-destructive text-destructive" : "text-muted-foreground"}`} />
                  </button>

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
                    <h3 className="font-heading font-black text-foreground text-sm md:text-base line-clamp-1 mb-1">
                      {item.name}
                    </h3>

                    {/* Stars */}
                    <div className="flex items-center justify-center gap-0.5 mb-2">
                      {[...Array(5)].map((_, s) => (
                        <Star key={s} className={`w-2.5 h-2.5 ${s < Math.floor(item.rating) ? "fill-yellow-400 text-yellow-400" : "fill-border text-border"}`} />
                      ))}
                      <span className="text-[9px] font-bold text-muted-foreground ml-0.5">{item.rating}</span>
                    </div>

                    <p className="text-muted-foreground text-[10px] md:text-[11px] mb-3 line-clamp-2 leading-relaxed flex-1">
                      {item.description}
                    </p>

                    {/* S/M/L size buttons */}
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

                    {/* Price + ADD row */}
                    <div className="w-full flex items-center justify-between gap-2 border-t border-border/60 pt-3 mt-auto">
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
                      <button
                        className="flex items-center gap-1 px-3 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg font-heading font-black text-[10px] md:text-xs tracking-wider transition-all shadow-sm shrink-0 active:scale-95"
                        onClick={() =>
                          addItem({
                            id: activeLabel ? `${item.id}-${activeLabel}` : item.id,
                            name: activeLabel ? `${item.name} (${activeLabel})` : item.name,
                            price: activePrice,
                            image: item.image,
                          })
                        }
                      >
                        <ShoppingCart className="w-3 h-3" />
                        ADD
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}

          {filteredItems.length === 0 && (
            <div className="col-span-full text-center py-20">
              <p className="text-5xl mb-4">🔍</p>
              <p className="font-heading font-black text-xl text-foreground mb-2">Nothing found</p>
              <p className="text-muted-foreground text-sm">Try a different search term</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FullMenu;
