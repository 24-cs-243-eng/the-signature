import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import MenuCategories from "@/components/MenuCategories";
import SignatureItems from "@/components/SignatureItems";
import CartPanel from "@/components/CartPanel";

const Index = () => {
  return (
    <div className="min-h-screen bg-background pb-16 lg:pb-0">
      <Navigation />
      <Hero />
      <MenuCategories />
      <SignatureItems />
      <CartPanel />
    </div>
  );
};

export default Index;
