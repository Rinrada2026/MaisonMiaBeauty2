import { useState, useEffect } from "react";
import { useParams } from "wouter";
import { Heart, Truck, Feather, Rabbit, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";
import { useToast } from "@/hooks/use-toast";
import { useShopifyProduct, useShopifyProducts } from "@/hooks/useShopifyProducts";
import { getProductPrice, getProductImage, ShopifyVariant, createCheckout } from "@/lib/shopify";
import { Link } from "wouter";
import { products as staticProducts } from "@/data/products";

export default function ProductDetail() {
  const { id } = useParams();
  const { addItem } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"details" | "shipping" | null>(null);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [isApplePayLoading, setIsApplePayLoading] = useState(false);
  const { products: allProducts } = useShopifyProducts();
  const relatedProducts = allProducts.filter((p) => p.handle !== id).slice(0, 5);

  const { product: shopifyProduct, loading } = useShopifyProduct(id);
  const staticProduct = staticProducts.find((p) => p.id === id);

  useEffect(() => {
    if (shopifyProduct?.variants.edges.length) {
      setSelectedVariantId(shopifyProduct.variants.edges[0].node.id);
    }
  }, [shopifyProduct]);

  const getVariantDisplayName = (variant: ShopifyVariant): string => {
    const title = variant.title;
    if (!title || title === "Default Title" || /^\d+(\.\d+)?$/.test(title.trim())) {
      return variant.selectedOptions.map((o) => o.name).join(" / ");
    }
    return title;
  };

  const selectedVariant: ShopifyVariant | null = shopifyProduct
    ? (shopifyProduct.variants.edges.find(({ node }) => node.id === selectedVariantId)?.node ??
       shopifyProduct.variants.edges[0]?.node ?? null)
    : null;

  const handleApplePay = async () => {
    if (!selectedVariant?.availableForSale) return;
    const variantId = selectedVariant?.id ?? shopifyProduct?.variants.edges[0]?.node.id;
    if (!variantId) return;
    setIsApplePayLoading(true);
    try {
      const checkoutUrl = await createCheckout([{ merchandiseId: variantId, quantity }]);
      window.location.href = checkoutUrl;
    } catch {
      toast({ title: "Checkout error", description: "Could not start checkout. Please try again." });
    } finally {
      setIsApplePayLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (shopifyProduct && selectedVariant) {
      addItem({
        productId: shopifyProduct.handle,
        variantId: selectedVariant.id,
        name: shopifyProduct.title,
        style: getVariantDisplayName(selectedVariant),
        price: parseFloat(selectedVariant.price.amount),
        quantity,
        image: selectedVariant.image?.url ?? getProductImage(shopifyProduct),
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
  const descriptionHtml = shopifyProduct?.descriptionHtml ?? null;
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


          <div className="text-sm leading-relaxed mb-8">
            <p className="font-bold uppercase tracking-wider text-xs mb-1">{style}</p>
            {descriptionHtml
              ? <div className="text-muted-foreground prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: descriptionHtml }} />
              : <p className="text-muted-foreground">{description}</p>
            }
          </div>

          {shopifyProduct && shopifyProduct.variants.edges.length > 0 && (
            <div className="mb-6">
              <p className="text-[10px] font-semibold uppercase tracking-widest mb-3 text-foreground">CHOOSE YOUR OPTION</p>
              <div className="flex flex-col gap-3">
                {shopifyProduct.variants.edges.map(({ node: variant }) => {
                  const isSelected = selectedVariantId === variant.id;
                  const variantName = getVariantDisplayName(variant);
                  const variantImg = variant.image?.url ?? getProductImage(shopifyProduct);
                  const soldOut = !variant.availableForSale;
                  return (
                    <button
                      key={variant.id}
                      onClick={() => { if (!soldOut) { setSelectedVariantId(variant.id); setActiveImage(null); } }}
                      disabled={soldOut}
                      className={`flex items-center gap-4 p-4 rounded-lg border-2 text-left transition-all ${
                        soldOut
                          ? "border-border bg-secondary/30 opacity-60 cursor-not-allowed"
                          : isSelected
                            ? "border-primary bg-white"
                            : "border-border bg-white hover:border-primary/40"
                      }`}
                    >
                      <div className={`shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                        soldOut ? "border-muted-foreground/20" : isSelected ? "border-primary" : "border-muted-foreground/40"
                      }`}>
                        {isSelected && !soldOut && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold uppercase tracking-wider text-foreground">{variantName}</p>
                          {soldOut && <span className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground border border-muted-foreground/30 px-1.5 py-0.5 rounded">Sold Out</span>}
                        </div>
                        <p className="text-sm font-semibold text-foreground mt-0.5">${parseFloat(variant.price.amount).toFixed(2)} AUD</p>
                      </div>
                      <div className="shrink-0 w-20 h-20 bg-secondary rounded-md overflow-hidden">
                        <img src={variantImg} alt={variantName} className="w-full h-full object-cover mix-blend-multiply" />
                      </div>
                    </button>
                  );
                })}
              </div>
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

          <div className="flex items-center gap-3 mb-6 bg-secondary/50 p-3 text-xs rounded-md">
            <Truck className="w-4 h-4 text-primary shrink-0" strokeWidth={1.5} />
            <span>Free shipping on orders over $80 Australia-wide</span>
          </div>

          <div className="flex flex-col gap-3 mb-8">
            <div className="flex items-center justify-between mb-1">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest mb-2 text-foreground">QUANTITY</p>
                <div className="flex items-center border border-border bg-white h-11 w-[120px]">
                  <button className="flex-1 h-full flex items-center justify-center text-lg hover:bg-secondary transition-colors" onClick={() => setQuantity((q) => Math.max(1, q - 1))}>&minus;</button>
                  <span className="flex-1 text-center text-sm font-medium">{quantity}</span>
                  <button className="flex-1 h-full flex items-center justify-center text-lg hover:bg-secondary transition-colors" onClick={() => setQuantity((q) => q + 1)}>+</button>
                </div>
              </div>
              <button
                onClick={() => {
                  const productId = shopifyProduct?.handle ?? staticProduct?.id ?? "";
                  const favVariantId = selectedVariant?.id ?? "";
                  toggleFavorite({ productId, variantId: favVariantId, name, style, price, image: mainImage });
                }}
                className={`flex items-center gap-2 text-xs font-medium uppercase tracking-widest transition-colors mt-5 ${isFavorite(shopifyProduct?.handle ?? staticProduct?.id ?? "") ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
              >
                <Heart className="w-4 h-4" strokeWidth={1.5} fill={isFavorite(shopifyProduct?.handle ?? staticProduct?.id ?? "") ? "currentColor" : "none"} />
                ADD TO WISHLIST
              </button>
            </div>

            <Button
              className="w-full h-12 rounded-none tracking-widest text-xs uppercase mt-2 disabled:opacity-60 disabled:cursor-not-allowed bg-primary hover:bg-primary/90 text-white"
              onClick={handleAddToCart}
              disabled={selectedVariant ? !selectedVariant.availableForSale : false}
            >
              {selectedVariant && !selectedVariant.availableForSale ? "SOLD OUT" : "ADD TO CART"}
            </Button>
            <Button
              className="w-full h-12 bg-black hover:bg-black/90 text-white rounded-none flex items-center justify-center gap-2 disabled:opacity-60"
              onClick={handleApplePay}
              disabled={isApplePayLoading || (selectedVariant ? !selectedVariant.availableForSale : false)}
            >
              {isApplePayLoading ? "REDIRECTING..." : <>Buy with <span className="font-bold tracking-tight text-sm">Apple Pay</span></>}
            </Button>
          </div>

          <div className="border-t border-border mt-6">
            <button
              className="w-full py-4 flex justify-between items-center text-xs font-medium tracking-widest uppercase border-b border-border"
              onClick={() => setActiveTab(activeTab === "details" ? null : "details")}
            >
              PRODUCT DETAILS <span>{activeTab === "details" ? "−" : "+"}</span>
            </button>
            {activeTab === "details" && (
              <div className="py-4 text-sm text-muted-foreground border-b border-border space-y-3 leading-relaxed">
                <p className="font-semibold text-foreground">Premium lash clusters designed for effortless salon-quality lashes at home ✨</p>
                <ul className="space-y-1">
                  <li>• Lightweight and comfortable</li>
                  <li>• Soft wispy finish</li>
                  <li>• Reusable with proper care</li>
                  <li>• Beginner-friendly application</li>
                  <li>• Cruelty free</li>
                </ul>
                <div>
                  <p className="font-medium text-foreground uppercase tracking-wider text-xs mb-1">Package includes:</p>
                  <ul className="space-y-1">
                    <li>• Lash clusters</li>
                    <li>• Luxury Maison Mia packaging</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium text-foreground uppercase tracking-wider text-xs mb-1">Full Kit option includes:</p>
                  <ul className="space-y-1">
                    <li>• Bond</li>
                    <li>• Seal</li>
                    <li>• Lash applicator</li>
                    <li>• Lash remover</li>
                  </ul>
                </div>
              </div>
            )}

            <button
              className="w-full py-4 flex justify-between items-center text-xs font-medium tracking-widest uppercase border-b border-border"
              onClick={() => setActiveTab(activeTab === "shipping" ? null : "shipping")}
            >
              SHIPPING & RETURNS <span>{activeTab === "shipping" ? "−" : "+"}</span>
            </button>
            {activeTab === "shipping" && (
              <div className="py-4 text-sm text-muted-foreground border-b border-border space-y-3 leading-relaxed">
                <p className="font-semibold text-foreground">Australia-wide shipping available 🇦🇺</p>
                <ul className="space-y-1">
                  <li>• Free shipping on orders over $80 AUD</li>
                  <li>• Orders are processed within 1–3 business days</li>
                  <li>• Tracking provided for all orders</li>
                </ul>
                <p>Due to hygiene reasons, opened lash products cannot be returned.</p>
                <p>If your order arrives damaged or incorrect, please contact us within 7 days of delivery.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <section className="mt-12 px-4 pb-8">
          <h2 className="text-center font-serif text-xl uppercase tracking-widest mb-6">You May Also Love</h2>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {relatedProducts.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.handle}`}
                className="shrink-0 w-[140px] flex flex-col gap-2"
              >
                <div className="w-[140px] h-[140px] bg-secondary overflow-hidden rounded-sm">
                  <img
                    src={getProductImage(product)}
                    alt={product.title}
                    className="w-full h-full object-cover mix-blend-multiply"
                  />
                </div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-foreground leading-tight">{product.title}</p>
                <p className="text-[11px] text-muted-foreground">${getProductPrice(product).toFixed(2)} AUD</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="bg-white border-y border-border grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-border mt-4 max-w-6xl mx-auto">
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
