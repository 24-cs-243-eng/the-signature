import { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react";
import { toast } from "sonner";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export interface CartReward {
  discountAmount: number;   // flat PKR discount
  freeDelivery: boolean;    // waive delivery fee
  freeBurger: boolean;      // free patty burger added
  label: string;            // human-readable reward label
  nextMilestone: number | null; // next milestone amount (null if max reached)
  nextLabel: string;        // label for the next milestone
}

// ─── Reward tiers ────────────────────────────────────────────────────────────
export const REWARD_MILESTONES = [
  { threshold: 3000, label: "🚚 Free Delivery",      freeDelivery: true,  freeBurger: false, discountAmount: 0   },
  { threshold: 4000, label: "💰 Rs. 150 Off",         freeDelivery: true,  freeBurger: false, discountAmount: 150 },
  { threshold: 5000, label: "🍔 Free Patty Burger",   freeDelivery: true,  freeBurger: true,  discountAmount: 150 },
];

export const FREE_BURGER_ITEM: Omit<CartItem, "quantity"> = {
  id: "__free_patty_burger__",
  name: "🎁 Free Patty Burger",
  price: 0,
  image: "/media/patty-burger.png",
};

export function getCartReward(total: number): CartReward {
  let active = { discountAmount: 0, freeDelivery: false, freeBurger: false, label: "" };
  for (const m of REWARD_MILESTONES) {
    if (total >= m.threshold) active = m;
  }
  const next = REWARD_MILESTONES.find((m) => total < m.threshold);
  return {
    ...active,
    nextMilestone: next ? next.threshold : null,
    nextLabel: next ? next.label : "",
  };
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  reward: CartReward;
  finalTotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const prevFreeBurger = useRef(false);

  const addItem = (item: Omit<CartItem, "quantity">) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeItem = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id));
  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) return removeItem(id);
    setItems((prev) => prev.map((i) => i.id === id ? { ...i, quantity } : i));
  };
  const clearCart = () => setItems([]);

  // Compute totals (exclude the free burger from price sum)
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const reward = getCartReward(totalPrice);
  const finalTotal = Math.max(0, totalPrice - reward.discountAmount);

  // Auto-add / remove free Patty Burger based on reward tier
  useEffect(() => {
    const hasBurger = items.some((i) => i.id === FREE_BURGER_ITEM.id);
    if (reward.freeBurger && !hasBurger) {
      setItems((prev) => [...prev, { ...FREE_BURGER_ITEM, quantity: 1 }]);
      if (!prevFreeBurger.current) {
        toast.success("🎉 You unlocked a FREE Patty Burger!", { duration: 4000 });
      }
    } else if (!reward.freeBurger && hasBurger) {
      setItems((prev) => prev.filter((i) => i.id !== FREE_BURGER_ITEM.id));
    }
    prevFreeBurger.current = reward.freeBurger;
  }, [reward.freeBurger, totalPrice]);

  return (
    <CartContext.Provider value={{
      items, addItem, removeItem, updateQuantity, clearCart,
      totalItems, totalPrice, reward, finalTotal,
      isCartOpen, setIsCartOpen,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
