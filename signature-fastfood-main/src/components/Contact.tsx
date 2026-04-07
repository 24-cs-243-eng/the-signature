import { contactInfo } from "@/data/menuData";
import { Phone, MapPin, Instagram, Utensils, Truck, ShoppingBag, MessageCircle } from "lucide-react";

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05A6.34 6.34 0 003.15 15.3a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.69a8.18 8.18 0 004.79 1.53V6.77a4.85 4.85 0 01-1.03-.08z"/>
  </svg>
);

const Contact = () => {
  return (
    <section id="contact" className="py-12 md:py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">

          {/* Header */}
          <div className="text-center mb-8 md:mb-12">
            <h2 className="font-heading font-black text-3xl md:text-5xl text-foreground mb-2">
              Visit <span className="text-gradient">Us</span>
            </h2>
            <p className="text-muted-foreground text-base md:text-lg">{contactInfo.tagline}</p>
          </div>

          {/* Contact Cards — stacked on mobile, grid on desktop */}
          <div className="flex flex-col gap-4 md:grid md:grid-cols-3 md:gap-6">

            {/* Call Us */}
            <a href="tel:+923125429037"
              className="flex items-center gap-4 md:flex-col md:items-center md:text-center bg-card rounded-2xl border border-border p-5 hover:border-primary/40 hover:shadow-lg transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors md:mx-auto">
                <Phone className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-foreground text-sm md:text-base mb-0.5">Call Us</h3>
                <p className="text-primary text-sm font-bold">{contactInfo.phone}</p>
              </div>
            </a>

            {/* WhatsApp */}
            <a
              href={`https://wa.me/${contactInfo.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 md:flex-col md:items-center md:text-center bg-card rounded-2xl border border-border p-5 hover:border-green-500/40 hover:shadow-lg transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0 group-hover:bg-green-500/20 transition-colors md:mx-auto">
                <MessageCircle className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-foreground text-sm md:text-base mb-0.5">WhatsApp</h3>
                <p className="text-green-500 text-sm font-bold">{contactInfo.phone}</p>
              </div>
            </a>

            {/* Find Us */}
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(contactInfo.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 md:flex-col md:items-center md:text-center bg-card rounded-2xl border border-border p-5 hover:border-primary/40 hover:shadow-lg transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors md:mx-auto">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-foreground text-sm md:text-base mb-0.5">Find Us</h3>
                <address className="text-muted-foreground text-xs not-italic leading-relaxed md:text-sm">
                  {contactInfo.address}
                </address>
              </div>
            </a>
          </div>

          {/* Social Media Row */}
          <div className="flex gap-3 mt-6 justify-center">
            <a
              href={contactInfo.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-tr from-purple-600 via-pink-500 to-orange-400 text-white font-heading font-bold text-sm shadow-lg hover:shadow-xl hover:scale-105 transition-all"
            >
              <Instagram className="w-4 h-4" />
              <span className="hidden sm:inline">Instagram</span>
              <span>{contactInfo.instagram}</span>
            </a>
            <a
              href={contactInfo.tiktokUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-card border border-border text-foreground font-heading font-bold text-sm shadow-lg hover:shadow-xl hover:border-primary/30 hover:scale-105 transition-all"
            >
              <TikTokIcon />
              <span className="hidden sm:inline">TikTok</span>
              <span>{contactInfo.tiktok}</span>
            </a>
          </div>

          {/* Services */}
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {[
              { icon: Utensils, label: "Dining" },
              { icon: ShoppingBag, label: "Takeaway" },
              { icon: Truck, label: "Home Delivery" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-heading font-semibold text-sm">
                <Icon className="w-4 h-4" /> {label}
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default Contact;
