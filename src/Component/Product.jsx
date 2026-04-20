import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { trackViewItem, trackAddToCart } from "../utils/analytics";

export default function ProductPage() {
  const API_URL = import.meta.env.VITE_APP_API_URL || "http://localhost:8080";
  const navigate = useNavigate();
  const { id } = useParams();

  const fallbackImages = [
    "/products/img1.jpeg",
    "/products/img2.jpeg",
    "/products/img3.jpeg",
    "/products/img4.jpeg",
    "/products/img5.jpeg",
    "/products/img6.jpeg",
    "/products/img7.jpeg",
    "/products/img8.jpeg",
    "/products/img9.jpeg",
    "/products/img10.jpeg",
    "/products/img11.jpeg",
  ];

  const [mainImage, setMainImage] = useState("");
  const [singleProduct, setSingleProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSingleProduct = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${API_URL}/api/product/getSingleProduct/${id}`,
      );

      const product = res?.data?.product;

      if (res?.data?.success && product) {
        setSingleProduct(product);
        setMainImage(product?.images?.[0]?.url || "/products/dummyImg.jpg");
      } else {
        toast.error("Product not found");
      }
    } catch (err) {
      console.log("fetchSingleProduct error:", err);
      toast.error(err?.response?.data?.message || "Failed to fetch product");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchSingleProduct();
    }
  }, [id]);

  useEffect(() => {
    if (!singleProduct) return;

    trackViewItem({
      item_id: singleProduct._id,
      item_name: singleProduct.name,
      price: getFinalPrice(singleProduct),
      category: singleProduct.category || "Aquarium",
    });
  }, [singleProduct]);

  const getFinalPrice = (product) => {
    const price = Number(product?.price || 0);
    const discount = Number(product?.discount || 0);

    if (!discount) return price;
    return Math.max(0, Math.round(price - (price * discount) / 100));
  };

  const calculateDeliveryCharge = (qty, product) => {
    const quantity = Math.max(1, Number(qty) || 1);
    const base = Number(product?.baseDeliveryPrice || 0);
    const perBottle = Number(product?.deliveryPricePerBottle || 0);

    return base + (quantity - 1) * perBottle;
  };

  const handleAddToCart = (product) => {
    if (!localStorage.getItem("aqua_token")) {
      navigate("/login");
      return;
    }

    const selectedQty = Math.max(1, Number(product?.qty) || 1);
    const finalPrice = getFinalPrice(product);
    const deliveryCharge = calculateDeliveryCharge(selectedQty, product);

    let cart = JSON.parse(localStorage.getItem("aqua_cart")) || [];

    const newItem = {
      productId: product._id,
      name: product.name,
      capacity: product.capacity,
      price: finalPrice,
      originalPrice: Number(product.price || 0),
      discount: Number(product.discount || 0),
      qty: selectedQty,
      image: product.images?.[0]?.url || "",
      baseDeliveryPrice: Number(product.baseDeliveryPrice || 0),
      deliveryPricePerBottle: Number(product.deliveryPricePerBottle || 0),
      deliveryCharge,
    };

    const existingIndex = cart.findIndex(
      (item) => item.productId === newItem.productId,
    );

    if (existingIndex !== -1) {
      const updatedQty = cart[existingIndex].qty + newItem.qty;
      cart[existingIndex].qty = updatedQty;
      cart[existingIndex].deliveryCharge = calculateDeliveryCharge(updatedQty, {
        baseDeliveryPrice: cart[existingIndex].baseDeliveryPrice,
        deliveryPricePerBottle: cart[existingIndex].deliveryPricePerBottle,
      });
    } else {
      cart.push(newItem);
    }

    localStorage.setItem("aqua_cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("userChanged"));
    trackAddToCart({
      item_id: newItem.productId,
      item_name: newItem.name,
      price: newItem.price,
      quantity: newItem.qty,
      category: singleProduct?.category || "Aquarium",
    });
    toast.success("Added to cart");
  };

  const handleBuyNow = (product) => {
    if (!localStorage.getItem("aqua_token")) {
      navigate("/login");
      return;
    }

    const selectedQty = Math.max(1, Number(product?.qty) || 1);
    const finalPrice = getFinalPrice(product);

    navigate("/BuyNow", {
      state: {
        productId: product._id,
        name: product.name,
        capacity: product.capacity,
        image: product.images?.[0]?.url || "",
        qty: selectedQty,
        price: finalPrice,
        originalPrice: Number(product.price || 0),
        discount: Number(product.discount || 0),
        baseDeliveryPrice: Number(product.baseDeliveryPrice || 0),
        deliveryPricePerBottle: Number(product.deliveryPricePerBottle || 0),
        deliveryCharge: calculateDeliveryCharge(selectedQty, product),
      },
    });
  };

  const finalPrice = getFinalPrice(singleProduct);
  const imageList =
    singleProduct?.images?.length > 0 ? singleProduct.images : fallbackImages;

  if (loading) {
    return (
      <section className="w-full py-28 px-6 bg-white">
        <div className="max-w-6xl mx-auto text-center text-gray-500">
          Loading product...
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-28 px-6 bg-white">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16">
        {/* LEFT – IMAGE GALLERY */}
        <div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="rounded-3xl overflow-hidden border border-gray-200 mb-4"
          >
            <img
              src={mainImage || "/products/dummyImg.jpg"}
              alt={singleProduct?.name || "product"}
              className="w-full h-[420px] object-contain"
            />
          </motion.div>

          <div className="grid grid-cols-6 gap-3">
            {imageList.map((img, i) => {
              const imageUrl = typeof img === "string" ? img : img?.url;

              return (
                <img
                  key={img?._id || i}
                  src={imageUrl || "/products/dummyImg.jpg"}
                  alt={`thumbnail-${i + 1}`}
                  loading="lazy"
                  onClick={() => setMainImage(imageUrl)}
                  className={`cursor-pointer rounded-lg h-20 w-full object-contain border ${
                    mainImage === imageUrl
                      ? "border-[#9EC07F]"
                      : "border-gray-200"
                  }`}
                />
              );
            })}
          </div>
        </div>

        {/* RIGHT – DETAILS */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-3xl md:text-5xl font-semibold text-[#1F212E] mb-4">
            {singleProduct?.name || "Aquahari Blackwater IAL Extract 🌿🐟"}
          </h1>

          <div className="mb-6">
            {Number(singleProduct?.discount) > 0 ? (
              <div className="flex items-center gap-3 flex-wrap">
                <p className="text-2xl text-[#9EC07F] font-semibold">
                  ₹{finalPrice}
                </p>
                <p className="text-lg text-gray-400 line-through">
                  ₹{singleProduct?.price}
                </p>
                <span className="text-sm bg-red-100 text-red-500 px-3 py-1 rounded-full">
                  {singleProduct?.discount}% OFF
                </span>
              </div>
            ) : (
              <p className="text-2xl text-[#9EC07F] font-semibold">
                ₹{singleProduct?.price || 0}
              </p>
            )}
          </div>

          <p className="text-gray-600 leading-relaxed mb-6 whitespace-pre-line">
            {singleProduct?.description || "No description available"}
          </p>

          <div className="mb-6 text-gray-600 space-y-2">
            <p>💧 Net Volume: {singleProduct?.capacity || "N/A"}</p>
            <p>
              🚚 Shipping: ₹{singleProduct?.baseDeliveryPrice || 0} base charge
            </p>
            {/* <p>
              📦 Extra Bottle Delivery: ₹
              {singleProduct?.deliveryPricePerBottle || 0} per bottle
            </p> */}
          </div>

          <div className="flex gap-4 mt-8">
            <button
              onClick={() => handleBuyNow(singleProduct)}
              disabled={!singleProduct}
              className="px-8 py-3 cursor-pointer rounded-full bg-[#1F212E] text-white hover:bg-[#2b2e3f] transition inline-block disabled:opacity-50"
            >
              Order Now
            </button>

            <button
              onClick={() => handleAddToCart(singleProduct)}
              disabled={!singleProduct}
              className="px-8 py-3 cursor-pointer rounded-full border border-gray-300 hover:bg-gray-100 transition disabled:opacity-50"
            >
              Add to Cart
            </button>
          </div>

          <p className="text-sm text-red-500 mt-6">
            ⚠ First batch limited stock
          </p>
        </motion.div>
      </div>
    </section>
  );
}
