import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { menuItems, categories } from "@/data/menuData";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/hooks/useFavorites";
import { Star, ShoppingCart, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
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

  // Per-card selected size state
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

  // Filter by category then by search query (across name, description, category)
  const filteredItems = menuItems
    .filter((item) => {
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
    <section ref={ref} id="full-menu" className="pt-4 pb-16 bg-background scroll-mt-20">
      <div className="container mx-auto px-4">
        {/* Category filter — hidden when search is active */}
        {!searchQuery && (
          <div className="flex flex-wrap gap-2 mb-10 justify-center">
            <button
              onClick={() => setActiveCategory("All")}
              className={`px-4 py-2 rounded-md text-sm font-heading font-semibold transition-all ${
                activeCategory === "All"
                  ? "bg-gradient-brand text-primary-foreground"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
              }`}
            >
              All Items
            </button>
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(cat.name)}
                className={`px-4 py-2 rounded-md text-sm font-heading font-semibold transition-all ${
                  activeCategory === cat.name
                    ? "bg-gradient-brand text-primary-foreground"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
          {filteredItems.map((item, i) => {
            const activeLabel = getActiveLabel(item.id, item.sizes);
            const activePrice = getSizePrice(item.id, item.price, item.sizes);

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: i * 0.04 }}
                whileHover={{ y: -6 }}
                className="bg-card rounded-xl border border-border mt-10 shadow-sm hover:shadow-xl hover:border-primary/20 hover:-translate-y-1 transition-all group relative flex flex-col h-full"
              >
                {/* Pop-out image */}
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-32 h-32 flex justify-center z-20 pointer-events-none">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-contain drop-shadow-2xl group-hover:scale-110 group-hover:-translate-y-2 transition-transform duration-500"
                  />
                </div>

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

                  <div className="flex items-center justify-center gap-1 mb-2.5">
                    {[...Array(5)].map((_, s) => (
                      <Star key={s} className={`w-3 h-3 ${s < Math.floor(item.rating) ? "fill-yellow-400 text-yellow-400" : "fill-border text-border"}`} />
                    ))}
                    <span className="text-[10px] font-bold text-muted-foreground ml-1">{item.rating}</span>
                  </div>

                  <p className="text-muted-foreground text-[11px] mb-4 line-clamp-2 leading-relaxed flex-1">{item.description}</p>

                  {/* S/M/L size buttons — only for items that have sizes */}
                  {item.sizes && (
                    <div className="flex items-center gap-1.5 mb-4">
                      {item.sizes.map((sz) => (
                        <button
                          key={sz.label}
                          onClick={() => setSelectedSizes((prev) => ({ ...prev, [item.id]: sz.label }))}
                          className={`w-8 h-8 rounded-md text-xs font-heading font-black border transition-all duration-200 ${
                            activeLabel === sz.label
                              ? "bg-primary text-primary-foreground border-primary shadow-md scale-110"
                              : "bg-muted text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
                          }`}
                        >
                          {sz.label}
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="w-full flex items-center justify-between border-t border-border pt-4 mt-auto">
                    <div>
                      <span className="font-heading font-black text-lg text-primary">{formatPKR(activePrice)}</span>
                      {activeLabel && (
                        <span className="ml-1 text-[10px] text-muted-foreground font-bold">({activeLabel})</span>
                      )}
                    </div>
                    <Button
                      size="default"
                      className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md font-heading font-black text-xs shadow-md transition-all duration-300"
                      onClick={() =>
                        addItem({
                          id: activeLabel ? `${item.id}-${activeLabel}` : item.id,
                          name: activeLabel ? `${item.name} (${activeLabel})` : item.name,
                          price: activePrice,
                          image: item.image,
                        })
                      }
                    >
                      ADD <ShoppingCart className="w-3.5 h-3.5 ml-1.5" />
                    </Button>
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
