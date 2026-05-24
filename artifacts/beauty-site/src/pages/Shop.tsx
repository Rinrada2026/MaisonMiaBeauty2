import { Heart, Truck, Plus } from "lucide-react";
import { Link } from "wouter";
import { products } from "@/data/products";
import { useCart } from "@/context/CartContext";

export default function Shop() {
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

  return (
    <main className="pb-32 bg-background min-h-screen">
      {/* Header */}
      <div className="pt-10 pb-8 text-center px-4 flex flex-col items-center">
        <p className="text-[10px] tracking-[0.2em] font-medium text-primary mb-2 uppercase">COLLECTION</p>
        <h1 className="font-serif text-4xl mb-4">All Lashes</h1>
        <Heart className="w-5 h-5 text-primary mb-4" strokeWidth={1} />
        <p className="text-sm text-muted-foreground max-w-sm">Premium quality lashes for every look and every you.</p>
      </div>

      {/* Filter Bar */}
      <div className="border-y border-border bg-white sticky top-16 z-30 flex justify-between items-center px-4 py-3 text-[11px] font-medium tracking-widest uppercase text-foreground">
        <button className="flex items-center gap-2">
          &equiv; FILTER &darr;
        </button>
        <button className="flex items-center gap-2">
          SORT: BEST SELLING &darr;
        </button>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-border">
        {products.map((product) => (
          <Link key={product.id} href={`/product/${product.id}`} className="bg-white flex flex-col relative group">
            <div className="relative aspect-square bg-secondary">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover mix-blend-multiply" />
              <button className="absolute top-3 right-3 p-1.5 bg-white/80 backdrop-blur rounded-full text-muted-foreground hover:text-primary z-10" onClick={(e) => { e.preventDefault(); }}>
                <Heart className="w-4 h-4" strokeWidth={1.5} />
              </button>
              {product.badge && (
                <div className="absolute bottom-3 left-3 bg-primary text-white text-[9px] font-medium px-2 py-1 tracking-widest uppercase">
                  {product.badge}
                </div>
              )}
            </div>
            <div className="p-4 flex flex-col relative flex-grow">
              <h3 className="text-xs font-medium tracking-[0.15em] uppercase mb-1">{product.name}</h3>
              <p className="text-xs text-muted-foreground mb-1">{product.style}</p>
              <p className="text-sm font-medium mt-auto">${product.price.toFixed(2)}</p>
              
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

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-border py-2 px-4 flex items-center justify-center gap-3 z-40 text-xs shadow-[0_-4px_10px_rgba(0,0,0,0.03)]">
        <Truck className="w-4 h-4 text-primary" strokeWidth={1.5} />
        <span className="font-medium tracking-wide">FREE SHIPPING</span>
        <span className="text-muted-foreground">On orders over $80 Australia-wide</span>
      </div>
    </main>
  );
}
