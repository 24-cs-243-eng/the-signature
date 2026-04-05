import Navigation from "@/components/Navigation";
import CartPanel from "@/components/CartPanel";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
const signatureLogo = "/media/signature-logo.jpeg";;
import { Heart, Flame, Users, Award, Clock, Star, MapPin } from "lucide-react";

const timelineEvents = [
  { year: "2024", title: "The Beginning", desc: "Opened our first kitchen at Ameer Mall with 5 items and a big dream.", icon: Flame, stat: "5 Menu Items" },
  { year: "2024", title: "Going Viral", desc: "Our Smash Burger took off. 1,000+ orders in the first months.", icon: Star, stat: "1,000+ Orders" },
  { year: "2025", title: "Menu Expansion", desc: "Pizza, wraps, chicken buckets — 34+ items crafted with obsessive care.", icon: Award, stat: "34+ Items" },
  { year: "2025", title: "Community Love", desc: "Family dinners, celebrations, late-night cravings — we became part of the culture.", icon: Users, stat: "15K+ Customers" },
  { year: "Now", title: "The Promise", desc: "Fresh, fast, made with care. This is just the beginning. ❤️", icon: Heart, stat: "And Counting..." },
];

const stats = [
  { value: "15K+", label: "Happy Customers", icon: Users },
  { value: "34+", label: "Menu Items", icon: Star },
  { value: "Est. 2024", label: "Born to Serve", icon: Flame },
];

const AboutPage = () => {
  const timelineRef = useRef(null);
  const timelineInView = useInView(timelineRef, { once: true, amount: 0.1 });
  const statsRef = useRef(null);
  const statsInView = useInView(statsRef, { once: true, amount: 0.3 });

  return (
    <div className="min-h-screen bg-background pb-16 lg:pb-0">
      <Navigation />

      {/* Hero — compact */}
      <div className="pt-[140px] pb-10 text-center px-4">
        <motion.img
          src={signatureLogo}
          alt="Signature"
          className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover mx-auto mb-4 border-2 border-primary/30 shadow-md"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
        />
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-heading font-black text-3xl md:text-5xl text-foreground mb-2"
        >
          Our <span className="text-gradient">Story</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground text-sm md:text-base max-w-md mx-auto"
        >
          More than food — it's a feeling.
        </motion.p>
      </div>

      {/* Stats — compact row */}
      <section ref={statsRef} className="pb-10 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-3 gap-2 md:gap-4 max-w-xl mx-auto">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                animate={statsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1 }}
                className="bg-card border border-border rounded-xl p-3 md:p-5 text-center"
              >
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-1.5">
                  <s.icon className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                </div>
                <p className="font-heading font-black text-lg md:text-2xl text-primary">{s.value}</p>
                <p className="text-muted-foreground text-[10px] md:text-xs font-heading">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline — mobile-first vertical */}
      <section ref={timelineRef} className="py-10 md:py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={timelineInView ? { opacity: 1, y: 0 } : {}}
            className="text-center mb-8"
          >
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary font-heading font-bold text-xs mb-3">
              📖 The Journey
            </span>
            <h2 className="font-heading font-black text-2xl md:text-4xl text-foreground">
              How It <span className="text-gradient">Started</span>
            </h2>
          </motion.div>

          {/* Simple vertical timeline */}
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-5 md:left-6 top-0 bottom-0 w-0.5 bg-border" />

            <div className="space-y-4 md:space-y-6">
              {timelineEvents.map((event, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -15 }}
                  animate={timelineInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: i * 0.1 }}
                  className="relative flex gap-3 md:gap-4"
                >
                  {/* Dot */}
                  <div className="relative z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-brand flex items-center justify-center flex-shrink-0 shadow-sm border-2 border-background">
                    <event.icon className="w-4 h-4 md:w-5 md:h-5 text-primary-foreground" />
                  </div>
                  {/* Card */}
                  <div className="flex-1 bg-card border border-border rounded-xl p-3 md:p-4 hover:border-primary/20 transition-colors">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-heading font-bold text-[10px] md:text-xs">{event.year}</span>
                      <span className="text-muted-foreground text-[10px] md:text-xs">{event.stat}</span>
                    </div>
                    <h3 className="font-heading font-black text-sm md:text-base text-foreground mb-0.5">{event.title}</h3>
                    <p className="text-muted-foreground text-xs md:text-sm leading-relaxed">{event.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CartPanel />
    </div>
  );
};

export default AboutPage;
