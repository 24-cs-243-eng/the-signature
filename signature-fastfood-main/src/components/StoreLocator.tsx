import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { MapPin, Clock, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";

const MAPS_LINK = "https://maps.app.goo.gl/jYdDCgGfqaS5qafX8";
const WHATSAPP_LINK = "https://wa.me/923125429037";

const stores = [
  { city: "Ameer Mall", address: "Ameer Mall, Main Location", hours: "10AM - 11PM" },
];

const StoreLocator = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="py-20 bg-card">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-14"
        >
          <h2 className="font-heading font-bold text-4xl md:text-5xl mb-4 text-foreground">
            Find Us <span className="text-gradient">Near You</span>
          </h2>
          <p className="text-muted-foreground text-lg">Great food is closer than you think.</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          <a href={MAPS_LINK} target="_blank" rel="noopener noreferrer" className="block bg-muted rounded-2xl h-80 overflow-hidden border border-border">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3403.123!2d74.123!3d31.123!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzHCsDA3JzIzLjAiTiA3NMKwMDcnMjMuMCJF!5e0!3m2!1sen!2s!4v1234567890"
              width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"
              referrerPolicy="no-referrer-when-downgrade" title="Signature Location"
            />
          </a>

          <div className="space-y-4">
            {stores.map((store, i) => (
              <motion.div
                key={store.city}
                initial={{ opacity: 0, x: 30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: i * 0.15 }}
                className="bg-background rounded-xl border border-border p-5 hover:border-primary/20 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-heading font-bold text-foreground">{store.city}</h3>
                    <p className="text-muted-foreground text-sm mt-1">{store.address}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {store.hours}</span>
                    </div>
                  </div>
                  <a href={MAPS_LINK} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" variant="outline" className="rounded-full border-border hover:bg-muted">
                      <Navigation className="w-4 h-4 mr-1" /> Directions
                    </Button>
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StoreLocator;
