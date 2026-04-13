import { useState } from "react";
import Navigation from "@/components/Navigation";
import MenuCategories from "@/components/MenuCategories";
import SearchBar from "@/components/SearchBar";
import FullMenu from "@/components/FullMenu";
import PizzaSection from "@/components/PizzaSection";
import ComboDeals from "@/components/ComboDeals";
import SignatureItems from "@/components/SignatureItems";
import CartPanel from "@/components/CartPanel";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { menuItems } from "@/data/menuData";

const MenuHero = () => (
  <section className="relative h-[50vh] md:h-[55vh] overflow-hidden flex items-center justify-center bg-background">
    {/* Video Background */}
    <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/media/menu-video.mp4" type="video/mp4" />
      </video>
      {/* Light-mode friendly overlay: dark but not opaque */}
      <div className="absolute inset-0 bg-black/55 z-10" />
      {/* Bottom fade to page background */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
    </div>

    <div className="relative z-20 text-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <span className="inline-block px-4 py-1.5 rounded-md bg-white/10 border border-white/20 text-white font-heading font-semibold text-sm mb-6 uppercase tracking-wider backdrop-blur-md">
          Fresh • Fast • Flavorful
        </span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.15 }}
        className="font-heading font-black text-5xl md:text-7xl lg:text-8xl text-white mb-4 leading-tight drop-shadow-2xl"
      >
        Our <span className="text-red-500">Menu</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="text-white/80 text-lg md:text-xl max-w-lg mx-auto mb-8 drop-shadow-lg font-medium"
      >
        Explore everything we serve — crafted with love, served with a smile.
      </motion.p>

      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        className="text-white/50"
      >
        <ChevronDown className="w-6 h-6 mx-auto" />
      </motion.div>
    </div>
  </section>
);

const MenuPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Count search results
  const searchResultCount = searchQuery
    ? menuItems.filter((item) => {
        const q = searchQuery.toLowerCase();
        return (
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q)
        );
      }).length
    : 0;

  return (
    <div className="min-h-screen bg-background pb-16 lg:pb-0">
      <Navigation />
      <div className="pt-[140px]">
        <MenuHero />
      </div>

      {/* Sticky Search Bar */}
      <div className="sticky top-[100px] z-30 bg-background/95 backdrop-blur-md border-b border-border py-4">
        <SearchBar
          query={searchQuery}
          onSearch={setSearchQuery}
          resultCount={searchResultCount}
        />
      </div>

      {/* Category nav + full menu grid (hidden when searching) */}
      {searchQuery ? (
        <FullMenu searchQuery={searchQuery} />
      ) : (
        <>
          <MenuCategories />
          <SignatureItems />
          <PizzaSection />
          <FullMenu />
          <ComboDeals />
        </>
      )}

      <CartPanel />
    </div>
  );
};

export default MenuPage;
