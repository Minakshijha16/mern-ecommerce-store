import { useParams, Link } from "react-router";

export default function OrderSuccess() {
  const { id } = useParams();

  return (
    <div className="max-w-xl mx-auto p-6 my-12 text-center">
      <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
          ✓
        </div>

        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
          Order Placed Successfully!
        </h1>

        <p className="text-gray-500 mt-2">
          Thank you for shopping with MinaShop. Your package is on its way.
        </p>

        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 my-6">
          <span className="text-xs uppercase font-bold text-gray-400 block mb-1">
            Order Reference ID
          </span>
          <code className="text-lg font-mono font-bold text-blue-600">
            {id}
          </code>
        </div>

        <Link
          to="/"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-xl transition shadow"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}