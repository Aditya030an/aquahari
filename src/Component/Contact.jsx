import { useState } from "react";
import { motion } from "framer-motion";
import { FaEnvelope, FaInstagram, FaYoutube } from "react-icons/fa";
import { toast } from "react-hot-toast";
import axios from "axios";

export default function ContactPage() {
  const API_URL = import.meta.env.VITE_APP_API_URL || "http://localhost:8080";

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    problem: "",
    duration: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      const onlyNumbers = value.replace(/\D/g, "");
      setFormData((prev) => ({
        ...prev,
        [name]: onlyNumbers,
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post(
        `${API_URL}/api/contact/send`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data;

      setMessage(data.message || "Your request has been sent successfully.");

      setFormData({
        fullName: "",
        phone: "",
        email: "",
        problem: "",
        duration: "",
      });

      toast.success(data.message || "Your request has been sent successfully.");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong";

      toast.error(errorMessage);
      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative w-full py-28 px-6 bg-white overflow-hidden">
      <div className="absolute top-[-120px] left-1/2 -translate-x-1/2 w-[350px] h-[350px] bg-[#9EC07F]/20 blur-[120px] rounded-full"></div>

      <div className="max-w-5xl mx-auto text-center">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-semibold text-[#1F212E] mb-6"
        >
          Contact Us
        </motion.h1>

        <p className="text-gray-500 mb-16 text-lg">
          Have questions or need guidance? We’re here to help you.
        </p>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="bg-white border border-gray-200 rounded-3xl p-10 shadow-[0_20px_60px_rgba(0,0,0,0.06)] max-w-xl mx-auto mb-12"
        >
          <div className="flex flex-col items-center gap-5">
            <div className="w-14 h-14 flex items-center justify-center rounded-full bg-[#9EC07F]/20">
              <FaEnvelope className="text-[#1F212E] text-xl" />
            </div>

            <h3 className="text-xl font-semibold text-[#1F212E]">Email Us</h3>

            <a
              href="mailto:aquahariofficial@gmail.com"
              className="text-[#9EC07F] font-medium hover:underline"
            >
              aquahariofficial@gmail.com
            </a>

            <p className="text-sm text-gray-500">
              We usually respond within 24 hours.
            </p>

            <div className="flex items-center gap-6 mt-4">
              <a
                href="https://www.instagram.com/aquahariofficial?igsh=eXl2cnp4NjlzdDU2&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 flex items-center justify-center rounded-full bg-[#F5F5F5] hover:bg-[#9EC07F]/20 transition"
              >
                <FaInstagram className="text-xl text-[#1F212E]" />
              </a>

              <a
                href="https://youtube.com/@aquahariofficial?si=sjANusivQxnEjz5U"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 flex items-center justify-center rounded-full bg-[#F5F5F5] hover:bg-[#9EC07F]/20 transition"
              >
                <FaYoutube className="text-xl text-[#1F212E]" />
              </a>
            </div>
          </div>
        </motion.div>

        <form
          onSubmit={handleSubmit}
          className="grid gap-6 max-w-2xl mx-auto text-left"
        >
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            required
            value={formData.fullName}
            onChange={handleChange}
            className="p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#9EC07F]"
          />

          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            required
            maxLength={10}
            value={formData.phone}
            onChange={handleChange}
            className="p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#9EC07F]"
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            required
            value={formData.email}
            onChange={handleChange}
            className="p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#9EC07F]"
          />

          <textarea
            rows="4"
            name="problem"
            placeholder="Describe your problem (fish health, tank issue, etc.)"
            required
            value={formData.problem}
            onChange={handleChange}
            className="p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#9EC07F]"
          ></textarea>

          <textarea
            rows="2"
            name="duration"
            placeholder="How long has this issue been happening?"
            value={formData.duration}
            onChange={handleChange}
            className="p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#9EC07F]"
          ></textarea>

          <button
            type="submit"
            disabled={loading}
            className="w-fit cursor-pointer px-8 py-3 rounded-full bg-[#1F212E] text-white hover:bg-[#2b2e3f] transition disabled:opacity-60"
          >
            {loading ? "Sending..." : "Submit Request"}
          </button>

          {message && <p className="text-sm text-gray-600">{message}</p>}
        </form>
      </div>
    </section>
  );
}