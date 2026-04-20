import { motion } from "framer-motion";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { AiOutlineEye } from "react-icons/ai";
import { AiOutlineEyeInvisible } from "react-icons/ai";
import { useState } from "react";

export default function Login() {
  const API_URL = import.meta.env.VITE_APP_API_URL || "http://localhost:8080";
  const navigate = useNavigate();
  console.log("API_URL", API_URL);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loader, setLoader] = useState(false);

  const handleSubmit = async (e) => {
    let value = "login";
    console.log("inside frontend", email);
    e.preventDefault();
    setLoader(true);
    try {
      const response = await axios.post(`${API_URL}/api/user/login`, {
        email,
        value,
        password,
      });
      console.log("response", response);
      if (response?.data?.success) {
        toast.success(response?.data?.message);
        localStorage.setItem("aqua_token", response?.data?.token);
        localStorage.setItem("aqua_user", JSON.stringify(response?.data?.user));

        window.dispatchEvent(new Event("userChanged"));
        navigate("/");
      } else {
        toast.error(response.data.message);
        setEmail("");
        setPassword("");
      }
    } catch (error) {
      if (error.response) {
        console.log("Login error:", error.response.data.message);
        toast.error(error.response.data.message); // show user-friendly message
      } else {
        console.log("Something went wrong:", error.message);
      }
    }
    setLoader(false);
  };

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center bg-[#FAFAF8] px-6 overflow-hidden">
      {/* SOFT GLOW */}
      <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-[#9EC07F]/20 blur-[120px] rounded-full"></div>

      {/* CARD */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white p-8 rounded-3xl 
                   shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-gray-200"
      >
        {/* TITLE */}
        <h2 className="text-3xl font-semibold text-[#1F212E] mb-2 text-center">
          Welcome Back
        </h2>
        <p className="text-gray-500 text-center mb-8">Login to your account</p>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* EMAIL */}
          <input
            type="email"
            value={email}
            required
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            placeholder="Email Address"
            className="p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#9EC07F]"
          />

          {/* PASSWORD */}

          <div className="group relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              required
              placeholder="Password"
              className="p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#9EC07F]"
            />

            {/* Show/Hide Icon */}
            <button
              type="button"
              className="absolute right-4 top-9 text-gray-600 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
            </button>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loader}
            className="w-full py-3 rounded-full bg-[#1F212E] text-white font-semibold hover:bg-[#2b2e3f] transition cursor-pointer"
          >
            {loader ? "Login..." : "Login"}
          </button>
        </form>

        {/* EXTRA LINKS */}
        <div className="flex justify-between mt-6 text-sm text-gray-500">
          <Link
            to="/Forgetpassword"
            className="hover:text-[#9EC07F] cursor-pointer"
          >
            Forgot Password?
          </Link>

          <Link to="/Signup" className="hover:text-[#9EC07F] cursor-pointer">
            Sign Up
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
