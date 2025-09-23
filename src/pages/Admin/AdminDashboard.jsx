import { useEffect, useState, useCallback } from 'react';
import useUserStore from '../../components/store/useUserStore';
import { apiGet, apiPut, apiDelete } from '../../lib/api';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [editProduct, setEditProduct] = useState(null);
  const [loadingList, setLoadingList] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);

  const { token } = useUserStore();
  const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

  const fetchProducts = useCallback(async () => {
    try {
      setLoadingList(true);
      const data = await apiGet('/items', { headers: { ...authHeader } });
      setProducts(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('GET /items error:', e);
      setProducts([]);
    } finally {
      setLoadingList(false);
    }
  }, [token]); // authHeader bergantung pada token

  const fetchOrders = useCallback(async () => {
    try {
      const data = await apiGet('/orders', { headers: { ...authHeader } });
      setOrders(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('GET /orders error:', e);
      setOrders([]);
    }
  }, [token]);

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, [fetchProducts, fetchOrders]);

  const handleDelete = async (id) => {
    if (!confirm('Yakin ingin hapus produk ini?')) return;
    try {
      await apiDelete(`/items/${id}`, { headers: { ...authHeader } });
      fetchProducts();
    } catch (e) {
      alert(e?.payload?.error || 'Gagal menghapus produk');
    }
  };

  const handleUpdate = async () => {
    if (!editProduct?._id) return;
    try {
      setSavingEdit(true);
      const payload = {
        name: editProduct.name,
        price: Number(editProduct.price) || 0,
        imgSrc: editProduct.imgSrc,
        description: editProduct.description,
        category: editProduct.category
      };
      await apiPut(`/items/${editProduct._id}`, payload, { headers: { ...authHeader } });
      setEditProduct(null);
      fetchProducts();
    } catch (e) {
      alert(e?.payload?.error || 'Gagal menyimpan perubahan');
    } finally {
      setSavingEdit(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto pt-24">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>

      <h2 className="text-xl font-semibold mb-2">Semua Produk</h2>
      {loadingList ? (
        <div className="mb-8 p-4 rounded bg-gray-50">Memuat produk…</div>
      ) : (
        <table className="w-full mb-8 border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Nama</th>
              <th className="p-2">Harga</th>
              <th className="p-2">Kategori</th>
              <th className="p-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {products.map((item) => (
              <tr key={item._id} className="border-t">
                <td className="p-2">{item.name}</td>
                <td className="p-2">Rp {Number(item.price || 0).toLocaleString('id-ID')}</td>
                <td className="p-2">{item.category}</td>
                <td className="p-2 space-x-2">
                  <button onClick={() => setEditProduct(item)} className="px-3 py-1 bg-yellow-500 text-white rounded">Edit</button>
                  <button onClick={() => handleDelete(item._id)} className="px-3 py-1 bg-red-600 text-white rounded">Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {editProduct && (
        <div className="mb-8 bg-gray-100 p-4 rounded">
          <h3 className="text-lg font-bold mb-2">Edit Produk</h3>
          <div className="grid md:grid-cols-2 gap-2">
            <input
              type="text"
              value={editProduct.name || ''}
              onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
              className="block w-full p-2 border rounded"
              placeholder="Nama"
            />
            <input
              type="number"
              value={editProduct.price ?? 0}
              onChange={(e) => setEditProduct({ ...editProduct, price: Number(e.target.value) })}
              className="block w-full p-2 border rounded"
              placeholder="Harga"
            />
            <input
              type="text"
              value={editProduct.imgSrc || ''}
              onChange={(e) => setEditProduct({ ...editProduct, imgSrc: e.target.value })}
              className="block w-full p-2 border rounded md:col-span-2"
              placeholder="URL Gambar"
            />
            <input
              type="text"
              value={editProduct.category || ''}
              onChange={(e) => setEditProduct({ ...editProduct, category: e.target.value })}
              className="block w-full p-2 border rounded"
              placeholder="Kategori"
            />
            <textarea
              value={editProduct.description || ''}
              onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })}
              className="block w-full p-2 border rounded md:col-span-2"
              rows={3}
              placeholder="Deskripsi"
            />
          </div>
          <div className="mt-3 space-x-2">
            <button
              onClick={handleUpdate}
              className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-60"
              disabled={savingEdit}
            >
              {savingEdit ? 'Menyimpan…' : 'Simpan'}
            </button>
            <button onClick={() => setEditProduct(null)} className="bg-gray-300 text-gray-900 px-4 py-2 rounded">
              Batal
            </button>
          </div>
        </div>
      )}

      <h2 className="text-xl font-semibold mb-2">Riwayat Pesanan</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">User</th>
            <th className="p-2">Item</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o._id} className="border-t">
              <td className="p-2">{o.username || o.user}</td>
              <td className="p-2">
                {o.items?.map((it, i) => (
                  <div key={i}>
                    {it.name} - Rp {Number(it.price || 0).toLocaleString('id-ID')}
                  </div>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminDashboard;
