import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router";
import { mockAddressService } from "../services/mockService";

export default function CheckoutAddress() {
  const userId = localStorage.getItem("userId") || "guest";
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "Minakshi Jha",
    phone: "+91 9876543210",
    addressLine: "Tech Boulevard, Suite 400",
    city: "Bengaluru",
    state: "Karnataka",
    pincode: "560100",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const saveAddress = async (e) => {
    e.preventDefault();

    try {
      await api.post("/address/add", {
        ...form,
        userId,
      });
    } catch {
      // Offline fallback
      mockAddressService.saveAddress(userId, form);
    }
    navigate("/checkout");
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">
          Delivery Address
        </h1>

        <form onSubmit={saveAddress} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">
              Full Name
            </label>
            <input
              name="fullName"
              placeholder="e.g. Minakshi Jha"
              value={form.fullName}
              onChange={handleChange}
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">
              Phone Number
            </label>
            <input
              name="phone"
              placeholder="e.g. +91 9876543210"
              value={form.phone}
              onChange={handleChange}
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">
              Address Line
            </label>
            <input
              name="addressLine"
              placeholder="House/Flat No, Street, Landmark"
              value={form.addressLine}
              onChange={handleChange}
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">
                City
              </label>
              <input
                name="city"
                placeholder="City"
                value={form.city}
                onChange={handleChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">
                State
              </label>
              <input
                name="state"
                placeholder="State"
                value={form.state}
                onChange={handleChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">
              Pincode / Zip Code
            </label>
            <input
              name="pincode"
              placeholder="Pincode"
              value={form.pincode}
              onChange={handleChange}
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition shadow mt-4"
          >
            Save Address & Continue →
          </button>
        </form>
      </div>
    </div>
  );
}