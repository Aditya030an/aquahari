import { useEffect, useState } from "react";
import axios from "axios";
import { FaBoxOpen, FaTruck } from "react-icons/fa";
import { MdPayment, MdLocationOn } from "react-icons/md";
import { toast } from "react-hot-toast";

export default function MyOrders() {
  const API_URL = import.meta.env.VITE_APP_API_URL || "http://localhost:8080";

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("aqua_token");

      const res = await axios.get(`${API_URL}/api/payment/my-orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        setOrders(res.data.orders || []);
      }
    } catch (error) {
      console.log("Fetch orders error:", error);
      console.log("Fetch orders error response:", error?.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const refreshShipment = async (orderId) => {
    try {
      const token = localStorage.getItem("aqua_token");

      const res = await axios.get(
        `${API_URL}/api/payment/refresh-shipment/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        toast.success("Shipment updated");
        fetchOrders();
      }
    } catch (error) {
      console.log("refresh shipment error:", error);
      toast.error("Could not refresh shipment");
    }
  };

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getPaymentBadge = (status) => {
    const base =
      "inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold";

    switch (status?.toLowerCase()) {
      case "paid":
        return `${base} bg-green-100 text-green-700`;
      case "pending":
        return `${base} bg-yellow-100 text-yellow-700`;
      case "failed":
        return `${base} bg-red-100 text-red-700`;
      default:
        return `${base} bg-gray-100 text-gray-700`;
    }
  };

  const getPaymentMethodBadge = (method) => {
    const base =
      "inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold";

    switch (method?.toLowerCase()) {
      case "cod":
        return `${base} bg-orange-100 text-orange-700`;
      case "prepaid":
        return `${base} bg-emerald-100 text-emerald-700`;
      default:
        return `${base} bg-gray-100 text-gray-700`;
    }
  };

  const formatPaymentMethod = (method) => {
    if (!method) return "N/A";
    if (method.toLowerCase() === "cod") return "Cash on Delivery";
    if (method.toLowerCase() === "prepaid") return "Prepaid";
    return method;
  };

  const getDeliveryBadge = (status) => {
    const base =
      "inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold";

    switch (status?.toLowerCase()) {
      case "shipment_created":
        return `${base} bg-indigo-100 text-indigo-700`;
      case "shipped":
        return `${base} bg-blue-100 text-blue-700`;
      case "delivered":
        return `${base} bg-green-100 text-green-700`;
      case "processing":
        return `${base} bg-orange-100 text-orange-700`;
      case "shipment_failed":
        return `${base} bg-red-100 text-red-700`;
      default:
        return `${base} bg-gray-100 text-gray-700`;
    }
  };

  return (
    <section className="min-h-screen bg-[#FAFAF8] px-4 sm:px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#1F212E]">
            My Orders
          </h1>
          <p className="text-gray-500 mt-2">
            Check your payment, delivery status, and tracking details.
          </p>
        </div>

        {loading ? (
          <div className="bg-white rounded-3xl shadow-sm border p-10 text-center">
            <p className="text-gray-500 text-lg">Loading your orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm border p-10 text-center">
            <FaBoxOpen className="mx-auto text-5xl text-gray-300 mb-4" />
            <h2 className="text-2xl font-semibold text-[#1F212E]">
              No orders found
            </h2>
            <p className="text-gray-500 mt-2">
              You have not placed any orders yet.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden"
              >
                <div className="p-6 sm:p-8 border-b bg-gradient-to-r from-white to-gray-50">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500">Order ID</p>
                        <h2 className="font-semibold text-[#1F212E] break-all">
                          {order._id}
                        </h2>
                      </div>

                      <p className="text-sm text-gray-500">
                        Ordered on: {formatDate(order.createdAt)}
                      </p>

                      <div className="flex flex-wrap items-center gap-3">
                        <span className={getPaymentBadge(order?.paymentStatus)}>
                          <MdPayment />
                          Payment: {order?.paymentStatus || "N/A"}
                        </span>

                        <span
                          className={getPaymentMethodBadge(order?.paymentMethod)}
                        >
                          <MdPayment />
                          Mode: {formatPaymentMethod(order?.paymentMethod)}
                        </span>

                        <span
                          className={getDeliveryBadge(order?.deliveryStatus)}
                        >
                          <FaTruck />
                          Delivery: {order?.deliveryStatus || "N/A"}
                        </span>
                      </div>

                      {order?.shipmentId && (
                        <button
                          onClick={() => refreshShipment(order._id)}
                          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer"
                        >
                          Refresh Shipment Status
                        </button>
                      )}

                      <div className="flex items-start gap-2 text-sm text-gray-600 pt-1">
                        <MdLocationOn className="text-lg mt-[2px]" />
                        <span>{order?.address}</span>
                      </div>
                    </div>

                    <div className="bg-[#FAFAF8] rounded-2xl p-5 min-w-[250px]">
                      <h3 className="font-semibold text-[#1F212E] mb-3">
                        Order Summary
                      </h3>

                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex justify-between">
                          <span>Subtotal</span>
                          <span>₹{order?.subTotal || 0}</span>
                        </div>

                        <div className="flex justify-between">
                          <span>Delivery</span>
                          <span>₹{order?.totalDeliveryCharge || 0}</span>
                        </div>

                        <div className="flex justify-between">
                          <span>Payment Mode</span>
                          <span className="font-medium">
                            {formatPaymentMethod(order?.paymentMethod)}
                          </span>
                        </div>

                        <div className="border-t pt-2 flex justify-between text-base font-bold text-green-600">
                          <span>Total</span>
                          <span>₹{order?.totalAmount || 0}</span>
                        </div>
                      </div>

                      {order?.trackingUrl && (
                        <a
                          href={order.trackingUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-4 inline-flex items-center justify-center w-full rounded-full bg-[#1F212E] text-white py-2.5 font-medium hover:bg-[#2d3145] transition"
                        >
                          Track Shipment
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-6 sm:p-8">
                  <h3 className="text-lg font-semibold text-[#1F212E] mb-5">
                    Ordered Items
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {order?.items?.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex gap-4 border border-gray-100 rounded-2xl p-4 hover:shadow-sm transition"
                      >
                        <img
                          src={item.image || "/products/dummyImg.jpg"}
                          alt={item.productName}
                          className="w-24 h-24 rounded-2xl object-cover border bg-gray-50"
                        />

                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-[#1F212E] line-clamp-2">
                            {item.productName}
                          </h4>

                          <p className="text-sm text-gray-500 mt-1">
                            Bottle Capacity: {item?.capacity}
                          </p>

                          <p className="text-sm text-gray-500">
                            Qty: {item.qty}
                          </p>

                          <p className="text-sm text-gray-500">
                            Delivery: ₹{item.deliveryCharge}
                          </p>

                          <div className="mt-2 flex items-center justify-between">
                            <p className="font-semibold text-green-600">
                              ₹{item.price}
                            </p>

                            <p className="text-sm text-gray-600">
                              Item Total: ₹{item.price * item.qty}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {(order?.shipmentId ||
                  order?.awbCode ||
                  order?.courierName) && (
                  <div className="px-6 sm:px-8 pb-6 sm:pb-8">
                    <div className="rounded-2xl bg-blue-50 border border-blue-100 p-4 text-sm text-gray-700">
                      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-6">
                        {order?.shipmentId && (
                          <p>
                            <span className="font-semibold">Shipment ID:</span>{" "}
                            {order.shipmentId}
                          </p>
                        )}

                        {order?.awbCode && (
                          <p>
                            <span className="font-semibold">AWB Code:</span>{" "}
                            {order.awbCode}
                          </p>
                        )}

                        {order?.courierName && (
                          <p>
                            <span className="font-semibold">Courier:</span>{" "}
                            {order.courierName}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}