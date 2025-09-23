import { useState, useEffect, useMemo, useRef } from 'react';
import ProductList from '../components/ProductList';
import { useFilterStore } from '../components/store/filterStore';
import api from '../lib/api';

const SkeletonCard = () => (
  <div className="max-w-xs bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
    <div className="h-40 bg-gray-200" />
    <div className="p-4 space-y-2">
      <div className="h-4 bg-gray-200 w-3/4" />
      <div className="h-3 bg-gray-200 w-1/2" />
    </div>
  </div>
);

function StorePage() {
  const { filters, setFilter, toggleFilter } = useFilterStore();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const pageSize = 30;
  const mainRef = useRef(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await api.get('/items');
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(products.map((p) => p.category).filter(Boolean)))],
    [products]
  );

  const filtered = useMemo(() => {
    let list =
      selectedCategory === 'All' ? products : products.filter((p) => p.category === selectedCategory);

    if (filters.sale) list = list.filter((p) => (p.price ?? 0) < 3000000);
    if (filters.gender !== 'all')
      list = list.filter((p) => (p.gender?.toLowerCase() || '') === filters.gender);
    if (filters.ageGroup !== 'all')
      list = list.filter((p) => (p.ageGroup?.toLowerCase() || '') === filters.ageGroup);

    if (filters.price === 'low-high') list = [...list].sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    else if (filters.price === 'high-low') list = [...list].sort((a, b) => (b.price ?? 0) - (a.price ?? 0));

    return list;
  }, [products, selectedCategory, filters]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(filtered.length / pageSize)),
    [filtered.length]
  );

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
      if (page > 4) arr.push('...');
      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);
      for (let i = start; i <= end; i++) arr.push(i);
      if (page < totalPages - 3) arr.push('...');
      arr.push(totalPages);
    }
    return arr;
  }, [page, totalPages]);

  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [page, selectedCategory, filters]);

  useEffect(() => {
    setPage(1);
  }, [selectedCategory, filters]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  return (
    <div className="h-full bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm flex-shrink-0">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-800">Store</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 flex gap-6">

        <main ref={mainRef} className="flex-1 overflow-y-auto pr-2">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : error ? (
            <p className="text-center py-10 text-red-500">{error}</p>
          ) : (
            <>
              <ProductList products={paginated} />

              <div className="sticky bottom-0 mt-6 bg-gray-50/90 backdrop-blur border-t">
                <div className="py-3 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-sm text-gray-600 px-1">
                    Menampilkan {(page - 1) * pageSize + 1}
                    {'–'}
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
                      p === '...' ? (
                        <span key={`dots-${idx}`} className="px-2 select-none">…</span>
                      ) : (
                        <button
                          key={p}
                          onClick={() => setPage(p)}
                          className={`px-3 py-1.5 rounded border ${
                            p === page ? 'bg-black text-white border-black' : 'bg-white hover:bg-gray-100'
                          }`}
                          aria-current={p === page ? 'page' : undefined}
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
    </div>
  );
}

export default StorePage;
