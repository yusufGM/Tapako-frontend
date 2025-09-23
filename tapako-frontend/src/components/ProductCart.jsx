import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import useCartStore from "./store/useCartStore";
import api from "../lib/api";

const ProductCart = ({ category, limit = 12 }) => {
  const { addToCart, openDrawer } = useCartStore();
  const [items, setItems] = useState([]);
  const rowRef = useRef(null);

  useEffect(() => {
    api.get("/items")
      .then((data) => {
        let filtered = data;
        if (category) {
          filtered = filtered.filter(
            (item) => item.category?.toLowerCase() === category.toLowerCase()
          );
        }
        setItems(filtered.slice(0, limit));
      })
      .catch((err) => console.error("GET /items error:", err));
  }, [category, limit]);

  const handleAddToCart = (item) => {
    addToCart({
      _id: item._id,
      name: item.name,
      price: item.price,
      imgSrc: item.imgSrc,
      qty: 1
    });
    openDrawer();
  };

  return (
    <div className="w-full">
      <div ref={rowRef} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((item) => (
          <div key={item._id} className="bg-white rounded-xl shadow-md overflow-hidden">
            <Link to={`/product/${item._id}`} className="block aspect-square bg-gray-50">
              <img
                src={item.imgSrc}
                alt={item.name}
                className="w-full h-full object-contain bg-white"
                onError={(e) => { e.currentTarget.src = "/fallback.png"; }}
              />
            </Link>
            <div className="p-3">
              <div className="font-medium">{item.name}</div>
              <div className="text-sm text-gray-500">Rp{Number(item.price || 0).toLocaleString("id-ID")}</div>
              <button
                className="mt-2 w-full rounded-lg bg-black text-white py-2"
                onClick={() => handleAddToCart(item)}
              >
                Tambah ke Keranjang
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductCart;
