import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import useCartStore from "./store/useCartStore";
import api from "../lib/api";

const ProductCart = ({ category, limit = 12 }) => {
  const { addToCart, openDrawer } = useCartStore();
  const [items, setItems] = useState([]);
  const [dragging, setDragging] = useState(false);

  const rowRef = useRef(null);
  const startX = useRef(0);
  const scrollStart = useRef(0);

  useEffect(() => {
    api
      .get("/items")
      .then((data) => {
        let filtered = data || [];
        if (category) {
          filtered = filtered.filter(
            (item) => item.category?.toLowerCase() === category.toLowerCase()
          );
        }
        setItems(filtered.slice(0, limit));
      })
      .catch(() => {});
  }, [category, limit]);

  const handleAddToCart = (item) => {
    addToCart({
      _id: item._id,
      name: item.name,
      price: item.price,
      imgSrc: item.imgSrc,
      qty: 1,
    });
    openDrawer();
  };

  const scrollByCard = (dir = 1) => {
    const el = rowRef.current;
    if (!el) return;
    const step = Math.min(el.clientWidth * 0.8, 900);
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  const onWheel = (e) => {
    const el = rowRef.current;
    if (!el) return;
    if (Math.abs(e.deltaY) >= Math.abs(e.deltaX)) {
      el.scrollLeft += e.deltaY;
      if (e.cancelable) e.preventDefault();
      e.stopPropagation();
    }
  };

  const onPointerDown = (e) => {
    const el = rowRef.current;
    if (!el) return;
    setDragging(true);
    el.classList.add("row-dragging");
    startX.current = (e.touches?.[0]?.clientX ?? e.clientX) || 0;
    scrollStart.current = el.scrollLeft;
  };

  const onPointerMove = (e) => {
    if (!dragging) return;
    const el = rowRef.current;
    const x = (e.touches?.[0]?.clientX ?? e.clientX) || 0;
    const dx = x - startX.current;
    el.scrollLeft = scrollStart.current - dx;
    if (e.cancelable) e.preventDefault();
    e.stopPropagation();
  };

  const endDrag = () => {
    setDragging(false);
    rowRef.current?.classList.remove("row-dragging");
  };

  if (!items.length) return null;

  return (
    <section className="py-10 md:py-12">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {category && (
          <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-5">
            {category}
          </h2>
        )}

        <div className="relative z-0 group">
          <div
            ref={rowRef}
            className="row-hide-scrollbar flex gap-4 overflow-x-auto scroll-smooth select-none"
            style={{
              touchAction: "pan-x",
              overscrollBehaviorX: "contain",
              overscrollBehaviorY: "none",
            }}
            onWheel={onWheel}
            onMouseDown={onPointerDown}
            onMouseMove={onPointerMove}
            onMouseLeave={endDrag}
            onMouseUp={endDrag}
            onTouchStart={onPointerDown}
            onTouchMove={onPointerMove}
            onTouchEnd={endDrag}
          >
            {items.map((item, idx) => (
              <Card
                key={item._id || idx}
                item={item}
                onAdd={() => handleAddToCart(item)}
              />
            ))}
          </div>

          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-l from-transparent to-white/90 opacity-0 group-hover:opacity-100 transition" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-r from-transparent to-white/90 opacity-0 group-hover:opacity-100 transition" />

          <ArrowButton side="left" onClick={() => scrollByCard(-1)} />
          <ArrowButton side="right" onClick={() => scrollByCard(1)} />
        </div>
      </div>
    </section>
  );
};

export default ProductCart;

const Card = ({ item, onAdd }) => {
  return (
    <div className="shrink-0 w-[65vw] xs:w-[52vw] sm:w-[40vw] md:w-[28vw] lg:w-[22vw] xl:w-[18vw] 2xl:w-[16vw] scroll-mx-6">
      <div className="relative rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-xl transition">
        <Link to={`/product/${item._id}`} className="block">
          <div className="relative aspect-[3/4] bg-gray-100">
            <img
              src={item.imgSrc}
              alt={item.name}
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "/fallback.png";
              }}
            />
          </div>
          <div className="p-3">
            <h3 className="text-sm md:text-base font-semibold line-clamp-1">
              {item.name}
            </h3>
            <p className="text-sm text-gray-500 line-clamp-2">
              {item.description}
            </p>
          </div>
        </Link>
        <div className="px-3 pb-3 flex items-center justify-between">
          <span className="text-base md:text-lg font-bold">
            Rp{Number(item.price || 0).toLocaleString("id-ID")}
          </span>
          <button
            onClick={onAdd}
            className="px-4 py-1 text-sm inline-block bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-full uppercase font-semibold tracking-widest shadow-2xl hover:scale-105 transition-transform"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

const ArrowButton = ({ side = "left", onClick }) => {
  const isLeft = side === "left";
  const pos = isLeft ? "left-1" : "right-1";
  const icon = isLeft ? "‹" : "›";

  return (
    <div className={`pointer-events-none hidden md:block absolute ${pos} top-1/2 -translate-y-1/2 z-10`}>
      <button
        onClick={onClick}
        className="pointer-events-auto relative w-[120px] h-[120px] -mx-4 -my-10 rounded-full bg-transparent"
        aria-label={isLeft ? "Scroll left" : "Scroll right"}
      >
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-10 w-10 flex items-center justify-center bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-full text-xl shadow-2xl hover:scale-105 transition-transform">
          {icon}
        </span>
      </button>
    </div>
  );
};
