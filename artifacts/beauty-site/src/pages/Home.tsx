import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, User, ShoppingCart, Heart, Feather, ShieldCheck, Truck } from "lucide-react";

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
        className="w-full bg-muted text-foreground text-xs tracking-widest text-center py-2 uppercase font-medium"
        data-testid="announcement-bar"
      >
        Free Shipping on orders over $80
      </div>

      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/40 transition-all duration-300">
        <div className="container mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
          <nav className="hidden md:flex items-center gap-8 text-sm tracking-wider uppercase">
            <a href="#" className="hover:text-primary transition-colors" data-testid="nav-shop">Shop</a>
            <a href="#" className="hover:text-primary transition-colors" data-testid="nav-about">About</a>
            <a href="#" className="hover:text-primary transition-colors" data-testid="nav-faq">FAQ</a>
            <a href="#" className="hover:text-primary transition-colors" data-testid="nav-contact">Contact</a>
          </nav>
          
          <div className="flex-1 md:flex-none text-center">
            <h1 className="font-serif text-3xl tracking-widest" data-testid="brand-logo">LUMI BEAUTY</h1>
          </div>

          <div className="flex items-center gap-6">
            <button className="hover:text-primary transition-colors" data-testid="btn-search">
              <Search className="w-5 h-5" strokeWidth={1.5} />
            </button>
            <button className="hover:text-primary transition-colors" data-testid="btn-account">
              <User className="w-5 h-5" strokeWidth={1.5} />
            </button>
            <button className="hover:text-primary transition-colors relative" data-testid="btn-cart">
              <ShoppingCart className="w-5 h-5" strokeWidth={1.5} />
              <span className="absolute -top-1.5 -right-2 bg-primary text-primary-foreground text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                0
              </span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="w-full grid grid-cols-1 lg:grid-cols-2 min-h-[600px] lg:h-[calc(100vh-80px)]">
          <div className="flex flex-col justify-center items-start p-12 lg:p-24 bg-secondary">
            <h2 className="font-serif text-5xl lg:text-7xl leading-tight mb-6" data-testid="hero-headline">
              Effortless <i className="text-primary font-serif">Beauty</i>,<br /> Every Day
            </h2>
            <p className="text-muted-foreground text-lg mb-10 max-w-md font-light leading-relaxed">
              Enhance your natural beauty with our handcrafted, premium false lashes. Designed for comfort, styled for impact.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground tracking-widest uppercase px-8 h-12 rounded-none" data-testid="hero-btn-shop">
                Shop Lashes
              </Button>
              <a href="#" className="uppercase tracking-widest text-sm font-medium hover:text-primary transition-colors border-b border-foreground hover:border-primary pb-1" data-testid="hero-link-learn">
                Learn More
              </a>
            </div>
          </div>
          <div className="relative h-[50vh] lg:h-full w-full">
            <img 
              src="/images/hero.png" 
              alt="Model with beautiful lashes" 
              className="absolute inset-0 w-full h-full object-cover"
              data-testid="hero-image"
            />
          </div>
        </section>

        {/* Product Collection */}
        <section className="py-24 px-4 md:px-6 container mx-auto">
          <div className="text-center mb-16 relative">
            <h3 className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-4">Our Lash Collection</h3>
            <h2 className="font-serif text-4xl md:text-5xl">Designed for Every Look</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product, idx) => (
              <div 
                key={product.id} 
                className="group relative flex flex-col bg-card border border-card-border p-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                onMouseEnter={() => setHoveredCard(product.id)}
                onMouseLeave={() => setHoveredCard(null)}
                data-testid={`product-card-${product.id}`}
              >
                <button className="absolute top-6 right-6 z-10 text-muted-foreground hover:text-primary transition-colors" data-testid={`btn-wishlist-${product.id}`}>
                  <Heart className="w-5 h-5" strokeWidth={1.5} />
                </button>
                <div className="aspect-square bg-secondary mb-6 overflow-hidden relative">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className={`w-full h-full object-cover transition-transform duration-700 ${hoveredCard === product.id ? 'scale-105' : 'scale-100'}`} 
                  />
                </div>
                <div className="text-center flex-grow flex flex-col justify-between">
                  <div>
                    <h4 className="font-serif text-2xl mb-1">{product.name}</h4>
                    <p className="text-sm text-muted-foreground mb-3">{product.style}</p>
                    <p className="text-sm mb-6">{product.price}</p>
                  </div>
                  <Button variant="outline" className="w-full tracking-widest uppercase text-xs h-10 rounded-none border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors" data-testid={`btn-add-to-cart-${product.id}`}>
                    Add to Cart
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Button variant="outline" size="lg" className="border-foreground text-foreground hover:bg-foreground hover:text-background tracking-widest uppercase px-12 rounded-none" data-testid="btn-shop-all">
              Shop All Lashes
            </Button>
          </div>
        </section>

        {/* Features Strip */}
        <section className="border-y border-border/50 py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-border/30">
              <div className="flex flex-col items-center justify-center text-center p-4">
                <Feather className="w-8 h-8 text-primary mb-4" strokeWidth={1} />
                <h5 className="font-serif text-lg">Lightweight Comfort</h5>
              </div>
              <div className="flex flex-col items-center justify-center text-center p-4">
                <Heart className="w-8 h-8 text-primary mb-4" strokeWidth={1} />
                <h5 className="font-serif text-lg">Handcrafted Quality</h5>
              </div>
              <div className="flex flex-col items-center justify-center text-center p-4">
                <ShieldCheck className="w-8 h-8 text-primary mb-4" strokeWidth={1} />
                <h5 className="font-serif text-lg">Cruelty Free</h5>
              </div>
              <div className="flex flex-col items-center justify-center text-center p-4">
                <Truck className="w-8 h-8 text-primary mb-4" strokeWidth={1} />
                <h5 className="font-serif text-lg">Fast Shipping</h5>
              </div>
            </div>
          </div>
        </section>

        {/* Secondary Banner */}
        <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <img 
              src="/images/banner.png" 
              alt="Lashes on silk" 
              className="w-full h-full object-cover"
              data-testid="banner-image"
            />
            <div className="absolute inset-0 bg-background/30 backdrop-blur-[2px]"></div>
          </div>
          <div className="relative z-10 text-center px-4 max-w-2xl mx-auto flex flex-col items-center">
            <span className="text-xs tracking-[0.2em] uppercase mb-4 block font-medium">The Lumi Difference</span>
            <h2 className="font-serif text-4xl md:text-6xl italic leading-tight mb-8">
              Lashes that speak<br />before you do.
            </h2>
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground tracking-widest uppercase px-10 h-12 rounded-none" data-testid="banner-btn-shop">
              Shop Lashes
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-secondary pt-20 pb-10 border-t border-border">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
            <div className="lg:col-span-2">
              <h2 className="font-serif text-2xl tracking-widest mb-6">LUMI BEAUTY</h2>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-sm mb-6">
                Premium, handcrafted false lashes designed to empower and enhance your natural beauty. Effortless luxury for every day.
              </p>
              <div className="flex gap-4">
                {/* Social placeholders */}
                <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:text-primary hover:border-primary transition-colors cursor-pointer">IG</div>
                <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:text-primary hover:border-primary transition-colors cursor-pointer">FB</div>
                <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:text-primary hover:border-primary transition-colors cursor-pointer">TK</div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium uppercase tracking-wider text-sm mb-6">Shop</h4>
              <ul className="space-y-4 text-muted-foreground text-sm">
                <li><a href="#" className="hover:text-primary transition-colors">All Lashes</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Bundles</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Accessories</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Gift Cards</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium uppercase tracking-wider text-sm mb-6">Info</h4>
              <ul className="space-y-4 text-muted-foreground text-sm">
                <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Lash Guide</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Stockists</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium uppercase tracking-wider text-sm mb-6">Newsletter</h4>
              <p className="text-muted-foreground text-sm mb-4">Subscribe to receive updates, access to exclusive deals, and more.</p>
              <div className="flex flex-col gap-3">
                <Input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="rounded-none border-border bg-background h-10"
                  data-testid="input-newsletter-email"
                />
                <Button className="w-full rounded-none bg-foreground hover:bg-foreground/90 text-background h-10 tracking-widest uppercase text-xs" data-testid="btn-newsletter-subscribe">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Lumi Beauty. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-foreground">Privacy Policy</a>
              <a href="#" className="hover:text-foreground">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
