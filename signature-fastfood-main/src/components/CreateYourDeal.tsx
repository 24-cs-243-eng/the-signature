import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, X, ShoppingCart, Plus, Minus, ChevronDown,
  Truck, Percent, Gift, Trash2, ArrowRight, CheckCircle2,
} from "lucide-react";
import { menuItems } from "@/data/menuData";
import { useCart } from "@/context/CartContext";
import { formatPKR } from "@/lib/currency";
import { useVideoAutoplay } from "@/hooks/useVideoAutoplay";

// ─── Discount tiers ──────────────────────────────────────────────────────────
const DISCOUNT_TIERS = [
  {
    threshold: 3000,
    label: "Free Delivery",
    description: "Spend Rs. 3,000 and delivery is on us",
    discount: 0,
    freeDelivery: true,
    icon: Truck,
  },
  {
    threshold: 4000,
    label: "5% Off",
    description: "Spend Rs. 4,000 and save 5% on your total",
    discount: 0.05,
    freeDelivery: true,
    icon: Percent,
  },
  {
    threshold: 5000,
    label: "10% Off",
    description: "Spend Rs. 5,000 and save 10% on your total",
    discount: 0.1,
    freeDelivery: true,
    icon: Gift,
  },
];

const ALL_CATEGORIES = [
  "All", "Burgers", "Wraps & Rolls", "Fries & Sides",
  "Wings", "Appetizers", "Pizza", "Combo Meals", "Family Deals",
];

// ─── Types ───────────────────────────────────────────────────────────────────
interface DealItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

// ─── Video Hero ───────────────────────────────────────────────────────────────
const VideoHero = () => {
  const videoRef = useVideoAutoplay();
  return (
    <div className="relative w-full h-[45vh] sm:h-[55vh] overflow-hidden bg-black">
      <video
        ref={videoRef}
        preload="none"
        poster="/media/combo.png"
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-80"
        src="/media/combo-deal.mp4"
      />
      <div className="absolute inset-0 bg-black/55 z-10" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />

      <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-4">
        <motion.span
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 bg-red-600 text-white text-[10px] font-heading font-black uppercase tracking-widest px-4 py-1.5 rounded-full mb-3 shadow-lg"
        >
          Build Any Meal — Earn Discounts
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="font-heading font-black text-4xl sm:text-5xl text-white leading-none tracking-tight drop-shadow-2xl"
        >
          Custom <span className="text-red-400">Deal</span> Builder
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-white/75 text-sm mt-3 max-w-xs"
        >
          Pick any items, unlock a discount, add the whole deal to your cart.
        </motion.p>
      </div>
    </div>
  );
};

// ─── Discount Tier Table ──────────────────────────────────────────────────────
const DiscountTable = ({ subtotal }: { subtotal: number }) => {
  const activeTier = [...DISCOUNT_TIERS]
    .reverse()
    .find((t) => subtotal >= t.threshold) ?? null;

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden mb-6">
      <div className="px-4 py-3 border-b border-border">
        <p className="font-heading font-black text-sm text-foreground">Discount Tiers</p>
        <p className="text-muted-foreground text-xs mt-0.5">Spend more, save more</p>
      </div>
      <div className="divide-y divide-border">
        {DISCOUNT_TIERS.map((tier) => {
          const Icon = tier.icon;
          const unlocked = subtotal >= tier.threshold;
          const isNext = !unlocked &&
            DISCOUNT_TIERS.find((t) => subtotal < t.threshold)?.threshold === tier.threshold;

          return (
            <div
              key={tier.threshold}
              className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                unlocked
                  ? "bg-green-500/8"
                  : isNext
                  ? "bg-red-600/5"
                  : ""
              }`}
            >
              <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                unlocked
                  ? "bg-green-500/20"
                  : isNext
                  ? "bg-red-600/15"
                  : "bg-muted"
              }`}>
                <Icon className={`w-4 h-4 ${
                  unlocked ? "text-green-500" : isNext ? "text-red-600" : "text-muted-foreground"
                }`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-heading font-black text-xs ${
                  unlocked ? "text-green-500" : isNext ? "text-foreground" : "text-muted-foreground"
                }`}>
                  Spend {formatPKR(tier.threshold)} — {tier.label}
                </p>
                <p className="text-muted-foreground text-[10px] leading-tight">{tier.description}</p>
              </div>
              {unlocked && (
                <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
              )}
              {isNext && (
                <span className="text-[9px] font-black text-red-600 bg-red-600/10 px-2 py-0.5 rounded-full shrink-0">
                  {formatPKR(tier.threshold - subtotal)} away
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── Item Card (Phase 1) ──────────────────────────────────────────────────────
const ItemCard = ({
  item,
  dealItems,
  onAdd,
  onRemove,
}: {
  item: (typeof menuItems)[0];
  dealItems: DealItem[];
  onAdd: (item: DealItem) => void;
  onRemove: (id: string) => void;
}) => {
  const [selectedSize, setSelectedSize] = useState(item.sizes ? item.sizes[0] : null);
  const [sizeOpen, setSizeOpen] = useState(false);

  const effectivePrice = selectedSize ? selectedSize.price : item.price;
  const cartId = item.sizes ? `${item.id}_${selectedSize?.label}` : item.id;
  const existing = dealItems.find((d) => d.id === cartId);
  const qty = existing?.quantity ?? 0;

  const handleAdd = () => {
    onAdd({
      id: cartId,
      name: item.sizes ? `${item.name} (${selectedSize?.label === "S" ? "Small" : selectedSize?.label === "M" ? "Medium" : "Large"})` : item.name,
      price: effectivePrice,
      image: item.image,
      quantity: 1,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      className="group relative bg-card border border-border rounded-2xl overflow-visible shadow flex flex-col h-full"
    >
      <div className="h-0.5 w-full bg-red-600 rounded-t-2xl shrink-0" />

      {item.isBestSeller && (
        <span className="absolute -top-2 left-3 z-20 bg-red-600 text-white text-[8px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow">
          Best Seller
        </span>
      )}

      {qty > 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 z-20 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-[10px] font-black text-white shadow-lg border-2 border-background"
        >
          {qty}
        </motion.div>
      )}

      {/* Image */}
      <div className="flex items-center justify-center pt-5 pb-2 relative">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-20 h-20 rounded-full bg-red-600/8 blur-2xl" />
        </div>
        <img
          src={item.image}
          alt={item.name}
          className="relative z-10 w-24 h-24 object-contain drop-shadow-xl group-hover:scale-110 transition-transform duration-500"
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
              className="w-full flex items-center justify-between bg-muted/50 border border-border rounded-xl px-2.5 py-1.5 text-[10px] font-heading font-bold text-foreground hover:border-red-600/40 transition-colors"
            >
              <span>
                {selectedSize?.label === "S" ? "Small" : selectedSize?.label === "M" ? "Medium" : "Large"} — {formatPKR(selectedSize?.price ?? 0)}
              </span>
              <ChevronDown className={`w-3 h-3 transition-transform ${sizeOpen ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {sizeOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.95 }}
                  className="absolute bottom-full mb-1 left-0 right-0 bg-card border border-border rounded-2xl shadow-2xl z-50 overflow-hidden"
                >
                  {item.sizes.map((s) => (
                    <button
                      key={s.label}
                      onClick={() => { setSelectedSize(s); setSizeOpen(false); }}
                      className={`w-full flex justify-between px-3 py-2 text-[10px] font-heading font-bold transition-colors ${
                        selectedSize?.label === s.label
                          ? "bg-red-600/15 text-red-600"
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

        <p className="text-red-600 font-black text-base font-heading">{formatPKR(effectivePrice)}</p>

        {/* Qty / Add */}
        {qty === 0 ? (
          <button
            onClick={handleAdd}
            className="w-full h-9 rounded-xl bg-red-600 hover:bg-red-700 active:scale-95 text-white font-heading font-black text-[10px] tracking-wide shadow transition-all flex items-center justify-center gap-1.5 mt-auto"
          >
            <Plus className="w-3 h-3" /> Add to Deal
          </button>
        ) : (
          <div className="flex items-center justify-center gap-2 mt-auto">
            <button
              onClick={() => onRemove(cartId)}
              className="w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center hover:bg-red-600 hover:text-white hover:border-red-600 transition-all"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="font-black text-foreground w-5 text-center text-sm">{qty}</span>
            <button
              onClick={handleAdd}
              className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white hover:bg-red-700 transition-all active:scale-95"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// ─── Deal Summary Drawer (Phase 2) ────────────────────────────────────────────
const DealSummaryDrawer = ({
  dealItems,
  onRemoveOne,
  onClear,
  onAddToCart,
}: {
  dealItems: DealItem[];
  onRemoveOne: (id: string) => void;
  onClear: () => void;
  onAddToCart: () => void;
}) => {
  const [open, setOpen] = useState(false);
  const subtotal = dealItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const total = dealItems.reduce((s, i) => s + i.quantity, 0);

  const activeTier = [...DISCOUNT_TIERS]
    .reverse()
    .find((t) => subtotal >= t.threshold) ?? null;

  const discountAmount = activeTier ? subtotal * activeTier.discount : 0;
  const finalPrice = subtotal - discountAmount;

  if (total === 0) return null;

  return (
    <>
      {/* Sticky bottom bar */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-[64px] lg:bottom-5 left-0 right-0 z-40 px-3"
      >
        <div className="max-w-xl mx-auto bg-card border border-border rounded-2xl shadow-2xl px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="font-heading font-black text-sm text-foreground">
              {total} item{total !== 1 ? "s" : ""} in your deal
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="font-black text-red-600 font-heading text-base leading-none">
                {formatPKR(finalPrice)}
              </span>
              {discountAmount > 0 && (
                <span className="text-muted-foreground text-xs line-through">
                  {formatPKR(subtotal)}
                </span>
              )}
              {activeTier && (
                <span className="text-[9px] bg-green-500/15 text-green-500 font-black px-2 py-0.5 rounded-full">
                  {activeTier.label}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={() => setOpen(true)}
            className="shrink-0 bg-red-600 hover:bg-red-700 text-white font-heading font-black text-xs px-4 py-2.5 rounded-xl transition-all active:scale-95 flex items-center gap-1.5 shadow"
          >
            Review Deal <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>

      {/* Full summary panel */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-card rounded-t-3xl shadow-2xl max-h-[85vh] overflow-y-auto"
            >
              {/* Handle */}
              <div className="flex items-center justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-border" />
              </div>

              <div className="px-4 pb-8">
                {/* Header */}
                <div className="flex items-center justify-between py-3 border-b border-border mb-4">
                  <h2 className="font-heading font-black text-lg text-foreground">Your Custom Deal</h2>
                  <button
                    onClick={() => setOpen(false)}
                    className="p-1.5 rounded-full hover:bg-muted transition-colors"
                  >
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>

                {/* Items */}
                <div className="space-y-3 mb-5">
                  {dealItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <img src={item.image} alt={item.name} className="w-12 h-12 object-contain rounded-xl bg-muted shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-heading font-bold text-sm text-foreground leading-tight line-clamp-1">{item.name}</p>
                        <p className="text-muted-foreground text-xs">{formatPKR(item.price)} × {item.quantity}</p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="font-heading font-black text-sm text-red-600">
                          {formatPKR(item.price * item.quantity)}
                        </span>
                        <button
                          onClick={() => onRemoveOne(item.id)}
                          className="w-7 h-7 rounded-full bg-muted flex items-center justify-center hover:bg-red-600/10 transition-colors"
                        >
                          <Minus className="w-3 h-3 text-muted-foreground" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Discount tiers */}
                <DiscountTable subtotal={subtotal} />

                {/* Price breakdown */}
                <div className="bg-muted/40 rounded-2xl p-4 mb-5 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground font-heading">Subtotal</span>
                    <span className="font-heading font-bold text-foreground">{formatPKR(subtotal)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-green-500 font-heading font-bold">Discount ({activeTier?.label})</span>
                      <span className="text-green-500 font-heading font-black">- {formatPKR(discountAmount)}</span>
                    </div>
                  )}
                  {activeTier?.freeDelivery && (
                    <div className="flex justify-between text-sm">
                      <span className="text-green-500 font-heading font-bold">Delivery</span>
                      <span className="text-green-500 font-heading font-black">Free</span>
                    </div>
                  )}
                  <div className="h-px bg-border" />
                  <div className="flex justify-between">
                    <span className="font-heading font-black text-foreground">Total</span>
                    <span className="font-heading font-black text-lg text-red-600">{formatPKR(finalPrice)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  <button
                    onClick={() => { onAddToCart(); setOpen(false); }}
                    className="w-full h-12 bg-red-600 hover:bg-red-700 active:scale-[0.98] text-white font-heading font-black uppercase tracking-wide rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add Deal to Cart — {formatPKR(finalPrice)}
                  </button>
                  <button
                    onClick={() => { onClear(); setOpen(false); }}
                    className="w-full h-10 border border-border text-muted-foreground font-heading font-bold text-sm rounded-2xl hover:bg-muted transition-colors flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Clear Deal
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const CreateYourDeal = () => {
  const { addItem } = useCart();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [dealItems, setDealItems] = useState<DealItem[]>([]);

  const filtered = useMemo(() => {
    return menuItems.filter((item) => {
      const matchCat = activeCategory === "All" || item.category === activeCategory;
      const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [search, activeCategory]);

  const handleAdd = (item: DealItem) => {
    setDealItems((prev) => {
      const existing = prev.find((d) => d.id === item.id);
      if (existing) {
        return prev.map((d) =>
          d.id === item.id ? { ...d, quantity: d.quantity + 1 } : d
        );
      }
      return [...prev, item];
    });
  };

  const handleRemoveOne = (id: string) => {
    setDealItems((prev) => {
      const existing = prev.find((d) => d.id === id);
      if (!existing) return prev;
      if (existing.quantity <= 1) return prev.filter((d) => d.id !== id);
      return prev.map((d) => (d.id === id ? { ...d, quantity: d.quantity - 1 } : d));
    });
  };

  const handleClear = () => setDealItems([]);

  const subtotal = dealItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const activeTier = [...DISCOUNT_TIERS].reverse().find((t) => subtotal >= t.threshold) ?? null;
  const discountAmount = activeTier ? subtotal * activeTier.discount : 0;
  const finalPrice = subtotal - discountAmount;

  const handleAddToCart = () => {
    if (dealItems.length === 0) return;
    const label = activeTier ? ` (${activeTier.label})` : "";
    addItem({
      id: `custom-deal-${Date.now()}`,
      name: `Custom Deal${label}`,
      price: finalPrice,
      image: dealItems[0].image,
    });
    setDealItems([]);
  };

  return (
    <div className="bg-background min-h-screen pb-44">
      <VideoHero />

      <div className="container mx-auto px-3 sm:px-4 -mt-6 relative z-10">

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-card border border-border rounded-2xl pl-11 pr-10 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-red-600/40 focus:border-red-600/50 transition-all shadow"
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

        {/* Category pills */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-5 scrollbar-hide">
          {ALL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 px-4 py-2 rounded-full text-[10px] font-heading font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                activeCategory === cat
                  ? "bg-red-600 text-white shadow scale-105"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-red-600/30"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs text-muted-foreground font-heading">
            <span className="text-foreground font-bold">{filtered.length}</span> item{filtered.length !== 1 ? "s" : ""}
            {activeCategory !== "All" ? ` in ${activeCategory}` : ""}
          </p>
          {(search || activeCategory !== "All") && (
            <button
              onClick={() => { setSearch(""); setActiveCategory("All"); }}
              className="text-[10px] text-red-600 font-bold hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p className="font-heading font-bold text-lg">Nothing found</p>
            <button
              onClick={() => { setSearch(""); setActiveCategory("All"); }}
              className="mt-3 text-red-600 text-sm font-bold hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {filtered.map((item) => (
              <ItemCard
                key={`${item.id}-${activeCategory}`}
                item={item}
                dealItems={dealItems}
                onAdd={handleAdd}
                onRemove={handleRemoveOne}
              />
            ))}
          </div>
        )}
      </div>

      {/* Summary drawer */}
      <AnimatePresence>
        {dealItems.length > 0 && (
          <DealSummaryDrawer
            dealItems={dealItems}
            onRemoveOne={handleRemoveOne}
            onClear={handleClear}
            onAddToCart={handleAddToCart}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default CreateYourDeal;
