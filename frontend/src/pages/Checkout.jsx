import { useState, useEffect } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router";
import { mockCartService, mockAddressService, mockOrderService } from "../services/mockService";

export default function Checkout() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId") || "guest";

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [cart, setCart] = useState(null);

  useEffect(() => {
    // Load cart
    api
      .get(`/cart/${userId}`)
      .then((res) => {
        if (res.data) setCart(res.data);
        else setCart(mockCartService.getCart(userId));
      })
      .catch(() => {
        setCart(mockCartService.getCart(userId));
      });

    // Load addresses
    api
      .get(`/address/${userId}`)
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setAddresses(res.data);
          setSelectedAddress(res.data[0]);
        } else {
          const fallback = mockAddressService.getAddresses(userId);
          setAddresses(fallback);
          setSelectedAddress(fallback[0]);
        }
      })
      .catch(() => {
        const fallback = mockAddressService.getAddresses(userId);
        setAddresses(fallback);
        setSelectedAddress(fallback[0]);
      });
  }, [userId]);

  if (!cart) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-gray-500 text-lg">Preparing checkout...</div>
      </div>
    );
  }

  const items = cart.items || [];
  const total = items.reduce(
    (sum, item) => sum + (item.productId?.price || 0) * item.quantity,
    0
  );

  const placeOrder = async () => {
    if (!selectedAddress) {
      alert("Please select a delivery address.");
      return;
    }

    try {
      const res = await api.post("/order/place", {
        userId,
        address: selectedAddress,
      });
      navigate(`/order-success/${res.data.orderId}`);
    } catch {
      // Fallback
      const order = mockOrderService.placeOrder(userId, selectedAddress);
      navigate(`/order-success/${order.orderId}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Address Selection */}
        <div className="md:col-span-2 space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h2 className="text-lg font-bold mb-4 text-gray-800">
              Select Delivery Address
            </h2>

            {addresses.length === 0 ? (
              <p className="text-gray-500">No saved addresses found.</p>
            ) : (
              <div className="space-y-3">
                {addresses.map((addr) => (
                  <label
                    key={addr._id}
                    className={`block border rounded-xl p-4 cursor-pointer transition ${
                      selectedAddress?._id === addr._id
                        ? "border-blue-600 bg-blue-50/50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="address"
                        checked={selectedAddress?._id === addr._id}
                        onChange={() => setSelectedAddress(addr)}
                        className="mt-1 text-blue-600 focus:ring-blue-500"
                      />
                      <div>
                        <strong className="text-gray-900 block font-semibold">
                          {addr.fullName}
                        </strong>
                        <p className="text-sm text-gray-600 mt-0.5">
                          {addr.addressLine}, {addr.city}, {addr.state} -{" "}
                          {addr.pincode}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          📞 {addr.phone}
                        </p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm h-fit">
          <h2 className="text-lg font-bold mb-4 text-gray-800">
            Order Summary
          </h2>

          <div className="space-y-3 mb-4 max-h-60 overflow-y-auto divide-y divide-gray-100">
            {items.map((item) => (
              <div
                key={item.productId?._id || item.productId}
                className="pt-2 flex justify-between text-sm"
              >
                <span className="text-gray-600 truncate max-w-[160px]">
                  {item.productId?.title} × {item.quantity}
                </span>
                <span className="font-semibold text-gray-800">
                  ${((item.productId?.price || 0) * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 pt-4 flex justify-between items-center mb-6">
            <span className="font-semibold text-gray-700">Total Amount:</span>
            <span className="text-2xl font-black text-gray-900">
              ${total.toFixed(2)}
            </span>
          </div>

          <button
            onClick={placeOrder}
            className="w-full bg-green-600 hover:bg-green-700 active:scale-98 text-white font-bold py-3.5 rounded-xl transition shadow"
          >
            Place Order (Cash on Delivery)
          </button>
        </div>
      </div>
    </div>
  );
}
