import { Heart, Truck } from "lucide-react";
import { Link } from "wouter";
import { useFavorites } from "@/context/FavoritesContext";
import { useShopifyProducts } from "@/hooks/useShopifyProducts";
import { getProductPrice, getProductImage, getFirstVariantId } from "@/lib/shopify";
import { products as staticProducts } from "@/data/products";

export default function Shop() {
  const { toggleFavorite, isFavorite } = useFavorites();
  const { products: shopifyProducts, loading, error } = useShopifyProducts();

  const usingShopify = !loading && !error && shopifyProducts.length > 0;

  const renderShopifyProducts = () =>
    shopifyProducts.map((product) => {
      const allSoldOut = product.variants.edges.every(({ node }) => !node.availableForSale);
      return (
        <Link key={product.id} href={`/product/${product.handle}`} className="bg-white flex flex-col relative group">
          <div className="relative aspect-square bg-secondary">
            <img src={getProductImage(product)} alt={product.title} className="w-full h-full object-cover mix-blend-multiply" />
            <button
              className={`absolute top-3 right-3 p-1.5 bg-white/80 backdrop-blur rounded-full z-10 ${isFavorite(product.handle) ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
              onClick={(e) => { e.preventDefault(); toggleFavorite({ productId: product.handle, variantId: getFirstVariantId(product) ?? "", name: product.title, style: product.tags?.[0] ?? "", price: getProductPrice(product), image: getProductImage(product) }); }}
            >
              <Heart className="w-4 h-4" strokeWidth={1.5} fill={isFavorite(product.handle) ? "currentColor" : "none"} />
            </button>
            {product.tags?.includes("new") && (
              <div className="absolute bottom-3 left-3 bg-primary text-white text-[9px] font-medium px-2 py-1 tracking-widest uppercase">NEW</div>
            )}
            {product.tags?.includes("best-seller") && (
              <div className="absolute bottom-3 left-3 bg-primary text-white text-[9px] font-medium px-2 py-1 tracking-widest uppercase">BEST SELLER</div>
            )}
          </div>
          <div className="p-4 flex flex-col relative flex-grow">
            <h3 className="text-xs font-medium tracking-[0.15em] uppercase mb-1">{product.title}</h3>
            <p className="text-xs text-muted-foreground mb-1">{product.tags?.[0] ?? ""}</p>
            <div className="flex items-center justify-between mt-auto">
              <p className="text-sm font-medium">${getProductPrice(product).toFixed(2)}</p>
              {allSoldOut && (
                <span className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground border border-muted-foreground/30 px-2 py-1">Sold Out</span>
              )}
            </div>
          </div>
        </Link>
      );
    });

  const renderStaticProducts = () =>
    staticProducts.map((product) => (
      <Link key={product.id} href={`/product/${product.id}`} className="bg-white flex flex-col relative group">
        <div className="relative aspect-square bg-secondary">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover mix-blend-multiply" />
          <button
            className={`absolute top-3 right-3 p-1.5 bg-white/80 backdrop-blur rounded-full z-10 ${isFavorite(product.id) ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
            onClick={(e) => { e.preventDefault(); toggleFavorite({ productId: product.id, variantId: "", name: product.name, style: product.style, price: product.price, image: product.image }); }}
          >
            <Heart className="w-4 h-4" strokeWidth={1.5} fill={isFavorite(product.id) ? "currentColor" : "none"} />
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
        </div>
      </Link>
    ));

  return (
    <main className="pb-32 bg-background min-h-screen">
      <div className="pt-10 pb-8 text-center px-4 flex flex-col items-center">
        <p className="text-[10px] tracking-[0.2em] font-medium text-primary mb-2 uppercase">COLLECTION</p>
        <h1 className="font-serif text-4xl mb-4">All Lashes</h1>
        <Heart className="w-5 h-5 text-primary mb-4" strokeWidth={1} />
        <p className="text-sm text-muted-foreground max-w-sm">Premium quality lashes for every look and every you.</p>
      </div>

      <div className="border-y border-border bg-white sticky top-16 z-30 flex justify-between items-center px-4 py-3 text-[11px] font-medium tracking-widest uppercase text-foreground">
        <button className="flex items-center gap-2">&equiv; FILTER &darr;</button>
        <button className="flex items-center gap-2">SORT: BEST SELLING &darr;</button>
      </div>

      {loading && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-border">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white flex flex-col animate-pulse">
              <div className="aspect-square bg-secondary" />
              <div className="p-4 flex flex-col gap-2">
                <div className="h-3 bg-secondary rounded w-2/3" />
                <div className="h-3 bg-secondary rounded w-1/2" />
                <div className="h-4 bg-secondary rounded w-1/4 mt-2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-border">
          {usingShopify ? renderShopifyProducts() : renderStaticProducts()}
        </div>
      )}

      {error && (
        <p className="text-center text-xs text-muted-foreground py-4">Showing preview catalogue</p>
      )}

      <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-border py-2 px-4 flex items-center justify-center gap-3 z-40 text-xs shadow-[0_-4px_10px_rgba(0,0,0,0.03)]">
        <Truck className="w-4 h-4 text-primary" strokeWidth={1.5} />
        <span className="font-medium tracking-wide">FREE SHIPPING</span>
        <span className="text-muted-foreground">On orders over $80 Australia-wide</span>
      </div>
    </main>
  );
}
