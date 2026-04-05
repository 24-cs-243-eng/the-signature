import { contactInfo } from "@/data/menuData";
import { Phone, MapPin, Instagram, Utensils, Truck, ShoppingBag } from "lucide-react";

const Contact = () => {
  return (
    <section id="contact" className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-heading font-black text-4xl md:text-5xl text-foreground mb-3">
              Visit <span className="text-gradient">Us</span>
            </h2>
            <p className="text-muted-foreground text-lg">{contactInfo.tagline}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-card rounded-2xl border border-border p-6 text-center hover:border-primary/30 transition-colors">
              <Phone className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-heading font-bold text-foreground mb-2">Call Us</h3>
              <a href="tel:+923125429037" className="text-muted-foreground hover:text-primary transition-colors">
                {contactInfo.phone}
              </a>
            </div>

            <div className="bg-card rounded-2xl border border-border p-6 text-center hover:border-primary/30 transition-colors">
              <MapPin className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-heading font-bold text-foreground mb-2">Find Us</h3>
              <address className="text-muted-foreground text-sm not-italic leading-relaxed">
                {contactInfo.address}
              </address>
            </div>

            <div className="bg-card rounded-2xl border border-border p-6 text-center hover:border-primary/30 transition-colors">
              <Instagram className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-heading font-bold text-foreground mb-2">Follow Us</h3>
              <a
                href="https://instagram.com/thesignaturecafe"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                {contactInfo.instagram}
              </a>
            </div>
          </div>

          {/* Services */}
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            {[
              { icon: Utensils, label: "Dining" },
              { icon: ShoppingBag, label: "Takeaway" },
              { icon: Truck, label: "Home Delivery" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-heading font-semibold text-sm">
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
