import { useState, useMemo } from "react";
import { Heart, Truck, X, SlidersHorizontal, ChevronDown } from "lucide-react";
import { Link } from "wouter";
import { useFavorites } from "@/context/FavoritesContext";
import { useShopifyProducts } from "@/hooks/useShopifyProducts";
import { getProductPrice, getProductImage, getFirstVariantId } from "@/lib/shopify";
import { products as staticProducts } from "@/data/products";

type SortOption = "best-selling" | "price-asc" | "price-desc";
type AvailFilter = "all" | "in-stock" | "sold-out";

export default function Shop() {
  const { toggleFavorite, isFavorite } = useFavorites();
  const { products: shopifyProducts, loading, error } = useShopifyProducts();

  const [sort, setSort] = useState<SortOption>("best-selling");
  const [availFilter, setAvailFilter] = useState<AvailFilter>("all");
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  const usingShopify = !loading && !error && shopifyProducts.length > 0;

  const processedProducts = useMemo(() => {
    let list = usingShopify ? shopifyProducts : [];

    if (availFilter === "in-stock") {
      list = list.filter((p) => p.variants.edges.some(({ node }) => node.availableForSale));
    } else if (availFilter === "sold-out") {
      list = list.filter((p) => p.variants.edges.every(({ node }) => !node.availableForSale));
    }

    if (sort === "price-asc") list = [...list].sort((a, b) => getProductPrice(a) - getProductPrice(b));
    else if (sort === "price-desc") list = [...list].sort((a, b) => getProductPrice(b) - getProductPrice(a));

    return list;
  }, [shopifyProducts, usingShopify, sort, availFilter]);

  const sortLabels: Record<SortOption, string> = {
    "best-selling": "BEST SELLING",
    "price-asc": "PRICE: LOW–HIGH",
    "price-desc": "PRICE: HIGH–LOW",
  };

  const activeFilterCount = (availFilter !== "all" ? 1 : 0);

  return (
    <main className="pb-32 pt-16 bg-background min-h-screen">
      <div className="pt-10 pb-8 text-center px-4 flex flex-col items-center">
        <p className="text-[10px] tracking-[0.2em] font-medium text-primary mb-2 uppercase">COLLECTION</p>
        <h1 className="font-serif text-4xl mb-4">All Lashes</h1>
        <Heart className="w-5 h-5 text-primary mb-4" strokeWidth={1} />
        <p className="text-sm text-muted-foreground max-w-sm">Premium quality lashes for every look and every you.</p>
      </div>

      <div className="border-y border-border bg-white sticky top-16 z-30 flex justify-between items-center px-4 py-3 text-[11px] font-medium tracking-widest uppercase text-foreground">
        <button
          className="flex items-center gap-2 relative"
          onClick={() => { setFilterOpen(true); setSortOpen(false); }}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          FILTER
          {activeFilterCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-primary text-white text-[9px] flex items-center justify-center">{activeFilterCount}</span>
          )}
        </button>
        <button
          className="flex items-center gap-1.5"
          onClick={() => { setSortOpen(true); setFilterOpen(false); }}
        >
          SORT: {sortLabels[sort]} <ChevronDown className="w-3 h-3" />
        </button>
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
        <>
          {processedProducts.length === 0 && usingShopify ? (
            <div className="text-center py-16 text-sm text-muted-foreground">ไม่พบสินค้าที่ตรงกับตัวกรองที่เลือก</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-border">
              {usingShopify
                ? processedProducts.map((product) => {
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
                  })
                : staticProducts.map((product) => (
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
                          <div className="absolute bottom-3 left-3 bg-primary text-white text-[9px] font-medium px-2 py-1 tracking-widest uppercase">{product.badge}</div>
                        )}
                      </div>
                      <div className="p-4 flex flex-col relative flex-grow">
                        <h3 className="text-xs font-medium tracking-[0.15em] uppercase mb-1">{product.name}</h3>
                        <p className="text-xs text-muted-foreground mb-1">{product.style}</p>
                        <p className="text-sm font-medium mt-auto">${product.price.toFixed(2)}</p>
                      </div>
                    </Link>
                  ))}
            </div>
          )}
        </>
      )}

      {error && (
        <p className="text-center text-xs text-muted-foreground py-4">Showing preview catalogue</p>
      )}

      <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-border py-2 px-4 flex items-center justify-center gap-3 z-40 text-xs shadow-[0_-4px_10px_rgba(0,0,0,0.03)]">
        <Truck className="w-4 h-4 text-primary" strokeWidth={1.5} />
        <span className="font-medium tracking-wide">FREE SHIPPING</span>
        <span className="text-muted-foreground">On orders over $80 Australia-wide</span>
      </div>

      {/* Filter Bottom Sheet */}
      {filterOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setFilterOpen(false)} />
          <div className="relative bg-white rounded-t-2xl px-5 pt-5 pb-10 z-10">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xs font-semibold uppercase tracking-widest">Filter</h3>
              <button onClick={() => setFilterOpen(false)}><X className="w-4 h-4" /></button>
            </div>

            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">Availability</p>
            <div className="flex flex-col gap-2 mb-6">
              {(["all", "in-stock", "sold-out"] as AvailFilter[]).map((opt) => {
                const labels = { all: "All", "in-stock": "In Stock", "sold-out": "Sold Out" };
                return (
                  <button
                    key={opt}
                    onClick={() => setAvailFilter(opt)}
                    className={`flex items-center gap-3 py-3 px-4 border rounded-lg text-sm text-left transition-all ${availFilter === opt ? "border-primary bg-primary/5 font-medium" : "border-border"}`}
                  >
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${availFilter === opt ? "border-primary" : "border-muted-foreground/30"}`}>
                      {availFilter === opt && <div className="w-2 h-2 rounded-full bg-primary" />}
                    </div>
                    {labels[opt]}
                  </button>
                );
              })}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => { setAvailFilter("all"); }}
                className="flex-1 h-11 border border-border text-xs font-medium uppercase tracking-widest"
              >
                Clear
              </button>
              <button
                onClick={() => setFilterOpen(false)}
                className="flex-1 h-11 bg-primary text-white text-xs font-medium uppercase tracking-widest"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sort Bottom Sheet */}
      {sortOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSortOpen(false)} />
          <div className="relative bg-white rounded-t-2xl px-5 pt-5 pb-10 z-10">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xs font-semibold uppercase tracking-widest">Sort By</h3>
              <button onClick={() => setSortOpen(false)}><X className="w-4 h-4" /></button>
            </div>
            <div className="flex flex-col gap-2">
              {(["best-selling", "price-asc", "price-desc"] as SortOption[]).map((opt) => (
                <button
                  key={opt}
                  onClick={() => { setSort(opt); setSortOpen(false); }}
                  className={`flex items-center gap-3 py-3 px-4 border rounded-lg text-sm text-left transition-all ${sort === opt ? "border-primary bg-primary/5 font-medium" : "border-border"}`}
                >
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${sort === opt ? "border-primary" : "border-muted-foreground/30"}`}>
                    {sort === opt && <div className="w-2 h-2 rounded-full bg-primary" />}
                  </div>
                  {sortLabels[opt]}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
