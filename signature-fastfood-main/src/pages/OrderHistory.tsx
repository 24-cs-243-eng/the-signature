import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import CartPanel from "@/components/CartPanel";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { ShoppingBag, RefreshCw, Clock, MapPin } from "lucide-react";
import { formatPKR } from "@/lib/currency";
import { Button } from "@/components/ui/button";
import { menuItems } from "@/data/menuData";

interface OrderRow {
  id: string;
  created_at: string;
  items: { id: string; name: string; price: number; quantity: number; image: string }[];
  total: number;
  status: string;
  address?: string;
}

const OrderHistory = () => {
  const { user, loading: authLoading } = useAuth();
  const { addItem } = useCart();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) navigate("/");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    const fetchOrders = async () => {
      const { data } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (data) setOrders(data as unknown as OrderRow[]);
      setLoading(false);
    };
    fetchOrders();
  }, [user]);

  const handleReorder = (order: OrderRow) => {
    order.items.forEach((item) => {
      const menuItem = menuItems.find((m) => m.id === item.id);
      if (menuItem) {
        for (let i = 0; i < item.quantity; i++) {
          addItem({ id: menuItem.id, name: menuItem.name, price: menuItem.price, image: menuItem.image });
        }
      }
    });
  };

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
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
            <h1 className="font-heading font-black text-3xl md:text-4xl text-foreground mb-2">
              Your <span className="text-gradient">Orders</span>
            </h1>
            <p className="text-muted-foreground">All your past orders in one place. Tap reorder to get your favorites again!</p>
          </motion.div>

          {orders.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <ShoppingBag className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <p className="font-heading font-semibold text-lg">No orders yet</p>
              <p className="text-sm mt-1">Your order history will show up here once you place your first order 🍔</p>
              <Button onClick={() => navigate("/menu")} className="mt-6 bg-gradient-brand text-primary-foreground rounded-full">
                Browse Menu
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order, i) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-card border border-border rounded-xl p-5"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(order.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </div>
                      <p className="font-heading font-bold text-foreground mt-1">
                        {formatPKR(order.total)}
                        <span className="ml-2 text-xs font-normal px-2 py-0.5 rounded-full bg-primary/10 text-primary capitalize">{order.status}</span>
                      </p>
                    </div>
                    <Button size="sm" variant="outline" className="rounded-full border-border" onClick={() => handleReorder(order)}>
                      <RefreshCw className="w-3.5 h-3.5 mr-1" /> Reorder
                    </Button>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {order.items.map((item) => `${item.name} x${item.quantity}`).join(" • ")}
                  </div>
                  {order.address && (
                    <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3 text-primary" />
                      <span className="line-clamp-1">{order.address}</span>
                    </div>
                  )}
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

export default OrderHistory;
