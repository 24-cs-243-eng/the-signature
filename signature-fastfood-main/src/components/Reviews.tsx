import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { reviews } from "@/data/menuData";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Reviews = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setCurrent((p) => (p + 1) % reviews.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <section ref={ref} className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-14"
        >
          <h2 className="font-heading font-bold text-4xl md:text-5xl mb-4 text-foreground">
            Real People, <span className="text-gradient">Real Love</span>
          </h2>
          <p className="text-muted-foreground text-lg">Don't take our word for it — hear from our community.</p>
        </motion.div>

        <div className="max-w-2xl mx-auto relative">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="bg-card rounded-2xl border border-border p-8 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-brand text-primary-foreground flex items-center justify-center text-xl font-heading font-bold mx-auto mb-4">
              {reviews[current].avatar}
            </div>
            <div className="flex justify-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-5 h-5 ${i < reviews[current].rating ? 'fill-secondary text-secondary' : 'text-muted-foreground/30'}`} />
              ))}
            </div>
            <p className="text-foreground text-lg mb-4 italic">"{reviews[current].text}"</p>
            <p className="font-heading font-bold text-muted-foreground">{reviews[current].name}</p>
          </motion.div>

          <div className="flex justify-center gap-4 mt-6">
            <Button variant="outline" size="icon" className="rounded-full border-border hover:bg-muted" onClick={() => setCurrent((p) => (p - 1 + reviews.length) % reviews.length)}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="flex gap-2 items-center">
              {reviews.map((_, i) => (
                <button key={i} className={`w-2.5 h-2.5 rounded-full transition-colors ${i === current ? 'bg-primary' : 'bg-border'}`} onClick={() => setCurrent(i)} />
              ))}
            </div>
            <Button variant="outline" size="icon" className="rounded-full border-border hover:bg-muted" onClick={() => setCurrent((p) => (p + 1) % reviews.length)}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Reviews;
