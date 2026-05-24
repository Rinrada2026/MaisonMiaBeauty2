import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, User, ShoppingCart, Heart, Feather, ShieldCheck, Truck, ArrowRight, Truck as TruckIcon } from "lucide-react";
import logoSrc from "/images/maison-mia-logo.png";

export default function Home() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const products = [
    {
      id: 1,
      name: "VELVET",
      style: "Soft & Wispy",
      price: "$24.95 AUD",
      image: "/images/product-1.png",
    },
    {
      id: 2,
      name: "DAYDREAM",
      style: "Natural & Fluffy",
      price: "$24.95 AUD",
      image: "/images/product-2.png",
    },
    {
      id: 3,
      name: "DOLL EYE",
      style: "Bold & Dramatic",
      price: "$24.95 AUD",
      image: "/images/product-3.png",
    },
    {
      id: 4,
      name: "ANGEL",
      style: "Wispy & Fluttery",
      price: "$24.95 AUD",
      image: "/images/product-4.png",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Announcement Bar */}
      <div
        className="w-full bg-muted text-foreground/80 text-xs tracking-widest text-center py-2 uppercase font-medium flex items-center justify-center gap-3"
        data-testid="announcement-bar"
      >
        <TruckIcon className="w-3.5 h-3.5 opacity-60" strokeWidth={1.5} />
        <span>Free Shipping on Orders Over $80 Australia-Wide</span>
        <TruckIcon className="w-3.5 h-3.5 opacity-60" strokeWidth={1.5} />
      </div>

      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/40">
        <div className="container mx-auto px-4 md:px-8 h-[72px] flex items-center justify-between">
          <nav className="hidden md:flex items-center gap-7 text-[11px] tracking-widest uppercase font-medium">
            <a href="#" className="hover:text-primary transition-colors" data-testid="nav-shop">Shop</a>
            <a href="#" className="hover:text-primary transition-colors" data-testid="nav-bestsellers">Best Sellers</a>
            <a href="#" className="hover:text-primary transition-colors" data-testid="nav-about">About</a>
            <a href="#" className="hover:text-primary transition-colors" data-testid="nav-faq">FAQ</a>
            <a href="#" className="hover:text-primary transition-colors" data-testid="nav-contact">Contact</a>
          </nav>

          <div className="absolute left-1/2 -translate-x-1/2 text-center">
            <img src={logoSrc} alt="Maison Mia Beauty" className="h-12 w-auto object-contain" data-testid="brand-logo" />
          </div>

          <div className="flex items-center gap-5">
            <button className="hover:text-primary transition-colors" data-testid="btn-search">
              <Search className="w-[18px] h-[18px]" strokeWidth={1.5} />
            </button>
            <button className="hover:text-primary transition-colors" data-testid="btn-account">
              <User className="w-[18px] h-[18px]" strokeWidth={1.5} />
            </button>
            <button className="hover:text-primary transition-colors relative" data-testid="btn-cart">
              <ShoppingCart className="w-[18px] h-[18px]" strokeWidth={1.5} />
              <span className="absolute -top-1.5 -right-2 bg-primary text-primary-foreground text-[9px] w-[15px] h-[15px] flex items-center justify-center rounded-full font-medium">
                0
              </span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section — full-width image with text overlay */}
        <section className="relative w-full overflow-hidden" style={{ height: "calc(100vh - 108px)", minHeight: "520px", maxHeight: "750px" }}>
          <img
            src="/images/hero.png"
            alt="Model with beautiful lashes"
            className="absolute inset-0 w-full h-full object-cover object-center"
            data-testid="hero-image"
          />
          {/* Left overlay for text legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#f5e8e4]/90 via-[#f5e8e4]/60 to-transparent" />

          <div className="relative z-10 h-full flex items-center">
            <div className="px-10 md:px-16 lg:px-24 max-w-[520px]">
              <p className="text-[11px] tracking-[0.25em] uppercase text-primary font-medium mb-4" data-testid="hero-tag">
                Enhance. Elevate. Empower.
              </p>
              <h2
                className="font-serif text-5xl md:text-6xl lg:text-[4.5rem] leading-[1.05] mb-5"
                data-testid="hero-headline"
              >
                Effortless Beauty,<br />Every Day
              </h2>
              <p className="text-[15px] text-foreground/70 mb-9 leading-relaxed max-w-[360px]">
                Premium lashes designed to enhance your natural beauty and boost your confidence.
              </p>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground tracking-[0.18em] uppercase text-[11px] px-8 h-11 rounded-none"
                  data-testid="hero-btn-shop"
                >
                  Shop Lashes
                </Button>
                <a
                  href="#"
                  className="flex items-center gap-2 uppercase tracking-[0.18em] text-[11px] font-medium hover:text-primary transition-colors"
                  data-testid="hero-link-learn"
                >
                  Learn More <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Features Strip — directly after hero, before products */}
        <section className="border-y border-border/40 py-10 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-border/30">
              <div className="flex flex-col items-center text-center px-6 py-4 gap-3">
                <Feather className="w-7 h-7 text-foreground/50" strokeWidth={1} />
                <div>
                  <h5 className="font-sans font-medium uppercase tracking-widest text-[10px] mb-1.5">Lightweight Comfort</h5>
                  <p className="text-[12px] text-muted-foreground leading-snug">Soft, lightweight, and comfortable for all-day wear.</p>
                </div>
              </div>
              <div className="flex flex-col items-center text-center px-6 py-4 gap-3">
                <Heart className="w-7 h-7 text-foreground/50" strokeWidth={1} />
                <div>
                  <h5 className="font-sans font-medium uppercase tracking-widest text-[10px] mb-1.5">Handcrafted Quality</h5>
                  <p className="text-[12px] text-muted-foreground leading-snug">Carefully handcrafted for a perfect finish.</p>
                </div>
              </div>
              <div className="flex flex-col items-center text-center px-6 py-4 gap-3">
                <ShieldCheck className="w-7 h-7 text-foreground/50" strokeWidth={1} />
                <div>
                  <h5 className="font-sans font-medium uppercase tracking-widest text-[10px] mb-1.5">Cruelty Free</h5>
                  <p className="text-[12px] text-muted-foreground leading-snug">100% cruelty-free and made with love.</p>
                </div>
              </div>
              <div className="flex flex-col items-center text-center px-6 py-4 gap-3">
                <Truck className="w-7 h-7 text-foreground/50" strokeWidth={1} />
                <div>
                  <h5 className="font-sans font-medium uppercase tracking-widest text-[10px] mb-1.5">Fast Shipping</h5>
                  <p className="text-[12px] text-muted-foreground leading-snug">Quick and reliable shipping across Australia.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Product Collection */}
        <section className="py-20 px-4 md:px-6 container mx-auto">
          <div className="text-center mb-12 relative">
            <p className="text-[11px] tracking-[0.3em] uppercase text-primary font-medium mb-3">Our Lash Collection</p>
            <h2 className="font-serif text-4xl md:text-5xl">Designed for Every Look</h2>
            <div className="flex justify-center mt-3">
              <Heart className="w-4 h-4 text-primary/60" strokeWidth={1} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {products.map((product) => (
              <div
                key={product.id}
                className="group relative flex flex-col bg-card border border-card-border transition-all duration-300 hover:shadow-md"
                onMouseEnter={() => setHoveredCard(product.id)}
                onMouseLeave={() => setHoveredCard(null)}
                data-testid={`product-card-${product.id}`}
              >
                <button
                  className="absolute top-4 right-4 z-10 text-muted-foreground hover:text-primary transition-colors"
                  data-testid={`btn-wishlist-${product.id}`}
                >
                  <Heart className="w-4 h-4" strokeWidth={1.5} />
                </button>
                <div className="aspect-square bg-muted overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className={`w-full h-full object-cover transition-transform duration-700 ${hoveredCard === product.id ? "scale-105" : "scale-100"}`}
                  />
                </div>
                <div className="text-center px-4 py-5 flex flex-col gap-1">
                  <h4 className="font-sans font-medium tracking-widest text-[12px] uppercase">{product.name}</h4>
                  <p className="text-[12px] text-muted-foreground">{product.style}</p>
                  <p className="text-[12px] mb-3">{product.price}</p>
                  <Button
                    variant="outline"
                    className="w-full tracking-[0.15em] uppercase text-[10px] h-9 rounded-none border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                    data-testid={`btn-add-to-cart-${product.id}`}
                  >
                    Add to Cart
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button
              variant="outline"
              className="border-foreground/40 text-foreground hover:bg-foreground hover:text-background tracking-[0.2em] uppercase text-[11px] px-14 h-10 rounded-none"
              data-testid="btn-shop-all"
            >
              Shop All Lashes
            </Button>
          </div>
        </section>

        {/* Secondary Banner — split layout: image left, text right */}
        <section className="w-full grid grid-cols-1 md:grid-cols-2 min-h-[400px]">
          <div className="relative h-[300px] md:h-auto overflow-hidden">
            <img
              src="/images/banner.png"
              alt="Lashes on silk"
              className="absolute inset-0 w-full h-full object-cover"
              data-testid="banner-image"
            />
          </div>
          <div className="bg-[#f9ede9] flex flex-col items-start justify-center px-12 md:px-16 py-16">
            <p className="text-[10px] tracking-[0.3em] uppercase text-primary font-medium mb-4">Be Your Own Standard</p>
            <h2 className="font-serif text-4xl md:text-5xl leading-tight mb-8">
              Lashes that speak<br /><em>before</em> you do.
            </h2>
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground tracking-[0.18em] uppercase text-[11px] px-9 h-11 rounded-none"
              data-testid="banner-btn-shop"
            >
              Shop Lashes
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-secondary pt-16 pb-8 border-t border-border/40">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-14">
            {/* Brand */}
            <div className="lg:col-span-1">
              <div className="mb-5">
                <img src={logoSrc} alt="Maison Mia Beauty" className="h-10 w-auto object-contain" />
              </div>
              <p className="text-muted-foreground text-[12px] leading-relaxed mb-6">
                Enhancing your natural beauty with premium lashes that are effortless, elevated, and made for you.
              </p>
              <div className="flex gap-3">
                <a href="#" className="text-[11px] text-muted-foreground hover:text-primary transition-colors" data-testid="social-instagram">IG</a>
                <a href="#" className="text-[11px] text-muted-foreground hover:text-primary transition-colors" data-testid="social-tiktok">TK</a>
                <a href="#" className="text-[11px] text-muted-foreground hover:text-primary transition-colors" data-testid="social-email">✉</a>
              </div>
            </div>

            {/* Shop */}
            <div>
              <h4 className="font-sans font-medium uppercase tracking-widest text-[10px] mb-5">Shop</h4>
              <ul className="space-y-3 text-muted-foreground text-[12px]">
                <li><a href="#" className="hover:text-primary transition-colors">All Lashes</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Best Sellers</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Velvet</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Daydream</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Doll Eye</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Angel</a></li>
              </ul>
            </div>

            {/* Help */}
            <div>
              <h4 className="font-sans font-medium uppercase tracking-widest text-[10px] mb-5">Help</h4>
              <ul className="space-y-3 text-muted-foreground text-[12px]">
                <li><a href="#" className="hover:text-primary transition-colors">Shipping</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Returns & Refunds</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact Us</a></li>
              </ul>
            </div>

            {/* Info */}
            <div>
              <h4 className="font-sans font-medium uppercase tracking-widest text-[10px] mb-5">Info</h4>
              <ul className="space-y-3 text-muted-foreground text-[12px]">
                <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="font-sans font-medium uppercase tracking-widest text-[10px] mb-5">Join The List</h4>
              <p className="text-muted-foreground text-[12px] leading-relaxed mb-5">
                Be the first to know about new arrivals and exclusive offers.
              </p>
              <div className="flex flex-col gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="rounded-none border-border bg-background h-10 text-[12px]"
                  data-testid="input-newsletter-email"
                />
                <Button
                  className="w-full rounded-none bg-foreground hover:bg-foreground/90 text-background h-10 tracking-[0.18em] uppercase text-[10px]"
                  data-testid="btn-newsletter-subscribe"
                >
                  Subscribe
                </Button>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-6 border-t border-border/30 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[11px] text-muted-foreground">&copy; {new Date().getFullYear()} Maison Mia Beauty. All rights reserved.</p>
            {/* Payment icons placeholder */}
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase tracking-widest">
              <span className="border border-border/50 px-2 py-0.5 rounded-sm">Visa</span>
              <span className="border border-border/50 px-2 py-0.5 rounded-sm">Mastercard</span>
              <span className="border border-border/50 px-2 py-0.5 rounded-sm">Amex</span>
              <span className="border border-border/50 px-2 py-0.5 rounded-sm">Apple Pay</span>
              <span className="border border-border/50 px-2 py-0.5 rounded-sm">Google Pay</span>
              <span className="border border-border/50 px-2 py-0.5 rounded-sm">Afterpay</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
