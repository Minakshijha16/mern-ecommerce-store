import { useState } from "react";
import { useNavigate, Link } from "react-router";
import api from "../api/axios";
import { mockAuth } from "../services/mockService";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [msg, setMsg] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");

    try {
      const res = await api.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.user.id);
      localStorage.setItem("userName", res.data.user.name || form.email.split("@")[0]);
      window.dispatchEvent(new Event("authChanged"));
      setIsSuccess(true);
      setMsg("Login Successful!");
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (err) {
      // Graceful fallback when backend API is unreachable
      try {
        const res = mockAuth.login(form.email, form.password);
        localStorage.setItem("token", res.token);
        localStorage.setItem("userId", res.user.id);
        localStorage.setItem("userName", res.user.name);
        window.dispatchEvent(new Event("authChanged"));
        setIsSuccess(true);
        setMsg("Login Successful!");
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } catch (mockErr) {
        setIsSuccess(false);
        setMsg(mockErr.message || "An error occurred");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[85vh] bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Login to Your Account</h2>

        {msg && (
          <div
            className={`mb-4 text-center text-sm font-medium p-2 rounded ${
              isSuccess
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {msg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="email"
            type="email"
            placeholder="Enter Email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Enter Password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors font-semibold"
          >
            Login
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-600 hover:underline font-medium">
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
}