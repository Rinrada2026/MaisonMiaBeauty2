import { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";
import { createCheckout } from "@/lib/shopify";

export type CartItem = {
  productId: string;
  variantId: string;
  name: string;
  style: string;
  price: number;
  quantity: number;
  image: string;
};

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  total: number;
  itemCount: number;
  checkout: () => Promise<void>;
  isCheckingOut: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem("maison-mia-cart");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [pendingCheckoutUrl, setPendingCheckoutUrl] = useState<string | null>(
    () => localStorage.getItem("maison-mia-checkout-url")
  );
  const syncTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    localStorage.setItem("maison-mia-cart", JSON.stringify(items));

    if (syncTimerRef.current) clearTimeout(syncTimerRef.current);

    const lines = items
      .filter((item) => item.variantId)
      .map((item) => ({ merchandiseId: item.variantId, quantity: item.quantity }));

    if (lines.length === 0) {
      setPendingCheckoutUrl(null);
      localStorage.removeItem("maison-mia-checkout-url");
      return;
    }

    syncTimerRef.current = setTimeout(async () => {
      try {
        const url = await createCheckout(lines);
        setPendingCheckoutUrl(url);
        localStorage.setItem("maison-mia-checkout-url", url);
      } catch {
        // silent — user can still checkout manually
      }
    }, 1500);
  }, [items]);

  const addItem = (newItem: CartItem) => {
    setItems((currentItems) => {
      const existing = currentItems.find((item) => item.productId === newItem.productId);
      if (existing) {
        return currentItems.map((item) =>
          item.productId === newItem.productId
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
      }
      return [...currentItems, newItem];
    });
  };

  const removeItem = (productId: string) => {
    setItems((currentItems) => currentItems.filter((item) => item.productId !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setItems((currentItems) => {
      if (quantity <= 0) {
        return currentItems.filter((item) => item.productId !== productId);
      }
      return currentItems.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      );
    });
  };

  const checkout = async () => {
    if (items.length === 0) return;
    setIsCheckingOut(true);
    try {
      if (pendingCheckoutUrl) {
        window.location.href = pendingCheckoutUrl;
        return;
      }

      const lines = items
        .filter((item) => item.variantId)
        .map((item) => ({ merchandiseId: item.variantId, quantity: item.quantity }));

      if (lines.length === 0) {
        window.location.href = `https://${import.meta.env.VITE_SHOPIFY_STORE_DOMAIN}/cart`;
        return;
      }

      const checkoutUrl = await createCheckout(lines);
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error("Checkout error:", error);
      window.location.href = `https://${import.meta.env.VITE_SHOPIFY_STORE_DOMAIN}/cart`;
    } finally {
      setIsCheckingOut(false);
    }
  };

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, total, itemCount, checkout, isCheckingOut }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
