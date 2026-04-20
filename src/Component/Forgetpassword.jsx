import { motion } from "framer-motion";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const API_URL = import.meta.env.VITE_APP_API_URL || "http://localhost:8080";

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      return toast.error("Please enter your email");
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${API_URL}/api/user/forgot-password/send-link`,
        { email }
      );

      console.log("forgot password response:", response.data);

      if (response.data.success) {
        toast.success(response.data.message);
        setEmail("");
      } else {
        toast.error(response.data.message || "Unable to send reset link");
      }
    } catch (error) {
      console.log("forgot password error:", error);
      toast.error(error?.response?.data?.message || "Unable to send reset link");
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
          Forgot Password
        </h2>

        <p className="text-gray-500 text-center mb-8">
          Enter your email and we’ll send you a secure reset link
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#9EC07F]"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full bg-[#1F212E] text-white font-semibold hover:bg-[#2b2e3f] transition disabled:opacity-70 cursor-pointer"
          >
            {loading ? "Sending Link..." : "Send Reset Link"}
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