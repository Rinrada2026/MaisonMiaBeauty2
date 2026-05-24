import { useState } from "react";
import { useParams } from "wouter";
import { Heart, Truck, Feather, Rabbit, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { products } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";

export default function ProductDetail() {
  const { id } = useParams();
  const { addItem } = useCart();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"details" | "shipping" | null>(null);

  const product = products.find(p => p.id === id);

  if (!product) {
    return <div className="p-20 text-center">Product not found</div>;
  }

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      style: product.style,
      price: product.price,
      quantity,
      image: product.image
    });
    toast({
      title: "Added to cart",
      description: `${quantity}x ${product.name} added to your cart.`
    });
  };

  return (
    <main className="pb-24 bg-background min-h-screen">
      {/* Breadcrumb */}
      <div className="px-4 py-4 text-[9px] uppercase tracking-widest text-muted-foreground font-medium">
        HOME &gt; SHOP &gt; LASHES &gt; <span className="text-foreground">{product.name}</span>
      </div>

      <div className="flex flex-col md:flex-row gap-8 lg:gap-16 px-4 max-w-6xl mx-auto">
        {/* Images */}
        <div className="w-full md:w-1/2 flex flex-col gap-2">
          <div className="aspect-square bg-secondary w-full relative">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover mix-blend-multiply" />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className={`aspect-square bg-secondary border ${i === 1 ? 'border-primary' : 'border-transparent'}`}>
                <img src={product.image} alt="" className="w-full h-full object-cover mix-blend-multiply" />
              </div>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="w-full md:w-1/2 flex flex-col">
          {product.badge && (
            <div className="bg-primary text-white text-[9px] font-medium px-2 py-1 tracking-widest uppercase w-max mb-4">
              {product.badge}
            </div>
          )}
          
          <h1 className="font-serif text-4xl uppercase mb-2">{product.name}</h1>
          <p className="text-lg font-medium mb-3">${product.price.toFixed(2)} AUD</p>
          
          <div className="flex items-center gap-1 mb-6 text-[11px] text-muted-foreground">
            <div className="flex text-yellow-500">
              {'★★★★★'.split('').map((s, i) => <span key={i}>{s}</span>)}
            </div>
            <span className="ml-1">(128 reviews)</span>
          </div>

          <div className="text-sm leading-relaxed mb-8">
            <p className="font-bold uppercase tracking-wider text-xs mb-1">{product.style}</p>
            <p className="text-muted-foreground">{product.description}</p>
          </div>

          {/* Specs */}
          <div className="border border-border rounded-sm mb-6 text-xs flex flex-col bg-white">
            <div className="flex border-b border-border py-2 px-3">
              <span className="w-1/3 font-medium text-muted-foreground uppercase tracking-wider text-[10px]">STYLE</span>
              <span className="w-2/3">{product.specs.style}</span>
            </div>
            <div className="flex border-b border-border py-2 px-3">
              <span className="w-1/3 font-medium text-muted-foreground uppercase tracking-wider text-[10px]">LENGTH</span>
              <span className="w-2/3">{product.specs.length}</span>
            </div>
            <div className="flex py-2 px-3">
              <span className="w-1/3 font-medium text-muted-foreground uppercase tracking-wider text-[10px]">BAND</span>
              <span className="w-2/3">{product.specs.band}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-6 bg-secondary/50 p-3 text-xs">
            <Truck className="w-4 h-4 text-primary shrink-0" strokeWidth={1.5} />
            <span>Free shipping on orders over $80 Australia-wide</span>
          </div>

          <div className="flex flex-col gap-3 mb-8">
            <div className="flex items-center border border-border bg-white h-12 w-full max-w-[120px]">
              <button className="flex-1 h-full flex items-center justify-center text-lg hover:bg-secondary" onClick={() => setQuantity(q => Math.max(1, q - 1))}>&minus;</button>
              <span className="flex-1 text-center text-sm font-medium">{quantity}</span>
              <button className="flex-1 h-full flex items-center justify-center text-lg hover:bg-secondary" onClick={() => setQuantity(q => q + 1)}>+</button>
            </div>
            <Button className="w-full h-12 bg-primary hover:bg-primary/90 text-white rounded-none tracking-widest text-xs uppercase" onClick={handleAddToCart}>
              ADD TO CART
            </Button>
            <Button className="w-full h-12 bg-black hover:bg-black/90 text-white rounded-none flex items-center justify-center gap-2">
              Buy with <span className="font-bold tracking-tight text-sm">Apple Pay</span>
            </Button>
            
            <button className="flex items-center justify-center gap-2 mt-4 text-xs font-medium uppercase tracking-widest hover:text-primary transition-colors">
              <Heart className="w-4 h-4" strokeWidth={1.5} /> Add to Wishlist
            </button>
          </div>

          {/* Accordion visually mocked */}
          <div className="border-t border-border mt-auto">
            <button 
              className="w-full py-4 flex justify-between items-center text-xs font-medium tracking-widest uppercase border-b border-border"
              onClick={() => setActiveTab(activeTab === "details" ? null : "details")}
            >
              PRODUCT DETAILS <span>{activeTab === "details" ? "−" : "+"}</span>
            </button>
            {activeTab === "details" && (
              <div className="py-4 text-sm text-muted-foreground border-b border-border">
                Full details about materials, care instructions, and longevity would appear here.
              </div>
            )}
            
            <button 
              className="w-full py-4 flex justify-between items-center text-xs font-medium tracking-widest uppercase border-b border-border"
              onClick={() => setActiveTab(activeTab === "shipping" ? null : "shipping")}
            >
              SHIPPING & RETURNS <span>{activeTab === "shipping" ? "−" : "+"}</span>
            </button>
            {activeTab === "shipping" && (
              <div className="py-4 text-sm text-muted-foreground border-b border-border">
                Information about shipping times, international delivery, and our 30-day return policy.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Features Strip */}
      <section className="bg-white border-y border-border grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-border mt-16 max-w-6xl mx-auto">
        <div className="flex flex-col items-center text-center p-6 gap-3">
          <Feather className="w-6 h-6 text-foreground" strokeWidth={1} />
          <span className="text-[9px] font-medium tracking-widest uppercase">LIGHTWEIGHT COMFORT</span>
        </div>
        <div className="flex flex-col items-center text-center p-6 gap-3">
          <Heart className="w-6 h-6 text-foreground" strokeWidth={1} />
          <span className="text-[9px] font-medium tracking-widest uppercase">HANDCRAFTED QUALITY</span>
        </div>
        <div className="flex flex-col items-center text-center p-6 gap-3">
          <Rabbit className="w-6 h-6 text-foreground" strokeWidth={1} />
          <span className="text-[9px] font-medium tracking-widest uppercase">CRUELTY FREE</span>
        </div>
        <div className="flex flex-col items-center text-center p-6 gap-3">
          <ShieldCheck className="w-6 h-6 text-foreground" strokeWidth={1} />
          <span className="text-[9px] font-medium tracking-widest uppercase">EASY RETURNS 30-DAY</span>
        </div>
      </section>
    </main>
  );
}
