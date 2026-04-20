import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";

export default function OrderSuccess() {
  return (
    <section className="w-full min-h-screen flex items-center justify-center bg-[#FAFAF8] px-6">

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-10 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.08)] 
                   border border-gray-200 text-center max-w-md w-full"
      >

        {/* ICON */}
        <FaCheckCircle className="text-[#9EC07F] text-6xl mx-auto mb-6" />

        {/* TITLE */}
        <h1 className="text-3xl font-semibold text-[#1F212E] mb-4">
          Order Successful 🎉
        </h1>

        {/* MESSAGE */}
        <p className="text-gray-600 mb-6">
          Your order has been placed successfully. We’ll contact you soon to confirm details.
        </p>

        <p className="text-sm text-gray-500 mb-8">
          Thank you for choosing Aquahari 🐟
        </p>

        {/* BUTTONS */}
        <div className="flex flex-col gap-4">

          <Link
            to="/"
            className="px-6 py-3 rounded-full bg-[#1F212E] text-white 
                       hover:bg-[#2b2e3f] transition"
          >
            Back to Home
          </Link>

          <Link
            to="/all_products"
            className="px-6 py-3 rounded-full border border-gray-300 
                       hover:bg-gray-100 transition"
          >
            Continue Shopping
          </Link>

        </div>

      </motion.div>

    </section>
  );
}