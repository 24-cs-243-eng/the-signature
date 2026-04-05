import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import CartPanel from "@/components/CartPanel";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { menuItems } from "@/data/menuData";
import { formatPKR } from "@/lib/currency";

const Favorites = () => {
  const { user, loading: authLoading } = useAuth();
  const { addItem } = useCart();
  const navigate = useNavigate();
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) navigate("/");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const { data } = await supabase.from("favorites").select("item_id").eq("user_id", user.id);
      if (data) setFavoriteIds(data.map((f) => f.item_id));
      setLoading(false);
    };
    fetch();
  }, [user]);

  const removeFavorite = async (itemId: string) => {
    if (!user) return;
    await supabase.from("favorites").delete().eq("user_id", user.id).eq("item_id", itemId);
    setFavoriteIds((prev) => prev.filter((id) => id !== itemId));
  };

  const favoriteItems = menuItems.filter((m) => favoriteIds.includes(m.id));

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-16 lg:pb-0">
      <Navigation />
      <div className="pt-28 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
            <h1 className="font-heading font-black text-3xl md:text-4xl text-foreground mb-2">
              Your <span className="text-gradient">Favorites</span>
            </h1>
            <p className="text-muted-foreground">Items you've loved — always just one tap away ❤️</p>
          </motion.div>

          {favoriteItems.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <Heart className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <p className="font-heading font-semibold text-lg">No favorites yet</p>
              <p className="text-sm mt-1">Tap the heart on any menu item to save it here</p>
              <Button onClick={() => navigate("/menu")} className="mt-6 bg-gradient-brand text-primary-foreground rounded-full">
                Browse Menu
              </Button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {favoriteItems.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="bg-card border border-border rounded-xl p-4 group"
                >
                  <div className="relative mb-3">
                    <img src={item.image} alt={item.name} className="w-full h-32 object-contain" />
                    <button
                      onClick={() => removeFavorite(item.id)}
                      className="absolute top-1 right-1 w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center hover:bg-destructive/20 transition-colors"
                    >
                      <Heart className="w-4 h-4 text-destructive fill-destructive" />
                    </button>
                  </div>
                  <h3 className="font-heading font-bold text-sm text-foreground">{item.name}</h3>
                  <p className="text-muted-foreground text-xs mt-1 line-clamp-2">{item.description}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="font-bold text-primary">{formatPKR(item.price)}</span>
                    <Button
                      size="sm"
                      className="rounded-full bg-gradient-brand text-primary-foreground text-xs"
                      onClick={() => addItem({ id: item.id, name: item.name, price: item.price, image: item.image })}
                    >
                      <ShoppingCart className="w-3 h-3 mr-1" /> Add
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
      <CartPanel />
    </div>
  );
};

export default Favorites;
