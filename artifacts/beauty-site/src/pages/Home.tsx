import { Feather, Heart, Rabbit, Truck } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/context/FavoritesContext";
import { useShopifyProducts } from "@/hooks/useShopifyProducts";
import { getProductPrice, getProductImage, getFirstVariantId } from "@/lib/shopify";

export default function Home() {
  const [, setLocation] = useLocation();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { products: shopifyProducts, loading } = useShopifyProducts();

  const bestSellers = shopifyProducts.slice(0, 4);

  return (
    <main className="pb-20">
      {/* Hero */}
      <section className="relative w-full aspect-[2/3] sm:aspect-[4/5] md:aspect-video overflow-hidden bg-[#f9eaea]">
        <img src="/images/hero.png" alt="Hero" className="absolute inset-0 w-full h-full object-cover object-[62%_top]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#fbeeee]/90 via-[#fbeeee]/55 to-transparent" />

        <p className="absolute top-5 left-6 z-10 text-primary text-[9px] sm:text-[10px] tracking-[0.22em] font-semibold uppercase">Enhance. Elevate. Empower.</p>

        <div className="relative z-10 h-full flex flex-col justify-start pt-60 px-6 sm:px-10 w-[55%] sm:w-[48%]">
          <h1 className="font-serif text-[1.9rem] sm:text-4xl md:text-5xl leading-[1.08] text-foreground mb-4">
            Effortless<br />Beauty,<br />Every Day
          </h1>
          <div className="w-8 h-px bg-primary/40 mb-4" />
          <p className="text-foreground/60 text-xs sm:text-sm leading-relaxed mb-7 max-w-[220px] sm:max-w-xs">
            Premium lashes designed to enhance your natural beauty and boost your confidence.
          </p>
          <div className="flex flex-col gap-3">
            <Button className="w-full sm:w-56 h-11 bg-primary hover:bg-primary/90 text-white rounded-none tracking-widest text-[10px] uppercase" onClick={() => setLocation("/shop")}>
              SHOP LASHES ✦
            </Button>
            <Button variant="outline" className="w-full sm:w-56 h-11 rounded-none tracking-widest text-[10px] uppercase border-primary/30 text-foreground hover:bg-primary/5" onClick={() => setLocation("/shop")}>
              BEST SELLERS ♡
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
          {loading
            ? [1, 2, 3, 4].map((i) => (
                <div key={i} className="snap-start shrink-0 w-[65vw] sm:w-[30vw] md:w-[22vw] flex flex-col bg-white animate-pulse">
                  <div className="aspect-square bg-secondary" />
                  <div className="p-4 flex flex-col gap-2">
                    <div className="h-3 bg-secondary rounded w-2/3" />
                    <div className="h-3 bg-secondary rounded w-1/2" />
                    <div className="h-4 bg-secondary rounded w-1/4 mt-1" />
                  </div>
                </div>
              ))
            : bestSellers.map((product) => (
                <Link key={product.id} href={`/product/${product.handle}`} className="snap-start shrink-0 w-[65vw] sm:w-[30vw] md:w-[22vw] flex flex-col group relative bg-white">
                  <div className="relative aspect-square overflow-hidden bg-secondary">
                    <img src={getProductImage(product)} alt={product.title} className="w-full h-full object-cover mix-blend-multiply" />
                    <button
                      className={`absolute top-3 right-3 p-1.5 bg-white rounded-full shadow-sm z-10 ${isFavorite(product.handle) ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFavorite({ productId: product.handle, variantId: getFirstVariantId(product) ?? "", name: product.title, style: product.tags?.[0] ?? "", price: getProductPrice(product), image: getProductImage(product) }); }}
                    >
                      <Heart className="w-4 h-4" fill={isFavorite(product.handle) ? "currentColor" : "none"} />
                    </button>
                  </div>
                  <div className="p-4 flex flex-col relative">
                    <h3 className="text-xs font-medium tracking-[0.15em] uppercase mb-1">{product.title}</h3>
                    <p className="text-xs text-muted-foreground mb-1">{product.tags?.[0] ?? ""}</p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-sm font-medium">${getProductPrice(product).toFixed(2)}</p>
                      {product.variants.edges.every(({ node }) => !node.availableForSale) && (
                        <span className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground border border-muted-foreground/30 px-2 py-1">Sold Out</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
        </div>
      </section>

    </main>
  );
}
