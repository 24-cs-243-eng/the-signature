import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { categories } from "@/data/menuData";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

interface MenuCategoriesProps {
  onCategorySelect?: (category: string) => void;
  isHome?: boolean;
}

const MenuCategories = ({ onCategorySelect, isHome }: MenuCategoriesProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section ref={ref} className="py-4 md:py-8 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="flex items-center justify-between mb-5"
        >
          <div>
            <h2 className="font-heading font-black text-xl md:text-2xl text-foreground uppercase tracking-wide">
              Explore Menu
            </h2>
            <div className="h-1 w-10 bg-red-600 rounded-full mt-1" />
          </div>
          <Link
            to="/menu"
            className="flex items-center gap-1 text-primary text-sm font-heading font-bold hover:underline uppercase tracking-wide"
          >
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* KFC-style horizontal scroll */}
        {!isHome && (
          <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide -mx-4 px-4 snap-x md:justify-center mx-auto">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.05 }}
                className="flex-shrink-0 cursor-pointer group text-center snap-start"
              >
                <a
                  href={`#category-${cat.name.replace(/\s+/g, "-").toLowerCase()}`}
                  onClick={(e) => {
                    if (onCategorySelect) {
                      e.preventDefault();
                      onCategorySelect(cat.name);
                      return;
                    }
                    const target = document.getElementById(
                      `category-${cat.name.replace(/\s+/g, "-").toLowerCase()}`
                    );
                    if (target) {
                      e.preventDefault();
                      target.scrollIntoView({ behavior: "smooth", block: "start" });
                    }
                  }}
                  className="block outline-none"
                >
                  <div className="w-24 h-24 md:w-28 md:h-28 rounded-xl bg-card border-2 border-border shadow-md group-hover:shadow-lg group-hover:border-primary/40 group-hover:scale-105 flex items-center justify-center mx-auto mb-2.5 transition-all duration-300 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-16 h-16 md:w-20 md:h-20 object-contain group-hover:scale-110 transition-transform relative z-10"
                    />
                  </div>
                  <p className="font-heading font-bold text-[11px] md:text-xs text-foreground whitespace-nowrap">
                    {cat.name}
                  </p>
                  <div className="h-0.5 w-0 group-hover:w-full bg-primary mx-auto mt-1 transition-all duration-300 rounded-full" />
                </a>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default MenuCategories;
