import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { USE_PHP_BACKEND } from "@/lib/config";
import { LogIn, LogOut, ShieldCheck, RefreshCw, Eye, X, CheckCircle, Clock, Truck, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPKR } from "@/lib/currency";
import { toast } from "sonner";

// ─── SIMPLE LOCAL-SESSION ADMIN AUTH ───────────────────────────────────────
const ADMIN_USER = "admin";
const ADMIN_PASS = "signature2024!";
const SESSION_KEY = "sig_admin_session";

type OrderStatus = "pending" | "confirmed" | "preparing" | "delivered" | "cancelled";
type Order = {
  id: string;
  user_id: string | null;
  items: Array<{ name: string; quantity: number; price: number }>;
  total: number;
  status: string;
  address: string | null;
  created_at: string;
};

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; icon: React.ElementType }> = {
  pending:    { label: "Pending",    color: "bg-yellow-100 text-yellow-700 border-yellow-200",  icon: Clock },
  confirmed:  { label: "Confirmed",  color: "bg-blue-100 text-blue-700 border-blue-200",        icon: CheckCircle },
  preparing:  { label: "Preparing",  color: "bg-orange-100 text-orange-700 border-orange-200",  icon: Package },
  delivered:  { label: "Delivered",  color: "bg-green-100 text-green-700 border-green-200",     icon: Truck },
  cancelled:  { label: "Cancelled",  color: "bg-red-100 text-red-700 border-red-200",           icon: X },
};

// ─── LOGIN ──────────────────────────────────────────────────────────────────
const AdminLogin = ({ onLogin }: { onLogin: () => void }) => {
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [err, setErr] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (u === ADMIN_USER && p === ADMIN_PASS) {
      sessionStorage.setItem(SESSION_KEY, "1");
      onLogin();
    } else {
      setErr("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm bg-card border border-border rounded-3xl p-8 shadow-2xl"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
            <ShieldCheck className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-heading font-black text-2xl text-foreground">Admin Panel</h1>
          <p className="text-muted-foreground text-sm mt-1">Signature Fast Food</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            value={u} onChange={(e) => setU(e.target.value)}
            placeholder="Username"
            className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="password"
            value={p} onChange={(e) => setP(e.target.value)}
            placeholder="Password"
            className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {err && <p className="text-destructive text-xs font-heading font-bold">{err}</p>}
          <Button type="submit" className="w-full bg-gradient-brand text-primary-foreground font-heading font-black rounded-full py-5">
            <LogIn className="w-4 h-4 mr-2" /> Sign In
          </Button>
        </form>
      </motion.div>
    </div>
  );
};

// ─── ORDER DETAIL MODAL ─────────────────────────────────────────────────────
const OrderModal = ({ order, onClose, onStatusUpdate }: {
  order: Order;
  onClose: () => void;
  onStatusUpdate: (id: string, status: OrderStatus) => void;
}) => {
  const nextStatuses: OrderStatus[] = ["pending", "confirmed", "preparing", "delivered", "cancelled"];
  const cfg = STATUS_CONFIG[order.status as OrderStatus] ?? STATUS_CONFIG.pending;
  const Icon = cfg.icon;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-card border border-border rounded-3xl p-6 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-heading font-black text-lg text-foreground">Order Detail</h2>
            <p className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleString()}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-muted transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status */}
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold mb-5 ${cfg.color}`}>
          <Icon className="w-3.5 h-3.5" /> {cfg.label}
        </div>

        {/* Items */}
        <div className="bg-muted/40 rounded-2xl p-4 mb-4 space-y-2">
          <p className="font-heading font-bold text-xs text-muted-foreground uppercase tracking-wider mb-2">Items</p>
          {Array.isArray(order.items) && order.items.map((item: { name: string; quantity: number; price: number }, i: number) => (
            <div key={i} className="flex justify-between text-sm">
              <span className="text-foreground/80">{item.name} ×{item.quantity}</span>
              <span className="font-bold text-foreground">{formatPKR(item.price * item.quantity)}</span>
            </div>
          ))}
          <div className="border-t border-border pt-2 mt-2 flex justify-between font-black text-foreground">
            <span>Total</span>
            <span className="text-primary">{formatPKR(order.total)}</span>
          </div>
        </div>

        {/* Address */}
        {order.address && (
          <div className="bg-primary/5 border border-primary/15 rounded-xl p-3 text-sm text-foreground/80 mb-4">
            📍 {order.address}
          </div>
        )}

        {/* Status update */}
        <p className="font-heading font-bold text-xs text-muted-foreground uppercase tracking-wider mb-2">Update Status</p>
        <div className="grid grid-cols-3 gap-2">
          {nextStatuses.map((s) => {
            const c = STATUS_CONFIG[s];
            return (
              <button
                key={s}
                onClick={() => onStatusUpdate(order.id, s)}
                className={`px-3 py-2 rounded-xl border text-xs font-bold transition-all ${
                  order.status === s ? c.color : "border-border text-foreground/60 hover:border-primary/30"
                }`}
              >
                {c.label}
              </button>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─── DASHBOARD ──────────────────────────────────────────────────────────────
const AdminDashboard = ({ onLogout }: { onLogout: () => void }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    if (USE_PHP_BACKEND) {
      try {
        const res = await fetch("/api/get_orders.php");
        const data = await res.json();
        if (data && Array.isArray(data)) setOrders(data);
      } catch (e) {
        toast.error("Failed to fetch orders from PHP backend");
      }
    } else {
      const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
      if (data) setOrders(data as Order[]);
    }
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleStatusUpdate = async (id: string, status: OrderStatus) => {
    if (USE_PHP_BACKEND) {
      try {
        const res = await fetch("/api/update_order.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, status })
        });
        const result = await res.json();
        if (result.status !== "success") throw new Error();
      } catch (e) {
        toast.error("Failed to update status");
        return;
      }
    } else {
      const { error } = await supabase.from("orders").update({ status }).eq("id", id);
      if (error) { toast.error("Failed to update status"); return; }
    }
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status } : o));
    if (selectedOrder?.id === id) setSelectedOrder((o) => o ? { ...o, status } : null);
    toast.success(`Order marked as ${STATUS_CONFIG[status].label}`);
  };

  const filtered = filterStatus === "all" ? orders : orders.filter((o) => o.status === filterStatus);
  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === "pending").length,
    preparing: orders.filter(o => o.status === "preparing").length,
    delivered: orders.filter(o => o.status === "delivered").length,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-heading font-black text-foreground leading-none">Admin Panel</h1>
              <p className="text-xs text-muted-foreground">Signature Fast Food</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={fetchOrders} className="p-2 rounded-full hover:bg-muted transition-colors" title="Refresh">
              <RefreshCw className={`w-4 h-4 text-muted-foreground ${loading ? "animate-spin" : ""}`} />
            </button>
            <button onClick={onLogout} className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-border hover:bg-muted text-xs font-heading font-bold transition-colors">
              <LogOut className="w-3.5 h-3.5" /> Logout
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Total Orders", value: stats.total, color: "text-foreground" },
            { label: "Pending", value: stats.pending, color: "text-yellow-600" },
            { label: "Preparing", value: stats.preparing, color: "text-orange-600" },
            { label: "Delivered", value: stats.delivered, color: "text-green-600" },
          ].map(s => (
            <div key={s.label} className="bg-card border border-border rounded-2xl p-4">
              <p className="text-xs text-muted-foreground font-heading font-bold uppercase tracking-wider">{s.label}</p>
              <p className={`font-heading font-black text-3xl mt-1 ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
          {["all", "pending", "confirmed", "preparing", "delivered", "cancelled"].map((s) => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-heading font-bold uppercase tracking-wider transition-all ${
                filterStatus === s ? "bg-primary text-primary-foreground shadow-md" : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >{s}</button>
          ))}
        </div>

        {/* Orders table */}
        {loading ? (
          <div className="text-center py-20"><RefreshCw className="w-8 h-8 animate-spin text-muted-foreground mx-auto" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Package className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p className="font-heading font-bold">No orders yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((order) => {
              const cfg = STATUS_CONFIG[order.status as OrderStatus] ?? STATUS_CONFIG.pending;
              const Icon = cfg.icon;
              const itemCount = Array.isArray(order.items) ? order.items.reduce((s: number, i: { quantity: number }) => s + i.quantity, 0) : 0;
              return (
                <motion.div
                  key={order.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-card border border-border rounded-2xl p-4 flex items-center gap-4 hover:border-primary/30 transition-colors cursor-pointer"
                  onClick={() => setSelectedOrder(order)}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${cfg.color} shrink-0`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-heading font-bold text-sm text-foreground truncate">{order.user_id ?? "Guest"}</p>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${cfg.color}`}>{cfg.label}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{itemCount} items · {new Date(order.created_at).toLocaleString()}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-heading font-black text-primary">{formatPKR(order.total)}</p>
                    <button className="text-xs text-muted-foreground hover:text-primary flex items-center gap-0.5 mt-1 ml-auto">
                      <Eye className="w-3 h-3" /> View
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedOrder && (
          <OrderModal order={selectedOrder} onClose={() => setSelectedOrder(null)} onStatusUpdate={handleStatusUpdate} />
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── MAIN EXPORT ─────────────────────────────────────────────────────────────
const AdminPage = () => {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(SESSION_KEY) === "1");
  const logout = () => { sessionStorage.removeItem(SESSION_KEY); setAuthed(false); };
  return authed ? <AdminDashboard onLogout={logout} /> : <AdminLogin onLogin={() => setAuthed(true)} />;
};

export default AdminPage;
