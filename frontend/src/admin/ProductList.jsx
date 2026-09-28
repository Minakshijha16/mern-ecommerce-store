import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router";
import { mockProductsService } from "../services/mockService";

export default function ProductList() {
  const [products, setProducts] = useState([]);

  const loadProducts = async () => {
    try {
      const response = await api.get("/products");
      if (response.data && response.data.length > 0) {
        setProducts(response.data);
        return;
      }
    } catch {
      // Fallback
    }
    const local = mockProductsService.getProducts();
    setProducts(local);
  };

  const deletedProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await api.delete(`/products/delete/${id}`);
      alert("Product deleted successfully!");
      loadProducts();
    } catch {
      mockProductsService.deleteProduct(id);
      alert("Product deleted successfully!");
      loadProducts();
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6 my-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Admin: Product Inventory</h2>
          <p className="text-sm text-gray-500">Manage all items in your store</p>
        </div>
        <Link
          to="/admin/products/add"
          className="bg-blue-600 text-white font-medium px-5 py-2.5 rounded-xl hover:bg-blue-700 transition shadow"
        >
          + Add New Product
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase font-bold text-gray-600">
              <th className="px-6 py-3">Product</th>
              <th className="px-6 py-3">Category</th>
              <th className="px-6 py-3">Price</th>
              <th className="px-6 py-3">Stock</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {products.map((product) => (
              <tr key={product._id} className="hover:bg-gray-50/50">
                <td className="px-6 py-4 flex items-center gap-3">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-10 h-10 object-cover rounded-lg bg-gray-100"
                  />
                  <span className="font-semibold text-gray-900 line-clamp-1 max-w-[200px]">
                    {product.title}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600">{product.category}</td>
                <td className="px-6 py-4 font-bold text-gray-900">
                  ${product.price}
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                    {product.stock} in stock
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-3">
                  <Link
                    to={`/admin/products/edit/${product._id}`}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => deletedProduct(product._id)}
                    className="text-red-600 hover:text-red-800 font-medium"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}