import Navigation from "@/components/Navigation";
import CartPanel from "@/components/CartPanel";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import {
  Flame, Star, Users, Award, MapPin, ArrowRight, ChefHat,
  Clock, Heart, Zap, ShieldCheck, Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";

const signatureLogo = "/media/signature-logo.jpeg";

/* ─── DATA ─────────────────────────────────────────────────── */
const promises = [
  { num: "01", icon: ShieldCheck, title: "Never Cheap Out", desc: "Every ingredient is hand-picked. No shortcuts, ever." },
  { num: "02", icon: Flame,       title: "Made Hot, Served Hot", desc: "Your food leaves the kitchen in under 3 minutes." },
  { num: "03", icon: Heart,       title: "Made With Care", desc: "We treat every order like it's going to our own family." },
  { num: "04", icon: Zap,         title: "Bold Over Bland", desc: "If it doesn't hit, it's not making the menu. Period." },
  { num: "05", icon: ChefHat,     title: "Chef-Level Standards", desc: "Fast food doesn't mean bad food. We prove it daily." },
  { num: "06", icon: Sparkles,    title: "Always Improving", desc: "We taste, tweak, and perfect — because good isn't enough." },
];

const chapters = [
  {
    year: "2024",
    label: "Chapter 01",
    title: "The First Flame",
    desc: "Opened at Ameer Mall with 5 menu items, a borrowed griddle, and one stubborn belief: that Lahore deserved better fast food.",
    stat: "5 Items on the Menu",
    color: "from-red-600 to-rose-500",
  },
  {
    year: "2024",
    label: "Chapter 02",
    title: "The Smash Hits",
    desc: "The Smash Burger went viral. Orders flew in overnight. We doubled staff, kept quality, and never looked back.",
    stat: "1,000+ Orders in Months",
    color: "from-orange-600 to-amber-500",
  },
  {
    year: "2025",
    label: "Chapter 03",
    title: "The Expansion",
    desc: "Pizza, wraps, chicken buckets — 34+ items crafted over months of obsessive testing. If it didn't earn its spot, it didn't make the menu.",
    stat: "34+ Menu Items",
    color: "from-red-700 to-red-500",
  },
  {
    year: "2025",
    label: "Chapter 04",
    title: "The Community",
    desc: "Late-night runs, birthday orders, family feasts — we became part of Lahore's food culture. That honour is not lost on us.",
    stat: "15,000+ Customers",
    color: "from-rose-600 to-pink-500",
  },
  {
    year: "Now",
    label: "Chapter 05",
    title: "The Promise",
    desc: "This is just the beginning. Every plate we send out carries our name. And our name means everything.",
    stat: "And Counting…",
    color: "from-red-600 to-rose-600",
  },
];

const stats = [
  { value: "15K+",     label: "Happy Customers", icon: Users },
  { value: "34+",      label: "Menu Items",       icon: Star },
  { value: "< 3 Min",  label: "Avg. Cook Time",   icon: Clock },
  { value: "Est. 2024",label: "Born to Serve",    icon: Award },
];

/* ─── SUB-COMPONENTS ────────────────────────────────────────── */

/** Animated grain overlay for cinematic feel */
const GrainOverlay = () => (
  <svg className="absolute inset-0 w-full h-full opacity-[0.04] pointer-events-none z-10" aria-hidden>
    <filter id="grain">
      <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
      <feColorMatrix type="saturate" values="0" />
    </filter>
    <rect width="100%" height="100%" filter="url(#grain)" />
  </svg>
);

/** Scrolling red marquee strip */
const MarqueeStrip = () => {
  const text = "FRESH INGREDIENTS · BOLD FLAVORS · REAL FAST DELIVERY · SIGNED BY US · ";
  const repeated = text.repeat(6);
  return (
    <div className="relative overflow-hidden bg-primary py-3 select-none">
      <div className="flex whitespace-nowrap animate-marquee">
        <span className="text-white font-heading font-black text-sm tracking-[0.2em] uppercase pr-0">
          {repeated}
        </span>
        <span className="text-white font-heading font-black text-sm tracking-[0.2em] uppercase">
          {repeated}
        </span>
      </div>
    </div>
  );
};

/** Single promise card */
const PromiseCard = ({
  item, index,
}: {
  item: (typeof promises)[0];
  index: number;
}) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.08 }}
      className="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] p-6 transition-all duration-300 hover:border-primary/30"
    >
      {/* Glow blob on hover */}
      <div className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
      <span className="font-heading font-black text-5xl text-white/5 absolute top-4 right-4 leading-none select-none">
        {item.num}
      </span>
      <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
        <item.icon className="w-5 h-5 text-primary" />
      </div>
      <h3 className="font-heading font-black text-base text-white mb-2">{item.title}</h3>
      <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
    </motion.div>
  );
};

/** Horizontal scroll timeline chapter card */
const ChapterCard = ({ item, index }: { item: (typeof chapters)[0]; index: number }) => (
  <motion.div
    initial={{ opacity: 0, x: 40 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ delay: index * 0.1 }}
    className="flex-shrink-0 w-[280px] md:w-[320px] rounded-2xl overflow-hidden border border-white/10 bg-white/[0.03] flex flex-col snap-start"
  >
    <div className={`h-2 w-full bg-gradient-to-r ${item.color}`} />
    <div className="p-6 flex flex-col gap-3 flex-1">
      <div className="flex items-center gap-2">
        <span className="text-xs font-heading font-bold text-white/30 tracking-widest uppercase">
          {item.label}
        </span>
        <span className="ml-auto px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/40 font-heading font-bold text-[10px] tracking-wider">
          {item.year}
        </span>
      </div>
      <h3 className="font-heading font-black text-xl text-white leading-tight">{item.title}</h3>
      <p className="text-white/50 text-sm leading-relaxed flex-1">{item.desc}</p>
      <div className="pt-2 border-t border-white/5">
        <span className={`text-xs font-heading font-black bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}>
          {item.stat}
        </span>
      </div>
    </div>
  </motion.div>
);

/* ─── MAIN PAGE ─────────────────────────────────────────────── */
const AboutPage = () => {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const statsRef = useRef(null);
  const statsInView = useInView(statsRef, { once: true, amount: 0.2 });

  return (
    <div className="min-h-screen bg-[#080808] text-white pb-16 lg:pb-0">
      <Navigation />

      {/* ── HERO ───────────────────────────────────────────────── */}
      <motion.section
        ref={heroRef}
        className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
        style={{ y: heroY, opacity: heroOpacity }}
      >
        {/* Background radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_60%,hsl(349_100%_45%/0.12),transparent)]" />
        {/* Grid lines */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(hsl(0 0% 100% / 0.5) 1px, transparent 1px),
                              linear-gradient(90deg, hsl(0 0% 100% / 0.5) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
        <GrainOverlay />

        <div className="relative z-20 text-center px-6 pt-24">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, type: "spring" }}
            className="mx-auto mb-8 w-20 h-20 rounded-full overflow-hidden border-2 border-white/10 shadow-[0_0_40px_hsl(349_100%_45%/0.3)]"
          >
            <img src={signatureLogo} alt="Signature Logo" className="w-full h-full object-cover" />
          </motion.div>

          {/* Tag line */}
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-block mb-6 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-heading font-bold tracking-[0.2em] uppercase"
          >
            Est. 2024 · Lahore, Pakistan
          </motion.span>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="font-heading font-black text-[clamp(2.8rem,10vw,7rem)] leading-[0.9] tracking-tighter text-white mb-6"
          >
            THIS IS<br />
            <span className="text-gradient">SIGNATURE.</span>
          </motion.h1>

          {/* Sub-text */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-white/50 text-base md:text-lg max-w-lg mx-auto leading-relaxed mb-12"
          >
            We didn't open a restaurant. We started a movement — one smash burger, one hot wing, one late night order at a time.
          </motion.p>

          {/* Scroll cue */}
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="flex flex-col items-center gap-2 text-white/25"
          >
            <span className="text-[10px] font-heading tracking-[0.3em] uppercase">Scroll</span>
            <div className="w-px h-12 bg-gradient-to-b from-white/20 to-transparent" />
          </motion.div>
        </div>
      </motion.section>

      {/* ── MARQUEE STRIP ──────────────────────────────────────── */}
      <MarqueeStrip />

      {/* ── ORIGIN STORY ───────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Left — giant year stamp */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              className="relative"
            >
              <div className="font-heading font-black text-[10rem] md:text-[14rem] leading-none text-white/[0.04] select-none absolute -top-8 -left-4">
                2024
              </div>
              <div className="relative z-10">
                <span className="text-xs font-heading font-bold text-primary tracking-[0.3em] uppercase block mb-4">
                  Where It Started
                </span>
                <h2 className="font-heading font-black text-4xl md:text-5xl text-white leading-tight mb-2">
                  A Kitchen.<br />
                  A Dream.<br />
                  <span className="text-gradient">Ameer Mall.</span>
                </h2>
              </div>
            </motion.div>

            {/* Right — story text */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: 0.15 }}
              className="space-y-6"
            >
              <p className="text-white/60 text-base leading-relaxed">
                We started with 5 items, zero investors, and one seriously stubborn belief: that the people of Lahore deserved fast food that actually tasted like someone cared.
              </p>
              <p className="text-white/60 text-base leading-relaxed">
                No frozen patties. No reheated anything. Just real ingredients, real heat, and real effort — served in under 3 minutes.
              </p>
              {/* Pull quote */}
              <blockquote className="border-l-2 border-primary pl-5 py-1">
                <p className="text-white font-heading font-black text-xl md:text-2xl leading-snug">
                  "If your name is on it, make sure it's worth remembering."
                </p>
                <cite className="text-white/30 text-xs font-heading tracking-widest uppercase block mt-2">
                  — The Signature Team
                </cite>
              </blockquote>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── STATS ──────────────────────────────────────────────── */}
      <section ref={statsRef} className="py-16 px-6 border-y border-white/5 bg-white/[0.01]">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5 rounded-2xl overflow-hidden">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                animate={statsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1 }}
                className="bg-[#0d0d0d] flex flex-col items-center justify-center py-10 px-4 text-center group hover:bg-white/[0.03] transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <s.icon className="w-5 h-5 text-primary" />
                </div>
                <p className="font-heading font-black text-3xl md:text-4xl text-white mb-1">{s.value}</p>
                <p className="text-white/30 text-xs font-heading tracking-widest uppercase">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── THE PROMISE ────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <span className="text-xs font-heading font-bold text-primary tracking-[0.3em] uppercase block mb-3">
              How We Do Things
            </span>
            <h2 className="font-heading font-black text-4xl md:text-5xl text-white">
              Our Six<br />
              <span className="text-gradient">Unbreakable Rules.</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {promises.map((item, i) => (
              <PromiseCard key={item.num} item={item} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── HORIZONTAL TIMELINE ────────────────────────────────── */}
      <section className="py-24 border-t border-white/5">
        <div className="container mx-auto max-w-5xl px-6 mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-xs font-heading font-bold text-primary tracking-[0.3em] uppercase block mb-3">
              The Journey
            </span>
            <h2 className="font-heading font-black text-4xl md:text-5xl text-white">
              Five Chapters.<br />
              <span className="text-gradient">One Story.</span>
            </h2>
          </motion.div>
        </div>

        {/* Horizontal scroll container */}
        <div className="overflow-x-auto scrollbar-hide pl-6 md:pl-[max(1.5rem,calc((100vw-64rem)/2))]">
          <div className="flex gap-4 pb-6 snap-x snap-mandatory" style={{ width: "max-content" }}>
            {chapters.map((ch, i) => (
              <ChapterCard key={i} item={ch} index={i} />
            ))}
            {/* Spacer at end */}
            <div className="flex-shrink-0 w-6" />
          </div>
        </div>
      </section>

      {/* ── LOCATION CARD ──────────────────────────────────────── */}
      <section className="py-16 px-6 border-t border-white/5">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center gap-8"
          >
            {/* Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

            <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-8 h-8 text-primary" />
            </div>

            <div className="flex-1">
              <span className="text-xs font-heading font-bold text-primary tracking-[0.3em] uppercase block mb-2">
                Come Find Us
              </span>
              <h3 className="font-heading font-black text-2xl md:text-3xl text-white mb-1">
                Ameer Mall, Lahore
              </h3>
              <p className="text-white/40 text-sm leading-relaxed max-w-sm">
                Walk in, call in, or order online — we're here when the craving hits.
              </p>
            </div>

            <Link
              to="/menu"
              className="flex-shrink-0 flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-heading font-black text-sm px-6 py-3 rounded-xl transition-colors group"
            >
              See the Menu
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── END CTA ────────────────────────────────────────────── */}
      <section className="py-24 px-6 text-center">
        <div className="container mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {/* Divider stamp */}
            <div className="inline-flex items-center gap-4 mb-10">
              <div className="h-px w-16 bg-white/10" />
              <img src={signatureLogo} alt="" className="w-8 h-8 rounded-full object-cover opacity-40" />
              <div className="h-px w-16 bg-white/10" />
            </div>

            <h2 className="font-heading font-black text-[clamp(2.5rem,8vw,6rem)] leading-[0.9] tracking-tighter text-white mb-6">
              Now You Know<br />
              <span className="text-gradient">The Story.</span>
            </h2>
            <p className="text-white/40 text-base md:text-lg max-w-md mx-auto mb-10 leading-relaxed">
              Come taste what all the passion is about. The menu is waiting — and so is the best meal of your week.
            </p>

            <Link
              to="/menu"
              className="inline-flex items-center gap-3 bg-primary hover:bg-primary/90 text-white font-heading font-black text-base px-10 py-4 rounded-2xl shadow-[0_0_40px_hsl(349_100%_45%/0.35)] hover:shadow-[0_0_60px_hsl(349_100%_45%/0.5)] transition-all group"
            >
              Order Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      <CartPanel />
    </div>
  );
};

export default AboutPage;
