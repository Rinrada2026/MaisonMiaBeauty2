import { User, ShoppingBag, MapPin, RotateCcw, ChevronRight, Heart, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const SHOPIFY_DOMAIN = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN;
const shopifyUrl = (path: string) => `https://${SHOPIFY_DOMAIN}${path}`;

const menuItems = [
  { icon: ShoppingBag, label: "My Orders", desc: "View and track your orders", href: shopifyUrl("/account/orders") },
  { icon: MapPin, label: "Addresses", desc: "Manage your saved addresses", href: shopifyUrl("/account/addresses") },
  { icon: RotateCcw, label: "Returns & Exchanges", desc: "Start a return or exchange", href: shopifyUrl("/account/orders") },
  { icon: Heart, label: "My Wishlist", desc: "View your saved items", href: "/favorites", internal: true },
];

export default function Account() {
  return (
    <main className="pb-32 bg-background min-h-screen">
      <div className="pt-10 pb-8 text-center px-4 flex flex-col items-center">
        <p className="text-[10px] tracking-[0.2em] font-medium text-primary mb-2 uppercase">PROFILE</p>
        <h1 className="font-serif text-4xl mb-4">My Account</h1>
        <div className="w-16 h-16 rounded-full bg-secondary border border-border flex items-center justify-center mt-2">
          <User className="w-7 h-7 text-muted-foreground" strokeWidth={1.5} />
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4">
        <div className="flex flex-col gap-3 mb-8">
          <a href={shopifyUrl("/account/login")} target="_blank" rel="noopener noreferrer">
            <Button className="w-full h-12 bg-primary hover:bg-primary/90 text-white rounded-none tracking-widest text-xs uppercase flex items-center gap-2">
              <LogIn className="w-4 h-4" /> SIGN IN TO YOUR ACCOUNT
            </Button>
          </a>
          <a href={shopifyUrl("/account/register")} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="w-full h-12 rounded-none tracking-widest text-xs uppercase border-border">
              CREATE AN ACCOUNT
            </Button>
          </a>
        </div>

        <div className="border border-border bg-white divide-y divide-border">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const content = (
              <div className="flex items-center gap-4 p-4 hover:bg-secondary/30 transition-colors">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-primary" strokeWidth={1.5} />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium tracking-widest uppercase">{item.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
            );

            return item.internal ? (
              <Link key={item.label} href={item.href}>{content}</Link>
            ) : (
              <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer">{content}</a>
            );
          })}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-8">
          Account is managed securely via Shopify.
        </p>
      </div>
    </main>
  );
}
