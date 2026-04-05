import { motion, useInView } from "framer-motion";
import { useRef } from "react";
const fries = "/media/fries.png";;
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { ShoppingCart } from "lucide-react";

const AnimatedFries = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });
  const { addItem } = useCart();

  return (
    <section ref={ref} className="py-20 bg-card overflow-hidden relative">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ x: -60, opacity: 0 }}
            animate={isInView ? { x: 0, opacity: 1 } : {}}
            transition={{ duration: 0.7 }}
            className="text-center md:text-left"
          >
            <h2 className="font-heading font-bold text-4xl md:text-5xl mb-4 text-foreground">
              Crispy Golden <span className="text-gradient">Fries</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-6 max-w-md">
              Cooked to golden perfection — crispy outside, fluffy inside. Add cheese, jalapeños, or our special sauce.
            </p>
            <Button
              className="bg-gradient-brand text-primary-foreground font-heading font-semibold rounded-full px-6"
              onClick={() => addItem({ id: "5", name: "Loaded Signature Fries", price: 350, image: fries })}
            >
              <ShoppingCart className="w-4 h-4 mr-2" /> Add Fries — Rs. 350
            </Button>
          </motion.div>

          <motion.div
            className="flex justify-center relative"
            initial={{ x: 60, opacity: 0 }}
            animate={isInView ? { x: 0, opacity: 1 } : {}}
            transition={{ duration: 0.7 }}
          >
            <motion.img
              src={fries}
              alt="Signature Fries"
              className="w-[280px] md:w-[350px] drop-shadow-2xl"
              animate={isInView ? { y: [0, -10, 0], rotate: [0, 2, -2, 0] } : {}}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              whileHover={{ scale: 1.1, rotate: 5 }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AnimatedFries;
