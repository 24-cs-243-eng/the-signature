import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { MapPin, Plus, Trash2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Address {
  id: string;
  label: string;
  address: string;
  is_default: boolean;
}

const SavedAddresses = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [label, setLabel] = useState("Home");
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (!authLoading && !user) navigate("/");
  }, [user, authLoading, navigate]);

  const fetchAddresses = async () => {
    if (!user) return;
    const { data } = await supabase.from("saved_addresses").select("*").eq("user_id", user.id).order("created_at");
    if (data) setAddresses(data as Address[]);
    setLoading(false);
  };

  useEffect(() => { fetchAddresses(); }, [user]);

  const handleAdd = async () => {
    if (!user || !address.trim()) return;
    await supabase.from("saved_addresses").insert({ user_id: user.id, label, address, is_default: addresses.length === 0 });
    setAddress(""); setLabel("Home"); setShowForm(false);
    toast.success("Address saved!");
    fetchAddresses();
  };

  const handleDelete = async (id: string) => {
    await supabase.from("saved_addresses").delete().eq("id", id);
    toast.success("Address removed");
    fetchAddresses();
  };

  const handleSetDefault = async (id: string) => {
    if (!user) return;
    await supabase.from("saved_addresses").update({ is_default: false }).eq("user_id", user.id);
    await supabase.from("saved_addresses").update({ is_default: true }).eq("id", id);
    toast.success("Default address updated");
    fetchAddresses();
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
        <div className="container mx-auto px-4 max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
            <h1 className="font-heading font-black text-3xl md:text-4xl text-foreground mb-2">
              Saved <span className="text-gradient">Addresses</span>
            </h1>
            <p className="text-muted-foreground">Your delivery spots — saved for faster checkout 📍</p>
          </motion.div>

          <div className="space-y-3 mb-6">
            {addresses.map((addr) => (
              <div key={addr.id} className="bg-card border border-border rounded-xl p-4 flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-heading font-bold text-sm text-foreground flex items-center gap-2">
                      {addr.label}
                      {addr.is_default && <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Default</span>}
                    </p>
                    <p className="text-muted-foreground text-sm mt-0.5">{addr.address}</p>
                  </div>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  {!addr.is_default && (
                    <Button size="icon" variant="ghost" onClick={() => handleSetDefault(addr.id)} className="w-8 h-8 text-muted-foreground hover:text-primary">
                      <Star className="w-4 h-4" />
                    </Button>
                  )}
                  <Button size="icon" variant="ghost" onClick={() => handleDelete(addr.id)} className="w-8 h-8 text-muted-foreground hover:text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {showForm ? (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-xl p-5 space-y-3">
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Label</label>
                <select value={label} onChange={(e) => setLabel(e.target.value)} className="w-full bg-input rounded-lg px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                  <option>Home</option>
                  <option>Work</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Full Address</label>
                <input value={address} onChange={(e) => setAddress(e.target.value)} className="w-full bg-input rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Enter your delivery address" />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAdd} className="bg-gradient-brand text-primary-foreground rounded-full flex-1">Save Address</Button>
                <Button variant="outline" onClick={() => setShowForm(false)} className="rounded-full border-border">Cancel</Button>
              </div>
            </motion.div>
          ) : (
            <Button onClick={() => setShowForm(true)} variant="outline" className="w-full border-dashed border-border rounded-xl py-6 text-muted-foreground hover:text-foreground hover:border-primary/30">
              <Plus className="w-4 h-4 mr-2" /> Add New Address
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SavedAddresses;
