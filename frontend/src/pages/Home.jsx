import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router";
import { mockProductsService, mockCartService } from "../services/mockService";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [toast, setToast] = useState("");

  const loadProducts = async () => {
    try {
      const res = await api.get(
        `/products?search=${search}&category=${category}`
      );
      if (res.data && res.data.length > 0) {
        setProducts(res.data);
        return;
      }
    } catch {
      // Fallback for static live demo / offline mode
    }

    const localCatalog = mockProductsService.getProducts(search, category);
    setProducts(localCatalog);
  };

  useEffect(() => {
    loadProducts();
  }, [search, category]);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(""), 2000);
  };

  const addToCart = async (productId) => {
    const userId = localStorage.getItem("userId") || "guest";

    try {
      const res = await api.post(`/cart/add`, { userId, productId });
      const total = res.data.cart.items.reduce(
        (sum, item) => sum + (item.productId?.price || 0) * item.quantity,
        0
      );
      localStorage.setItem("cartCount", total);
      window.dispatchEvent(new Event("cartUpdated"));
      showToast("Added to cart!");
    } catch {
      // Seamless fallback
      mockCartService.addItem(userId, productId);
      showToast("Added to cart!");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-bounce">
          ✅ {toast}
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="mb-6 flex flex-col md:flex-row gap-4 items-center bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/2 border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full md:w-1/4 border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Categories</option>
          <option value="Laptops">Laptops</option>
          <option value="Mobiles">Mobiles</option>
          <option value="Tablets">Tablets</option>
        </select>
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No products found matching your search.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <Link to={`/product/${product._id}`} className="group">
                <div className="w-full h-44 overflow-hidden rounded-lg bg-gray-50 flex items-center justify-center">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h2 className="mt-3 font-semibold text-base text-gray-800 line-clamp-1 group-hover:text-blue-600 transition">
                  {product.title}
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">{product.category}</p>
              </Link>

              <div className="mt-4 flex items-center justify-between pt-2 border-t border-gray-100">
                <span className="text-lg font-bold text-gray-900">
                  ${product.price}
                </span>

                <button
                  onClick={() => addToCart(product._id)}
                  className="bg-blue-600 text-white px-3.5 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700 active:scale-95 transition"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
