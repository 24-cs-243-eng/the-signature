import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useOrderMode } from "@/context/OrderModeContext";
import { supabase } from "@/integrations/supabase/client";
import { USE_PHP_BACKEND } from "@/lib/config";
import { addOns } from "@/data/menuData";
import type { AddOn } from "@/data/menuData";
import { X, Plus, Minus, Trash2, MapPin, CheckCircle2, Loader2, MessageCircle, GlassWater, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoginModal } from "@/components/AuthUI";
import { formatPKR } from "@/lib/currency";
import { toast } from "sonner";

interface Drink {
  id: string;
  name: string;
  price: number;
  image: string;
}

const drinks: Drink[] = [
  { id: "drk1", name: "Fizup 1.5L",   price: 200, image: "/media/fizup.png" },
  { id: "drk2", name: "Next Cola 1.5L", price: 200, image: "/media/colanext.png" },
];

const sidesData = [
  { id: "s1", name: "Regular Fries", price: 180, image: "https://images.unsplash.com/photo-1576107232684-1279f3908594?w=150&h=150&fit=crop" },
  { id: "s2", name: "Mayo Fries", price: 250, image: "https://images.unsplash.com/photo-1534080564583-6be75777b70a?w=150&h=150&fit=crop" },
  { id: "s3", name: "Spicy Fries", price: 220, image: "https://images.unsplash.com/photo-1630431341973-02e1b662ce3b?w=150&h=150&fit=crop" },
];

const BucketIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 10 L6 21 H18 L20 10" />
    <path d="M2 10 H22" />
    <path d="M8 10 C8 5 16 5 16 10" />
  </svg>
);

type Step = "cart" | "checkout" | "done";

let lastOrderTime = 0;

const CartPanel = () => {
  const { items, isCartOpen, setIsCartOpen, removeItem, updateQuantity, totalPrice, totalItems, clearCart, addItem } = useCart();
  const { user } = useAuth();
  const { mode } = useOrderMode();
  const [showLogin, setShowLogin] = useState(false);
  const [step, setStep] = useState<Step>("cart");
  const [address, setAddress] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [selectedDrinks, setSelectedDrinks] = useState<{ drink: Drink; qty: number }[]>([]);
  const [selectedAddOns, setSelectedAddOns] = useState<AddOn[]>([]);
  
  const [drinksOpen, setDrinksOpen] = useState(true);
  const [dipsOpen, setDipsOpen] = useState(false);
  const [sidesOpen, setSidesOpen] = useState(false);

  const toggleDrink = (drink: Drink) => {
    setSelectedDrinks(prev => {
      const exists = prev.find(d => d.drink.id === drink.id);
      return exists ? prev.filter(d => d.drink.id !== drink.id) : [...prev, { drink, qty: 1 }];
    });
  };

  const isDrinkSelected = (id: string) => selectedDrinks.some(d => d.drink.id === id);

  const toggleAddOn = (addOn: AddOn) => {
    setSelectedAddOns(prev =>
      prev.find(a => a.id === addOn.id)
        ? prev.filter(a => a.id !== addOn.id)
        : [...prev, addOn]
    );
  };

  // Reset form when cart opens
  useEffect(() => {
    if (isCartOpen) setStep("cart");
  }, [isCartOpen]);

  // Auto-fill user data from guest profile
  useEffect(() => {
    if (user) {
      setCustomerName(user.user_metadata?.full_name || "");
      setPhone((user.user_metadata as any)?.phone || "");
    }
  }, [user]);

  // Load saved address from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("sig_last_address");
    if (saved) setAddress(saved);
  }, []);

  const validateCheckout = () => {
    if (!customerName.trim()) { toast.error("Please enter your name"); return false; }
    if (!phone.trim() || phone.replace(/\D/g, "").length < 10) { toast.error("Please enter a valid phone number"); return false; }
    if (mode === "delivery" && !address.trim()) { toast.error("Please enter your delivery address"); return false; }
    return true;
  };

  const drinksTotal = selectedDrinks.reduce((s, d) => s + d.drink.price * d.qty, 0);

  const handlePlaceOrder = async () => {
    const now = Date.now();
    if (now - lastOrderTime < 30000) {
      toast.error("Please wait 30 seconds before placing another order");
      return;
    }
    if (!validateCheckout()) return;

    setLoading(true);
    const newOrderId = `ORD${Date.now().toString().slice(-6)}`;

    const orderType = mode === "pickup"
      ? "🏪 *Pickup from Store*"
      : `📍 *Delivery Address:*\n${address}`;

    const addOnTotal = selectedAddOns.reduce((s, a) => s + a.price, 0);
    const grandTotal = totalPrice + addOnTotal + drinksTotal;

    const addOnLine = selectedAddOns.length > 0
      ? `\n*Add-Ons:* ${selectedAddOns.map(a => a.name).join(", ")} (+${formatPKR(addOnTotal)})`
      : "";

    const drinksLine = selectedDrinks.length > 0
      ? `\n*Drinks:* ${selectedDrinks.map(d => `${d.drink.name} ×${d.qty}`).join(", ")} (+${formatPKR(drinksTotal)})`
      : "";

    const message =
      `🍔 *New Order — ${newOrderId}*\n\n` +
      items.map(i => `• ${i.name} ×${i.quantity}  —  ${formatPKR(i.price * i.quantity)}`).join("\n") +
      addOnLine +
      drinksLine +
      `\n\n*Total: ${formatPKR(grandTotal)}*\n\n` +
      `👤 *Name:* ${customerName}\n📞 *Phone:* ${phone}\n\n` +
      `${orderType}\n\n💵 *Cash on Delivery*`;

    try {
      if (address) localStorage.setItem("sig_last_address", address);
      if (USE_PHP_BACKEND) {
        await fetch("/api/create_order.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            order_id: newOrderId, user_id: "Guest",
            customer_name: customerName, phone, address: address || null,
            items: JSON.stringify(items.map(i => ({ name: i.name, quantity: i.quantity, price: i.price }))),
            total: grandTotal, payment_method: "cash", transaction_id: null
          })
        });
      } else {
        await supabase.from("orders").insert({
          user_id: null,
          items: items.map(i => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity })),
          total: grandTotal, status: "pending", address: address || null,
        });
      }
    } catch (_) { /* WhatsApp still works */ }

    lastOrderTime = now;
    setOrderId(newOrderId);
    setLoading(false);
    setStep("done");
    window.location.href = `https://wa.me/923125429037?text=${encodeURIComponent(message)}`;
    clearCart();
  };

  return (
    <>
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
              onClick={() => setIsCartOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 220 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-card border-l border-border z-[60] flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-border bg-primary/5 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <BucketIcon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-heading font-black text-lg text-foreground leading-none">
                      {step === "cart" ? "Your Bucket" : step === "checkout" ? "Your Details" : "Order Placed!"}
                    </h2>
                    <span className="text-xs text-muted-foreground font-heading">
                      {step === "cart"
                        ? `${totalItems} item${totalItems !== 1 ? "s" : ""}`
                        : `${formatPKR(totalPrice + drinksTotal)} total`}
                    </span>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsCartOpen(false)} className="hover:bg-muted rounded-full">
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Progress dots — 2 steps */}
              {step !== "done" && items.length > 0 && (
                <div className="flex items-center justify-center gap-2 py-3 shrink-0">
                  {(["cart", "checkout"] as Step[]).map((s, i) => (
                    <div key={s} className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full text-[10px] font-black flex items-center justify-center transition-all ${
                        step === s ? "bg-primary text-primary-foreground" :
                        (["cart", "checkout"].indexOf(step) > i) ? "bg-green-500 text-white" : "bg-muted text-muted-foreground"
                      }`}>{i + 1}</div>
                      {i < 1 && <div className="w-8 h-px bg-border" />}
                    </div>
                  ))}
                </div>
              )}

              {/* Scrollable content */}
              <div className="flex-1 overflow-y-auto p-5 space-y-3">

                {/* ── STEP: CART ── */}
                {step === "cart" && (
                  <>
                    {items.length === 0 ? (
                      <div className="text-center py-20 text-muted-foreground">
                        <BucketIcon className="w-16 h-16 mx-auto mb-4 opacity-20" />
                        <p className="font-heading font-bold text-lg">Your bucket is empty</p>
                        <p className="text-sm mt-1">Add some finger lickin' items!</p>
                      </div>
                    ) : items.map((item) => (
                      <motion.div
                        key={item.id} layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 60 }}
                        className="flex gap-3 bg-muted/40 rounded-2xl p-3 border border-border/50"
                      >
                        <div className="w-16 h-16 rounded-xl bg-background flex items-center justify-center shrink-0">
                          <img src={item.image} alt={item.name} className="w-14 h-14 object-contain" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-heading font-bold text-sm text-foreground truncate">{item.name}</h4>
                          <p className="text-primary font-black text-sm mt-0.5">{formatPKR(item.price * item.quantity)}</p>
                          <div className="flex items-center gap-1.5 mt-1.5">
                            <button
                              className="w-7 h-7 rounded-full bg-card border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            ><Minus className="w-3 h-3" /></button>
                            <span className="text-sm font-black w-6 text-center text-foreground">{item.quantity}</span>
                            <button
                              className="w-7 h-7 rounded-full bg-card border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            ><Plus className="w-3 h-3" /></button>
                          </div>
                        </div>
                        <button className="text-muted-foreground hover:text-destructive transition-colors self-start mt-1" onClick={() => removeItem(item.id)}>
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </motion.div>
                    ))}

                    {items.length > 0 && (
                      <>
                        <div className="space-y-4 pt-4">
                          {/* ── Complete With a Drink ── */}
                          <div className="border border-border/50 rounded-xl overflow-hidden bg-card shadow-sm">
                            <div 
                              onClick={() => setDrinksOpen(!drinksOpen)}
                              className="bg-red-600 hover:bg-red-700 text-white p-3 flex justify-between items-center cursor-pointer transition-colors"
                            >
                              <span className="font-heading font-black text-sm uppercase tracking-wide">Complete With a Drink</span>
                              <div className="flex items-center gap-2 text-xs font-bold opacity-90">
                                (Optional)
                                <ChevronDown className={`w-4 h-4 transition-transform ${drinksOpen ? "rotate-180" : ""}`} />
                              </div>
                            </div>
                            {drinksOpen && (
                              <div className="divide-y divide-border/50">
                                {drinks.map(drink => {
                                  const selected = isDrinkSelected(drink.id);
                                  return (
                                    <div key={drink.id} className="flex flex-row items-center justify-between p-3 bg-muted/10 hover:bg-muted/30 transition-colors">
                                      <div className="flex items-center gap-3">
                                        <img src={drink.image} alt={drink.name} className="w-10 h-10 object-cover rounded-md shadow-sm border border-border/50 p-0.5 bg-white" />
                                        <div className="flex flex-col">
                                          <span className="font-heading font-bold text-sm text-foreground">{drink.name}</span>
                                          <span className="text-xs text-muted-foreground">(+Rs {drink.price})</span>
                                        </div>
                                      </div>
                                      <button
                                        onClick={() => toggleDrink(drink)}
                                        className={`px-4 py-1.5 rounded text-xs font-heading font-bold uppercase tracking-wider transition-all shadow-sm ${
                                          selected 
                                            ? "bg-green-500 text-white" 
                                            : "bg-red-600 text-white hover:bg-red-700 hover:scale-105 active:scale-95"
                                        }`}
                                      >
                                        {selected ? "Added" : "Add"}
                                      </button>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>

                          {/* ── Add Some Dips ── */}
                          <div className="border border-border/50 rounded-xl overflow-hidden bg-card shadow-sm">
                            <div 
                              onClick={() => setDipsOpen(!dipsOpen)}
                              className="bg-red-600 hover:bg-red-700 text-white p-3 flex justify-between items-center cursor-pointer transition-colors"
                            >
                              <span className="font-heading font-black text-sm uppercase tracking-wide">Add Some Dips</span>
                              <div className="flex items-center gap-2 text-xs font-bold opacity-90">
                                (Optional)
                                <ChevronDown className={`w-4 h-4 transition-transform ${dipsOpen ? "rotate-180" : ""}`} />
                              </div>
                            </div>
                            {dipsOpen && (
                              <div className="divide-y divide-border/50">
                                {addOns.map(addOn => {
                                  const selected = selectedAddOns.some(a => a.id === addOn.id);
                                  return (
                                    <div key={addOn.id} className="flex flex-row items-center justify-between p-3 bg-muted/10 hover:bg-muted/30 transition-colors">
                                      <div className="flex items-center gap-3">
                                        {addOn.image ? (
                                           <img src={addOn.image} alt={addOn.name} className="w-10 h-10 object-cover rounded-md shadow-sm border border-border/50" />
                                        ) : (
                                          <div className="w-10 h-10 rounded-md bg-muted flex border border-border/50 items-center justify-center shrink-0">
                                            <span className="text-[8px] font-heading font-black text-muted-foreground uppercase opacity-50">Sauce</span>
                                          </div>
                                        )}
                                        <div className="flex flex-col">
                                          <span className="font-heading font-bold text-sm text-foreground">{addOn.name}</span>
                                          <span className="text-xs text-muted-foreground">(+Rs {addOn.price})</span>
                                        </div>
                                      </div>
                                      <button
                                        onClick={() => toggleAddOn(addOn)}
                                        className={`px-4 py-1.5 rounded text-xs font-heading font-bold uppercase tracking-wider transition-all shadow-sm ${
                                          selected 
                                            ? "bg-green-500 text-white" 
                                            : "bg-red-600 text-white hover:bg-red-700 hover:scale-105 active:scale-95"
                                        }`}
                                      >
                                        {selected ? "Added" : "Add"}
                                      </button>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>

                          {/* ── Add a Side ── */}
                          <div className="border border-border/50 rounded-xl overflow-hidden bg-card shadow-sm mb-4">
                            <div 
                              onClick={() => setSidesOpen(!sidesOpen)}
                              className="bg-red-600 hover:bg-red-700 text-white p-3 flex justify-between items-center cursor-pointer transition-colors"
                            >
                              <span className="font-heading font-black text-sm uppercase tracking-wide">Add a Side</span>
                              <div className="flex items-center gap-2 text-xs font-bold opacity-90">
                                (Optional)
                                <ChevronDown className={`w-4 h-4 transition-transform ${sidesOpen ? "rotate-180" : ""}`} />
                              </div>
                            </div>
                            {sidesOpen && (
                              <div className="divide-y divide-border/50">
                                {sidesData.map(side => (
                                  <div key={side.id} className="flex flex-row items-center justify-between p-3 bg-muted/10 hover:bg-muted/30 transition-colors">
                                    <div className="flex items-center gap-3">
                                      <img src={side.image} alt={side.name} className="w-10 h-10 object-cover rounded-md shadow-sm border border-border/50" />
                                      <div className="flex flex-col">
                                        <span className="font-heading font-bold text-sm text-foreground">{side.name}</span>
                                        <span className="text-xs text-muted-foreground">(+Rs {side.price})</span>
                                      </div>
                                    </div>
                                    <button
                                      onClick={() => addItem({ id: side.id, name: side.name, price: side.price, image: side.image })}
                                      className="px-4 py-1.5 rounded text-xs font-heading font-bold uppercase tracking-wider transition-all shadow-sm bg-red-600 text-white hover:bg-red-700 hover:scale-105 active:scale-95"
                                    >
                                      Add
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </>
                )}

                {/* ── STEP: CHECKOUT ── */}
                {step === "checkout" && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-heading font-bold text-foreground/70 uppercase tracking-wider mb-1.5 block">Your Name *</label>
                      <input
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value.slice(0, 60))}
                        placeholder="Full name"
                        className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-heading font-bold text-foreground/70 uppercase tracking-wider mb-1.5 block">Phone *</label>
                      <input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/[^0-9+\-\s]/g, "").slice(0, 15))}
                        placeholder="03XX XXXXXXX"
                        type="tel"
                        className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    {mode === "delivery" && (
                      <div>
                        <label className="text-xs font-heading font-bold text-foreground/70 uppercase tracking-wider mb-1.5 block">
                          <MapPin className="w-3 h-3 inline mr-1" />Delivery Address *
                        </label>
                        <textarea
                          value={address}
                          onChange={(e) => setAddress(e.target.value.slice(0, 300))}
                          placeholder="House #, Street, Area, City..."
                          className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none h-24"
                        />
                      </div>
                    )}
                    {mode === "pickup" && (
                      <div className="bg-primary/8 border border-primary/20 rounded-xl p-3 flex gap-2">
                        <span className="text-lg">🏪</span>
                        <div>
                          <p className="font-heading font-bold text-sm text-foreground">Pickup from Store</p>
                          <p className="text-xs text-muted-foreground mt-0.5">Shop No 23, Ameer Mall, Wah Cantt Phase 2</p>
                        </div>
                      </div>
                    )}

                    {/* COD Badge */}
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-green-500/8 border border-green-500/20">
                      <span className="text-xl">💵</span>
                      <div>
                        <p className="font-heading font-bold text-sm text-foreground">Cash on Delivery</p>
                        <p className="text-xs text-muted-foreground">Pay when your order arrives</p>
                      </div>
                    </div>

                    {/* Order summary */}
                    <div className="bg-muted/40 rounded-2xl p-4 space-y-1.5 text-sm">
                      <p className="font-heading font-bold text-foreground/70 text-xs uppercase tracking-wider mb-2">Order Summary</p>
                      {items.map(i => (
                        <div key={i.id} className="flex justify-between text-foreground/80">
                          <span>{i.name} ×{i.quantity}</span>
                          <span className="font-bold">{formatPKR(i.price * i.quantity)}</span>
                        </div>
                      ))}
                      {selectedAddOns.length > 0 && selectedAddOns.map(a => (
                        <div key={a.id} className="flex justify-between text-foreground/60 text-xs">
                          <span>+ {a.name}</span>
                          <span>{formatPKR(a.price)}</span>
                        </div>
                      ))}
                      {selectedDrinks.length > 0 && selectedDrinks.map(d => (
                        <div key={d.drink.id} className="flex justify-between text-blue-500 text-xs">
                          <span>{d.drink.name}</span>
                          <span>{formatPKR(d.drink.price)}</span>
                        </div>
                      ))}
                      <div className="border-t border-border mt-2 pt-2 flex justify-between font-black text-foreground">
                        <span>Total</span>
                        <span className="text-primary">{formatPKR(totalPrice + drinksTotal + selectedAddOns.reduce((s, a) => s + a.price, 0))}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── STEP: DONE ── */}
                {step === "done" && (
                  <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", bounce: 0.5 }}
                      className="w-20 h-20 bg-green-500/15 rounded-full flex items-center justify-center"
                    >
                      <CheckCircle2 className="w-10 h-10 text-green-500" />
                    </motion.div>
                    <div>
                      <h3 className="font-heading font-black text-2xl text-foreground">Order Placed!</h3>
                      <p className="text-muted-foreground text-sm mt-1">Order ID: <strong>{orderId}</strong></p>
                      <p className="text-muted-foreground text-xs mt-2">Your order has been sent to WhatsApp. We'll confirm shortly!</p>
                    </div>
                    <Button
                      onClick={() => setIsCartOpen(false)}
                      className="mt-2 bg-gradient-brand text-primary-foreground rounded-full px-8 font-heading font-black"
                    >
                      Continue Browsing
                    </Button>
                  </div>
                )}
              </div>

              {/* Footer actions */}
              {items.length > 0 && step !== "done" && (
                <div className="border-t border-border p-5 bg-card space-y-3 shrink-0">
                  <div className="flex justify-between font-heading font-black text-xl text-foreground">
                    <span>Total</span>
                    <span className="text-primary">{formatPKR(totalPrice + drinksTotal + selectedAddOns.reduce((s, a) => s + a.price, 0))}</span>
                  </div>

                  {step === "cart" && (
                    <Button
                      className="w-full bg-gradient-brand text-primary-foreground font-heading font-black text-base py-6 rounded-full shadow-lg hover:shadow-xl transition-shadow uppercase tracking-wide"
                      onClick={() => setStep("checkout")}
                    >
                      Checkout →
                    </Button>
                  )}

                  {step === "checkout" && (
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1 rounded-full" onClick={() => setStep("cart")}>← Back</Button>
                      <Button
                        className="flex-1 bg-gradient-brand text-primary-foreground rounded-full font-heading font-black"
                        onClick={handlePlaceOrder}
                        disabled={loading}
                      >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><MessageCircle className="w-4 h-4 mr-1.5" /> Send Order</>}
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
    </>
  );
};

export default CartPanel;

