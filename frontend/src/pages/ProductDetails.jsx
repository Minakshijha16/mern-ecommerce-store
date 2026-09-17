import { useEffect, useState } from "react";
import api from "../api/axios";
import { useParams } from "react-router";
import { mockProducts } from "../data/mockProducts";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  const loadProduct = async () => {
    try {
      const res = await api.get("/products/");
      const p = res.data.find((item) => item._id === id);
      if (p) {
        setProduct(p);
        return;
      }
    } catch (err) {
      console.warn("API request failed, loading product details locally...", err.message);
    }

    const fallbackProduct = mockProducts.find((item) => item._id === id);
    setProduct(fallbackProduct || mockProducts[0]);
  };

  useEffect(() => {
    loadProduct();
  }, []);

  const addToCart = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("Please login first");
      return;
    }

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
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <img
        src={product.image}
        alt={product.title}
        className="w-full h-40 object-contain bg-white rounded"
      />
      <h1 className="text-2xl font-bold mt-4">{product.title}</h1>
      <p className="text-gray-700 mt-2">{product.description}</p>
      <p className="text-xl font-semibold mt-4">${product.price}</p>

      <button
        onClick={addToCart}
        className="mt-6 w-full md:w-1/2 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
      >
        Add to Cart
      </button>
    </div>
  );
}
