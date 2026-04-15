import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, User, MapPin, Heart, History, X, LogOut, ChevronRight, Check, ShoppingCart } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/hooks/useFavorites";
import { menuItems } from "@/data/menuData";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useTheme } from "@/components/ThemeProvider";
import Navigation from "@/components/Navigation";
import BottomNav from "@/components/BottomNav";

type Tab = "general" | "profile" | "location" | "favorites" | "history";

export default function AccountSettings() {
  const { user, googleUser, guest, saveGuest, signOut, clearGuest } = useAuth();
  const { theme, setTheme } = useTheme();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { addItem, setIsCartOpen } = useCart();
  
  const [activeTab, setActiveTab] = useState<Tab>("general");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(true);

  // Profile Form State
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  
  // Location State
  const [locationStr, setLocationStr] = useState("Not set");
  const [gettingLocation, setGettingLocation] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.user_metadata?.full_name || "");
      setPhone(user.user_metadata?.phone || "");
    }
  }, [user]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleUser && guest) {
      saveGuest({ name, phone });
    }
  };

  const handleGetLocation = () => {
    setGettingLocation(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Placeholder for Google API: for now just setting coordinates
          setLocationStr(`${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`);
          setGettingLocation(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocationStr("Permission denied or unavailable");
          setGettingLocation(false);
        }
      );
    } else {
      setLocationStr("Geolocation not supported");
      setGettingLocation(false);
    }
  };

  const tabs = [
    { id: "general", label: "General", icon: Settings },
    { id: "profile", label: "Profile", icon: User },
    { id: "location", label: "Location", icon: MapPin },
    { id: "favorites", label: "Favorites", icon: Heart },
    { id: "history", label: "Order History", icon: History },
  ] as const;

  const renderContent = () => {
    switch (activeTab) {
      case "general":
        return (
          <div className="space-y-6 max-w-lg">
            <h2 className="text-xl font-heading font-black border-b border-border pb-4">General Settings</h2>
            
            <div className="flex items-center justify-between py-4 border-b border-border/50">
              <div>
                <p className="font-bold text-sm">Theme</p>
                <p className="text-xs text-muted-foreground">Switch between light and dark mode</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm uppercase font-bold text-muted-foreground">{theme}</span>
                <ThemeToggle />
              </div>
            </div>
            
            <div className="flex items-center justify-between py-4 border-b border-border/50 opacity-50 cursor-not-allowed">
              <div>
                <p className="font-bold text-sm">Language</p>
                <p className="text-xs text-muted-foreground">Auto-detect (System)</p>
              </div>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        );

      case "profile":
        return (
          <div className="space-y-6 max-w-lg">
            <h2 className="text-xl font-heading font-black border-b border-border pb-4">Profile</h2>
            
            <div className="flex items-center gap-4 mb-6">
              {googleUser?.user_metadata?.avatar_url ? (
                <img src={googleUser.user_metadata.avatar_url} className="w-16 h-16 rounded-full" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-2xl">
                  {name[0]?.toUpperCase()}
                </div>
              )}
              <div>
                <p className="font-bold">{googleUser ? googleUser.email : "Guest User"}</p>
                {googleUser && <p className="text-xs text-green-500 flex items-center gap-1"><Check className="w-3 h-3"/> Verified via Google</p>}
              </div>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={!!googleUser} // Disable if managed by google
                  className="w-full mt-1 bg-muted border-border rounded-lg px-3 py-2 text-sm disabled:opacity-50"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full mt-1 bg-muted border-border rounded-lg px-3 py-2 text-sm"
                />
              </div>
              
              {!googleUser && (
                <button type="submit" className="bg-primary text-white font-bold text-sm px-4 py-2 rounded-lg">
                  Save Changes
                </button>
              )}
            </form>
          </div>
        );

      case "location":
        return (
          <div className="space-y-6 max-w-lg">
            <h2 className="text-xl font-heading font-black border-b border-border pb-4">Delivery Location</h2>
            
            <div className="bg-muted p-4 rounded-xl">
              <p className="text-sm font-bold mb-1">Current Location</p>
              <p className="text-xs text-muted-foreground mb-4">{locationStr}</p>
              
              <button 
                onClick={handleGetLocation}
                disabled={gettingLocation}
                className="bg-foreground text-background font-bold text-xs px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <MapPin className="w-4 h-4" />
                {gettingLocation ? "Locating..." : "Use Current Location"}
              </button>
            </div>
          </div>
        );

      case "favorites":
        const favoriteItems = menuItems.filter(p => isFavorite(p.id));
        
        return (
          <div className="space-y-6 max-w-lg">
            <h2 className="text-xl font-heading font-black border-b border-border pb-4">Favorites</h2>
            
            {favoriteItems.length === 0 ? (
              <div className="py-10 text-center border border-dashed border-border rounded-xl">
                <Heart className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm font-bold text-muted-foreground">No favorites yet</p>
                <p className="text-xs text-muted-foreground">Items you favorite will appear here.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {favoriteItems.map(item => (
                  <div key={item.id} className="flex items-center gap-4 bg-muted p-3 rounded-xl border border-border/50 shadow-sm relative">
                    <img src={item.image} alt={item.name} className="w-14 h-14 object-contain" />
                    <div className="flex-1">
                      <h4 className="font-heading font-black text-sm">{item.name}</h4>
                      <p className="text-xs text-muted-foreground line-clamp-1">{item.description}</p>
                    </div>
                    <button 
                      onClick={() => toggleFavorite(item.id)}
                      className="p-2 hover:bg-background rounded-full transition-colors"
                    >
                      <Heart className="w-4 h-4 fill-destructive text-destructive" />
                    </button>
                    <button 
                      onClick={() => {
                        addItem({
                          id: item.id,
                          name: item.name,
                          price: item.price,
                          image: item.image,
                        });
                        setIsCartOpen(true);
                      }}
                      className="p-2 bg-primary text-primary-foreground rounded-full hover:scale-105 transition-transform"
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case "history":
        // Simulated Order History for the "Reactive Reorder" functionality
        const pastOrders = [
          { id: "ORD-9281", date: "Today, 1:30 PM", status: "Delivered", items: [menuItems[0], menuItems[3]], total: menuItems[0]?.price + menuItems[3]?.price },
          { id: "ORD-8442", date: "Yesterday, 8:15 PM", status: "Delivered", items: [menuItems[1]], total: menuItems[1]?.price }
        ].filter(o => o.items[0]); // safety check if items don't map

        return (
          <div className="space-y-6 max-w-lg">
            <h2 className="text-xl font-heading font-black border-b border-border pb-4">Order History</h2>
            
            {pastOrders.length === 0 ? (
              <div className="py-10 text-center border border-dashed border-border rounded-xl">
                <History className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm font-bold text-muted-foreground">No past orders</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pastOrders.map(order => (
                  <div key={order.id} className="bg-card border border-border rounded-xl p-4 shadow-sm">
                    <div className="flex justify-between items-center mb-3 border-b border-border/50 pb-2">
                      <div>
                        <p className="font-heading font-black text-sm">{order.id} <span className="font-sans font-normal text-xs text-green-500 ml-2 py-0.5 px-2 bg-green-500/10 rounded-full">{order.status}</span></p>
                        <p className="text-xs text-muted-foreground">{order.date}</p>
                      </div>
                      <p className="font-heading font-black text-primary text-sm">Rs. {order.total}</p>
                    </div>
                    
                    <div className="text-xs text-muted-foreground mb-4">
                      {order.items.map(i => i.name).join(" • ")}
                    </div>
                    
                    <button 
                      onClick={() => {
                        order.items.forEach(item => addItem({ id: item.id, name: item.name, price: item.price, image: item.image }));
                        setIsCartOpen(true);
                      }}
                      className="w-full bg-primary/10 text-primary hover:bg-primary/20 font-bold text-sm py-2 rounded-lg flex justify-center items-center gap-2 transition-colors"
                    >
                      <History className="w-4 h-4" /> REORDER INSTANTLY
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="flex pt-[56px] min-h-[calc(100vh-60px)]">
        
        {/* Sidebar - hidden on mobile unless toggled */}
        <div className={`
          ${isMobileMenuOpen ? 'flex' : 'hidden'} 
          md:flex flex-col w-full md:w-64 border-r border-border bg-card/50 p-4 absolute md:relative z-10 h-full md:h-auto
        `}>
          <div className="md:hidden flex justify-end mb-4">
            <button onClick={() => setIsMobileMenuOpen(false)}>
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
          
          <h1 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4 pl-2">Settings</h1>
          
          <div className="space-y-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as Tab);
                  if (window.innerWidth < 768) setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id 
                    ? "bg-muted text-foreground" 
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="mt-auto pt-8">
            <button 
              onClick={() => {
                if (googleUser) signOut();
                else clearGuest();
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-6 md:p-10 overflow-auto">
          {/* Mobile menu toggle */}
          {!isMobileMenuOpen && (
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden flex items-center gap-2 text-sm font-bold text-muted-foreground mb-6"
            >
              <ChevronRight className="w-4 h-4" /> Show Menu
            </button>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
}
