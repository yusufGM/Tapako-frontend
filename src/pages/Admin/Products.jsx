import { useState } from "react";

export default function Products() {
  const [products, setProducts] = useState([
    { id: 1, name: "T-Shirt", price: 100, stock: 20, image: "https://via.placeholder.com/50" },
    { id: 2, name: "Sneakers", price: 200, stock: 15, image: "https://via.placeholder.com/50" },
  ]);
  const [newProduct, setNewProduct] = useState({ name: "", price: "", stock: "", image: "" });

  const addProduct = () => {
    setProducts([...products, { id: products.length + 1, ...newProduct }]);
    setNewProduct({ name: "", price: "", stock: "", image: "" });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Products</h1>
      <table className="w-full bg-white rounded shadow mb-6">
        <thead>
          <tr className="border-b">
            <th className="text-left p-2">Image</th>
            <th className="text-left p-2">Name</th>
            <th className="text-left p-2">Price</th>
            <th className="text-left p-2">Stock</th>
            <th className="text-left p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-b">
              <td className="p-2"><img src={p.image} alt={p.name} className="w-12 h-12" /></td>
              <td className="p-2">{p.name}</td>
              <td className="p-2">${p.price}</td>
              <td className="p-2">{p.stock}</td>
              <td className="p-2">
                <button className="text-blue-500 mr-2">Edit</button>
                <button className="text-red-500">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-bold mb-2">Add New Product</h2>
        <input
          type="text"
          placeholder="Name"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          className="border p-2 rounded w-full mb-2"
        />
        <input
          type="number"
          placeholder="Price"
          value={newProduct.price}
          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
          className="border p-2 rounded w-full mb-2"
        />
        <input
          type="number"
          placeholder="Stock"
          value={newProduct.stock}
          onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
          className="border p-2 rounded w-full mb-2"
        />
        <input
          type="text"
          placeholder="Image URL"
          value={newProduct.image}
          onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
          className="border p-2 rounded w-full mb-2"
        />
        <button onClick={addProduct} className="bg-blue-600 text-white px-4 py-2 rounded">
          Add Product
        </button>
      </div>
    </div>
  );
}
