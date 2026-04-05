import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, ChevronLeft, Check, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { formatPKR } from "@/lib/currency";
const heroBurger = "/media/hero-burger.png";;

interface BurgerOption {
  id: string;
  name: string;
  price: number;
  emoji: string;
  description: string;
}

const burgers: BurgerOption[] = [
  { id: "b1", name: "Signature Smash", price: 650, emoji: "🍔", description: "Double smashed patty, signature sauce, cheddar" },
  { id: "b2", name: "Spicy Inferno", price: 750, emoji: "🔥", description: "Ghost pepper sauce, crispy onions, jalapeños" },
  { id: "b3", name: "Classic Cheese", price: 450, emoji: "🧀", description: "Beef patty, American cheese, lettuce, tomato" },
  { id: "b4", name: "BBQ Bacon", price: 800, emoji: "🥓", description: "Smoky BBQ sauce, crispy bacon, onion rings" },
];

const sauces: BurgerOption[] = [
  { id: "s1", name: "Signature Sauce", price: 0, emoji: "🟡", description: "Our secret house blend" },
  { id: "s2", name: "Spicy Mayo", price: 50, emoji: "🌶️", description: "Creamy with a kick of heat" },
  { id: "s3", name: "BBQ Sauce", price: 0, emoji: "🟤", description: "Sweet & smoky classic" },
  { id: "s4", name: "Garlic Aioli", price: 50, emoji: "🧄", description: "Rich garlic cream" },
  { id: "s5", name: "Ranch", price: 0, emoji: "⚪", description: "Cool & creamy ranch" },
];

const toppings: BurgerOption[] = [
  { id: "t1", name: "Extra Cheese", price: 80, emoji: "🧀", description: "Double melted cheddar" },
  { id: "t2", name: "Crispy Bacon", price: 120, emoji: "🥓", description: "Smoky crispy strips" },
  { id: "t3", name: "Jalapeños", price: 50, emoji: "🌶️", description: "Sliced fresh jalapeños" },
  { id: "t4", name: "Caramelized Onions", price: 70, emoji: "🧅", description: "Sweet golden onions" },
  { id: "t5", name: "Pickles", price: 30, emoji: "🥒", description: "Crunchy dill pickles" },
  { id: "t6", name: "Avocado", price: 150, emoji: "🥑", description: "Fresh sliced avocado" },
];

const steps = ["Choose Burger", "Select Sauce", "Pick Toppings", "Review & Add"];

const BurgerOrderFlow = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [step, setStep] = useState(0);
  const [selectedBurger, setSelectedBurger] = useState<BurgerOption | null>(null);
  const [selectedSauce, setSelectedSauce] = useState<BurgerOption | null>(null);
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const { addItem, setIsCartOpen } = useCart();

  const toggleTopping = (id: string) => {
    setSelectedToppings((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const totalPrice = () => {
    let total = selectedBurger?.price || 0;
    total += selectedSauce?.price || 0;
    selectedToppings.forEach((id) => {
      const t = toppings.find((tp) => tp.id === id);
      if (t) total += t.price;
    });
    return total;
  };

  const handleAddToCart = () => {
    if (!selectedBurger) return;
    const toppingNames = selectedToppings.map((id) => toppings.find((t) => t.id === id)?.name).filter(Boolean);
    const name = `${selectedBurger.name}${selectedSauce ? ` + ${selectedSauce.name}` : ""}${toppingNames.length ? ` + ${toppingNames.join(", ")}` : ""}`;
    addItem({ id: `custom-${Date.now()}`, name, price: totalPrice(), image: heroBurger });
    resetAndClose();
    setIsCartOpen(true);
  };

  const resetAndClose = () => {
    setStep(0);
    setSelectedBurger(null);
    setSelectedSauce(null);
    setSelectedToppings([]);
    onClose();
  };

  const canNext = () => {
    if (step === 0) return !!selectedBurger;
    if (step === 1) return !!selectedSauce;
    return true;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-background/70 backdrop-blur-sm z-50" onClick={resetAndClose} />
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg md:max-h-[85vh] bg-card border border-border rounded-2xl z-50 flex flex-col overflow-hidden"
          >
            <div className="flex items-center justify-between p-5 border-b border-border">
              <div>
                <h2 className="font-heading font-bold text-lg text-foreground">Build Your Burger</h2>
                <p className="text-muted-foreground text-xs mt-0.5">Step {step + 1} of {steps.length}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={resetAndClose} className="hover:bg-muted"><X className="w-5 h-5" /></Button>
            </div>

            <div className="px-5 pt-4">
              <div className="flex gap-1.5">
                {steps.map((s, i) => (
                  <div key={s} className="flex-1 flex flex-col items-center gap-1">
                    <div className={`h-1 w-full rounded-full transition-colors duration-300 ${i <= step ? "bg-primary" : "bg-border"}`} />
                    <span className={`text-[10px] font-medium transition-colors ${i <= step ? "text-primary" : "text-muted-foreground"}`}>{s}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              <AnimatePresence mode="wait">
                {step === 0 && (
                  <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-3">
                    {burgers.map((b) => (
                      <button key={b.id} onClick={() => setSelectedBurger(b)} className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left ${selectedBurger?.id === b.id ? "border-primary bg-primary/5 shadow-lg shadow-primary/5" : "border-border hover:border-muted-foreground/30 bg-background"}`}>
                        <span className="text-3xl">{b.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-heading font-bold text-foreground text-sm">{b.name}</p>
                          <p className="text-muted-foreground text-xs mt-0.5">{b.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-heading font-bold text-primary text-sm">{formatPKR(b.price)}</p>
                          {selectedBurger?.id === b.id && <Check className="w-4 h-4 text-primary ml-auto mt-1" />}
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}

                {step === 1 && (
                  <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-3">
                    {sauces.map((s) => (
                      <button key={s.id} onClick={() => setSelectedSauce(s)} className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left ${selectedSauce?.id === s.id ? "border-primary bg-primary/5 shadow-lg shadow-primary/5" : "border-border hover:border-muted-foreground/30 bg-background"}`}>
                        <span className="text-2xl">{s.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-heading font-bold text-foreground text-sm">{s.name}</p>
                          <p className="text-muted-foreground text-xs mt-0.5">{s.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-heading font-bold text-sm text-foreground">{s.price > 0 ? `+${formatPKR(s.price)}` : "Free"}</p>
                          {selectedSauce?.id === s.id && <Check className="w-4 h-4 text-primary ml-auto mt-1" />}
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-3">
                    <p className="text-muted-foreground text-xs mb-2">Select as many as you like (optional)</p>
                    {toppings.map((t) => {
                      const selected = selectedToppings.includes(t.id);
                      return (
                        <button key={t.id} onClick={() => toggleTopping(t.id)} className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left ${selected ? "border-primary bg-primary/5 shadow-lg shadow-primary/5" : "border-border hover:border-muted-foreground/30 bg-background"}`}>
                          <span className="text-2xl">{t.emoji}</span>
                          <div className="flex-1 min-w-0">
                            <p className="font-heading font-bold text-foreground text-sm">{t.name}</p>
                            <p className="text-muted-foreground text-xs mt-0.5">{t.description}</p>
                          </div>
                          <div className="text-right flex items-center gap-2">
                            <p className="font-heading font-bold text-sm text-foreground">+{formatPKR(t.price)}</p>
                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${selected ? "bg-primary border-primary" : "border-border"}`}>
                              {selected && <Check className="w-3 h-3 text-primary-foreground" />}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                    <div className="bg-background rounded-xl border border-border p-5 text-center">
                      <img src={heroBurger} alt="Your burger" className="w-32 h-32 mx-auto object-contain drop-shadow-lg mb-3" />
                      <h3 className="font-heading font-bold text-foreground text-lg">{selectedBurger?.name}</h3>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Burger</span>
                        <span className="text-foreground font-medium">{selectedBurger?.name} — {formatPKR(selectedBurger?.price || 0)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Sauce</span>
                        <span className="text-foreground font-medium">{selectedSauce?.name} — {selectedSauce && selectedSauce.price > 0 ? formatPKR(selectedSauce.price) : "Free"}</span>
                      </div>
                      {selectedToppings.length > 0 && (
                        <div className="text-sm">
                          <span className="text-muted-foreground">Toppings</span>
                          {selectedToppings.map((id) => {
                            const t = toppings.find((tp) => tp.id === id);
                            return t ? (
                              <div key={id} className="flex justify-between pl-4 mt-1">
                                <span className="text-muted-foreground text-xs">{t.emoji} {t.name}</span>
                                <span className="text-foreground text-xs font-medium">+{formatPKR(t.price)}</span>
                              </div>
                            ) : null;
                          })}
                        </div>
                      )}
                      <div className="border-t border-border pt-3 mt-3 flex justify-between">
                        <span className="font-heading font-bold text-foreground">Total</span>
                        <span className="font-heading font-bold text-primary text-lg">{formatPKR(totalPrice())}</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="border-t border-border p-5 flex items-center gap-3">
              {step > 0 && (
                <Button variant="outline" onClick={() => setStep(step - 1)} className="rounded-full border-border hover:bg-muted">
                  <ChevronLeft className="w-4 h-4 mr-1" /> Back
                </Button>
              )}
              <div className="flex-1" />
              <p className="font-heading font-bold text-primary text-sm mr-2">{formatPKR(totalPrice())}</p>
              {step < 3 ? (
                <Button disabled={!canNext()} onClick={() => setStep(step + 1)} className="bg-gradient-brand text-primary-foreground font-heading font-semibold rounded-full px-6">
                  Next <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              ) : (
                <Button onClick={handleAddToCart} className="bg-gradient-brand text-primary-foreground font-heading font-semibold rounded-full px-6">
                  <ShoppingCart className="w-4 h-4 mr-2" /> Add to Cart
                </Button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BurgerOrderFlow;
