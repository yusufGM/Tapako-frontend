import useCartStore from "./store/UseCartStore";
import { Link } from "react-router-dom";

const FallbackImg = (props) => (
  <img {...props} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/fallback.png'; }} />
);

const ProductList = ({ products }) => {
  const { addToCart, openDrawer } = useCartStore();

  const handleAdd = (item) => {
    addToCart({ _id: item._id, name: item.name, price: item.price, imgSrc: item.imgSrc });
    openDrawer();
  };

  if (!products || products.length === 0) {
    return (
      <div className="w-full text-center py-8">
        <p className="text-gray-500">No products found in this category.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {products.map((product) => (
          <div key={product._id} className="max-w-xs bg-white rounded-xl shadow-md overflow-hidden relative">
            <Link to={`/product/${product._id}`}>
              <div className="relative w-full h-40 bg-gray-200 rounded-md">
                {product.imgSrc ? (
                  <FallbackImg src={product.imgSrc} alt={product.name} className="w-full h-full object-contain bg-white" />
                ) : (
                  <span className="text-gray-500 flex items-center justify-center h-full">No Image</span>
                )}
                {product.isNew && (
                  <span className="absolute top-2 right-2 bg-black text-white text-xs font-semibold px-3 py-1 rounded-full">Just In</span>
                )}
              </div>
              <div className="p-4 flex flex-col">
                <h3 className="text-base font-semibold text-gray-900">{product.name}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
              </div>
            </Link>
            <div className="flex items-center justify-between mt-3 px-4 pb-4">
              <span className="text-lg font-bold text-black">Rp{Number(product.price || 0).toLocaleString('id-ID')}</span>
              <button onClick={() => handleAdd(product)} className="inline-block bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-full px-4 py-1 text-sm font-semibold tracking-wide shadow-md hover:scale-105 transition-transform">Add Cart</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductList;
