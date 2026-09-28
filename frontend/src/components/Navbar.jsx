import { Link, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import api from "../api/axios";
import { mockCartService } from "../services/mockService";

export default function Navbar() {
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);
  const [userId, setUserId] = useState(localStorage.getItem("userId"));
  const [userName, setUserName] = useState(localStorage.getItem("userName"));

  const loadCart = async (currentUserId) => {
    if (!currentUserId) {
      setCartCount(0);
      return;
    }

    try {
      const res = await api.get(`/cart/${currentUserId}`);
      const total = (res.data?.items || []).reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      setCartCount(total);
    } catch {
      // Fallback for offline/demo mode
      const localCart = mockCartService.getCart(currentUserId);
      const total = (localCart?.items || []).reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      setCartCount(total);
    }
  };

  useEffect(() => {
    const handleAuthChange = () => {
      const id = localStorage.getItem("userId");
      const name = localStorage.getItem("userName");
      setUserId(id);
      setUserName(name);
      loadCart(id);
    };

    const handleCartUpdate = () => {
      const id = localStorage.getItem("userId");
      loadCart(id);
    };

    handleAuthChange();

    window.addEventListener("authChanged", handleAuthChange);
    window.addEventListener("cartUpdated", handleCartUpdate);

    return () => {
      window.removeEventListener("authChanged", handleAuthChange);
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("cartCount");
    setUserId(null);
    setUserName(null);
    setCartCount(0);
    window.dispatchEvent(new Event("authChanged"));
    window.dispatchEvent(new Event("cartUpdated"));
    navigate("/login");
  };

  return (
    <nav className="flex justify-between items-center p-4 shadow bg-black text-white">
      <Link
        to="/"
        className="font-bold text-xl tracking-wide flex items-center gap-2 hover:text-blue-400 transition"
      >
        <span>🛍️</span> MinaShop
      </Link>

      <div className="flex gap-5 items-center">
        <Link
          to="/cart"
          className="relative text-xl hover:scale-105 transition-transform"
          title="Shopping Cart"
        >
          🛒
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-full font-bold">
              {cartCount}
            </span>
          )}
        </Link>

        {!userId ? (
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="text-sm md:text-base hover:text-blue-400 transition"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="text-sm md:text-base bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded transition"
            >
              Signup
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-300 hidden sm:inline">
              Hi, <strong className="text-white">{userName || "Customer"}</strong>
            </span>
            <button
              onClick={logout}
              className="text-sm bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded transition"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}