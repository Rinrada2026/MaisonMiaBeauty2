import { Home, ShoppingBag, Heart, User, ShoppingCart } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useFavorites } from "@/context/FavoritesContext";
import { useCart } from "@/context/CartContext";

export default function BottomNav() {
  const [location] = useLocation();
  const { favoriteCount } = useFavorites();
  const { itemCount } = useCart();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border z-40 pb-safe" data-testid="bottom-nav">
      <div className="flex items-center justify-between px-2 h-10">
        <Link href="/" className={`flex flex-col items-center justify-center w-full h-full gap-0.5 ${location === "/" ? "text-primary" : "text-muted-foreground"}`} data-testid="nav-home">
          <Home className="w-4 h-4" strokeWidth={location === "/" ? 2 : 1.5} />
          <span className="text-[9px] font-medium tracking-wide">HOME</span>
        </Link>
        <Link href="/shop" className={`flex flex-col items-center justify-center w-full h-full gap-0.5 ${location === "/shop" || location.startsWith("/product/") ? "text-primary" : "text-muted-foreground"}`} data-testid="nav-shop">
          <ShoppingBag className="w-4 h-4" strokeWidth={location === "/shop" || location.startsWith("/product/") ? 2 : 1.5} />
          <span className="text-[9px] font-medium tracking-wide">SHOP</span>
        </Link>
        <Link href="/favorites" className={`flex flex-col items-center justify-center w-full h-full gap-0.5 relative ${location === "/favorites" ? "text-primary" : "text-muted-foreground"}`} data-testid="nav-favorites">
          <div className="relative">
            <Heart className="w-4 h-4" strokeWidth={location === "/favorites" ? 2 : 1.5} fill={location === "/favorites" ? "currentColor" : "none"} />
            {favoriteCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-[8px] font-bold w-[12px] h-[12px] rounded-full flex items-center justify-center">
                {favoriteCount}
              </span>
            )}
          </div>
          <span className="text-[9px] font-medium tracking-wide">FAVORITES</span>
        </Link>
        <Link href="/cart" className={`flex flex-col items-center justify-center w-full h-full gap-0.5 relative ${location === "/cart" ? "text-primary" : "text-muted-foreground"}`} data-testid="nav-cart">
          <div className="relative">
            <ShoppingCart className="w-4 h-4" strokeWidth={location === "/cart" ? 2 : 1.5} />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-[8px] font-bold w-[12px] h-[12px] rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </div>
          <span className="text-[9px] font-medium tracking-wide">CART</span>
        </Link>
        <Link href="/account" className={`flex flex-col items-center justify-center w-full h-full gap-0.5 ${location === "/account" ? "text-primary" : "text-muted-foreground"}`} data-testid="nav-account">
          <User className="w-4 h-4" strokeWidth={location === "/account" ? 2 : 1.5} />
          <span className="text-[9px] font-medium tracking-wide">ACCOUNT</span>
        </Link>
      </div>
    </div>
  );
}
