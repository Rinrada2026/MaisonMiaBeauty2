import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type FavoriteItem = {
  productId: string;
  variantId: string;
  name: string;
  style: string;
  price: number;
  image: string;
};

interface FavoritesContextType {
  favorites: FavoriteItem[];
  addFavorite: (item: FavoriteItem) => void;
  removeFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  toggleFavorite: (item: FavoriteItem) => void;
  favoriteCount: number;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteItem[]>(() => {
    try {
      const stored = localStorage.getItem("maison-mia-favorites");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("maison-mia-favorites", JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (item: FavoriteItem) => {
    setFavorites((prev) => {
      if (prev.find((f) => f.productId === item.productId)) return prev;
      return [...prev, item];
    });
  };

  const removeFavorite = (productId: string) => {
    setFavorites((prev) => prev.filter((f) => f.productId !== productId));
  };

  const isFavorite = (productId: string) => {
    return favorites.some((f) => f.productId === productId);
  };

  const toggleFavorite = (item: FavoriteItem) => {
    if (isFavorite(item.productId)) {
      removeFavorite(item.productId);
    } else {
      addFavorite(item);
    }
  };

  const favoriteCount = favorites.length;

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite, toggleFavorite, favoriteCount }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}
