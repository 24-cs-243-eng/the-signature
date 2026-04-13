import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navigation from "@/components/Navigation";
import ComboDeals from "@/components/ComboDeals";
import CreateYourDeal from "@/components/CreateYourDeal";
import CartPanel from "@/components/CartPanel";
import { Tag, Wand2 } from "lucide-react";

const DealsPage = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<"combo" | "build">(
    location.hash === "#custom" ? "build" : "combo"
  );

  useEffect(() => {
    if (location.hash === "#custom") setActiveTab("build");
    else if (location.hash === "#combo" || location.pathname === "/deals") {
      // Don't auto reset if they manually switched tabs, just listen to hash changes
      if (location.hash === "") return; 
      setActiveTab("combo");
    }
  }, [location.hash]);

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
      <Navigation />
      <div className="pt-[64px]">

        {/* ── Tab switcher ── */}
        <div className="sticky top-[64px] z-30 bg-background/95 backdrop-blur-md border-b border-white/10 shadow-sm">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-1 py-2">
              <button
                id="tab-combo-deals"
                onClick={() => setActiveTab("combo")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-heading font-black text-xs uppercase tracking-wide transition-all ${
                  activeTab === "combo"
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <Tag className="w-3.5 h-3.5" />
                Combo Deals
              </button>
              <button
                id="tab-pick-and-save"
                onClick={() => setActiveTab("build")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-heading font-black text-xs uppercase tracking-wide transition-all ${
                  activeTab === "build"
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <Wand2 className="w-3.5 h-3.5" />
                🔥 Custom Deals
              </button>
            </div>
          </div>
        </div>

        {/* ── Tab content ── */}
        {activeTab === "combo" ? <ComboDeals /> : <CreateYourDeal />}
      </div>
      <CartPanel />
    </div>
  );
};

export default DealsPage;
