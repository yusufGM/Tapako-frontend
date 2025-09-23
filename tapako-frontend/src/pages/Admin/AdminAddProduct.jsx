import { useState } from 'react';

const AdminAddProduct = () => {
  const [title, setTitle] = useState('');
  const [image, setImage] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Sepatu');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newItem = {
      name: title,
      imgSrc: image,
      price: parseFloat(price),
      description,
      category,
    };

    try {
      const res = await fetch('http://localhost:5000/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });

      if (!res.ok) throw new Error('Gagal menambahkan produk');
      alert('Produk berhasil ditambahkan');
      setTitle('');
      setImage('');
      setPrice('');
      setDescription('');
      setCategory('Sepatu');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Tambah Produk</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" placeholder="Nama Produk" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border px-3 py-2 rounded" required />
        <input type="text" placeholder="Link Gambar" value={image} onChange={(e) => setImage(e.target.value)} className="w-full border px-3 py-2 rounded" required />
        <input type="number" placeholder="Harga" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full border px-3 py-2 rounded" required />
        <textarea placeholder="Deskripsi" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border px-3 py-2 rounded" rows={3} required />
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border px-3 py-2 rounded">
          <option value="Sepatu">Sepatu</option>
          <option value="Sneakers">Sneakers</option>
          <option value="Running">Running</option>
          <option value="Formal">Formal</option>
        </select>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">Simpan Produk</button>
      </form>
    </div>
  );
};

export default AdminAddProduct;
