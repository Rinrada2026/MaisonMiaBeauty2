import { useState, useEffect, useRef } from "react";
import { X, Search, Loader2 } from "lucide-react";
import { Link } from "wouter";
import { searchProducts, getProductImage, getProductPrice, ShopifyProduct } from "@/lib/shopify";

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
      setResults([]);
      setSearched(false);
    }
  }, [open]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      setSearched(false);
      try {
        const res = await searchProducts(query.trim());
        setResults(res);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
        setSearched(true);
      }
    }, 400);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 bg-white w-full shadow-xl flex flex-col max-h-[85vh]">
        <div className="flex items-center gap-3 px-4 h-16 border-b border-border">
          <Search className="w-5 h-5 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ค้นหาสินค้า..."
            className="flex-1 text-sm outline-none bg-transparent placeholder:text-muted-foreground"
          />
          {loading && <Loader2 className="w-4 h-4 text-muted-foreground animate-spin shrink-0" />}
          <button onClick={onClose} className="p-1 text-muted-foreground hover:text-foreground shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto">
          {!query.trim() && (
            <div className="px-4 py-10 text-center text-sm text-muted-foreground">
              พิมพ์ชื่อสินค้าที่ต้องการค้นหา
            </div>
          )}

          {searched && results.length === 0 && !loading && (
            <div className="px-4 py-10 text-center">
              <p className="text-sm text-muted-foreground">ไม่พบสินค้าที่ตรงกับ "<span className="text-foreground font-medium">{query}</span>"</p>
            </div>
          )}

          {results.length > 0 && (
            <div className="divide-y divide-border">
              {results.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.handle}`}
                  onClick={onClose}
                  className="flex items-center gap-4 px-4 py-3 hover:bg-secondary/50 transition-colors"
                >
                  <div className="w-16 h-16 bg-secondary shrink-0 overflow-hidden rounded">
                    <img
                      src={getProductImage(product)}
                      alt={product.title}
                      className="w-full h-full object-cover mix-blend-multiply"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium uppercase tracking-wider text-foreground truncate">{product.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{product.tags?.[0] ?? ""}</p>
                    <p className="text-sm font-semibold text-foreground mt-1">${getProductPrice(product).toFixed(2)} AUD</p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {results.length > 0 && (
            <div className="px-4 py-4 border-t border-border">
              <Link
                href={`/shop`}
                onClick={onClose}
                className="block text-center text-xs font-medium uppercase tracking-widest text-primary hover:text-primary/80 py-2"
              >
                ดูสินค้าทั้งหมด →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
