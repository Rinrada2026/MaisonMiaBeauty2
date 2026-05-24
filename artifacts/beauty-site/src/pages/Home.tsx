import { Feather, Heart, Rabbit, Truck, Plus } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { products } from "@/data/products";
import { useCart } from "@/context/CartContext";

export default function Home() {
  const [, setLocation] = useLocation();
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product.id,
      name: product.name,
      style: product.style,
      price: product.price,
      quantity: 1,
      image: product.image
    });
  };

  const bestSellers = products.filter(p => ["velvet-kiss", "angel", "daydream", "doll-eye"].includes(p.id));

  return (
    <main className="pb-20">
      {/* Hero */}
      <section className="relative w-full aspect-[4/5] sm:aspect-video md:aspect-[21/9] overflow-hidden bg-white">
        <img src="/images/hero.png" alt="Hero" className="absolute inset-0 w-full h-full object-cover object-[70%_center]" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent w-full md:w-3/4" />
        
        <div className="relative z-10 h-full flex flex-col justify-center px-6 sm:px-12 max-w-lg">
          <p className="text-primary text-[10px] sm:text-xs tracking-[0.2em] font-medium mb-4">ENHANCE. ELEVATE. EMPOWER.</p>
          <h1 className="font-serif text-[2.75rem] sm:text-6xl leading-[1.05] text-foreground mb-4">
            Effortless Beauty,<br />Every Day
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-8 max-w-sm">
            Premium lashes designed to enhance your natural beauty and boost your confidence.
          </p>
          <div className="flex flex-col gap-3">
            <Button className="w-full sm:w-64 h-12 bg-primary hover:bg-primary/90 text-white rounded-none tracking-widest text-xs uppercase" onClick={() => setLocation("/shop")}>
              SHOP LASHES
            </Button>
            <Button variant="outline" className="w-full sm:w-64 h-12 rounded-none tracking-widest text-xs uppercase border-border" onClick={() => setLocation("/shop")}>
              BEST SELLERS
            </Button>
          </div>
        </div>
      </section>

      {/* Features Strip */}
      <section className="bg-white border-y border-border grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-border">
        <div className="flex flex-col items-center text-center p-6 gap-3">
          <Feather className="w-6 h-6 text-foreground" strokeWidth={1} />
          <span className="text-[10px] font-medium tracking-widest uppercase">LIGHTWEIGHT COMFORT</span>
        </div>
        <div className="flex flex-col items-center text-center p-6 gap-3">
          <Heart className="w-6 h-6 text-foreground" strokeWidth={1} />
          <span className="text-[10px] font-medium tracking-widest uppercase">HANDCRAFTED QUALITY</span>
        </div>
        <div className="flex flex-col items-center text-center p-6 gap-3">
          <Rabbit className="w-6 h-6 text-foreground" strokeWidth={1} />
          <span className="text-[10px] font-medium tracking-widest uppercase">CRUELTY FREE</span>
        </div>
        <div className="flex flex-col items-center text-center p-6 gap-3">
          <Truck className="w-6 h-6 text-foreground" strokeWidth={1} />
          <span className="text-[10px] font-medium tracking-widest uppercase">FREE SHIPPING $80+ AUSTRALIA-WIDE</span>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-12 bg-background overflow-hidden">
        <div className="px-6 flex justify-between items-end mb-6">
          <h2 className="text-xl font-bold font-sans tracking-wide">BEST SELLERS</h2>
          <Link href="/shop" className="text-xs font-medium text-muted-foreground hover:text-foreground flex items-center gap-1">
            VIEW ALL <span className="text-lg leading-none">&rarr;</span>
          </Link>
        </div>

        <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar pl-6 pr-6 pb-4 -mr-6 gap-4">
          {bestSellers.map((product) => (
            <Link key={product.id} href={`/product/${product.id}`} className="snap-start shrink-0 w-[65vw] sm:w-[30vw] md:w-[22vw] flex flex-col group relative bg-white">
              <div className="relative aspect-square overflow-hidden bg-secondary">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover mix-blend-multiply" />
                <button className="absolute top-3 right-3 p-1.5 bg-white rounded-full shadow-sm text-muted-foreground hover:text-primary z-10" onClick={(e) => { e.preventDefault(); }}>
                  <Heart className="w-4 h-4" />
                </button>
              </div>
              <div className="p-4 flex flex-col relative">
                <h3 className="text-xs font-medium tracking-[0.15em] uppercase mb-1">{product.name}</h3>
                <p className="text-xs text-muted-foreground mb-1">{product.style}</p>
                <p className="text-sm font-medium">${product.price.toFixed(2)}</p>
                
                <button 
                  onClick={(e) => handleAddToCart(e, product)}
                  className="absolute bottom-4 right-4 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary/90 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Secondary Banner */}
      <section className="grid grid-cols-1 md:grid-cols-2 bg-secondary">
        <div className="aspect-[4/3] md:aspect-auto md:h-full relative overflow-hidden order-1 md:order-none">
          <img src="/images/banner.png" alt="Lashes" className="absolute inset-0 w-full h-full object-cover" />
        </div>
        <div className="flex flex-col justify-center items-start p-10 sm:p-16">
          <p className="text-[10px] tracking-[0.2em] font-medium mb-3 uppercase text-primary">BE YOUR OWN STANDARD</p>
          <h2 className="font-serif italic text-4xl sm:text-5xl leading-tight mb-8">
            Lashes that speak before you do.
          </h2>
          <Button className="h-12 px-8 bg-primary hover:bg-primary/90 text-white rounded-none tracking-widest text-xs uppercase" onClick={() => setLocation("/shop")}>
            SHOP NOW
          </Button>
        </div>
      </section>
    </main>
  );
}
