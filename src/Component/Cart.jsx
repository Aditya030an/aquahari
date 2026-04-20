import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { trackBeginCheckout } from "../utils/analytics";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("aqua_cart")) || [];
    setCart(storedCart);
  }, []);

  const calculateDeliveryCharge = (qty, item) => {
    const quantity = Math.max(1, Number(qty) || 1);
    const base = Number(item?.baseDeliveryPrice || 0);
    const perBottle = Number(item?.deliveryPricePerBottle || 0);

    return base + (quantity - 1) * perBottle;
  };

  const getFinalUnitPrice = (item) => {
    const originalPrice = Number(item?.originalPrice || 0);
    const discount = Number(item?.discount || 0);
    const storedPrice = Number(item?.price || 0);

    if (originalPrice > 0 && discount > 0) {
      return Math.max(
        0,
        Math.round(originalPrice - (originalPrice * discount) / 100)
      );
    }

    return storedPrice;
  };

  const updateCart = (updatedCart) => {
    setCart(updatedCart);
    localStorage.setItem("aqua_cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("userChanged"));
  };

  const handleQtyChange = (index, type) => {
    const updatedCart = [...cart];
    const currentItem = updatedCart[index];

    if (type === "inc") {
      currentItem.qty += 1;
    } else if (type === "dec" && currentItem.qty > 1) {
      currentItem.qty -= 1;
    }

    currentItem.deliveryCharge = calculateDeliveryCharge(
      currentItem.qty,
      currentItem
    );

    updateCart(updatedCart);
  };

  const handleDelete = (index) => {
    const updatedCart = cart.filter((_, i) => i !== index);
    updateCart(updatedCart);
  };

  const totalProductPrice = cart.reduce((acc, item) => {
    return acc + getFinalUnitPrice(item) * Number(item.qty || 0);
  }, 0);

  const totalDelivery = cart.reduce(
    (acc, item) => acc + Number(item.deliveryCharge || 0),
    0
  );

  const grandTotal = totalProductPrice + totalDelivery;

  console.log("cart" , cart);

  return (
    <section className="min-h-screen w-full bg-[#FAFAF8] px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <h2 className="text-3xl font-semibold text-[#1F212E] md:text-5xl">
            Your Cart 🛒
          </h2>
          <p className="mt-2 text-sm text-gray-500 sm:text-base">
            Review your selected water bottles before checkout
          </p>
        </div>

        {cart.length === 0 ? (
          <div className="rounded-3xl border border-gray-200 bg-white p-10 text-center shadow-sm">
            <p className="text-gray-500">Your cart is empty</p>
          </div>
        ) : (
          <div className="grid gap-10 md:grid-cols-3">
            {/* ITEMS */}
            <div className="space-y-6 md:col-span-2">
              {cart.map((item, index) => {
                const finalUnitPrice = getFinalUnitPrice(item);
                const itemTotal = finalUnitPrice * Number(item.qty || 0);

                return (
                  <motion.div
                    key={index}
                    className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:gap-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <img
                      src={item.image || "/products/dummyImg.jpg"}
                      alt={item.name}
                      className="h-24 w-24 rounded-xl object-cover"
                    />

                    <div className="flex-1">
                      <h3 className="font-semibold text-[#1F212E]">
                        {item.name}
                      </h3>

                      {item.capacity && (
                        <p className="mt-1 text-sm text-gray-500">
                          Bottle Size: {item.capacity}
                        </p>
                      )}

                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <p className="font-medium text-[#9EC07F]">
                          ₹{finalUnitPrice}
                        </p>

                        {Number(item.discount || 0) > 0 &&
                          Number(item.originalPrice || 0) > 0 && (
                            <>
                              <span className="text-sm text-gray-400 line-through">
                                ₹{item.originalPrice}
                              </span>
                              <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
                                {item.discount}% OFF
                              </span>
                            </>
                          )}
                      </div>

                      <p className="mt-1 text-sm text-gray-500">
                        Item Total: ₹{itemTotal}
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        Delivery: ₹{item.deliveryCharge}
                      </p>

                      {/* QUANTITY */}
                      <div className="mt-3 flex items-center gap-3">
                        <button
                          onClick={() => handleQtyChange(index, "dec")}
                          className="rounded-lg cursor-pointer border px-3 py-1 transition hover:bg-gray-50"
                        >
                          -
                        </button>

                        <span className="min-w-[20px] text-center">
                          {item.qty}
                        </span>

                        <button
                          onClick={() => handleQtyChange(index, "inc")}
                          className="rounded-lg cursor-pointer border px-3 py-1 transition hover:bg-gray-50"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* REMOVE */}
                    <button
                      onClick={() => handleDelete(index)}
                      className="self-start cursor-pointer text-sm text-red-500 transition hover:text-red-600 sm:self-center"
                    >
                      Remove
                    </button>
                  </motion.div>
                );
              })}
            </div>

            {/* SUMMARY */}
            <div className="h-fit rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-xl font-semibold text-[#1F212E]">
                Order Summary
              </h3>

              <div className="mb-2 flex justify-between text-gray-600">
                <span>Product Total</span>
                <span>₹{totalProductPrice}</span>
              </div>

              <div className="mb-4 flex justify-between text-gray-600">
                <span>Delivery</span>
                <span>₹{totalDelivery}</span>
              </div>

              <div className="mb-6 flex justify-between text-lg font-semibold text-[#1F212E]">
                <span>Total</span>
                <span>₹{grandTotal}</span>
              </div>

              <button
                onClick={() =>
                  navigate("/BuyNow", {
                    state: { cart },
                  })
                }
                className="block w-full rounded-full bg-[#1F212E] py-3 text-center text-white transition hover:bg-[#2b2e3f]"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}