import { useEffect, useState } from "react";
import axios from "axios";
import {
  FaComments,
  FaPhoneAlt,
  FaClipboardList,
  FaCheckCircle,
  FaClock,
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";

export default function MyConsultations() {
  const API_URL = import.meta.env.VITE_APP_API_URL || "http://localhost:8080";

  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConsultations();
  }, []);

  const fetchConsultations = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("aqua_token");

      if (!token) {
        setConsultations([]);
        return;
      }

      const res = await axios.get(`${API_URL}/api/consultation/my-consultations`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        setConsultations(res.data.consultations || []);
      }
    } catch (error) {
      console.log("Consultation fetch error:", error);
      toast.error(
        error.response?.data?.message || "Failed to fetch consultations"
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getPlanIcon = (title) => {
    const lower = title?.toLowerCase() || "";

    if (lower.includes("basic")) return <FaComments className="text-lg" />;
    if (lower.includes("advanced")) return <FaPhoneAlt className="text-lg" />;
    return <FaClipboardList className="text-lg" />;
  };

  const getPaymentBadge = (status) => {
    const base =
      "inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold";

    switch (status?.toLowerCase()) {
      case "paid":
        return `${base} bg-green-100 text-green-700`;
      case "failed":
        return `${base} bg-red-100 text-red-700`;
      case "created":
        return `${base} bg-yellow-100 text-yellow-700`;
      default:
        return `${base} bg-gray-100 text-gray-700`;
    }
  };

  const getConsultationBadge = (status) => {
    const base =
      "inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold";

    switch (status?.toLowerCase()) {
      case "scheduled":
        return `${base} bg-blue-100 text-blue-700`;
      case "completed":
        return `${base} bg-green-100 text-green-700`;
      case "cancelled":
        return `${base} bg-red-100 text-red-700`;
      case "pending":
        return `${base} bg-orange-100 text-orange-700`;
      default:
        return `${base} bg-gray-100 text-gray-700`;
    }
  };

  const getPlanDescription = (title) => {
    const lower = title?.toLowerCase() || "";

    if (lower.includes("basic")) return "Chat support – 20 mins";
    if (lower.includes("advanced")) return "Call support – 45 mins";
    if (lower.includes("setup")) return "Complete detailed guide";
    return "Expert consultation";
  };

  return (
    <section className="min-h-screen bg-[#FAFAF8] px-4 sm:px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#1F212E]">
            My Consultations
          </h1>
          <p className="text-gray-500 mt-2">
            View your purchased consultation plans and their current status.
          </p>
        </div>

        {loading ? (
          <div className="bg-white rounded-3xl border shadow-sm p-10 text-center">
            <p className="text-gray-500 text-lg">Loading consultations...</p>
          </div>
        ) : consultations.length === 0 ? (
          <div className="bg-white rounded-3xl border shadow-sm p-10 text-center">
            <FaClock className="mx-auto text-5xl text-gray-300 mb-4" />
            <h2 className="text-2xl font-semibold text-[#1F212E]">
              No consultations yet
            </h2>
            <p className="text-gray-500 mt-2 mb-6">
              You have not booked any consultation plans yet.
            </p>
            <Link
              to="/consultation"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-[#1F212E] text-white hover:bg-[#2b2e3f] transition"
            >
              Explore Consultation Plans
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {consultations.map((item, index) => (
              <div
                key={`${item.razorpayOrderId}-${index}`}
                className="bg-white rounded-3xl border border-gray-100 shadow-md p-6 sm:p-7"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 min-w-0">
                    <div className="w-12 h-12 rounded-2xl bg-[#9EC07F]/20 text-[#1F212E] flex items-center justify-center shrink-0">
                      {getPlanIcon(item.planTitle)}
                    </div>

                    <div className="min-w-0">
                      <h2 className="text-xl font-semibold text-[#1F212E] break-words">
                        {item.planTitle}
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">
                        {getPlanDescription(item.planTitle)}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-xl font-bold text-green-600">
                      ₹{item.price}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 mt-5">
                  <span className={getPaymentBadge(item.paymentStatus)}>
                    <FaCheckCircle />
                    Payment: {item.paymentStatus || "N/A"}
                  </span>

                  <span className={getConsultationBadge(item.consultationStatus)}>
                    <FaClock />
                    Status: {item.consultationStatus || "N/A"}
                  </span>
                </div>

                <div className="mt-6 space-y-3 text-sm text-gray-600">
                  <div className="flex justify-between gap-4">
                    <span>Booked On</span>
                    <span className="text-right">{formatDate(item.bookedAt)}</span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span>Currency</span>
                    <span>{item.currency || "INR"}</span>
                  </div>

                  {item.razorpayOrderId && (
                    <div className="flex justify-between gap-4">
                      <span>Order ID</span>
                      <span className="text-right break-all">
                        {item.razorpayOrderId}
                      </span>
                    </div>
                  )}

                  {item.razorpayPaymentId && (
                    <div className="flex justify-between gap-4">
                      <span>Payment ID</span>
                      <span className="text-right break-all">
                        {item.razorpayPaymentId}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-6 rounded-2xl bg-[#FAFAF8] border border-gray-100 p-4">
                  {item.paymentStatus === "paid" &&
                  item.consultationStatus === "pending" ? (
                    <>
                      <p className="text-sm font-medium text-[#1F212E]">
                        Your consultation is confirmed.
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Our team will contact you soon by WhatsApp or email for the
                        next steps.
                      </p>
                    </>
                  ) : item.consultationStatus === "scheduled" ? (
                    <>
                      <p className="text-sm font-medium text-[#1F212E]">
                        Your consultation has been scheduled.
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Please check your WhatsApp, email, or shared meeting link.
                      </p>
                    </>
                  ) : item.consultationStatus === "completed" ? (
                    <>
                      <p className="text-sm font-medium text-[#1F212E]">
                        This consultation is completed.
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        You can still book another expert consultation anytime.
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm font-medium text-[#1F212E]">
                        Consultation status update unavailable.
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Contact support if you need help with this booking.
                      </p>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}