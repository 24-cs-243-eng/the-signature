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
    else if (location.hash === "") {
      // no change on empty hash
    }
  }, [location.hash]);

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
      <Navigation />
      <div className="pt-[56px]">

        {/* Tab switcher */}
        <div className="sticky top-[56px] z-30 bg-white dark:bg-black border-b border-gray-200 dark:border-white/10 shadow-sm">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-1 py-2">
              <button
                id="tab-combo-deals"
                onClick={() => setActiveTab("combo")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-heading font-black text-xs uppercase tracking-wide transition-all ${
                  activeTab === "combo"
                    ? "bg-red-600 text-white shadow"
                    : "text-gray-500 dark:text-white/50 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10"
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
                    ? "bg-red-600 text-white shadow"
                    : "text-gray-500 dark:text-white/50 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10"
                }`}
              >
                <Wand2 className="w-3.5 h-3.5" />
                Custom Deal
              </button>
            </div>
          </div>
        </div>

        {activeTab === "combo" ? <ComboDeals /> : <CreateYourDeal />}
      </div>
      <CartPanel />
    </div>
  );
};

export default DealsPage;
