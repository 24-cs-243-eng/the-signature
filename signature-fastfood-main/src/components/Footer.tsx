import { Link } from "react-router-dom";
import { Phone, MapPin } from "lucide-react";
const signatureLogo = "/media/signature-logo.jpeg";;
import { contactInfo } from "@/data/menuData";

// ── Branded SVG Social Icons ─────────────────────────────────────────────────
const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="w-5 h-5">
    <defs>
      <linearGradient id="ig-footer-grad" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#f09433" />
        <stop offset="25%" stopColor="#e6683c" />
        <stop offset="50%" stopColor="#dc2743" />
        <stop offset="75%" stopColor="#cc2366" />
        <stop offset="100%" stopColor="#bc1888" />
      </linearGradient>
    </defs>
    <path fill="url(#ig-footer-grad)" d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/>
  </svg>
);

const TikTokIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="w-4 h-4">
    <path fill="#ffffff" d="M448 209.91a210.06 210.06 0 0 1-122.77-39.25V349.38A162.55 162.55 0 1 1 185 188.31v89.89a74.62 74.62 0 1 0 52.23 71.18V0l88 0a121.18 121.18 0 0 0 1.86 22.17h0A122.18 122.18 0 0 0 381 102.39a121.43 121.43 0 0 0 67 20.14Z"/>
  </svg>
);

const Footer = () => (
  <footer className="relative bg-[hsl(0,40%,8%)] text-[hsl(0,0%,90%)] pt-0 pb-8">
    {/* Red accent stripe */}
    <div className="h-1 bg-primary w-full" />

    <div className="container mx-auto px-4 pt-14">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <img src={signatureLogo} alt="Signature" className="w-10 h-10 rounded-full object-cover" />
            <span className="font-heading font-bold text-lg">{contactInfo.name}</span>
          </div>
          <p className="text-[hsl(0,0%,90%)]/60 text-sm mb-3">{contactInfo.tagline}</p>
          <p className="text-[hsl(0,0%,90%)]/40 text-xs">{contactInfo.established}</p>

          {/* Social icons under brand */}
          <div className="flex items-center gap-3 mt-5">
            <a
              href="https://www.instagram.com/info.thesignaturecafe?igsh=MTBvZ2R1enRub2lyeA=="
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="group w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-200 hover:scale-110"
            >
              <InstagramIcon />
            </a>
            <a
              href="https://www.tiktok.com/@thesignaturecafee?_r=1&_t=ZS-95FrtTeNr3U"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="group w-9 h-9 rounded-lg bg-white/10 hover:bg-black flex items-center justify-center transition-all duration-200 hover:scale-110"
            >
              <TikTokIcon />
            </a>
          </div>
        </div>

        {/* Explore links */}
        <div>
          <h4 className="font-heading font-bold mb-4">Explore</h4>
          <div className="space-y-2 text-sm text-[hsl(0,0%,90%)]/60">
            <Link to="/" className="block hover:text-primary transition-colors">Home</Link>
            <Link to="/menu" className="block hover:text-primary transition-colors">Menu</Link>
            <Link to="/deals" className="block hover:text-primary transition-colors">Deals</Link>
            <Link to="/about" className="block hover:text-primary transition-colors">About</Link>
            <Link to="/contact" className="block hover:text-primary transition-colors">Contact</Link>
          </div>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-heading font-bold mb-4">Contact Us</h4>
          <div className="space-y-3 text-sm text-[hsl(0,0%,90%)]/60">
            <a href="tel:+923125429037" className="flex items-center gap-2 hover:text-primary transition-colors">
              <Phone className="w-4 h-4" /> {contactInfo.phone}
            </a>
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span className="leading-relaxed">{contactInfo.address}</span>
            </div>
          </div>
        </div>

        {/* Services + Newsletter */}
        <div>
          <h4 className="font-heading font-bold mb-4">Services</h4>
          <div className="space-y-2 text-sm text-[hsl(0,0%,90%)]/60 mb-6">
            {contactInfo.services.map((s) => (
              <p key={s}>✓ {s}</p>
            ))}
          </div>
          <h4 className="font-heading font-bold mb-3">Stay in the Loop</h4>
          <div className="flex gap-2">
            <input type="email" placeholder="Your email" className="flex-1 bg-[hsl(0,0%,100%)]/10 rounded-md px-3 py-2 text-sm text-[hsl(0,0%,90%)] placeholder:text-[hsl(0,0%,90%)]/40 focus:outline-none focus:ring-2 focus:ring-primary" />
            <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-bold hover:bg-primary/90 transition-colors">Join</button>
          </div>
        </div>
      </div>

      <div className="border-t border-[hsl(0,0%,100%)]/10 pt-6 text-center text-sm text-[hsl(0,0%,90%)]/40">
        © 2025 {contactInfo.name}. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
