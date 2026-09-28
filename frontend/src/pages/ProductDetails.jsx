import { useEffect, useState } from "react";
import api from "../api/axios";
import { useParams, Link } from "react-router";
import { mockProductsService, mockCartService } from "../services/mockService";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [toast, setToast] = useState("");

  const loadProduct = async () => {
    try {
      const res = await api.get("/products/");
      const p = res.data.find((item) => item._id === id);
      if (p) {
        setProduct(p);
        return;
      }
    } catch {
      // Fallback
    }

    const fallbackProduct = mockProductsService.getProductById(id);
    setProduct(fallbackProduct);
  };

  useEffect(() => {
    loadProduct();
  }, [id]);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(""), 2000);
  };

  const addToCart = async () => {
    const userId = localStorage.getItem("userId") || "guest";

    try {
      const res = await api.post("/cart/add", {
        userId,
        productId: product._id,
      });

      const total = res.data.cart.items.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      localStorage.setItem("cartCount", total);
      window.dispatchEvent(new Event("cartUpdated"));
      showToast("Added to cart!");
    } catch {
      mockCartService.addItem(userId, product._id);
      showToast("Added to cart!");
    }
  };

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-gray-500 text-lg">Loading product details...</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {toast && (
        <div className="fixed bottom-6 right-6 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          ✅ {toast}
        </div>
      )}

      <Link
        to="/"
        className="inline-flex items-center text-sm text-blue-600 hover:underline mb-6"
      >
        ← Back to Catalog
      </Link>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-8">
        <div className="w-full h-80 rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex flex-col justify-between">
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
              {product.category}
            </span>
            <h1 className="text-2xl md:text-3xl font-bold mt-3 text-gray-900">
              {product.title}
            </h1>
            <p className="text-gray-600 mt-4 leading-relaxed">
              {product.description}
            </p>
            <p className="text-3xl font-extrabold mt-6 text-gray-900">
              ${product.price}
            </p>
            <p className="text-sm text-green-600 font-medium mt-1">
              ✓ In Stock ({product.stock || 10} units available)
            </p>
          </div>

          <div className="mt-8 flex gap-4">
            <button
              onClick={addToCart}
              className="flex-1 bg-blue-600 text-white py-3.5 px-6 rounded-xl font-semibold hover:bg-blue-700 active:scale-98 transition shadow"
            >
              Add to Cart
            </button>
            <Link
              to="/cart"
              className="bg-gray-100 text-gray-800 py-3.5 px-6 rounded-xl font-semibold hover:bg-gray-200 transition"
            >
              View Cart
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
