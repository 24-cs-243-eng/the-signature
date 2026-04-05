import { useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { menuItems } from "@/data/menuData";
import { Sparkles, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PersonalDeal {
  item: typeof menuItems[0];
  discount: number;
  reason: string;
}

const PersonalizedDeals = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const { user } = useAuth();
  const { addItem } = useCart();
  const [deals, setDeals] = useState<PersonalDeal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      // For non-logged-in users, show popular items as deals
      const popular = menuItems.filter((m) => m.isBestSeller).slice(0, 3);
      setDeals(popular.map((item) => ({ item, discount: 15, reason: "🔥 Trending this week" })));
      setLoading(false);
      return;
    }

    const generateDeals = async () => {
      // Fetch user's order history
      const { data: orders } = await supabase
        .from("orders")
        .select("items")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10);

      // Fetch user's favorites
      const { data: favs } = await supabase.from("favorites").select("item_id").eq("user_id", user.id);

      const favIds = favs?.map((f) => f.item_id) || [];

      // Count ordered items
      const itemCounts: Record<string, number> = {};
      orders?.forEach((order) => {
        const items = order.items as { id: string; quantity: number }[];
        items?.forEach((i) => {
          itemCounts[i.id] = (itemCounts[i.id] || 0) + (i.quantity || 1);
        });
      });

      const personalDeals: PersonalDeal[] = [];

      // Deal 1: Discount on their most ordered item
      const topItem = Object.entries(itemCounts).sort(([, a], [, b]) => b - a)[0];
      if (topItem) {
        const item = menuItems.find((m) => m.id === topItem[0]);
        if (item) personalDeals.push({ item, discount: 20, reason: "🎯 Because you love this" });
      }

      // Deal 2: Recommend from their favorite category
      const orderedCategories = Object.keys(itemCounts)
        .map((id) => menuItems.find((m) => m.id === id)?.category)
        .filter(Boolean);
      const topCategory = orderedCategories.sort((a, b) =>
        orderedCategories.filter((c) => c === b).length - orderedCategories.filter((c) => c === a).length
      )[0];
      if (topCategory) {
        const newInCategory = menuItems.find(
          (m) => m.category === topCategory && !itemCounts[m.id]
        );
        if (newInCategory) personalDeals.push({ item: newInCategory, discount: 25, reason: `✨ New in ${topCategory} — try it!` });
      }

      // Deal 3: From favorites they haven't ordered recently
      const unorderedFav = favIds.find((id) => !itemCounts[id]);
      if (unorderedFav) {
        const item = menuItems.find((m) => m.id === unorderedFav);
        if (item) personalDeals.push({ item, discount: 15, reason: "❤️ From your wishlist" });
      }

      // Fill remaining with popular items
      while (personalDeals.length < 3) {
        const popular = menuItems.find(
          (m) => m.isBestSeller && !personalDeals.some((d) => d.item.id === m.id)
        );
        if (popular) personalDeals.push({ item: popular, discount: 10, reason: "🔥 Fan favorite" });
        else break;
      }

      setDeals(personalDeals.slice(0, 3));
      setLoading(false);
    };

    generateDeals();
  }, [user]);

  if (loading || deals.length === 0) return null;

  return (
    <section ref={ref} className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-bold px-4 py-1.5 rounded-full mb-4">
            <Sparkles className="w-4 h-4" /> {user ? "Picked Just For You" : "Trending Now"}
          </div>
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground">
            {user ? "Your Personal " : "Popular "}
            <span className="text-gradient">Deals</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-4xl mx-auto">
          {deals.map((deal, i) => (
            <motion.div
              key={deal.item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.12 }}
              className="bg-card border border-border rounded-xl overflow-hidden group hover:border-primary/20 transition-colors"
            >
              <div className="relative p-4 pb-0">
                <span className="absolute top-3 left-3 text-xs font-bold bg-primary text-primary-foreground px-2 py-1 rounded-full">
                  {deal.discount}% OFF
                </span>
                <img src={deal.item.image} alt={deal.item.name} className="w-full h-28 object-contain" />
              </div>
              <div className="p-4">
                <p className="text-xs text-muted-foreground mb-1">{deal.reason}</p>
                <h3 className="font-heading font-bold text-sm text-foreground">{deal.item.name}</h3>
                <div className="flex items-center justify-between mt-3">
                  <div>
                    <span className="font-bold text-primary">${(deal.item.price * (1 - deal.discount / 100)).toFixed(2)}</span>
                    <span className="text-xs text-muted-foreground line-through ml-2">${deal.item.price.toFixed(2)}</span>
                  </div>
                  <Button
                    size="sm"
                    className="rounded-full bg-gradient-brand text-primary-foreground text-xs"
                    onClick={() => addItem({ id: deal.item.id, name: deal.item.name, price: +(deal.item.price * (1 - deal.discount / 100)).toFixed(2), image: deal.item.image })}
                  >
                    <ShoppingCart className="w-3 h-3 mr-1" /> Add
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PersonalizedDeals;
