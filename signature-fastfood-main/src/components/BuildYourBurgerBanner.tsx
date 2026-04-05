import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import BurgerOrderFlow from "@/components/BurgerOrderFlow";
const heroBurger = "/media/hero-burger.png";;

const BuildYourBurgerBanner = () => {
  const [showOrderFlow, setShowOrderFlow] = useState(false);

  return (
    <>
      <section className="py-12 md:py-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="container mx-auto"
        >
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border-2 border-primary/20 p-8 md:p-12">
            {/* Animated glow background */}
            <div className="absolute inset-0 overflow-hidden">
              <motion.div
                className="absolute -top-20 -right-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl"
                animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute -bottom-20 -left-20 w-60 h-60 bg-secondary/10 rounded-full blur-3xl"
                animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>

            <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8">
              {/* Burger image with floating animation */}
              <motion.div
                className="relative flex-shrink-0"
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl scale-75" />
                <img
                  src={heroBurger}
                  alt="Build Your Own Burger"
                  className="relative w-48 md:w-64 drop-shadow-2xl"
                />
                {/* Floating ingredients */}
                <motion.span
                  className="absolute -top-2 -right-2 text-3xl"
                  animate={{ rotate: [0, 20, -10, 0], y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                >
                  🧀
                </motion.span>
                <motion.span
                  className="absolute bottom-4 -left-4 text-2xl"
                  animate={{ rotate: [0, -15, 10, 0], y: [0, -6, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, delay: 1 }}
                >
                  🥓
                </motion.span>
                <motion.span
                  className="absolute top-8 -left-6 text-2xl"
                  animate={{ rotate: [0, 10, -20, 0], y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, delay: 0.2 }}
                >
                  🌶️
                </motion.span>
              </motion.div>

              {/* Text content */}
              <div className="flex-1 text-center lg:text-left">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/20 border border-primary/30 text-primary font-heading font-bold text-sm mb-4"
                >
                  <Sparkles className="w-4 h-4" />
                  CUSTOMIZE IT YOUR WAY
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="font-heading font-black text-3xl md:text-5xl lg:text-6xl text-foreground mb-4 leading-tight"
                >
                  Build Your
                  <br />
                  <span className="text-gradient">Own Burger</span>
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="text-muted-foreground text-base md:text-lg max-w-md mx-auto lg:mx-0 mb-6"
                >
                  Pick your patty, choose your sauce, stack your toppings — create the burger of your dreams in 4 easy steps.
                </motion.p>

                <div className="flex flex-col sm:flex-row items-center gap-3 justify-center lg:justify-start">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                  >
                    <Button
                      size="lg"
                      onClick={() => setShowOrderFlow(true)}
                      className="bg-gradient-brand text-primary-foreground font-heading font-bold text-lg px-8 py-6 rounded-full glow-red hover:opacity-90 transition-opacity group"
                    >
                      Start Building
                      <ChevronRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </motion.div>

                  {/* Steps preview */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 }}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    {["🍔 Patty", "🟡 Sauce", "🧀 Toppings", "✅ Done"].map((step, i) => (
                      <span key={i} className="flex items-center gap-1">
                        {step}
                        {i < 3 && <span className="text-border">→</span>}
                      </span>
                    ))}
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <BurgerOrderFlow isOpen={showOrderFlow} onClose={() => setShowOrderFlow(false)} />
    </>
  );
};

export default BuildYourBurgerBanner;
