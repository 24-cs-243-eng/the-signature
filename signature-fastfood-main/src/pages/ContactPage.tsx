import Navigation from "@/components/Navigation";
import CartPanel from "@/components/CartPanel";
import { motion } from "framer-motion";
import { MapPin, Phone, Clock, Utensils, Truck, ShoppingBag, RotateCcw, ChevronRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { contactInfo } from "@/data/menuData";
import { Link } from "react-router-dom";

// ── Branded social icons ──────────────────────────────────────────────────────
const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="w-5 h-5">
    <defs>
      <linearGradient id="ig-contact-grad" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#f09433" />
        <stop offset="25%" stopColor="#e6683c" />
        <stop offset="50%" stopColor="#dc2743" />
        <stop offset="75%" stopColor="#cc2366" />
        <stop offset="100%" stopColor="#bc1888" />
      </linearGradient>
    </defs>
    <path fill="url(#ig-contact-grad)" d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/>
  </svg>
);

const TikTokIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="w-5 h-5">
    <path fill="#010101" d="M448 209.91a210.06 210.06 0 0 1-122.77-39.25V349.38A162.55 162.55 0 1 1 185 188.31v89.89a74.62 74.62 0 1 0 52.23 71.18V0l88 0a121.18 121.18 0 0 0 1.86 22.17h0A122.18 122.18 0 0 0 381 102.39a121.43 121.43 0 0 0 67 20.14Z"/>
    <path fill="#EE1D52" d="M325.23 170.66a210.06 210.06 0 0 0 122.77 39.25V130.8a122.18 122.18 0 0 1-67-20.14v.01a122.18 122.18 0 0 1-55.77-102.5H237.23v259.07a74.62 74.62 0 1 1-52.23-71.18V107.1A162.55 162.55 0 0 0 185 349.38V188.31a162.55 162.55 0 0 0 140.23-17.65z" opacity="0.9"/>
    <path fill="#69C9D0" d="M448 130.8v79.11a210.06 210.06 0 0 1-122.77-39.25 210.06 210.06 0 0 1-55.77-102.5H237.23v16l-1.86-22.17H325.23A122.18 122.18 0 0 0 381 102.39a121.43 121.43 0 0 0 67 20.14v8.27z" opacity="0.9"/>
  </svg>
);

const ContactPage = () => (
  <div className="min-h-screen bg-background pb-16 lg:pb-0">
    <Navigation />
    <div className="pt-[140px] pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="font-heading font-black text-3xl md:text-5xl text-foreground mb-2">
            Get in <span className="text-gradient">Touch</span>
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">We'd love to hear from you!</p>
        </motion.div>

        {/* Reorder CTA */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <Link to="/orders">
            <div className="relative bg-primary rounded-xl p-6 md:p-8 text-primary-foreground overflow-hidden group cursor-pointer hover:shadow-xl transition-shadow">
              <div className="absolute top-0 right-0 w-40 h-40 bg-primary-foreground/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary-foreground/5 rounded-full translate-y-1/2 -translate-x-1/2" />
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                    <RotateCcw className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="font-heading font-black text-xl md:text-2xl">REORDER</p>
                    <p className="text-primary-foreground/80 text-sm">Get your last meal again instantly</p>
                  </div>
                </div>
                <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Contact cards grid */}
        <div className="grid grid-cols-2 gap-3 md:gap-4 mb-6">
          {[
            { icon: Phone, label: "Call Us",   value: contactInfo.phone,            link: `tel:+923125429037` },
            { icon: MapPin, label: "Find Us",   value: "Ameer Mall, Wah Cantt",       link: "https://maps.app.goo.gl/jYdDCgGfqaS5qafX8" },
            { icon: Clock,  label: "Timings",   value: "12 PM – 12 AM",               link: undefined },
            { icon: MessageCircle, label: "WhatsApp", value: "Chat with us",          link: `https://wa.me/923125429037` },
          ].map((item) => (
            <motion.a
              key={item.label}
              href={item.link || "#"}
              target={item.link ? "_blank" : undefined}
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border rounded-xl p-5 text-center hover:border-primary/30 hover:-translate-y-1 hover:shadow-lg transition-all"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <item.icon className="w-6 h-6 text-primary" />
              </div>
              <p className="font-heading font-bold text-sm text-foreground mb-1">{item.label}</p>
              <p className="text-muted-foreground text-xs leading-tight">{item.value}</p>
            </motion.a>
          ))}
        </div>

        {/* Social Media Row */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-card border border-border rounded-xl p-6 mb-6"
        >
          <p className="font-heading font-bold text-sm text-foreground mb-4 text-center">Follow Us</p>
          <div className="flex items-center justify-center gap-4">
            {/* Instagram */}
            <a
              href={contactInfo.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="flex items-center justify-center w-14 h-14 bg-muted hover:bg-muted/70 border border-border rounded-xl transition-all hover:scale-110 hover:shadow-md"
            >
              <InstagramIcon />
            </a>
            {/* TikTok */}
            <a
              href={contactInfo.tiktokUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="flex items-center justify-center w-14 h-14 bg-muted hover:bg-muted/70 border border-border rounded-xl transition-all hover:scale-110 hover:shadow-md"
            >
              <TikTokIcon />
            </a>
          </div>
        </motion.div>

        {/* Full Address */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-xl p-5 mb-6"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-heading font-bold text-sm text-foreground mb-1">Full Address</p>
              <p className="text-muted-foreground text-xs md:text-sm leading-relaxed">{contactInfo.address}</p>
            </div>
          </div>
        </motion.div>

        {/* Google Maps */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-xl overflow-hidden border border-border mb-6 shadow-sm"
        >
          <iframe
            src="https://maps.google.com/maps?q=Ameer+Mall+New+City+Phase+2+Wah+Cantt&output=embed&z=16"
            width="100%"
            height="220"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="The Signature Location"
            className="w-full"
          />
        </motion.div>

        {/* Service badges */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {[
            { icon: Utensils,    label: "Dining" },
            { icon: ShoppingBag, label: "Takeaway" },
            { icon: Truck,       label: "Home Delivery" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary/10 border border-primary/20 text-primary font-heading font-bold text-xs">
              <Icon className="w-3.5 h-3.5" /> {label}
            </div>
          ))}
        </div>

        {/* WhatsApp CTA */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <Button
            asChild
            size="lg"
            className="bg-gradient-brand text-primary-foreground font-heading font-black uppercase tracking-wider rounded-lg px-10 py-6 shadow-lg text-base"
          >
            <a href={`https://wa.me/923125429037?text=${encodeURIComponent("Hi! I have a question about The Signature Café.")}`} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="w-5 h-5 mr-2" /> Chat on WhatsApp
            </a>
          </Button>
        </motion.div>
      </div>
    </div>
    <CartPanel />
  </div>
);

export default ContactPage;
