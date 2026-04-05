import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";

interface Banner {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  price?: number;
  dealId?: string; // map to a menu/deal item
  link: string;
  cta: string;
  objectPosition?: string;
}

const banners: Banner[] = [
  {
    id: "b3",
    image: "/media/banner-explore.png",
    title: "Explore Our Menu",
    subtitle: "Fresh. Hot. Finger Lickin' Good.",
    link: "/menu",
    cta: "Explore Menu",
    objectPosition: "center center",
  },
  {
    id: "b1",
    image: "/media/banner-zinger.png",
    title: "Zinger Combo",
    subtitle: "1 Zinger Burger · 1 Regular Fries · 1 Regular Drink",
    price: 599,
    dealId: "cd2",
    link: "/deals",
    cta: "Order Now",
    objectPosition: "center center",
  },
  {
    id: "b2",
    image: "/media/banner-family.png",
    title: "Family Deals 1",
    subtitle: "4pc Zinger · 4pc Fried Chicken · Regular Fries · 1.5L Drink",
    price: 2290,
    dealId: "cd1",
    link: "/deals",
    cta: "Order Now",
    objectPosition: "center center",
  },
];


const Hero = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { addItem } = useCart();

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    const interval = setInterval(() => emblaApi.scrollNext(), 5500);
    return () => { emblaApi.off("select", onSelect); clearInterval(interval); };
  }, [emblaApi]);

  const handleOrderNow = (banner: Banner) => {
    if (banner.price && banner.dealId) {
      addItem({
        id: banner.dealId,
        name: banner.title,
        price: banner.price,
        image: banner.image,
      });
    }
  };

  return (
    <section className="pt-[90px] md:pt-[64px]">
      {/* Hero Carousel */}
      <div className="relative overflow-hidden">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {banners.map((b, i) => (
              <div key={b.id} className="flex-[0_0_100%] min-w-0">
                {/* Mobile: compact, 220px tall. Desktop: 380px */}
                <div className="relative h-[220px] sm:h-[280px] md:h-[380px] overflow-hidden bg-black">
                  <img
                    src={b.image}
                    alt={b.title}
                    className="w-full h-full object-cover object-center"
                    style={{ objectPosition: b.objectPosition ?? "center" }}
                  />
                  {/* Dark gradient overlay from left */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

                  {/* Text + CTA (left side) */}
                  <motion.div
                    key={`text-${i}-${selectedIndex}`}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 flex flex-col justify-center px-5 md:px-12 max-w-[60%] md:max-w-[50%]"
                  >
                    <h2 className="font-heading font-black text-white text-xl sm:text-2xl md:text-4xl leading-tight mb-1 drop-shadow-lg">
                      {b.title}
                    </h2>
                    <p className="text-white/80 text-[11px] sm:text-sm md:text-base mb-3 leading-snug hidden sm:block">
                      {b.subtitle}
                    </p>
                    {b.price && (
                      <p className="font-heading font-black text-red-400 text-lg sm:text-xl md:text-3xl mb-3">
                        Rs. {b.price.toLocaleString()}
                      </p>
                    )}
                    <div className="flex gap-2">
                      {b.price && b.dealId ? (
                        <button
                          onClick={() => handleOrderNow(b)}
                          className="bg-red-600 hover:bg-red-700 active:scale-95 text-white font-heading font-black text-xs sm:text-sm px-4 sm:px-6 py-2 sm:py-2.5 rounded-full shadow-lg transition-all duration-200 uppercase tracking-wide"
                        >
                          {b.cta}
                        </button>
                      ) : (
                        <Link to={b.link}>
                          <button className="bg-red-600 hover:bg-red-700 active:scale-95 text-white font-heading font-black text-xs sm:text-sm px-4 sm:px-6 py-2 sm:py-2.5 rounded-full shadow-lg transition-all duration-200 uppercase tracking-wide">
                            {b.cta}
                          </button>
                        </Link>
                      )}
                    </div>
                  </motion.div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Arrows */}
        <button
          onClick={scrollPrev}
          aria-label="Previous"
          className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-black/60 transition-all z-10"
        >
          <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
        </button>
        <button
          onClick={scrollNext}
          aria-label="Next"
          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-black/60 transition-all z-10"
        >
          <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => emblaApi?.scrollTo(i)}
              aria-label={`Slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === selectedIndex ? "w-6 bg-white" : "w-1.5 bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>

      {/* REORDER strip */}
      <Link to="/menu">
        <div className="bg-red-600 hover:bg-red-700 text-white text-center font-heading font-black text-sm md:text-base py-3 tracking-widest uppercase cursor-pointer transition-colors">
          Reorder
        </div>
      </Link>
    </section>
  );
};

export default Hero;
