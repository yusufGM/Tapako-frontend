import { useEffect, useState } from 'react';
import useUserStore from '../components/store/useUserStore';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [editProduct, setEditProduct] = useState(null);
  const { token } = useUserStore();

  const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

  const fetchProducts = async () => {
    const res = await fetch('http://localhost:5000/items', { headers: authHeader });
    const data = await res.json();
    setProducts(Array.isArray(data) ? data : []);
  };

  const fetchOrders = async () => {
    const res = await fetch('http://localhost:5000/orders', { headers: authHeader });
    const data = await res.json();
    setOrders(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Yakin ingin hapus produk ini?')) return;
    await fetch(`http://localhost:5000/items/${id}`, { method: 'DELETE', headers: { 'Content-Type': 'application/json', ...authHeader } });
    fetchProducts();
  };

  const handleUpdate = async () => {
    await fetch(`http://localhost:5000/items/${editProduct._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...authHeader },
      body: JSON.stringify(editProduct),
    });
    setEditProduct(null);
    fetchProducts();
  };

  return (
    <div className="p-6 max-w-6xl mx-auto pt-24">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>

      <h2 className="text-xl font-semibold mb-2">Semua Produk</h2>
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

      {editProduct && (
        <div className="mb-8 bg-gray-100 p-4 rounded">
          <h3 className="text-lg font-bold mb-2">Edit Produk</h3>
          <input type="text" value={editProduct.name} onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })} className="block w-full mb-2 p-2 border" />
          <input type="number" value={editProduct.price} onChange={(e) => setEditProduct({ ...editProduct, price: Number(e.target.value) })} className="block w-full mb-2 p-2 border" />
          <button onClick={handleUpdate} className="bg-blue-600 text-white px-4 py-2 rounded">Simpan</button>
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
                  <div key={i}>{it.name} - Rp {Number(it.price || 0).toLocaleString('id-ID')}</div>
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
