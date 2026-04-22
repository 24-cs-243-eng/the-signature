import { useState, useEffect, useRef, ChangeEvent } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings, User, MapPin, Heart, History, X, LogOut,
  ChevronRight, Check, ShoppingCart, Camera, RefreshCw, Phone, Save,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/hooks/useFavorites";
import { menuItems } from "@/data/menuData";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useTheme } from "@/components/ThemeProvider";
import Navigation from "@/components/Navigation";
import BottomNav from "@/components/BottomNav";

type Tab = "general" | "profile" | "location" | "favorites" | "history";

const TABS = [
  { id: "general",   label: "General",       icon: Settings  },
  { id: "profile",   label: "Profile",        icon: User      },
  { id: "location",  label: "Location",       icon: MapPin    },
  { id: "favorites", label: "Favourites",     icon: Heart     },
  { id: "history",   label: "Order History",  icon: History   },
] as const;

export default function AccountSettings() {
  const { user, googleUser, guest, saveGuest, signOut, clearGuest } = useAuth();
  const { theme } = useTheme();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { addItem, setIsCartOpen } = useCart();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<Tab>("general");
  const [showSidebar, setShowSidebar] = useState(false);

  /* ─── Profile Fields ─────────────────────────────────────── */
  const [name, setName]       = useState("");
  const [phone, setPhone]     = useState("");
  const [saved, setSaved]     = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  /* ─── Location ───────────────────────────────────────────── */
  const [locationStr,      setLocationStr]      = useState("Not set");
  const [manualAddress,    setManualAddress]    = useState("");
  const [gettingLocation,  setGettingLocation]  = useState(false);
  const [locationDone,     setLocationDone]     = useState(false);

  // Populate fields once auth resolves
  useEffect(() => {
    const meta = googleUser?.user_metadata;
    setName(meta?.full_name ?? guest?.name ?? "");
    setPhone(meta?.phone ?? guest?.phone ?? "");
    const stored = localStorage.getItem("sig_avatar_preview");
    if (stored) setAvatarPreview(stored);
    const storedAddr = localStorage.getItem("sig_address");
    if (storedAddr) { setLocationStr(storedAddr); setManualAddress(storedAddr); }
  }, [googleUser, guest]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleUser && guest) saveGuest({ name, phone });
    // For Google users, save phone locally
    if (googleUser && phone) localStorage.setItem("sig_phone_override", phone);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setAvatarPreview(result);
      localStorage.setItem("sig_avatar_preview", result);
    };
    reader.readAsDataURL(file);
  };

  const handleGetLocation = () => {
    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const str = `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`;
        setLocationStr(str);
        setManualAddress(str);
        localStorage.setItem("sig_address", str);
        setGettingLocation(false);
        setLocationDone(true);
      },
      () => {
        setLocationStr("Permission denied");
        setGettingLocation(false);
      }
    );
  };

  const handleSaveAddress = () => {
    setLocationStr(manualAddress);
    localStorage.setItem("sig_address", manualAddress);
    setLocationDone(true);
    setTimeout(() => setLocationDone(false), 2000);
  };

  /* ─── Avatar displayed in header ────────────────────────── */
  const displayAvatar = avatarPreview ?? googleUser?.user_metadata?.avatar_url ?? null;
  const displayName   = name || googleUser?.user_metadata?.full_name || guest?.name || "You";
  const firstName     = displayName.split(" ")[0];

  /* ─── Tab content renderer ───────────────────────────────── */
  const renderContent = () => {
    switch (activeTab) {

      /* ── GENERAL ──────────────────────────────────────────── */
      case "general":
        return (
          <div className="space-y-5 max-w-lg">
            <h2 className="text-lg font-black border-b border-border pb-3">General Settings</h2>
            <div className="flex items-center justify-between py-3 border-b border-border/40">
              <div>
                <p className="font-bold text-sm">App Theme</p>
                <p className="text-xs text-muted-foreground">Switch between light and dark look</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-bold text-muted-foreground">{theme}</span>
                <ThemeToggle />
              </div>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-border/40 opacity-50 cursor-not-allowed">
              <div>
                <p className="font-bold text-sm">Language</p>
                <p className="text-xs text-muted-foreground">Auto-detect (System default)</p>
              </div>
              <ChevronRight className="w-4 h-4" />
            </div>
            {(googleUser || guest) && (
              <button
                onClick={() => { googleUser ? signOut() : clearGuest(); }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-destructive/10 text-destructive font-bold text-sm hover:bg-destructive/20 transition-colors mt-4"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            )}
          </div>
        );

      /* ── PROFILE ──────────────────────────────────────────── */
      case "profile":
        return (
          <div className="space-y-5 max-w-lg">
            <h2 className="text-lg font-black border-b border-border pb-3">Your Profile</h2>

            {/* Avatar */}
            <div className="flex flex-col items-center gap-3 py-2">
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-border shadow-md bg-primary/10">
                  {displayAvatar ? (
                    <img src={displayAvatar} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl font-black text-primary">
                      {firstName[0]?.toUpperCase()}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-red-600 text-white shadow-lg flex items-center justify-center hover:bg-red-700 transition-colors"
                >
                  <Camera className="w-4 h-4" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>
              <p className="text-xs text-muted-foreground">Tap the camera to change your photo</p>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              {/* Name */}
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={!!googleUser}
                  placeholder="Your name"
                  className="w-full bg-muted border border-border rounded-xl px-3 py-2.5 text-sm disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {googleUser && (
                  <p className="text-[11px] text-muted-foreground mt-1">Name is managed by your Google account.</p>
                )}
              </div>

              {/* Phone — editable for everyone including Google users */}
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/[^0-9+\-\s]/g, "").slice(0, 15))}
                    placeholder="03XX XXXXXXX"
                    className="w-full bg-muted border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Email — read only */}
              {googleUser?.email && (
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">Email</label>
                  <div className="flex items-center gap-2 bg-muted border border-border rounded-xl px-3 py-2.5">
                    <span className="text-sm text-foreground flex-1 truncate">{googleUser.email}</span>
                    <span className="text-[10px] text-green-500 font-bold flex items-center gap-1">
                      <Check className="w-3 h-3" /> Verified
                    </span>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold text-sm py-3 rounded-xl transition-colors shadow-md"
              >
                {saved ? <><Check className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save Changes</>}
              </button>
            </form>
          </div>
        );

      /* ── LOCATION ─────────────────────────────────────────── */
      case "location":
        return (
          <div className="space-y-5 max-w-lg">
            <h2 className="text-lg font-black border-b border-border pb-3">Delivery Location</h2>
            <p className="text-sm text-muted-foreground">We use this to deliver your order to the right place.</p>

            <button
              onClick={handleGetLocation}
              disabled={gettingLocation}
              className="w-full flex items-center justify-center gap-2 bg-foreground text-background font-bold text-sm py-3 rounded-xl transition-all disabled:opacity-60"
            >
              <MapPin className="w-4 h-4" />
              {gettingLocation ? "Finding your location…" : "Use My Current Location"}
            </button>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground">or enter manually</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase">Your Address</label>
              <textarea
                rows={3}
                value={manualAddress}
                onChange={(e) => setManualAddress(e.target.value)}
                placeholder="House / Flat no., Street, Area, City"
                className="w-full bg-muted border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
              <button
                onClick={handleSaveAddress}
                disabled={!manualAddress.trim()}
                className="w-full flex items-center justify-center gap-2 bg-primary/10 text-primary hover:bg-primary/20 font-bold text-sm py-2.5 rounded-xl transition-colors disabled:opacity-50"
              >
                {locationDone ? <><Check className="w-4 h-4" /> Address Saved!</> : <><Save className="w-4 h-4" /> Save Address</>}
              </button>
            </div>

            {locationStr !== "Not set" && locationStr !== "Permission denied" && (
              <div className="flex items-start gap-2 bg-green-500/10 text-green-600 text-xs rounded-xl p-3 border border-green-500/20">
                <Check className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                <span className="font-medium break-all">{locationStr}</span>
              </div>
            )}
          </div>
        );

      /* ── FAVOURITES ───────────────────────────────────────── */
      case "favorites":
        const favoriteItems = menuItems.filter((p) => isFavorite(p.id));
        return (
          <div className="space-y-5 max-w-lg">
            <h2 className="text-lg font-black border-b border-border pb-3">Your Favourites</h2>
            {favoriteItems.length === 0 ? (
              <div className="py-16 text-center border border-dashed border-border rounded-2xl">
                <Heart className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="font-bold text-sm text-muted-foreground">Nothing here yet</p>
                <p className="text-xs text-muted-foreground mt-1">Tap ❤️ on any menu item to save it here</p>
                <Link to="/menu" className="inline-block mt-4 text-xs font-bold text-primary hover:underline">Browse Menu →</Link>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {favoriteItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 bg-muted p-3 rounded-2xl border border-border/50">
                    <img src={item.image} alt={item.name} className="w-14 h-14 object-contain rounded-xl flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-black text-sm truncate">{item.name}</h4>
                      <p className="text-xs text-muted-foreground line-clamp-1">{item.description}</p>
                      <p className="text-xs font-bold text-primary mt-0.5">Rs. {item.price}</p>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <button
                        onClick={() => { addItem({ id: item.id, name: item.name, price: item.price, image: item.image }); setIsCartOpen(true); }}
                        className="p-2 bg-primary text-primary-foreground rounded-full hover:scale-105 transition-transform"
                        title="Add to cart"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => toggleFavorite(item.id)}
                        className="p-2 bg-destructive/10 text-destructive rounded-full hover:bg-destructive/20 transition-colors"
                        title="Remove favourite"
                      >
                        <Heart className="w-3.5 h-3.5 fill-destructive" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      /* ── ORDER HISTORY ────────────────────────────────────── */
      case "history":
        const pastOrders = [
          { id: "ORD-9281", date: "Today, 1:30 PM",     status: "Delivered", items: [menuItems[0], menuItems[3]].filter(Boolean), total: (menuItems[0]?.price ?? 0) + (menuItems[3]?.price ?? 0) },
          { id: "ORD-8442", date: "Yesterday, 8:15 PM", status: "Delivered", items: [menuItems[1]].filter(Boolean),               total: menuItems[1]?.price ?? 0 },
        ];
        return (
          <div className="space-y-5 max-w-lg">
            <h2 className="text-lg font-black border-b border-border pb-3">Order History</h2>
            {pastOrders.length === 0 ? (
              <div className="py-16 text-center border border-dashed border-border rounded-2xl">
                <History className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="font-bold text-sm text-muted-foreground">No past orders yet</p>
                <Link to="/menu" className="inline-block mt-4 text-xs font-bold text-primary hover:underline">Order Something →</Link>
              </div>
            ) : (
              <div className="space-y-4">
                {pastOrders.map((order) => (
                  <div key={order.id} className="bg-card border border-border rounded-2xl p-4 shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-black text-sm">{order.id}</p>
                        <p className="text-xs text-muted-foreground">{order.date}</p>
                        <span className="inline-block mt-1 text-[10px] font-bold text-green-600 bg-green-500/10 px-2 py-0.5 rounded-full">{order.status}</span>
                      </div>
                      <p className="font-black text-primary text-sm">Rs. {order.total}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">{order.items.map((i) => i.name).join(" • ")}</p>
                    <button
                      onClick={() => { order.items.forEach((item) => addItem({ id: item.id, name: item.name, price: item.price, image: item.image })); setIsCartOpen(true); }}
                      className="w-full flex items-center justify-center gap-2 bg-primary/10 text-primary hover:bg-primary/20 font-bold text-sm py-2.5 rounded-xl transition-colors"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> Reorder This
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

      {/* ── Mobile Tab Bar (bottom scrollable) ── */}
      <div className="lg:hidden fixed bottom-[56px] left-0 right-0 z-40 bg-card/95 backdrop-blur border-t border-border overflow-x-auto scrollbar-hide">
        <div className="flex gap-1 px-3 py-2" style={{ width: "max-content", minWidth: "100%" }}>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? "bg-red-600 text-white shadow-md"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Main layout ── */}
      <div className="flex pt-14 min-h-screen">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 border-r border-border bg-card/50 p-4 sticky top-14 h-[calc(100vh-3.5rem)] shrink-0">
          {/* User summary */}
          <div className="flex items-center gap-3 mb-6 p-3 rounded-xl bg-muted/60 border border-border/50">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center flex-shrink-0">
              {displayAvatar ? (
                <img src={displayAvatar} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="font-black text-lg text-primary">{firstName[0]?.toUpperCase()}</span>
              )}
            </div>
            <div className="min-w-0">
              <p className="font-black text-sm truncate">{firstName}</p>
              <p className="text-xs text-muted-foreground truncate">{googleUser?.email ?? guest?.phone ?? ""}</p>
            </div>
          </div>

          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3 pl-1">Settings</p>
          <nav className="space-y-1 flex-1">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-red-600 text-white"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>

          <button
            onClick={() => { googleUser ? signOut() : clearGuest(); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-destructive hover:bg-destructive/10 transition-colors mt-4"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </aside>

        {/* Content */}
        <main className="flex-1 p-4 lg:p-10 pb-36 lg:pb-16 overflow-auto">
          {/* Mobile user card */}
          <div className="lg:hidden flex items-center gap-3 mb-5 p-3 rounded-2xl bg-card border border-border shadow-sm">
            <div className="w-11 h-11 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center flex-shrink-0">
              {displayAvatar ? (
                <img src={displayAvatar} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="font-black text-xl text-primary">{firstName[0]?.toUpperCase()}</span>
              )}
            </div>
            <div className="min-w-0">
              <p className="font-black text-sm">{displayName}</p>
              <p className="text-xs text-muted-foreground truncate">{googleUser?.email ?? guest?.phone ?? "Guest User"}</p>
            </div>
            {googleUser && (
              <span className="ml-auto text-[10px] text-green-500 font-bold flex items-center gap-1 shrink-0">
                <Check className="w-3 h-3" /> Google
              </span>
            )}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.18 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <BottomNav />
    </div>
  );
}
