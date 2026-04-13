import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ShoppingCart, Plus, Minus, ChevronDown, Sparkles, Truck, Gift, Coins } from "lucide-react";
import { menuItems } from "@/data/menuData";
import { useCart, REWARD_MILESTONES } from "@/context/CartContext";
import { formatPKR } from "@/lib/currency";

// ─── Category list ────────────────────────────────────────────────────────────
const ALL_CATEGORIES = [
  "All","Burgers","Wraps & Rolls","Fries & Sides",
  "Wings","Appetizers","Pizza","Combo Meals","Family Deals",
];

// ─── Video Hero ───────────────────────────────────────────────────────────────
const VideoHero = () => {
  return (
    <div className="relative w-full h-[60vh] sm:h-[70vh] flex items-center justify-center overflow-hidden bg-background">
      {/* Cinematic video background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover object-bottom z-0"
        src="/media/combo-deal.mp4"
      />

      {/* Solid dark overlay — readability in both light + dark modes */}
      <div className="absolute inset-0 pointer-events-none z-10 bg-black/55" />
      {/* Bottom fade blends into page background regardless of theme */}
      <div className="absolute bottom-0 left-0 right-0 h-36 pointer-events-none z-10 bg-gradient-to-t from-background to-transparent" />

      {/* Hero content */}
      <div className="relative z-20 flex flex-col items-center px-4 text-center mt-8">
        <motion.span
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 bg-background/50 border border-primary/50 text-primary text-[10px] font-heading font-black uppercase tracking-widest px-4 py-1.5 rounded-full mb-3 backdrop-blur-md shadow-lg"
        >
          <Sparkles className="w-3 h-3" />
          Build Any Meal — Earn Real Rewards
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="font-heading font-black text-5xl sm:text-6xl text-white leading-none tracking-tight drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)]"
        >
          Custom <span className="text-primary">Deals</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-white/80 text-sm sm:text-base mt-4 max-w-sm drop-shadow-md"
        >
          Mix any items from our full menu. Spend more, unlock rewards, and save big!
        </motion.p>
      </div>

      {/* Reward milestone chips — bottom */}
      <div className="absolute bottom-6 left-0 right-0 z-30 px-4">
        <div className="flex items-center justify-center gap-3 flex-wrap">
          {REWARD_MILESTONES.map((m, i) => (
            <motion.div
              key={m.threshold}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.1 }}
              className="flex items-center gap-2 bg-background/60 backdrop-blur-lg border border-border/50 rounded-2xl px-4 py-2 shadow-xl"
            >
              <span className="text-lg">
                {m.threshold === 3000 ? "🚚" : m.threshold === 4000 ? "💰" : "🍔"}
              </span>
              <div className="text-left">
                <p className="text-foreground font-heading font-black text-xs">{formatPKR(m.threshold)}</p>
                <p className="text-muted-foreground text-[9px] leading-tight">{m.label.replace(/^[^ ]+ /, "")}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── Milestone progress bar ───────────────────────────────────────────────────
const MilestoneSection = ({ totalPrice }: { totalPrice: number }) => {
  const max = REWARD_MILESTONES[REWARD_MILESTONES.length - 1].threshold;
  const progress = Math.min((totalPrice / max) * 100, 100);
  const currentReward = [...REWARD_MILESTONES].reverse().find((m) => totalPrice >= m.threshold);
  const nextMilestone = REWARD_MILESTONES.find((m) => totalPrice < m.threshold);

  const icons = [Truck, Coins, Gift];

  return (
    <div className="relative bg-card/80 backdrop-blur-xl border border-white/10 rounded-3xl p-5 mb-6 overflow-hidden shadow-2xl">
      {/* Glow */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      {/* Status row */}
      <div className="flex items-start justify-between mb-4 relative z-10">
        <div>
          {currentReward ? (
            <>
              <p className="text-green-400 font-heading font-black text-sm flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse inline-block" />
                {currentReward.label} Unlocked!
              </p>
              {nextMilestone && (
                <p className="text-muted-foreground text-xs mt-0.5">
                  Add{" "}
                  <span className="text-primary font-bold">
                    {formatPKR(nextMilestone.threshold - totalPrice)}
                  </span>{" "}
                  more for {nextMilestone.label}
                </p>
              )}
              {!nextMilestone && (
                <p className="text-green-400 text-xs font-bold mt-0.5">
                  Maximum rewards achieved! 🏆
                </p>
              )}
            </>
          ) : (
            <>
              <p className="text-foreground font-heading font-black text-sm">Your Reward Progress</p>
              <p className="text-muted-foreground text-xs mt-0.5">
                Add{" "}
                <span className="text-primary font-bold">
                  {nextMilestone ? formatPKR(nextMilestone.threshold - totalPrice) : ""}
                </span>{" "}
                to unlock {nextMilestone?.label}
              </p>
            </>
          )}
        </div>
        <div className="text-right shrink-0">
          <p className="font-heading font-black text-2xl text-primary leading-none">
            {formatPKR(totalPrice)}
          </p>
          <p className="text-muted-foreground text-xs mt-0.5">cart total</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative h-3 bg-muted/60 rounded-full overflow-hidden mb-5">
        <motion.div
          className="h-full rounded-full"
          style={{
            background: "linear-gradient(90deg, hsl(349,100%,45%) 0%, #f97316 60%, #22c55e 100%)",
          }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
        {/* Glow effect on bar */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: "linear-gradient(90deg, hsl(349,100%,45%,0.4) 0%, #f97316/40 60%, #22c55e/40 100%)",
            filter: "blur(4px)",
          }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>

      {/* Milestone cards */}
      <div className="grid grid-cols-3 gap-3">
        {REWARD_MILESTONES.map((m, i) => {
          const unlocked = totalPrice >= m.threshold;
          const Icon = icons[i];
          const isNext = !unlocked && REWARD_MILESTONES.findIndex((x) => totalPrice < x.threshold) === i;
          return (
            <motion.div
              key={m.threshold}
              animate={unlocked ? { scale: [1, 1.04, 1] } : {}}
              transition={{ duration: 0.4 }}
              className={`relative flex flex-col items-center text-center rounded-2xl p-3 border transition-all overflow-hidden ${
                unlocked
                  ? "bg-green-500/15 border-green-500/40 shadow-lg shadow-green-500/10"
                  : isNext
                  ? "bg-primary/10 border-primary/30"
                  : "bg-muted/20 border-white/8"
              }`}
            >
              {unlocked && (
                <div className="absolute inset-0 bg-green-400/5 pointer-events-none" />
              )}
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center mb-2 ${
                  unlocked ? "bg-green-500/25" : isNext ? "bg-primary/20" : "bg-muted/40"
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    unlocked ? "text-green-400" : isNext ? "text-primary" : "text-muted-foreground"
                  }`}
                />
              </div>
              <p
                className={`font-heading font-black text-xs leading-none mb-1 ${
                  unlocked ? "text-green-400" : isNext ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {formatPKR(m.threshold)}
              </p>
              <p
                className={`text-[9px] leading-tight font-heading ${
                  unlocked ? "text-green-400/80" : "text-muted-foreground"
                }`}
              >
                {m.label.replace(/^[^ ]+ /, "")}
                {m.freeDelivery && m.threshold > 3000 && (
                  <span className="block text-[8px] text-green-500 font-bold mt-0.5">🚚 +Free Delivery</span>
                )}
              </p>
              {unlocked && (
                <span className="absolute top-1.5 right-1.5 text-[8px] bg-green-500 text-white rounded-full w-3.5 h-3.5 flex items-center justify-center font-black">
                  ✓
                </span>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

// ─── Item card ────────────────────────────────────────────────────────────────
const ItemCard = ({ item }: { item: (typeof menuItems)[0] }) => {
  const { addItem, items, updateQuantity } = useCart();
  const [selectedSize, setSelectedSize] = useState(item.sizes ? item.sizes[0] : null);
  const [sizeOpen, setSizeOpen] = useState(false);

  const effectivePrice = selectedSize ? selectedSize.price : item.price;
  const cartId = item.sizes ? `${item.id}_${selectedSize?.label}` : item.id;
  const cartItem = items.find((i) => i.id === cartId);
  const qty = cartItem?.quantity ?? 0;

  const handleAdd = () => {
    addItem({
      id: cartId,
      name: item.sizes ? `${item.name} (${selectedSize?.label})` : item.name,
      price: effectivePrice,
      image: item.image,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ duration: 0.35 }}
      className="group relative bg-gradient-to-b from-card/90 to-card border border-white/10 rounded-3xl overflow-visible shadow-xl flex flex-col h-full"
      style={{ filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.4))" }}
    >
      {/* Top accent line */}
      <div className="h-0.5 w-full bg-gradient-to-r from-primary via-orange-400 to-yellow-300 rounded-t-3xl shrink-0" />

      {/* Best seller badge */}
      {item.isBestSeller && (
        <span className="absolute -top-2 left-3 z-20 bg-gradient-to-r from-primary to-orange-500 text-white text-[8px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-lg">
          ⭐ Best Seller
        </span>
      )}

      {/* Add-to-cart badge (qty) */}
      {qty > 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 z-20 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-[10px] font-black text-white shadow-lg border-2 border-background"
        >
          {qty}
        </motion.div>
      )}

      {/* Image */}
      <div className="relative flex items-center justify-center pt-6 pb-2">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-24 h-24 rounded-full bg-primary/10 blur-3xl" />
        </div>
        <img
          src={item.image}
          alt={item.name}
          className="relative z-10 w-28 h-28 object-contain drop-shadow-2xl group-hover:scale-110 group-hover:-rotate-2 transition-transform duration-500 ease-out"
        />
      </div>

      {/* Body */}
      <div className="px-3 pb-4 flex flex-col flex-1 gap-1.5 text-center">
        <h3 className="font-heading font-black text-foreground text-sm leading-tight line-clamp-2">
          {item.name}
        </h3>
        <p className="text-muted-foreground text-[9px] leading-snug line-clamp-2 flex-1">
          {item.description}
        </p>

        {/* Size selector */}
        {item.sizes && (
          <div className="relative">
            <button
              onClick={() => setSizeOpen(!sizeOpen)}
              className="w-full flex items-center justify-between bg-muted/50 border border-white/10 rounded-xl px-2.5 py-1.5 text-[10px] font-heading font-bold text-foreground hover:border-primary/40 transition-colors"
            >
              <span>
                {selectedSize?.label === "S" ? "Small" : selectedSize?.label === "M" ? "Medium" : "Large"} —{" "}
                {formatPKR(selectedSize?.price ?? 0)}
              </span>
              <ChevronDown className={`w-3 h-3 transition-transform ${sizeOpen ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {sizeOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.95 }}
                  className="absolute bottom-full mb-1 left-0 right-0 bg-card border border-white/15 rounded-2xl shadow-2xl z-50 overflow-hidden"
                >
                  {item.sizes.map((s) => (
                    <button
                      key={s.label}
                      onClick={() => { setSelectedSize(s); setSizeOpen(false); }}
                      className={`w-full flex justify-between px-3 py-2 text-[10px] font-heading font-bold transition-colors ${
                        selectedSize?.label === s.label
                          ? "bg-primary/20 text-primary"
                          : "text-foreground hover:bg-muted/60"
                      }`}
                    >
                      <span>{s.label === "S" ? "Small" : s.label === "M" ? "Medium" : "Large"}</span>
                      <span>{formatPKR(s.price)}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Price */}
        <p className="text-primary font-black text-base font-heading">
          {formatPKR(effectivePrice)}
        </p>

        {/* Qty / Add */}
        {qty === 0 ? (
          <button
            onClick={handleAdd}
            className="w-full h-9 rounded-xl bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-400 active:scale-95 text-white font-heading font-black text-[10px] tracking-wide shadow-lg shadow-primary/30 transition-all flex items-center justify-center gap-1.5 mt-auto"
          >
            <ShoppingCart className="w-3 h-3" />
            Add to Deal
          </button>
        ) : (
          <div className="flex items-center justify-center gap-2 mt-auto">
            <button
              onClick={() => updateQuantity(cartId, qty - 1)}
              className="w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="font-black text-foreground w-5 text-center text-sm">{qty}</span>
            <button
              onClick={handleAdd}
              className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white hover:bg-primary/90 transition-all active:scale-95"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────
const CreateYourDeal = () => {
  const { totalPrice, totalItems, setIsCartOpen, reward } = useCart();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = useMemo(() => {
    return menuItems.filter((item) => {
      const matchCat = activeCategory === "All" || item.category === activeCategory;
      const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [search, activeCategory]);

  const nextMilestone = REWARD_MILESTONES.find((m) => totalPrice < m.threshold);
  const toNext = nextMilestone ? nextMilestone.threshold - totalPrice : 0;

  return (
    <div className="bg-background min-h-screen pb-44">

      {/* ── Video hero ── */}
      <VideoHero />

      {/* ── Content section ── */}
      <div className="container mx-auto px-3 sm:px-4 -mt-6 relative z-10">

        {/* ── Milestone bar ── */}
        <MilestoneSection totalPrice={totalPrice} />

        {/* ── Search ── */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search burgers, pizza, wings..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-card/80 backdrop-blur-sm border border-white/10 rounded-2xl pl-11 pr-11 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary/50 transition-all shadow-lg"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* ── Category pills ── */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-5 scrollbar-hide">
          {ALL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 px-4 py-2 rounded-full text-[10px] font-heading font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                activeCategory === cat
                  ? "bg-primary text-white shadow-lg shadow-primary/40 scale-105"
                  : "bg-card/80 border border-white/10 text-muted-foreground hover:text-foreground hover:border-primary/30 backdrop-blur-sm"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ── Count ── */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs text-muted-foreground font-heading font-bold">
            Showing{" "}
            <span className="text-foreground">{filtered.length}</span> item
            {filtered.length !== 1 ? "s" : ""}
            {activeCategory !== "All" ? ` in ${activeCategory}` : ""}
            {search ? ` for "${search}"` : ""}
          </p>
          {(search || activeCategory !== "All") && (
            <button
              onClick={() => { setSearch(""); setActiveCategory("All"); }}
              className="text-[10px] text-primary font-bold hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* ── Grid ── */}
        {filtered.length === 0 ? (
          <div className="text-center py-24 text-muted-foreground">
            <p className="text-5xl mb-4">🍽️</p>
            <p className="font-heading font-bold text-lg">Nothing found</p>
            <button
              onClick={() => { setSearch(""); setActiveCategory("All"); }}
              className="mt-4 text-primary text-sm font-bold hover:underline"
            >
              Clear filters →
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {filtered.map((item) => (
              <ItemCard key={`${item.id}-${activeCategory}`} item={item} />
            ))}
          </div>
        )}
      </div>

      {/* ── Floating savings bar ── */}
      <AnimatePresence>
        {totalItems > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 22, stiffness: 200 }}
            className="fixed bottom-[72px] left-0 right-0 z-40 px-3 lg:bottom-5"
          >
            <div className="max-w-xl mx-auto bg-card/95 backdrop-blur-xl border border-white/15 rounded-2xl shadow-2xl shadow-black/50 px-4 py-3 flex items-center justify-between gap-3">
              {/* Glow line */}
              <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent pointer-events-none" />

              <div className="flex-1 min-w-0">
                {reward.label ? (
                  <motion.p
                    key={reward.label}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-green-400 font-heading font-black text-xs truncate"
                  >
                    {reward.label} Unlocked! 🎉
                  </motion.p>
                ) : nextMilestone ? (
                  <p className="text-muted-foreground font-heading font-bold text-xs truncate">
                    Add{" "}
                    <span className="text-primary font-black">{formatPKR(toNext)}</span>{" "}
                    for {nextMilestone.label}
                  </p>
                ) : (
                  <p className="text-green-400 font-heading font-black text-xs">All rewards unlocked! 🏆</p>
                )}
                <p className="text-foreground font-black font-heading text-sm mt-0.5">
                  {formatPKR(totalPrice)}{" "}
                  <span className="text-muted-foreground font-normal text-xs">
                    · {totalItems} item{totalItems !== 1 ? "s" : ""}
                  </span>
                </p>
              </div>

              <button
                onClick={() => setIsCartOpen(true)}
                className="shrink-0 bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-400 text-white font-heading font-black text-xs px-4 py-2.5 rounded-xl transition-all active:scale-95 flex items-center gap-1.5 shadow-lg shadow-primary/30"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                View Cart
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CreateYourDeal;
