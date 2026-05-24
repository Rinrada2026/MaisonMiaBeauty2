import { Link } from "wouter";
import { Truck, X, ShieldCheck, RefreshCw, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";

export default function Cart() {
  const { items, removeItem, updateQuantity, total, itemCount, checkout, isCheckingOut } = useCart();
  
  const freeShippingThreshold = 80;
  const progress = Math.min(100, (total / freeShippingThreshold) * 100);
  const remaining = Math.max(0, freeShippingThreshold - total);

  if (items.length === 0) {
    return (
      <main className="min-h-[80vh] flex flex-col items-center justify-center p-6 bg-background">
        <h1 className="font-serif text-4xl mb-4">Your Cart</h1>
        <p className="text-muted-foreground mb-8 text-center">Your cart is currently empty.</p>
        <Link href="/shop">
          <Button className="h-12 px-8 bg-primary hover:bg-primary/90 text-white rounded-none tracking-widest text-xs uppercase">
            CONTINUE SHOPPING
          </Button>
        </Link>
      </main>
    );
  }

  return (
    <main className="pb-32 bg-background min-h-screen">
      <div className="max-w-4xl mx-auto px-4 pt-10">
        
        {/* Header */}
        <div className="flex justify-between items-end mb-8">
          <h1 className="font-serif text-3xl">Your Cart ({itemCount})</h1>
          <Link href="/shop" className="text-xs font-medium text-muted-foreground hover:text-foreground tracking-widest uppercase pb-1">
            CONTINUE SHOPPING &rarr;
          </Link>
        </div>

        {/* Free Shipping Progress */}
        <div className="bg-white border border-border p-4 mb-8">
          <div className="flex justify-between text-xs font-medium mb-3">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-primary" strokeWidth={1.5} />
              {remaining > 0 ? (
                <span>You're <strong className="text-primary">${remaining.toFixed(2)}</strong> away from free shipping!</span>
              ) : (
                <span className="text-primary">You've unlocked free shipping!</span>
              )}
            </div>
            <span className="text-muted-foreground">$80.00 FREE SHIPPING</span>
          </div>
          <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-primary transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Cart Items */}
          <div className="flex-1 flex flex-col gap-6">
            {items.map((item) => (
              <div key={item.productId} className="flex gap-4 border-b border-border pb-6 relative">
                <Link href={`/product/${item.productId}`} className="w-24 h-24 bg-secondary shrink-0 block">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover mix-blend-multiply" />
                </Link>
                
                <div className="flex flex-col flex-1 py-1">
                  <div className="flex justify-between items-start pr-6">
                    <div>
                      <h3 className="text-sm font-medium tracking-[0.1em] uppercase mb-1">{item.name}</h3>
                      <p className="text-xs text-muted-foreground mb-3">{item.style}</p>
                    </div>
                    <p className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                  
                  <div className="flex items-center border border-border bg-white h-9 w-[100px] mt-auto">
                    <button className="flex-1 h-full flex items-center justify-center text-lg hover:bg-secondary" onClick={() => updateQuantity(item.productId, item.quantity - 1)}>&minus;</button>
                    <span className="flex-1 text-center text-xs font-medium">{item.quantity}</span>
                    <button className="flex-1 h-full flex items-center justify-center text-lg hover:bg-secondary" onClick={() => updateQuantity(item.productId, item.quantity + 1)}>+</button>
                  </div>
                </div>

                <button 
                  onClick={() => removeItem(item.productId)}
                  className="absolute top-1 right-0 text-muted-foreground hover:text-destructive"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-[320px] shrink-0">
            <div className="bg-secondary/50 p-6 flex flex-col border border-border">
              <h2 className="font-serif text-xl mb-6">Order Summary</h2>
              
              <div className="flex justify-between text-sm mb-4">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between text-sm mb-6 border-b border-border pb-6">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-right text-muted-foreground text-xs max-w-[120px]">Calculated at checkout</span>
              </div>
              
              <div className="flex justify-between items-end mb-8">
                <span className="text-sm font-medium">Total</span>
                <span className="text-xl font-medium">AUD ${total.toFixed(2)}</span>
              </div>

              <div className="flex flex-col gap-3">
                <Button
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-white rounded-none tracking-widest text-xs uppercase disabled:opacity-60"
                  onClick={checkout}
                  disabled={isCheckingOut}
                >
                  {isCheckingOut ? "REDIRECTING..." : "CHECKOUT"}
                </Button>
                <Button className="w-full h-12 bg-black hover:bg-black/90 text-white rounded-none flex items-center justify-center gap-2">
                  Buy with <span className="font-bold tracking-tight text-sm">Apple Pay</span>
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="mt-8 space-y-3">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <ShieldCheck className="w-4 h-4" /> Secure Checkout
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <RefreshCw className="w-4 h-4" /> 30-Day Returns
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <Star className="w-4 h-4" /> Trusted by 10,000+ Customers
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
