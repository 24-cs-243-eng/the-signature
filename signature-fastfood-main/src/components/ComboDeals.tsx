import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { comboDeals } from "@/data/menuData";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/hooks/useFavorites";
import { ShoppingCart, Heart, Tag } from "lucide-react";
import { formatPKR } from "@/lib/currency";

const ComboDeals = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.05 });
  const { addItem } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

  return (
    <section ref={ref} className="bg-background pb-24">

      {/* ── Video Hero Banner ── */}
      <div className="relative w-full overflow-hidden" style={{ maxHeight: "420px" }}>
        <video
          src="/media/deal-video.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full object-cover"
          style={{ maxHeight: "420px", minHeight: "200px" }}
        />
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-background pointer-events-none" />
        {/* Text on video */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-4"
        >
          <span className="inline-flex items-center gap-2 bg-primary/90 text-primary-foreground text-xs font-heading font-black uppercase tracking-widest px-4 py-1.5 rounded-full mb-3 shadow-lg">
            <Tag className="w-3.5 h-3.5" />
            Special Offers
          </span>
          <h2 className="font-heading font-black text-3xl sm:text-4xl md:text-5xl text-white drop-shadow-2xl leading-tight">
            Combo <span className="text-primary">Deals</span> You'll Love
          </h2>
          <p className="text-white/80 text-sm md:text-base mt-2 max-w-md drop-shadow-md">
            More food, less money — perfect for sharing.
          </p>
        </motion.div>
      </div>

      {/* ── Floating Deal Cards Grid ── */}
      <div className="container mx-auto px-3 sm:px-4 -mt-8 relative z-10">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {comboDeals.map((deal, i) => (
            <motion.div
              key={deal.id}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.07, duration: 0.45, ease: "easeOut" }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="relative group"
              style={{
                filter: "drop-shadow(0 8px 32px rgba(0,0,0,0.35))",
              }}
            >
              {/* Card shell — floating glass style */}
              <div className="relative rounded-[1.5rem] overflow-hidden bg-gradient-to-b from-card/95 to-card border border-white/10 shadow-2xl backdrop-blur-sm h-full flex flex-col">

                {/* Gradient accent top bar */}
                <div className="h-1 w-full bg-gradient-to-r from-primary via-orange-400 to-accent shrink-0" />

                {/* Favourite button */}
                <button
                  onClick={() => toggleFavorite(deal.id)}
                  className="absolute top-3 right-3 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-black/30 backdrop-blur-md border border-white/20 hover:bg-accent/30 transition-all shadow-lg"
                >
                  <Heart className={`w-3.5 h-3.5 transition-colors ${isFavorite(deal.id) ? "fill-accent text-accent" : "text-white/70"}`} />
                </button>

                {/* Discount badge */}
                {deal.discount && (
                  <span className="absolute top-3 left-3 z-20 bg-gradient-to-r from-primary to-orange-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-md uppercase tracking-wider">
                    {deal.discount}
                  </span>
                )}

                {/* Food image — floating out of card visually */}
                <div className="flex items-center justify-center pt-6 pb-2 relative">
                  {/* Glow orb behind image */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-28 h-28 rounded-full bg-primary/20 blur-2xl animate-pulse" />
                  </div>
                  <motion.img
                    src={deal.image}
                    alt={deal.title}
                    className="relative z-10 w-28 h-28 sm:w-32 sm:h-32 object-contain drop-shadow-2xl group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500 ease-out"
                  />
                </div>

                {/* Card body */}
                <div className="px-3 pb-4 flex flex-col flex-1 gap-2">
                  {/* Title */}
                  <h3 className="font-heading font-black text-foreground text-sm sm:text-base leading-tight text-center line-clamp-2">
                    {deal.title}
                  </h3>

                  {/* Items list */}
                  <div className="space-y-0.5 flex-1">
                    {deal.items.map((item, idx) => (
                      <p key={idx} className="text-muted-foreground text-[9px] sm:text-[10px] leading-snug text-center">
                        • {item}
                      </p>
                    ))}
                  </div>

                  {/* Price row */}
                  <div className="flex items-end justify-center gap-1.5 mt-1">
                    <span className="text-primary font-black text-lg sm:text-xl leading-none font-heading">
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
                    onClick={() => addItem({ id: deal.id, name: deal.title, price: deal.price, image: deal.image })}
                    className="w-full mt-1 h-10 rounded-xl bg-primary hover:bg-primary/90 active:scale-95 text-primary-foreground font-heading font-black text-xs tracking-wide shadow-lg transition-all flex items-center justify-center gap-1.5 group/btn"
                  >
                    <ShoppingCart className="w-3.5 h-3.5 group-hover/btn:scale-110 transition-transform" />
                    Add to Bucket
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
