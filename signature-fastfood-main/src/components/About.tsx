import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Flame, Clock, MapPin, Users, Star, Heart } from "lucide-react";
const signatureLogo = "/media/signature-logo.jpeg";;

const stats = [
  { icon: Flame, value: "500+", label: "Items Served Daily" },
  { icon: Users, value: "50K+", label: "Happy Customers" },
  { icon: Star, value: "4.8", label: "Average Rating" },
  { icon: MapPin, value: "3", label: "Locations" },
];

const values = [
  { icon: Flame, title: "Fresh Ingredients", desc: "Sourced daily from trusted local suppliers" },
  { icon: Clock, title: "Fast Service", desc: "Ready in minutes, never compromising quality" },
  { icon: Heart, title: "Made with Love", desc: "Every meal prepared with passion & care" },
];

const About = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} id="about" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-10 md:mb-14"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-heading font-bold text-xs uppercase tracking-wider mb-4">
            <Flame className="w-3.5 h-3.5" /> Our Story
          </span>
          <h2 className="font-heading font-black text-3xl md:text-5xl text-foreground mb-3">
            About <span className="text-gradient">Signature</span>
          </h2>
          <p className="text-muted-foreground text-sm md:text-base max-w-xl mx-auto">
            Born from a love for bold flavors and fast service — we're redefining fast food in Pakistan.
          </p>
        </motion.div>

        {/* Main content — compact grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 max-w-5xl mx-auto mb-10 md:mb-14">
          {/* Left — Brand story */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="flex flex-col gap-4"
          >
            <div className="flex items-center gap-3">
              <img src={signatureLogo} alt="Signature" className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/20" />
              <div>
                <h3 className="font-heading font-black text-lg text-foreground">Signature Fast Food</h3>
                <p className="text-xs text-primary font-heading font-bold uppercase tracking-wider">Est. 2020 • Islamabad</p>
              </div>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              What started as a small kitchen with big dreams is now one of the most loved fast food brands in Islamabad.
              We believe everyone deserves restaurant-quality burgers, crispy fried chicken, and loaded pizzas — served fast and priced right.
            </p>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Our signature recipes use premium ingredients, house-made sauces, and time-tested techniques that keep customers coming back for more.
            </p>
          </motion.div>

          {/* Right — Values */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="space-y-3"
          >
            {values.map((v, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-muted/50 border border-border/50">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <v.icon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-sm text-foreground">{v.title}</h4>
                  <p className="text-muted-foreground text-xs">{v.desc}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-4xl mx-auto"
        >
          {stats.map((stat, i) => (
            <div key={i} className="text-center p-4 md:p-5 rounded-2xl bg-card border border-border shadow-sm">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                <stat.icon className="w-5 h-5 text-primary" />
              </div>
              <p className="font-heading font-black text-2xl md:text-3xl text-foreground">{stat.value}</p>
              <p className="text-muted-foreground text-xs font-heading font-medium">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default About;
