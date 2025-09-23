import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import useCartStore from "../components/store/UseCartStore";
import { toast } from "sonner";
import { api } from "../lib/api";

const safeSrc = (src) => src || '/fallback.png';

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [other, setOther] = useState([]);
  const [loading, setLoading] = useState(true);
  const addToCart = useCartStore((s) => s.addToCart);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(api(`/items/${id}`)).then((r) => r.json()),
      fetch(api('/items')).then((r) => r.json()),
    ])
      .then(([p, items]) => {
        setProduct(p);
        setOther((Array.isArray(items) ? items : []).filter((x) => x._id !== id));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="text-center py-10 text-xl font-semibold">Memuat...</p>;
  if (!product) return <p className="text-center py-10">Produk tidak ditemukan</p>;

  const handleAdd = () => {
    addToCart({ _id: product._id, name: product.name, price: product.price, imgSrc: product.imgSrc });
    toast.success('Produk ditambahkan ke keranjang!');
  };

  return (
    <div className="max-w-7xl mx-auto pt-24 px-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <img src={safeSrc(product.imgSrc)} alt={product.name} className="w-full rounded-lg shadow-lg object-cover" onError={(e) => (e.currentTarget.src = '/fallback.png')} />
        </div>
        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="mt-4 text-gray-600">{product.description}</p>
          <p className="mt-6 text-2xl font-semibold">Rp{Number(product.price || 0).toLocaleString('id-ID')}</p>
          <button onClick={handleAdd} className="mt-6 bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-3 rounded-lg hover:opacity-90 transition">
            Add to Cart
          </button>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Produk Lainnya</h2>
          <div className="space-y-4">
            {other.slice(0, 5).map((item) => (
              <Link to={`/product/${item._id}`} key={item._id} className="flex items-center space-x-4 border rounded-lg p-3 hover:shadow-lg transition">
                <img src={safeSrc(item.imgSrc)} alt={item.name} className="w-16 h-16 object-cover rounded" onError={(e) => (e.currentTarget.src = '/fallback.png')} />
                <div>
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-gray-600">Rp{Number(item.price || 0).toLocaleString('id-ID')}</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-4">
            <Link to="/store" className="block text-center bg-gradient-to-r from-orange-500 to-red-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition">
              Lihat Semua Produk
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
