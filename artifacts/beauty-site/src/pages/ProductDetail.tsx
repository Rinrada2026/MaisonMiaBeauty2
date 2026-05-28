import { useState, useEffect } from "react";
import { useParams } from "wouter";
import { Heart, Truck, Feather, Rabbit, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";
import { useToast } from "@/hooks/use-toast";
import { useShopifyProduct } from "@/hooks/useShopifyProducts";
import { getProductPrice, getProductImage, ShopifyVariant } from "@/lib/shopify";
import { products as staticProducts } from "@/data/products";

export default function ProductDetail() {
  const { id } = useParams();
  const { addItem } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"details" | "shipping" | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [activeImage, setActiveImage] = useState<string | null>(null);

  const { product: shopifyProduct, loading } = useShopifyProduct(id);
  const staticProduct = staticProducts.find((p) => p.id === id);

  useEffect(() => {
    if (shopifyProduct?.options) {
      const initial: Record<string, string> = {};
      shopifyProduct.options.forEach((opt) => {
        if (opt.values.length > 0) initial[opt.name] = opt.values[0];
      });
      setSelectedOptions(initial);
    }
  }, [shopifyProduct]);

  const selectedVariant: ShopifyVariant | null = shopifyProduct
    ? (shopifyProduct.variants.edges.find(({ node }) =>
        node.selectedOptions.every((so) => selectedOptions[so.name] === so.value)
      )?.node ?? shopifyProduct.variants.edges[0]?.node ?? null)
    : null;

  const handleAddToCart = () => {
    if (shopifyProduct && selectedVariant) {
      addItem({
        productId: shopifyProduct.handle,
        variantId: selectedVariant.id,
        name: shopifyProduct.title,
        style: Object.values(selectedOptions).join(" / "),
        price: parseFloat(selectedVariant.price.amount),
        quantity,
        image: getProductImage(shopifyProduct),
      });
      toast({ title: "Added to cart", description: `${quantity}x ${shopifyProduct.title} added to your cart.` });
    } else if (staticProduct) {
      addItem({
        productId: staticProduct.id,
        variantId: "",
        name: staticProduct.name,
        style: staticProduct.style,
        price: staticProduct.price,
        quantity,
        image: staticProduct.image,
      });
      toast({ title: "Added to cart", description: `${quantity}x ${staticProduct.name} added to your cart.` });
    }
  };

  if (loading) {
    return (
      <main className="pb-24 bg-background min-h-screen">
        <div className="px-4 py-4 text-[9px] uppercase tracking-widest text-muted-foreground font-medium">
          HOME &gt; SHOP &gt; LASHES
        </div>
        <div className="flex flex-col md:flex-row gap-8 lg:gap-16 px-4 max-w-6xl mx-auto animate-pulse">
          <div className="w-full md:w-1/2 aspect-square bg-secondary" />
          <div className="w-full md:w-1/2 flex flex-col gap-4 pt-4">
            <div className="h-6 bg-secondary rounded w-1/3" />
            <div className="h-10 bg-secondary rounded w-2/3" />
            <div className="h-5 bg-secondary rounded w-1/4" />
            <div className="h-20 bg-secondary rounded w-full mt-4" />
          </div>
        </div>
      </main>
    );
  }

  const name = shopifyProduct?.title ?? staticProduct?.name ?? "";
  const price = selectedVariant
    ? parseFloat(selectedVariant.price.amount)
    : shopifyProduct
    ? getProductPrice(shopifyProduct)
    : (staticProduct?.price ?? 0);
  const defaultImage = shopifyProduct ? getProductImage(shopifyProduct) : (staticProduct?.image ?? "");
  const variantImage = selectedVariant?.image?.url ?? null;
  const description = shopifyProduct?.description ?? staticProduct?.description ?? "";
  const style = shopifyProduct?.tags?.[0] ?? staticProduct?.style ?? "";
  const badge = shopifyProduct?.tags?.includes("best-seller") ? "BEST SELLER" : shopifyProduct?.tags?.includes("new") ? "NEW" : staticProduct?.badge ?? null;
  const productImages = shopifyProduct?.images.edges.map((e) => e.node.url) ?? [defaultImage];
  const allImages = productImages.length >= 4 ? productImages.slice(0, 4) : [...productImages, ...Array(Math.max(0, 4 - productImages.length)).fill(defaultImage)];

  const mainImage = variantImage ?? activeImage ?? defaultImage;

  if (!shopifyProduct && !staticProduct) {
    return <div className="p-20 text-center">Product not found</div>;
  }

  return (
    <main className="pb-24 bg-background min-h-screen">
      <div className="px-4 py-4 text-[9px] uppercase tracking-widest text-muted-foreground font-medium">
        HOME &gt; SHOP &gt; LASHES &gt; <span className="text-foreground">{name}</span>
      </div>

      <div className="flex flex-col md:flex-row gap-8 lg:gap-16 px-4 max-w-6xl mx-auto">
        <div className="w-full md:w-1/2 flex flex-col gap-2">
          <div className="aspect-square bg-secondary w-full relative overflow-hidden">
            <img src={mainImage} alt={name} className="w-full h-full object-cover mix-blend-multiply transition-opacity duration-300" />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {allImages.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(img)}
                className={`aspect-square bg-secondary border transition-colors ${mainImage === img ? "border-primary" : "border-transparent hover:border-primary/50"}`}
              >
                <img src={img} alt="" className="w-full h-full object-cover mix-blend-multiply" />
              </button>
            ))}
          </div>
        </div>

        <div className="w-full md:w-1/2 flex flex-col">
          {badge && (
            <div className="bg-primary text-white text-[9px] font-medium px-2 py-1 tracking-widest uppercase w-max mb-4">
              {badge}
            </div>
          )}

          <h1 className="font-serif text-4xl uppercase mb-2">{name}</h1>
          <p className="text-lg font-medium mb-3">${price.toFixed(2)} AUD</p>

          <div className="flex items-center gap-1 mb-6 text-[11px] text-muted-foreground">
            <div className="flex text-yellow-500">
              {"★★★★★".split("").map((s, i) => <span key={i}>{s}</span>)}
            </div>
            <span className="ml-1">(128 reviews)</span>
          </div>

          <div className="text-sm leading-relaxed mb-8">
            <p className="font-bold uppercase tracking-wider text-xs mb-1">{style}</p>
            <p className="text-muted-foreground">{description}</p>
          </div>

          {shopifyProduct && shopifyProduct.options.filter((o) => !(o.values.length === 1 && o.name === "Title")).length > 0 && (
            <div className="mb-6 flex flex-col gap-4">
              {shopifyProduct.options.filter((o) => !(o.values.length === 1 && o.name === "Title")).map((option) => (
                <div key={option.name}>
                  <p className="text-[10px] font-medium uppercase tracking-widest mb-2">
                    {option.name}: <span className="text-foreground">{selectedOptions[option.name]}</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {option.values.map((value) => {
                      const isSelected = selectedOptions[option.name] === value;
                      return (
                        <button
                          key={value}
                          onClick={() => { setSelectedOptions((prev) => ({ ...prev, [option.name]: value })); setActiveImage(null); }}
                          className={`px-4 py-2 text-xs border transition-colors ${
                            isSelected
                              ? "border-primary bg-primary text-white"
                              : "border-border bg-white text-foreground hover:border-primary"
                          }`}
                        >
                          {value}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {staticProduct && (
            <div className="border border-border rounded-sm mb-6 text-xs flex flex-col bg-white">
              <div className="flex border-b border-border py-2 px-3">
                <span className="w-1/3 font-medium text-muted-foreground uppercase tracking-wider text-[10px]">STYLE</span>
                <span className="w-2/3">{staticProduct.specs.style}</span>
              </div>
              <div className="flex border-b border-border py-2 px-3">
                <span className="w-1/3 font-medium text-muted-foreground uppercase tracking-wider text-[10px]">LENGTH</span>
                <span className="w-2/3">{staticProduct.specs.length}</span>
              </div>
              <div className="flex py-2 px-3">
                <span className="w-1/3 font-medium text-muted-foreground uppercase tracking-wider text-[10px]">BAND</span>
                <span className="w-2/3">{staticProduct.specs.band}</span>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 mb-6 bg-secondary/50 p-3 text-xs">
            <Truck className="w-4 h-4 text-primary shrink-0" strokeWidth={1.5} />
            <span>Free shipping on orders over $80 Australia-wide</span>
          </div>

          <div className="flex flex-col gap-3 mb-8">
            <div className="flex items-center border border-border bg-white h-12 w-full max-w-[120px]">
              <button className="flex-1 h-full flex items-center justify-center text-lg hover:bg-secondary" onClick={() => setQuantity((q) => Math.max(1, q - 1))}>&minus;</button>
              <span className="flex-1 text-center text-sm font-medium">{quantity}</span>
              <button className="flex-1 h-full flex items-center justify-center text-lg hover:bg-secondary" onClick={() => setQuantity((q) => q + 1)}>+</button>
            </div>
            <Button className="w-full h-12 bg-primary hover:bg-primary/90 text-white rounded-none tracking-widest text-xs uppercase" onClick={handleAddToCart}>
              ADD TO CART
            </Button>
            <Button className="w-full h-12 bg-black hover:bg-black/90 text-white rounded-none flex items-center justify-center gap-2">
              Buy with <span className="font-bold tracking-tight text-sm">Apple Pay</span>
            </Button>

            <button
              onClick={() => {
                const productId = shopifyProduct?.handle ?? staticProduct?.id ?? "";
                toggleFavorite({ productId, variantId: shopifyProduct ? (getFirstVariantId(shopifyProduct) ?? "") : "", name, style, price, image });
              }}
              className={`flex items-center justify-center gap-2 mt-4 text-xs font-medium uppercase tracking-widest transition-colors ${isFavorite(shopifyProduct?.handle ?? staticProduct?.id ?? "") ? "text-primary" : "hover:text-primary"}`}
            >
              <Heart className="w-4 h-4" strokeWidth={1.5} fill={isFavorite(shopifyProduct?.handle ?? staticProduct?.id ?? "") ? "currentColor" : "none"} />
              {isFavorite(shopifyProduct?.handle ?? staticProduct?.id ?? "") ? "Saved to Wishlist" : "Add to Wishlist"}
            </button>
          </div>

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
                Information about shipping times, international delivery, and our 7-day return policy.
              </div>
            )}
          </div>
        </div>
      </div>

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
