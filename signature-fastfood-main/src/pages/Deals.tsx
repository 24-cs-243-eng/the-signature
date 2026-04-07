import Navigation from "@/components/Navigation";
import ComboDeals from "@/components/ComboDeals";
import CartPanel from "@/components/CartPanel";

const DealsPage = () => (
  <div className="min-h-screen bg-background pb-20 lg:pb-0">
    <Navigation />
    <div className="pt-[64px] md:pt-[64px]">
      <ComboDeals />
    </div>
    <CartPanel />
  </div>
);

export default DealsPage;
