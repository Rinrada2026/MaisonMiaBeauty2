import { Heart } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/context/FavoritesContext";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import { useShopifyProducts } from "@/hooks/useShopifyProducts";

export default function Favorites() {
  const { favorites, removeFavorite } = useFavorites();
  const { addItem } = useCart();
  const { toast } = useToast();
  const { products: shopifyProducts } = useShopifyProducts();

  const isSoldOut = (productId: string): boolean => {
    const product = shopifyProducts.find(
      (p) => p.handle === productId || p.id === productId
    );
    if (!product) return false;
    return product.variants.edges.every(({ node }) => !node.availableForSale);
  };

  const handleAddToCart = (item: typeof favorites[0]) => {
    if (isSoldOut(item.productId)) return;
    addItem({
      productId: item.productId,
      variantId: item.variantId,
      name: item.name,
      style: item.style,
      price: item.price,
      quantity: 1,
      image: item.image,
    });
    toast({ title: "Added to cart", description: `${item.name} added to your cart.` });
  };

  if (favorites.length === 0) {
    return (
      <main className="min-h-[80vh] flex flex-col items-center justify-center p-6 bg-background">
        <Heart className="w-12 h-12 text-primary mb-6" strokeWidth={1} />
        <h1 className="font-serif text-4xl mb-4">Your Wishlist</h1>
        <p className="text-muted-foreground mb-8 text-center text-sm">
          Save your favourite lashes here and come back to them anytime.
        </p>
        <Link href="/shop">
          <Button className="h-12 px-8 bg-primary hover:bg-primary/90 text-white rounded-none tracking-widest text-xs uppercase">
            BROWSE LASHES
          </Button>
        </Link>
      </main>
    );
  }

  return (
    <main className="pb-32 bg-background min-h-screen">
      <div className="pt-10 pb-8 text-center px-4 flex flex-col items-center">
        <p className="text-[10px] tracking-[0.2em] font-medium text-primary mb-2 uppercase">WISHLIST</p>
        <h1 className="font-serif text-4xl mb-4">Your Favourites</h1>
        <Heart className="w-5 h-5 text-primary" strokeWidth={1} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-border max-w-6xl mx-auto">
        {favorites.map((item) => {
          const soldOut = isSoldOut(item.productId);
          return (
            <div key={item.productId} className="bg-white flex flex-col relative group">
              <Link href={`/product/${item.productId}`} className="block">
                <div className="relative aspect-square bg-secondary">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover mix-blend-multiply" />
                  <button
                    onClick={(e) => { e.preventDefault(); removeFavorite(item.productId); }}
                    className="absolute top-3 right-3 p-1.5 bg-white/80 backdrop-blur rounded-full text-primary z-10"
                  >
                    <Heart className="w-4 h-4 fill-primary" strokeWidth={1.5} />
                  </button>
                </div>
              </Link>
              <div className="p-4 flex flex-col flex-grow gap-2">
                <Link href={`/product/${item.productId}`}>
                  <h3 className="text-xs font-medium tracking-[0.15em] uppercase">{item.name}</h3>
                  <p className="text-xs text-muted-foreground">{item.style}</p>
                  <p className="text-sm font-medium mt-1">${item.price.toFixed(2)}</p>
                </Link>
                {soldOut ? (
                  <div className="w-full h-9 border border-muted-foreground/30 flex items-center justify-center mt-auto">
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Sold Out</span>
                  </div>
                ) : (
                  <Button
                    className="w-full h-9 bg-primary hover:bg-primary/90 text-white rounded-none tracking-widest text-[10px] uppercase mt-auto"
                    onClick={() => handleAddToCart(item)}
                  >
                    ADD TO CART
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
