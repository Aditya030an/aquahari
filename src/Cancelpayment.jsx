import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaTimesCircle } from "react-icons/fa";

export default function CancelPayment() {
  return (
    <section className="w-full min-h-screen flex items-center justify-center bg-[#FAFAF8] px-6">

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-10 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.08)] 
                   border border-gray-200 text-center max-w-md w-full"
      >

        {/* ICON */}
        <FaTimesCircle className="text-red-500 text-6xl mx-auto mb-6" />

        {/* TITLE */}
        <h1 className="text-3xl font-semibold text-[#1F212E] mb-4">
          Payment Cancelled ❌
        </h1>

        {/* MESSAGE */}
        <p className="text-gray-600 mb-6">
          Your payment was not completed or has been cancelled. Don’t worry — you can try again anytime.
        </p>

        <p className="text-sm text-gray-500 mb-8">
          If money was deducted, it will be refunded automatically.
        </p>

        {/* BUTTONS */}
        <div className="flex flex-col gap-4">

          <Link
            to="/buy"
            className="px-6 py-3 rounded-full bg-[#1F212E] text-white 
                       hover:bg-[#2b2e3f] transition"
          >
            Try Again
          </Link>

          <Link
            to="/"
            className="px-6 py-3 rounded-full border border-gray-300 
                       hover:bg-gray-100 transition"
          >
            Back to Home
          </Link>

        </div>

      </motion.div>

    </section>
  );
}