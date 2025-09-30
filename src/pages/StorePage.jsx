import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import ProductList from "../components/ProductList";
import { useFilterStore } from "../components/store/filterStore";
import api from "../lib/api";

const SkeletonCard = () => (
  <div className="max-w-xs bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
    <div className="h-40 bg-gray-200" />
    <div className="p-4 space-y-2">
      <div className="h-4 bg-gray-200 w-3/4" />
      <div className="h-3 bg-gray-200 w-1/2" />
    </div>
  </div>
);

function useDebouncedValue(value, delay = 400) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}

function StorePage() {
  const { filters, setFilter, toggleFilter } = useFilterStore();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const pageSize = 30;
  const mainRef = useRef(null);
  const [openMobileFilters, setOpenMobileFilters] = useState(false);
  const [q, setQ] = useState("");
  const qDebounced = useDebouncedValue(q, 450);
  const [onlyInStock, setOnlyInStock] = useState(false);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.get("/items");
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.payload?.error || err?.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(products.map((p) => p.category).filter(Boolean)))],
    [products]
  );

  const filtered = useMemo(() => {
    let list =
      selectedCategory === "All"
        ? products
        : products.filter((p) => (p.category || "") === selectedCategory);

    if (qDebounced.trim()) {
      const term = qDebounced.toLowerCase();
      list = list.filter((p) => {
        const name = (p.name || "").toLowerCase();
        const desc = (p.description || "").toLowerCase();
        return name.includes(term) || desc.includes(term);
      });
    }

    if (filters.sale) list = list.filter((p) => (p.price ?? 0) < 3000000);
    if (filters.gender !== "all")
      list = list.filter((p) => (p.gender?.toLowerCase() || "") === filters.gender);
    if (filters.ageGroup !== "all")
      list = list.filter((p) => (p.ageGroup?.toLowerCase() || "") === filters.ageGroup);
    if (onlyInStock) list = list.filter((p) => (p.stock ?? 1) > 0);
    if (filters.price === "low-high") list = [...list].sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    else if (filters.price === "high-low") list = [...list].sort((a, b) => (b.price ?? 0) - (a.price ?? 0));

    return list;
  }, [products, selectedCategory, filters, qDebounced, onlyInStock]);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(filtered.length / pageSize)), [filtered.length]);

  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);

  const pageNumbers = useMemo(() => {
    const arr = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) arr.push(i);
    } else {
      arr.push(1);
      if (page > 4) arr.push("...");
      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);
      for (let i = start; i <= end; i++) arr.push(i);
      if (page < totalPages - 3) arr.push("...");
      arr.push(totalPages);
    }
    return arr;
  }, [page, totalPages]);

  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [page, selectedCategory, filters, qDebounced]);

  useEffect(() => {
    setPage(1);
  }, [selectedCategory, filters, qDebounced, onlyInStock]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") setPage((p) => Math.max(1, p - 1));
      if (e.key === "ArrowRight") setPage((p) => Math.min(totalPages, p + 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [totalPages]);

  const clearAllFilters = () => {
    setFilter("gender", "all");
    setFilter("ageGroup", "all");
    setFilter("price", "none");
    if (filters.sale) toggleFilter("sale");
    setOnlyInStock(false);
    setSelectedCategory("All");
    setQ("");
  };

  const FiltersPanel = (
    <div className="bg-white rounded-lg shadow p-4 max-h-[80vh] overflow-y-auto space-y-6">
      <div>
        <h2 className="font-semibold text-lg mb-3">Categories</h2>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                className={`px-3 py-1.5 rounded-full border transition-colors ${
                  active ? "bg-black text-white border-black" : "bg-white hover:bg-gray-100"
                }`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      <div className="h-px bg-gray-100" />

      <div className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Gender</label>
          <select
            value={filters.gender}
            onChange={(e) => setFilter("gender", e.target.value)}
            className="w-full border rounded px-2 py-1"
          >
            <option value="all">All</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="unisex">Unisex</option>
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Age Group</label>
          <select
            value={filters.ageGroup}
            onChange={(e) => setFilter("ageGroup", e.target.value)}
            className="w-full border rounded px-2 py-1"
          >
            <option value="all">All</option>
            <option value="adult">Adult</option>
            <option value="child">Child</option>
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Urutkan Harga</label>
          <select
            value={filters.price}
            onChange={(e) => setFilter("price", e.target.value)}
            className="w-full border rounded px-2 py-1"
          >
            <option value="none">Default</option>
            <option value="low-high">Rendah → Tinggi</option>
            <option value="high-low">Tinggi → Rendah</option>
          </select>
        </div>

        <div className="flex items-center justify-between">
          <span>Sale &amp; Offers</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={filters.sale}
              onChange={() => toggleFilter("sale")}
            />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-black relative">
              <div className={`absolute top-[2px] left-[2px] h-5 w-5 bg-white border border-gray-300 rounded-full transition-all ${filters.sale ? "translate-x-5" : ""}`} />
            </div>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <span>Ready Stock</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={onlyInStock}
              onChange={() => setOnlyInStock((s) => !s)}
            />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-black relative">
              <div className={`absolute top-[2px] left-[2px] h-5 w-5 bg-white border border-gray-300 rounded-full transition-all ${onlyInStock ? "translate-x-5" : ""}`} />
            </div>
          </label>
        </div>

        <button
          onClick={clearAllFilters}
          className="w-full mt-2 px-3 py-2 rounded-lg border bg-white hover:bg-gray-100"
        >
          Reset Semua Filter
        </button>
      </div>
    </div>
  );

  return (
    <div className="h-full bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm flex-shrink-0">
        <div className="container mx-auto px-4 py-4 flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-800">Store</h1>
          <div className="ml-auto flex-1 max-w-xl">
            <label className="sr-only" htmlFor="search">Search</label>
            <div className="relative">
              <input
                id="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Cari produk, model, brand…"
                className="w-full border rounded-lg px-3 py-2 pr-10"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">⌘K</span>
            </div>
          </div>
          <button
            onClick={() => setOpenMobileFilters(true)}
            className="md:hidden px-3 py-2 rounded-lg border bg-white hover:bg-gray-100"
          >
            Filter
          </button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 flex gap-6">
        <aside className="hidden md:block w-72 flex-shrink-0">
          <div className="sticky top-28">{FiltersPanel}</div>
        </aside>

        <main ref={mainRef} className="flex-1 overflow-y-auto pr-2">
          <div className="mb-4 text-sm text-gray-600">
            {loading ? "Memuat produk…" : `${filtered.length} produk ditemukan`}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 9 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : error ? (
            <div className="py-10 text-center space-y-3">
              <p className="text-red-500">{error}</p>
              <button
                onClick={fetchProducts}
                className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-100"
              >
                Coba lagi
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <p className="text-lg font-semibold">Tidak ada produk cocok</p>
              <p className="text-gray-500">Coba hapus beberapa filter atau ubah kata kunci pencarian.</p>
              <button
                onClick={clearAllFilters}
                className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-100"
              >
                Reset filter
              </button>
            </div>
          ) : (
            <>
              <ProductList products={paginated} />

              <div className="sticky bottom-0 mt-6 bg-gray-50/90 backdrop-blur border-t">
                <div className="py-3 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-sm text-gray-600 px-1">
                    Menampilkan {(page - 1) * pageSize + 1}
                    {"–"}
                    {Math.min(page * pageSize, filtered.length)} dari {filtered.length} produk
                  </span>

                  <div className="flex items-center gap-2 px-1">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-3 py-1.5 rounded border bg-white disabled:opacity-50"
                    >
                      ‹ Prev
                    </button>

                    {pageNumbers.map((p, idx) =>
                      p === "..." ? (
                        <span key={`dots-${idx}`} className="px-2 select-none">…</span>
                      ) : (
                        <button
                          key={p}
                          onClick={() => setPage(p)}
                          className={`px-3 py-1.5 rounded border ${
                            p === page ? "bg-black text-white border-black" : "bg-white hover:bg-gray-100"
                          }`}
                          aria-current={p === page ? "page" : undefined}
                        >
                          {p}
                        </button>
                      )
                    )}

                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="px-3 py-1.5 rounded border bg-white disabled:opacity-50"
                    >
                      Next ›
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>

      {openMobileFilters && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpenMobileFilters(false)} />
          <div className="absolute right-0 top-0 h-full w-11/12 max-w-sm bg-white shadow-xl p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">Filter</h2>
              <button
                onClick={() => setOpenMobileFilters(false)}
                className="px-3 py-1.5 rounded-lg border bg-white hover:bg-gray-100"
              >
                Tutup
              </button>
            </div>
            {FiltersPanel}
          </div>
        </div>
      )}
    </div>
  );
}

export default StorePage;
