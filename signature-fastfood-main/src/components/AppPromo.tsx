import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Smartphone, MapPin, Clock, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
const signatureLogo = "/media/signature-logo.jpeg";;

const features = [
  { icon: Smartphone, text: "Order in seconds" },
  { icon: MapPin, text: "Live tracking" },
  { icon: Clock, text: "Schedule ahead" },
  { icon: Bell, text: "Deal alerts" },
];

const AppPromo = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="py-20 bg-accent text-accent-foreground overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
          >
            <h2 className="font-heading font-bold text-4xl md:text-5xl mb-4">
              Your Favorite Food, <span className="text-gradient">One Tap Away</span>
            </h2>
            <p className="text-accent-foreground/70 text-lg mb-8">
              Download our app for exclusive deals, real-time tracking & instant reordering.
            </p>
            <div className="grid grid-cols-2 gap-4 mb-8">
              {features.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <f.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-sm font-medium">{f.text}</span>
                </motion.div>
              ))}
            </div>
            <div className="flex gap-3">
              <Button className="bg-card text-card-foreground hover:bg-card/80 font-heading font-semibold rounded-xl px-6 py-5 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-foreground"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12c0-5.523-4.477-10-10-10z"/></svg> 
                App Store
              </Button>
              <Button className="bg-card text-card-foreground hover:bg-card/80 font-heading font-semibold rounded-xl px-6 py-5 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-foreground"><path d="M4 2v20l17-10L4 2z"/></svg>
                Google Play
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            className="flex justify-center"
          >
            <div className="relative w-64 h-[500px] bg-card rounded-[3rem] border-4 border-border shadow-2xl overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-accent-foreground/10 rounded-b-2xl" />
              <div className="p-6 pt-10 h-full flex flex-col">
                <div className="text-center mb-4">
                  <img src={signatureLogo} alt="Signature" className="w-12 h-12 rounded-full object-cover mx-auto mb-2" />
                  <p className="font-heading font-bold text-card-foreground text-sm">Signature</p>
                </div>
                <div className="bg-muted rounded-xl p-3 mb-3 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground"><circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/></svg>
                  <p className="text-xs text-muted-foreground">What are you craving?</p>
                </div>
                <div className="flex gap-2 mb-3 overflow-hidden">
                  {[1, 2, 3, 4].map((e) => (
                    <div key={e} className="flex-shrink-0 w-14 h-14 bg-muted rounded-xl border border-border" />
                  ))}
                </div>
                <div className="flex-1 bg-muted rounded-xl p-3">
                  <p className="text-xs font-heading font-bold text-card-foreground mb-2">Your Order</p>
                  <div className="space-y-2">
                    <div className="bg-card rounded-lg p-2 flex justify-between items-center text-xs">
                      <span>Smash Burger</span>
                      <span className="font-bold text-primary">Rs. 650</span>
                    </div>
                    <div className="bg-card rounded-lg p-2 flex justify-between items-center text-xs">
                      <span>Fries</span>
                      <span className="font-bold text-primary">Rs. 350</span>
                    </div>
                  </div>
                </div>
                <div className="mt-3 bg-gradient-brand rounded-xl p-3 text-center">
                  <p className="text-white text-xs font-bold">Checkout — Rs. 1,000</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AppPromo;
