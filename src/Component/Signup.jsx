import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

export default function Signup() {
  const API_URL = import.meta.env.VITE_APP_API_URL || "http://localhost:8080";
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("inside frontend", name, email, password, phoneNumber);
    if (password !== confirmPassword) {
      return alert("Password is not matching");
    }
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/user/register`, {
        name,
        email,
        password,
        phoneNumber,
      });
      console.log("response", response);
      if (response.data.success) {
        toast.success("SignUp successfully");
        navigate("/login");
      } else {
        toast.error(response.data.message);
      }
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setPhoneNumber("");
    } catch (err) {
      toast.error(err || "Signup failed");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center bg-[#FAFAF8] px-6 overflow-hidden">
      {/* SOFT GLOW */}
      <div className="absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] bg-[#9EC07F]/20 blur-[120px] rounded-full"></div>

      {/* CARD */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white p-8 rounded-3xl 
                   shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-gray-200"
      >
        {/* TITLE */}
        <h2 className="text-3xl font-semibold text-[#1F212E] mb-2 text-center">
          Create Account
        </h2>
        <p className="text-gray-500 text-center mb-8">
          Join Aquahari and start your journey
        </p>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* NAME */}
          <input
            name="name"
            type="text"
            placeholder="Full Name"
            onChange={(e) => {
              setName(e.target.value);
            }}
            value={name}
            required
            className="p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#9EC07F]"
          />

          {/* EMAIL */}
          <input
            name="email"
            type="email"
            placeholder="Email Address"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            value={email}
            required
            className="p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#9EC07F]"
          />

          {/* PHONE */}
          <input
            name="phoneNumber"
            type="tel"
            placeholder="Phone Number"
            required
            onChange={(e) => {
              setPhoneNumber(e.target.value);
            }}
            value={phoneNumber}
            maxLength={10}
            className="p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#9EC07F]"
          />

          {/* PASSWORD */}
          {/* <input
            type="password"
            placeholder="Password"
            required
            className="p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#9EC07F]"
          /> */}
          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              value={password}
              required
              className="p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#9EC07F]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              {showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
            </button>
          </div>

          {/* CONFIRM PASSWORD */}
          {/* <input
            type="password"
            placeholder="Confirm Password"
            required
            className="p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#9EC07F]"
          /> */}

          <div className="relative">
            <input
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              onChange={(e) => {
                setConfirmPassword(e.target.value);
              }}
              value={confirmPassword}
              required
              className="p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#9EC07F]"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              {showConfirmPassword ? (
                <AiOutlineEye />
              ) : (
                <AiOutlineEyeInvisible />
              )}
            </button>
          </div>

          {/* BUTTON */}
          <button
            disabled={loading}
            type="submit"
            className="w-full py-3 cursor-pointer rounded-full bg-[#1F212E] text-white font-semibold 
                       hover:bg-[#2b2e3f] transition"
          >
            {loading ? "Signing Up...." : "Sign Up"}
          </button>
        </form>

        {/* LOGIN LINK */}
        <p className="text-sm text-gray-500 text-center mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-[#9EC07F] hover:underline cursor-pointer"
          >
            Login
          </Link>
        </p>
      </motion.div>
    </section>
  );
}
