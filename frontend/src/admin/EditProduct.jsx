import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate, useParams, Link } from "react-router";
import { mockProductsService } from "../services/mockService";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    price: "",
    description: "",
    category: "",
    image: "",
    stock: "",
  });

  const loadProduct = async () => {
    try {
      const res = await api.get("/products");
      const product = res.data.find((p) => p._id === id);
      if (product) {
        setForm(product);
        return;
      }
    } catch {
      // Fallback
    }

    const localProduct = mockProductsService.getProductById(id);
    if (localProduct) {
      setForm(localProduct);
    }
  };

  useEffect(() => {
    loadProduct();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/products/update/${id}`, form);
      alert("Product updated!");
      navigate("/admin/products");
    } catch {
      mockProductsService.updateProduct(id, form);
      alert("Product updated!");
      navigate("/admin/products");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 my-10 bg-white shadow-sm border border-gray-200 rounded-2xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Edit Product</h2>
        <Link
          to="/admin/products"
          className="text-sm text-blue-600 hover:underline"
        >
          Cancel
        </Link>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
            Product Title
          </label>
          <input
            name="title"
            value={form.title || ""}
            onChange={handleChange}
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
            Category
          </label>
          <select
            name="category"
            value={form.category || "Laptops"}
            onChange={handleChange}
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="Laptops">Laptops</option>
            <option value="Mobiles">Mobiles</option>
            <option value="Tablets">Tablets</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
              Price ($)
            </label>
            <input
              name="price"
              type="number"
              value={form.price || ""}
              onChange={handleChange}
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
              Stock Quantity
            </label>
            <input
              name="stock"
              type="number"
              value={form.stock || ""}
              onChange={handleChange}
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
            Image URL
          </label>
          <input
            name="image"
            value={form.image || ""}
            onChange={handleChange}
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
            Description
          </label>
          <textarea
            name="description"
            rows="3"
            value={form.description || ""}
            onChange={handleChange}
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition shadow mt-2"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
