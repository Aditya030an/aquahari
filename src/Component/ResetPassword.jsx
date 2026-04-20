import { motion } from "framer-motion";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

export default function ResetPassword() {
  const API_URL = import.meta.env.VITE_APP_API_URL || "http://localhost:8080";
  const { token } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.password || !form.confirmPassword) {
      return toast.error("Please fill all fields");
    }

    if (form.password !== form.confirmPassword) {
      return toast.error("Passwords do not match");
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${API_URL}/api/user/reset-password/${token}`,
        {
          password: form.password,
          confirmPassword: form.confirmPassword,
        }
      );

      console.log("reset password response:", response.data);

      if (response.data.success) {
        localStorage.removeItem("aqua_token");
        localStorage.removeItem("aqua_user");
        toast.success(response.data.message);
        navigate("/login");
      } else {
        toast.error(response.data.message || "Password reset failed");
      }
    } catch (error) {
      console.log("reset password error:", error);
      toast.error(error?.response?.data?.message || "Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center bg-[#FAFAF8] px-6 overflow-hidden">
      <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-[#9EC07F]/20 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] bg-[#9EC07F]/20 blur-[120px] rounded-full"></div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white p-8 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-gray-200"
      >
        <h2 className="text-3xl font-semibold text-[#1F212E] mb-2 text-center">
          Reset Password
        </h2>

        <p className="text-gray-500 text-center mb-8">
          Enter your new password below
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="New Password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#9EC07F]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
            >
              {showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
            </button>
          </div>

          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm New Password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#9EC07F]"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
            >
              {showConfirmPassword ? (
                <AiOutlineEye />
              ) : (
                <AiOutlineEyeInvisible />
              )}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full bg-[#1F212E] text-white font-semibold hover:bg-[#2b2e3f] transition disabled:opacity-70 cursor-pointer"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <div className="text-center mt-6">
          <Link
            to="/login"
            className="text-sm text-[#9EC07F] hover:underline cursor-pointer"
          >
            Back to Login
          </Link>
        </div>
      </motion.div>
    </section>
  );
}