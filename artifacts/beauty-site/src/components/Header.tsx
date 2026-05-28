import { useState } from "react";
import { Search, ShoppingBag } from "lucide-react";
import { Link } from "wouter";
import { useCart } from "@/context/CartContext";
import SearchOverlay from "@/components/SearchOverlay";
import logoSrc from "/images/maison-mia-logo.png";

export default function Header() {
  const { itemCount } = useCart();
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-border h-32 flex items-center px-4 justify-between" data-testid="header">
        <div className="flex-1" />

        <div className="flex-1 flex justify-center">
          <Link href="/" data-testid="header-logo-link">
            <img src={logoSrc} alt="Maison Mia" className="h-32 object-contain" style={{ filter: "brightness(0) saturate(100%) invert(63%) sepia(19%) saturate(560%) hue-rotate(302deg) brightness(92%) contrast(88%)" }} />
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-end gap-2">
          <button className="p-2" data-testid="btn-search" onClick={() => setSearchOpen(true)}>
            <Search className="w-5 h-5 text-foreground" />
          </button>
          <Link href="/cart" className="p-2 relative" data-testid="header-cart-link">
            <ShoppingBag className="w-5 h-5 text-foreground" />
            {itemCount > 0 && (
              <span className="absolute top-1 right-1 bg-primary text-white text-[9px] font-bold w-[14px] h-[14px] rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </header>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
