import { useEffect, useMemo, useRef, useState } from "react";
import useUserStore from "../../components/store/useUserStore";
import { apiGet, apiPost, apiPatch, apiDelete } from "../../lib/api";

const formatIDR = (n = 0) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 })
    .format(Math.max(0, Number(n) || 0))
    .replace(/\s/g, "");

function AddProductPanel({ open, toggle, onCreated }) {
  const { token } = useUserStore();
  const [name, setName] = useState("");
  const [imgSrc, setImgSrc] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  const valid = useMemo(() => {
    const p = Number(price);
    return name.trim().length > 0 && imgSrc.trim().length > 0 && Number.isFinite(p) && p > 0;
  }, [name, imgSrc, price]);

  const submit = async (e) => {
    e.preventDefault();
    if (!valid || saving) return;
    setSaving(true);
    try {
      const body = {
        name: name.trim(),
        imgSrc: imgSrc.trim(),
        price: Number(price),
        category: category.trim() || undefined,
        description: description.trim() || undefined,
        status: "active"
      };
      await apiPost("/admin/items", body, { headers: { Authorization: `Bearer ${token}` } });
      setName(""); setImgSrc(""); setPrice(""); setCategory(""); setDescription("");
      onCreated?.();
      toggle();
    } catch (err) {
      alert(err?.payload?.error || "Gagal menambahkan produk");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border">
      <button type="button" onClick={toggle} className="w-full flex items-center justify-between px-4 py-3 rounded-t-xl">
        <span className="text-lg font-semibold">Add Product</span>
        <span className={`transition-transform ${open ? "rotate-180" : ""}`}>▾</span>
      </button>
      {open && (
        <div className="p-4 pt-0">
          <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="border rounded px-3 py-2" required />
            <input value={imgSrc} onChange={(e) => setImgSrc(e.target.value)} placeholder="Image URL" className="border rounded px-3 py-2" required />
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price" className="border rounded px-3 py-2" required />
            <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category" className="border rounded px-3 py-2" />
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" className="md:col-span-2 border rounded px-3 py-2" rows={3} />
            <div className="md:col-span-2 flex justify-end">
              <button disabled={!valid || saving} className="px-4 py-2 rounded bg-black text-white disabled:opacity-50">
                {saving ? "Saving..." : "Save Product"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function EditModal({ item, onClose, onSaved }) {
  const { token } = useUserStore();
  const [form, setForm] = useState(() => ({
    name: item?.name || "",
    imgSrc: item?.imgSrc || "",
    price: item?.price || 0,
    category: item?.category || "",
    description: item?.description || "",
    status: item?.status || "active",
    version: item?.version ?? 0
  }));
  useEffect(() => {
    setForm({
      name: item?.name || "",
      imgSrc: item?.imgSrc || "",
      price: item?.price || 0,
      category: item?.category || "",
      description: item?.description || "",
      status: item?.status || "active",
      version: item?.version ?? 0
    });
  }, [item]);

  const valid = form.name.trim() && form.imgSrc.trim() && Number(form.price) > 0;

  const submit = async (e) => {
    e.preventDefault();
    if (!valid) return;
    try {
      await apiPatch(`/admin/items/${item._id}`, {
        name: form.name.trim(),
        imgSrc: form.imgSrc.trim(),
        price: Number(form.price),
        category: form.category.trim() || undefined,
        description: form.description.trim() || undefined,
        status: form.status,
        version: form.version ?? 0
      }, { headers: { Authorization: `Bearer ${token}` } });
      onSaved?.();
      onClose?.();
    } catch (err) {
      alert(err?.payload?.error || "Gagal menyimpan");
    }
  };

  if (!item) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-xl">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="font-semibold">Edit Product</div>
          <button onClick={onClose} className="px-2 py-1 rounded border">Close</button>
        </div>
        <form onSubmit={submit} className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          <input value={form.name} onChange={(e) => setForm(s => ({ ...s, name: e.target.value }))} placeholder="Name" className="border rounded px-3 py-2" required />
          <input value={form.imgSrc} onChange={(e) => setForm(s => ({ ...s, imgSrc: e.target.value }))} placeholder="Image URL" className="border rounded px-3 py-2" required />
          <input type="number" value={form.price} onChange={(e) => setForm(s => ({ ...s, price: e.target.value }))} placeholder="Price" className="border rounded px-3 py-2" required />
          <input value={form.category} onChange={(e) => setForm(s => ({ ...s, category: e.target.value }))} placeholder="Category" className="border rounded px-3 py-2" />
          <textarea value={form.description} onChange={(e) => setForm(s => ({ ...s, description: e.target.value }))} placeholder="Description" className="md:col-span-2 border rounded px-3 py-2" rows={3} />
          <select value={form.status} onChange={(e) => setForm(s => ({ ...s, status: e.target.value }))} className="border rounded px-3 py-2">
            <option value="active">active</option>
            <option value="draft">draft</option>
            <option value="archived">archived</option>
          </select>
          <div className="md:col-span-2 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded border bg-white">Batal</button>
            <button disabled={!valid} className="px-4 py-2 rounded bg-black text-white disabled:opacity-50">Simpan</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Products() {
  const { token } = useUserStore();
  const [openAdd, setOpenAdd] = useState(true);

  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 15;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("updatedDesc");
  const [q, setQ] = useState("");
  const [knownCategories, setKnownCategories] = useState([]);

  const [editing, setEditing] = useState(null);

  const pagerRef = useRef(null);
  const pages = Math.max(1, Math.ceil(total / limit));

  const buildSortParam = () => {
    if (sort === "priceAsc") return "price:asc";
    if (sort === "priceDesc") return "price:desc";
    if (sort === "updatedAsc") return "updatedAt:asc";
    return "updatedAt:desc";
  };

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const qs = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        sort: buildSortParam()
      });
      const qTrim = q.trim();
      if (qTrim) {
        qs.set("q", qTrim);
        qs.set("search", qTrim);
      }
      if (category !== "all") qs.set("category", category);
      const data = await apiGet(`/admin/items?${qs.toString()}`, { headers: { Authorization: `Bearer ${token}` } });
      const items = data.items || [];
      setRows(items);
      setTotal(data.total || 0);
      const cats = Array.from(new Set(items.map(i => i.category).filter(Boolean)));
      setKnownCategories(prev => Array.from(new Set([...prev, ...cats])));
    } catch (e) {
      setError(e?.payload?.error || "Gagal memuat produk");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [page, category, sort, q]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") setPage((p) => Math.min(pages, p + 1));
      if (e.key === "ArrowLeft") setPage((p) => Math.max(1, p - 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pages]);

  const goPrev = () => { setPage((p) => Math.max(1, p - 1)); pagerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }); };
  const goNext = () => { setPage((p) => Math.min(pages, p + 1)); pagerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }); };

  const doDelete = async (id) => {
    if (!confirm("Hapus item ini?")) return;
    try {
      await apiDelete(`/admin/items/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      load();
    } catch (e) {
      alert(e?.payload?.error || "Gagal hapus");
    }
  };

  const doRestore = async (id) => {
    try {
      await apiPost(`/admin/items/${id}/restore`, {}, { headers: { Authorization: `Bearer ${token}` } });
      load();
    } catch (e) {
      alert(e?.payload?.error || "Gagal restore");
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Products</h1>

      <AddProductPanel open={openAdd} toggle={() => setOpenAdd((v) => !v)} onCreated={() => { setPage(1); load(); }} />

      <div className="bg-white rounded-xl border p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-600 mb-1">Cari</label>
            <input
              value={q}
              onChange={(e) => { setPage(1); setQ(e.target.value); }}
              placeholder="Ketik nama produk atau username"
              className="border rounded px-3 py-2"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-600 mb-1">Kategori</label>
            <select value={category} onChange={(e) => { setPage(1); setCategory(e.target.value); }} className="border rounded px-3 py-2">
              <option value="all">Semua</option>
              {knownCategories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-600 mb-1">Urutkan</label>
            <select value={sort} onChange={(e) => { setPage(1); setSort(e.target.value); }} className="border rounded px-3 py-2">
              <option value="updatedDesc">Ter-update terbaru</option>
              <option value="updatedAsc">Ter-update terlama</option>
              <option value="priceAsc">Harga rendah ke tinggi</option>
              <option value="priceDesc">Harga tinggi ke rendah</option>
            </select>
          </div>
          <div className="flex items-end text-sm text-gray-600">
            Menampilkan {rows.length} dari total {total} item
          </div>
        </div>
      </div>

      <div className="border rounded-xl bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3">Image</th>
                <th className="text-left p-3">Name</th>
                <th className="text-left p-3">Price</th>
                <th className="text-left p-3">Category</th>
                <th className="text-left p-3">Updated</th>
                <th className="text-left p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="p-4">Loading...</td></tr>
              ) : error ? (
                <tr><td colSpan={6} className="p-4 text-red-600">{error}</td></tr>
              ) : rows.length === 0 ? (
                <tr><td colSpan={6} className="p-4 text-gray-600">Tidak ada data</td></tr>
              ) : (
                rows.map((p) => (
                  <tr key={p._id} className={`border-t ${p.deletedAt ? "opacity-60" : ""}`}>
                    <td className="p-3">
                      <img src={p.imgSrc} alt={p.name} className="w-12 h-12 object-cover rounded" />
                    </td>
                    <td className="p-3">{p.name}</td>
                    <td className="p-3">{formatIDR(p.price)}</td>
                    <td className="p-3">{p.category || "-"}</td>
                    <td className="p-3">{p.updatedAt ? new Date(p.updatedAt).toLocaleString("id-ID") : "-"}</td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <button onClick={() => setEditing(p)} className="px-2 py-1 rounded border">Edit</button>
                        {!p.deletedAt ? (
                          <button onClick={() => doDelete(p._id)} className="px-2 py-1 rounded border">Delete</button>
                        ) : (
                          <button onClick={() => doRestore(p._id)} className="px-2 py-1 rounded border">Restore</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div ref={pagerRef} className="flex items-center justify-between p-3 border-t bg-gray-50">
          <button onClick={goPrev} disabled={page <= 1} className="px-3 py-2 rounded border bg-white disabled:opacity-50">‹ Prev</button>
          <div className="text-sm">Hal {page} dari {pages}</div>
          <button onClick={goNext} disabled={page >= pages} className="px-3 py-2 rounded border bg-white disabled:opacity-50">Next ›</button>
        </div>
      </div>

      {editing && <EditModal item={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load(); }} />}
    </div>
  );
}
