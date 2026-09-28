import { useState, useEffect } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router";
import { mockCartService } from "../services/mockService";

export default function Cart() {
  const userId = localStorage.getItem("userId") || "guest";
  const [cart, setCart] = useState(null);
  const navigate = useNavigate();

  const loadCart = async () => {
    try {
      const res = await api.get(`/cart/${userId}`);
      if (res.data) {
        setCart(res.data);
        return;
      }
    } catch {
      // Fallback
    }

    const localCart = mockCartService.getCart(userId);
    setCart(localCart);
  };

  useEffect(() => {
    loadCart();
  }, []);

  const removeItem = async (productId) => {
    try {
      await api.post(`/cart/remove`, { userId, productId });
      loadCart();
      window.dispatchEvent(new Event("cartUpdated"));
    } catch {
      mockCartService.removeItem(userId, productId);
      loadCart();
    }
  };

  const updateQty = async (productId, quantity) => {
    try {
      await api.post(`/cart/update`, { userId, productId, quantity });
      loadCart();
      window.dispatchEvent(new Event("cartUpdated"));
    } catch {
      mockCartService.updateQty(userId, productId, quantity);
      loadCart();
    }
  };

  if (!cart) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-gray-500 text-lg">Loading your cart...</div>
      </div>
    );
  }

  const items = cart.items || [];
  const total = items.reduce(
    (sum, item) => sum + (item.productId?.price || 0) * item.quantity,
    0
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Shopping Cart</h1>

      {items.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-gray-200 shadow-sm">
          <p className="text-5xl mb-4">🛒</p>
          <h2 className="text-xl font-semibold text-gray-700">Your cart is empty</h2>
          <p className="text-gray-500 mt-2 mb-6">
            Looks like you haven't added any products to your cart yet.
          </p>
          <Link
            to="/"
            className="inline-block bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden divide-y divide-gray-100 shadow-sm">
            {items.map((item) => {
              const prod = item.productId || {};
              const prodId = prod._id || prod.id;
              return (
                <div
                  key={prodId}
                  className="flex flex-col sm:flex-row items-center justify-between p-4 gap-4"
                >
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <img
                      src={prod.image}
                      alt={prod.title}
                      className="w-20 h-20 object-cover rounded-lg bg-gray-50"
                    />
                    <div>
                      <h2 className="text-base font-semibold text-gray-800">
                        {prod.title}
                      </h2>
                      <p className="text-sm text-gray-500">
                        ${(prod.price || 0).toFixed(2)} each
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                      <button
                        onClick={() => updateQty(prodId, item.quantity - 1)}
                        className="px-3 py-1 bg-gray-50 hover:bg-gray-200 text-gray-700 font-bold transition"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 font-semibold text-sm">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQty(prodId, item.quantity + 1)}
                        className="px-3 py-1 bg-gray-50 hover:bg-gray-200 text-gray-700 font-bold transition"
                      >
                        +
                      </button>
                    </div>

                    <p className="text-base font-bold text-gray-900 min-w-[70px] text-right">
                      ${((prod.price || 0) * item.quantity).toFixed(2)}
                    </p>

                    <button
                      onClick={() => removeItem(prodId)}
                      className="text-red-500 hover:text-red-700 text-sm font-medium transition"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-sm text-gray-500">Order Subtotal:</span>
              <h2 className="text-2xl font-black text-gray-900">
                ${total.toFixed(2)}
              </h2>
            </div>

            <button
              onClick={() => navigate("/checkout-address")}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-xl transition shadow"
            >
              Proceed to Checkout →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
