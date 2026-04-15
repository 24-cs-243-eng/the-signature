import Navigation from "@/components/Navigation";
import CreateYourDeal from "@/components/CreateYourDeal";
import CartPanel from "@/components/CartPanel";

const CustomDealPage = () => {
  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
      <Navigation />
      <div className="pt-[56px]">
        <CreateYourDeal />
      </div>
      <CartPanel />
    </div>
  );
};

export default CustomDealPage;
