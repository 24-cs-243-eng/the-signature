import Navigation from "@/components/Navigation";
import ComboDeals from "@/components/ComboDeals";
import CartPanel from "@/components/CartPanel";

const DealsPage = () => (
  <div className="min-h-screen bg-background pb-16 lg:pb-0">
    <Navigation />
    <div className="pt-[140px] px-4 text-center">
      <h1 className="font-heading font-black text-4xl md:text-5xl text-foreground mb-2">
        Hot <span className="text-gradient">Deals</span>
      </h1>
      <p className="text-muted-foreground text-lg">Limited-time offers you don't want to miss</p>
    </div>
    <ComboDeals />
    <CartPanel />
  </div>
);

export default DealsPage;
