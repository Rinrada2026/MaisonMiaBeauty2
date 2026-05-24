import { Home, ShoppingBag, Heart, User } from "lucide-react";
import { Link, useLocation } from "wouter";

export default function BottomNav() {
  const [location] = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border z-40 pb-safe" data-testid="bottom-nav">
      <div className="flex items-center justify-between px-2 h-16">
        <Link href="/" className={`flex flex-col items-center justify-center w-full h-full gap-1 ${location === "/" ? "text-primary" : "text-muted-foreground"}`} data-testid="nav-home">
          <Home className="w-5 h-5" strokeWidth={location === "/" ? 2 : 1.5} />
          <span className="text-[10px] font-medium tracking-wide">HOME</span>
        </Link>
        <Link href="/shop" className={`flex flex-col items-center justify-center w-full h-full gap-1 ${location === "/shop" || location.startsWith("/product/") ? "text-primary" : "text-muted-foreground"}`} data-testid="nav-shop">
          <ShoppingBag className="w-5 h-5" strokeWidth={location === "/shop" || location.startsWith("/product/") ? 2 : 1.5} />
          <span className="text-[10px] font-medium tracking-wide">SHOP</span>
        </Link>
        <button className="flex flex-col items-center justify-center w-full h-full gap-1 text-muted-foreground" data-testid="nav-favorites">
          <Heart className="w-5 h-5" strokeWidth={1.5} />
          <span className="text-[10px] font-medium tracking-wide">FAVORITES</span>
        </button>
        <button className="flex flex-col items-center justify-center w-full h-full gap-1 text-muted-foreground" data-testid="nav-account">
          <User className="w-5 h-5" strokeWidth={1.5} />
          <span className="text-[10px] font-medium tracking-wide">ACCOUNT</span>
        </button>
      </div>
    </div>
  );
}
