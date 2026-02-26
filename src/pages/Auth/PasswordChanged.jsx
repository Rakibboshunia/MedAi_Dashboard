import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import BackNextButtons from "../../components/BackNextButtons";

import { resetPassword } from "../../api/authApi";

export default function ResetPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = e.target.email.value;

    if (!email) {
      setError("Please enter your email");
      return;
    }

    if (!password || !confirmPassword) {
      setError("Please fill in both fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const data = await resetPassword({
        email,
        new_password: password,
        confirm_password: confirmPassword,
      });

      toast.success(data.message || "Password updated successfully ✅");
      setShowSuccessModal(true);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.response?.data?.detail ||
          "Password reset failed ❌"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showSuccessModal) {
      const timer = setTimeout(() => {
        navigate("/login");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessModal, navigate]);

  return (
    <div className="min-h-screen bg-background-main flex flex-col relative">
      <div className="h-20 bg-primary" />

      <div className="flex flex-1 items-center justify-center px-4">
        <div className="w-full max-w-lg bg-white rounded-3xl shadow-lg p-10">
          <div className="flex flex-col items-center mb-6">
            <img src={"/logo.png"} alt="Logo" />
          </div>

          <h2 className="text-center text-primary text-3xl font-semibold mb-1 pb-2">
            Set a new password
          </h2>

          <p className="text-center text-md text-gray-700 mb-6">
            Create a new password. Ensure it differs from previous ones.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
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
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your new password"
                  className="w-full border border-primary rounded-md px-3 py-3 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-600 block mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Enter your confirm password"
                  className="w-full border border-primary rounded-md px-3 py-3 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center font-medium">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3 rounded-md font-medium hover:opacity-90 transition disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Updating..." : "Reset Password"}
            </button>

            <BackNextButtons
              backLabel="Back"
              onBack={() => navigate("/verify-otp")}
              showNext={false}
            />
          </form>
        </div>
      </div>

      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-10 flex flex-col items-center">
            <div className="flex flex-col items-center mb-6">
              <img src={"/logo.png"} alt="Logo" />
            </div>

            <div className="bg-primary-light p-4 rounded-full mb-6">
              <CheckCircle className="text-primary w-16 h-16" />
            </div>

            <h2 className="text-center text-primary text-3xl font-semibold mb-4">
              Password Updated Successfully
            </h2>
            <p className="text-center text-md text-gray-700 mb-8">
              Your new password has been saved. You can now continue securely.
            </p>

            <div className="w-full bg-primary h-1 rounded-full overflow-hidden">
              <div
                className="h-full bg-white/30 animate-progress"
                style={{ width: "100%" }}
              ></div>
            </div>
            <p className="text-xs text-gray-400 mt-4">
              Redirecting to login...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
