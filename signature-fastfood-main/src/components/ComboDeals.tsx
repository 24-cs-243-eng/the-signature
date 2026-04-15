import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { comboDeals } from "@/data/menuData";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/hooks/useFavorites";
import { ShoppingCart, Heart, Tag } from "lucide-react";
import { formatPKR } from "@/lib/currency";
import { useVideoAutoplay } from "@/hooks/useVideoAutoplay";

const ComboDeals = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.05 });
  const { addItem } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const videoRef = useVideoAutoplay();

  return (
    <section ref={ref} className="bg-background pb-24">

      {/* ── Video Hero Banner ── */}
      <div className="relative w-full overflow-hidden" style={{ maxHeight: "380px" }}>
        <video
          ref={videoRef}
          src="/media/deal-video.mp4"
          poster="/media/deal-duo-meal.png"
          preload="none"
          loop
          muted
          playsInline
          className="w-full object-cover"
          style={{ maxHeight: "380px", minHeight: "180px" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-background pointer-events-none" />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <span className="inline-flex items-center gap-2 bg-red-600 text-white text-xs font-heading font-black uppercase tracking-widest px-4 py-1.5 rounded-full mb-3 shadow-lg">
            <Tag className="w-3.5 h-3.5" />
            Special Offers
          </span>
          <h2 className="font-heading font-black text-3xl sm:text-4xl md:text-5xl text-white drop-shadow-2xl leading-tight">
            Combo <span className="text-red-400">Deals</span>
          </h2>
          <p className="text-white/80 text-sm md:text-base mt-2 max-w-sm drop-shadow-md">
            More food, less money — perfect for sharing.
          </p>
        </div>
      </div>

      {/* ── Deal Cards Grid ── */}
      <div className="container mx-auto px-3 sm:px-4 -mt-8 relative z-10">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {comboDeals.map((deal, i) => (
            <motion.div
              key={deal.id}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.07, duration: 0.45, ease: "easeOut" }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="relative group"
            >
              <div className="relative rounded-[1.25rem] overflow-hidden bg-card border border-white/10 dark:border-white/8 shadow-xl h-full flex flex-col">

                {/* Top accent */}
                <div className="h-1 w-full bg-red-600 shrink-0" />

                {/* Favourite */}
                <button
                  onClick={() => toggleFavorite(deal.id)}
                  className="absolute top-3 right-3 z-20 w-7 h-7 flex items-center justify-center rounded-full bg-black/30 backdrop-blur-md border border-white/20 hover:bg-red-600/30 transition-all"
                >
                  <Heart
                    className={`w-3.5 h-3.5 transition-colors ${
                      isFavorite(deal.id) ? "fill-red-500 text-red-500" : "text-white/70"
                    }`}
                  />
                </button>

                {/* Discount badge — clean pill */}
                {deal.discount && (
                  <span className="absolute top-3 left-3 z-20 bg-red-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow">
                    {deal.discount}
                  </span>
                )}

                {/* Image */}
                <div className="flex items-center justify-center pt-6 pb-2 relative">
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-24 h-24 rounded-full bg-red-600/10 blur-2xl" />
                  </div>
                  <motion.img
                    src={deal.image}
                    alt={deal.title}
                    className="relative z-10 w-28 h-28 sm:w-32 sm:h-32 object-contain drop-shadow-xl group-hover:scale-110 transition-transform duration-500 ease-out"
                  />
                </div>

                {/* Body */}
                <div className="px-3 pb-4 flex flex-col flex-1 gap-2">
                  <h3 className="font-heading font-black text-foreground text-sm sm:text-base leading-tight text-center line-clamp-2">
                    {deal.title}
                  </h3>

                  {/* Items count — cleaner than bullet list */}
                  <p className="text-muted-foreground text-[10px] text-center">
                    {deal.items.length} item{deal.items.length !== 1 ? "s" : ""} included
                  </p>

                  {/* Price */}
                  <div className="flex items-end justify-center gap-1.5 mt-1">
                    <span className="text-red-600 font-black text-lg sm:text-xl leading-none font-heading">
                      {formatPKR(deal.price)}
                    </span>
                    {deal.originalPrice && (
                      <span className="text-muted-foreground text-[10px] line-through leading-none pb-0.5">
                        {formatPKR(deal.originalPrice)}
                      </span>
                    )}
                  </div>

                  {/* Add button */}
                  <button
                    onClick={() =>
                      addItem({ id: deal.id, name: deal.title, price: deal.price, image: deal.image })
                    }
                    className="w-full mt-1 h-10 rounded-xl bg-red-600 hover:bg-red-700 active:scale-95 text-white font-heading font-black text-xs tracking-wide shadow transition-all flex items-center justify-center gap-1.5"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    Add to Cart
                  </button>
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
