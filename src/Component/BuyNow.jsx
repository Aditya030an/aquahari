import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { trackBeginCheckout, trackPurchase } from "../utils/analytics";

export default function BuyNow() {
  const API_URL = import.meta.env.VITE_APP_API_URL || "http://localhost:8080";
  const location = useLocation();
  const navigate = useNavigate();

  const isCartCheckout = Boolean(location.state?.cart);
  const product = location.state;
  const cartItems = location.state?.cart || [];

  const storedUser = JSON.parse(localStorage.getItem("aqua_user")) || {};

  const [form, setForm] = useState({
    name: storedUser?.name || "",
    phone: storedUser?.phoneNumber || "",
    quantity: product?.qty || 1,
    fullAddress: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("prepaid");

  const calculateDeliveryCharge = (qty, item) => {
    const quantity = Math.max(1, Number(qty) || 1);
    const base = Number(item?.baseDeliveryPrice || 0);
    const perBottle = Number(item?.deliveryPricePerBottle || 0);

    return base + (quantity - 1) * perBottle;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: name === "quantity" ? Number(value) : value,
    }));
  };

  const normalizedItems = useMemo(() => {
    if (isCartCheckout) {
      return cartItems.map((item) => ({
        productId: item.productId,
        productName: item.name,
        image: item.image,
        capacity: item.capacity,
        price: Number(item.price || 0),
        originalPrice: Number(item.originalPrice || 0),
        discount: Number(item.discount || 0),
        qty: Number(item.qty || 1),
        baseDeliveryPrice: Number(item.baseDeliveryPrice || 0),
        deliveryPricePerBottle: Number(item.deliveryPricePerBottle || 0),
        deliveryCharge: calculateDeliveryCharge(Number(item.qty || 1), item),
      }));
    }

    return [
      {
        productId: product.productId,
        productName: product.name,
        image: product.image,
        capacity: product.capacity,
        price: Number(product.price || 0),
        originalPrice: Number(product.originalPrice || 0),
        discount: Number(product.discount || 0),
        qty: Number(form.quantity || 1),
        baseDeliveryPrice: Number(product.baseDeliveryPrice || 0),
        deliveryPricePerBottle: Number(product.deliveryPricePerBottle || 0),
        deliveryCharge: calculateDeliveryCharge(Number(form.quantity || 1), {
          baseDeliveryPrice: product.baseDeliveryPrice,
          deliveryPricePerBottle: product.deliveryPricePerBottle,
        }),
      },
    ];
  }, [isCartCheckout, cartItems, product, form.quantity]);

  const subTotal = normalizedItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0,
  );

  const totalDelivery = normalizedItems.reduce(
    (acc, item) => acc + item.deliveryCharge,
    0,
  );

  const total = subTotal + totalDelivery;

  const validateForm = () => {
    if (!form.name.trim() || !form.phone.trim()) {
      toast.error("Please fill name and phone");
      return false;
    }

    if (!/^\d{10}$/.test(form.phone.trim())) {
      toast.error("Phone number must be 10 digits");
      return false;
    }

    if (
      !form.fullAddress.trim() ||
      !form.city.trim() ||
      !form.state.trim() ||
      !form.pincode.trim()
    ) {
      toast.error("Please fill full shipping address");
      return false;
    }

    if (!/^\d{6}$/.test(form.pincode.trim())) {
      toast.error("Pincode must be 6 digits");
      return false;
    }

    // if (
    //   form.city.trim().toLowerCase() === "bhopal" &&
    //   form.pincode.trim() === "461775"
    // ) {
    //   toast.error("City and pincode do not match. 461775 is not Bhopal.");
    //   return false;
    // }

    return true;
  };

  const buildAddressString = () => {
    return [
      form.fullAddress,
      form.landmark,
      form.city,
      form.state,
      form.pincode,
      "India",
    ]
      .filter(Boolean)
      .join(", ");
  };

  const getShippingAddress = () => ({
    fullAddress: form.fullAddress.trim(),
    landmark: form.landmark.trim(),
    city: form.city.trim(),
    state: form.state.trim(),
    pincode: form.pincode.trim(),
    country: "India",
  });

  const handlePayment = async () => {
    if (!validateForm()) return;

    const token = localStorage.getItem("aqua_token");
    if (!token) {
      navigate("/login");
      return;
    }

    trackBeginCheckout({
      value: total,
      items: normalizedItems.map((item) => ({
        item_id: item.productId,
        item_name: item.productName,
        price: item.price,
        quantity: item.qty,
        item_category: "Aquarium",
      })),
    });

    try {
      setPaymentLoading(true);

      const { data } = await axios.post(
        `${API_URL}/api/payment/create-order`,
        { amount: total },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const razorpayOrder = data.order;

      const options = {
        key: import.meta.env.VITE_APP_RAZORPAY_KEY,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "Aquahari",
        description: "Order Payment",
        order_id: razorpayOrder.id,

        handler: async function (response) {
          const verifyPayload = {
            ...response,
            orderData: {
              name: form.name,
              phone: form.phone,
              address: buildAddressString(),
              shippingAddress: getShippingAddress(),
              items: normalizedItems,
            },
          };

          try {
            const verifyRes = await axios.post(
              `${API_URL}/api/payment/verify-payment`,
              verifyPayload,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              },
            );

            if (verifyRes.data.success) {
              if (isCartCheckout) {
                localStorage.removeItem("aqua_cart");
              }

              window.dispatchEvent(new Event("userChanged"));
              trackPurchase({
                transaction_id:
                  response.razorpay_payment_id || razorpayOrder.id,
                value: total,
                shipping: totalDelivery,
                items: normalizedItems.map((item) => ({
                  item_id: item.productId,
                  item_name: item.productName,
                  price: item.price,
                  quantity: item.qty,
                  item_category: "Aquarium",
                })),
              });
              toast.success("Order placed successfully");
              navigate("/order_successful");
            } else {
              toast.error("Payment verification failed");
            }
          } catch (error) {
            console.log("verify-payment API error:", error);
            toast.error("Payment succeeded but verification failed");
          }
        },

        modal: {
          ondismiss: function () {
            toast.error("Payment popup closed");
          },
        },

        prefill: {
          name: form.name,
          contact: form.phone,
        },

        theme: {
          color: "#1F212E",
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", function (response) {
        toast.error(response.error.description || "Payment failed");
      });

      rzp.open();
    } catch (err) {
      console.log("Payment error:", err);
      toast.error(err?.response?.data?.message || "Payment failed");
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleCODOrder = async () => {
    if (!validateForm()) return;

    const token = localStorage.getItem("aqua_token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setPaymentLoading(true);

      const payload = {
        orderData: {
          name: form.name,
          phone: form.phone,
          address: buildAddressString(),
          shippingAddress: getShippingAddress(),
          items: normalizedItems,
        },
      };

      const res = await axios.post(
        `${API_URL}/api/payment/place-cod-order`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.data.success) {
        if (isCartCheckout) {
          localStorage.removeItem("aqua_cart");
        }

        window.dispatchEvent(new Event("userChanged"));
        trackPurchase({
          transaction_id: res.data?.order?._id || `COD-${Date.now()}`,
          value: total,
          shipping: totalDelivery,
          items: normalizedItems.map((item) => ({
            item_id: item.productId,
            item_name: item.productName,
            price: item.price,
            quantity: item.qty,
            item_category: "Aquarium",
          })),
        });
        toast.success("COD order placed successfully");
        navigate("/order_successful");
      } else {
        toast.error(res.data.message || "Failed to place COD order");
      }
    } catch (err) {
      console.log("COD order error:", err);
      toast.error(err?.response?.data?.message || "Failed to place COD order");
    } finally {
      setPaymentLoading(false);
    }
  };

  return (
    <section className="w-full min-h-screen py-10 sm:py-14 md:py-20 px-4 sm:px-6 bg-[#FAFAF8]">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10 lg:gap-16">
        {/* LEFT SIDE */}
        <motion.div className="bg-white p-4 sm:p-6 rounded-3xl border shadow-sm">
          <h2 className="text-xl sm:text-2xl font-semibold mb-5">
            {isCartCheckout ? "Cart Summary" : "Product Summary"}
          </h2>

          <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1 sm:pr-2">
            {normalizedItems.map((item, i) => (
              <div
                key={i}
                className="flex flex-col sm:flex-row gap-4 border-b pb-4"
              >
                <img
                  src={item.image}
                  alt={item.productName}
                  className="w-full sm:w-24 h-48 sm:h-24 object-cover rounded-xl border"
                />

                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 text-sm sm:text-base">
                    {item.productName}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {item.capacity || "Bottle"} × {item.qty}
                  </p>

                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-green-600 text-sm sm:text-base">
                      ₹{item.price * item.qty}
                    </p>

                    {item.discount > 0 && (
                      <span className="text-xs text-gray-400 line-through">
                        ₹{item.originalPrice * item.qty}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-gray-500 mt-1">
                    Delivery: ₹{item.deliveryCharge}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {!isCartCheckout && (
            <div className="mt-5">
              <label className="text-sm font-medium text-gray-700">
                Quantity
              </label>
              <input
                type="number"
                name="quantity"
                min="1"
                value={form.quantity}
                onChange={handleChange}
                className="mt-2 w-full p-3 sm:p-4 border rounded-xl"
              />
            </div>
          )}

          <div className="mt-6 space-y-2 bg-gray-50 rounded-2xl p-4">
            <div className="flex justify-between text-gray-700 text-sm sm:text-base">
              <span>Subtotal</span>
              <span>₹{subTotal}</span>
            </div>
            <div className="flex justify-between text-gray-700 text-sm sm:text-base">
              <span>Delivery</span>
              <span>₹{totalDelivery}</span>
            </div>
            <div className="flex justify-between text-base sm:text-lg font-bold text-black border-t pt-3">
              <span>Total</span>
              <span>₹{total}</span>
            </div>
          </div>
        </motion.div>

        {/* RIGHT SIDE */}
        <motion.div className="bg-white p-4 sm:p-6 md:p-8 rounded-3xl border shadow-sm">
          <h2 className="text-xl sm:text-2xl font-semibold mb-6">
            Enter Details
          </h2>

          <div className="flex flex-col gap-4 sm:gap-5">
            <input
              type="text"
              name="name"
              value={form.name}
              placeholder="Full Name"
              onChange={handleChange}
              className="p-3 sm:p-4 border rounded-xl"
            />

            <input
              type="tel"
              name="phone"
              value={form.phone}
              placeholder="Phone Number"
              onChange={handleChange}
              className="p-3 sm:p-4 border rounded-xl"
              maxLength={10}
            />

            <textarea
              name="fullAddress"
              placeholder="House no, street, area"
              value={form.fullAddress}
              onChange={handleChange}
              className="p-3 sm:p-4 border rounded-xl min-h-[110px]"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                name="landmark"
                placeholder="Landmark"
                value={form.landmark}
                onChange={handleChange}
                className="p-3 sm:p-4 border rounded-xl"
              />

              <input
                type="text"
                name="city"
                placeholder="City"
                value={form.city}
                onChange={handleChange}
                className="p-3 sm:p-4 border rounded-xl"
              />

              <input
                type="text"
                name="state"
                placeholder="State"
                value={form.state}
                onChange={handleChange}
                className="p-3 sm:p-4 border rounded-xl"
              />

              <input
                type="text"
                name="pincode"
                placeholder="Pincode"
                value={form.pincode}
                onChange={handleChange}
                className="p-3 sm:p-4 border rounded-xl"
                maxLength={6}
              />
            </div>

            <div className="space-y-3 pt-2">
              <p className="text-sm font-medium text-gray-700">
                Select Payment Method
              </p>

              <label
                className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition ${
                  paymentMethod === "prepaid"
                    ? "border-black bg-gray-50"
                    : "border-gray-200"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === "prepaid"}
                  onChange={() => setPaymentMethod("prepaid")}
                />
                <span className="text-sm sm:text-base">
                  Pay Online (Razorpay)
                </span>
              </label>

              <label
                className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition ${
                  paymentMethod === "cod"
                    ? "border-black bg-gray-50"
                    : "border-gray-200"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                />
                <span className="text-sm sm:text-base">Cash on Delivery</span>
              </label>
            </div>

            <button
              onClick={paymentMethod === "cod" ? handleCODOrder : handlePayment}
              disabled={paymentLoading}
              className="w-full py-3 sm:py-4 rounded-full bg-black text-white font-semibold cursor-pointer hover:bg-gray-800 transition disabled:opacity-60 text-sm sm:text-base"
            >
              {paymentLoading
                ? "Processing..."
                : paymentMethod === "cod"
                  ? `Place COD Order ₹${total}`
                  : `Pay ₹${total}`}
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
