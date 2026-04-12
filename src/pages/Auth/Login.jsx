import { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

import { loginUser } from "../../api/authApi";
import { AuthContext } from "../../provider/AuthContext";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  // ✅ Already logged → redirect
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const data = await loginUser({ email, password });

      const accessToken = data?.access || data?.token || data?.access_token || data?.data?.access || data?.data?.token || data;
      const refreshToken = data?.refresh || data?.refresh_token || data?.data?.refresh || null;
      const userId = data?.id || data?.data?.id || null;

      if (!accessToken || typeof accessToken === "object") {
        throw new Error("Invalid token format received from server ❌");
      }

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("userId", userId);

      // 🔥 IMPORTANT FIX
      setUser({ token: data.access });

      toast.success("Login successful 🎉");

      // 🔥 Delay fix (live issue solve)
      setTimeout(() => {
        navigate("/");
      }, 120);

    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Invalid credentials ❌"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-main flex flex-col">
      <div className="h-20 bg-primary" />

      <div className="flex flex-1 items-center justify-center px-4">
        <div className="w-full max-w-lg bg-white rounded-3xl shadow-lg p-10">
          <div className="flex flex-col items-center mb-6">
            <img src="/logo.png" alt="Logo" />
          </div>

          <h2 className="text-center text-primary text-2xl font-semibold mb-1 pb-2">
            Login to Account
          </h2>
          <p className="text-center text-sm text-gray-500 mb-6">
            Please enter your email and password to continue
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm text-gray-600 block mb-1">
                Email address
              </label>
              <input
                name="email"
                type="email"
                required
                placeholder="Enter your email"
                className="w-full border border-primary rounded-md px-3 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600 block mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Enter your password"
                  className="w-full border border-primary rounded-md px-3 py-3 text-sm pr-10 focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end text-sm">
              <Link
                to="/forgot-password"
                className="text-gray-500 underline hover:text-primary"
              >
                Forget Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3 rounded-md font-medium hover:opacity-90 transition cursor-pointer disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}