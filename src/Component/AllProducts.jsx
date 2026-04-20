import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import ProductCard from "./ProductCard";
import { FiRefreshCw } from "react-icons/fi";
import { MdOutlineInventory2 } from "react-icons/md";
import { trackAddToCart } from "../utils/analytics";

export default function AllProducts({ isAdmin }) {
  const API_URL = import.meta.env.VITE_APP_API_URL || "http://localhost:8080";
  const navigate = useNavigate();
  const location = useLocation();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);

  const PRODUCT_CACHE_KEY = "aqua_products";
  const PRODUCT_CACHE_TIME_KEY = "aqua_products_last_fetch";
  const CACHE_DURATION = 10 * 60 * 1000;

  const fetchAllProducts = useCallback(
    async (forceRefresh = false) => {
      try {
        const cachedProducts = JSON.parse(
          localStorage.getItem(PRODUCT_CACHE_KEY),
        );
        const lastFetchTime = localStorage.getItem(PRODUCT_CACHE_TIME_KEY);
        const now = Date.now();

        const isCacheValid =
          !forceRefresh &&
          cachedProducts &&
          lastFetchTime &&
          now - Number(lastFetchTime) < CACHE_DURATION;

        if (isCacheValid) {
          setProducts(cachedProducts);
          return;
        }

        setLoading(true);

        const response = await axios.get(`${API_URL}/api/product`);
        const fetchedProducts = response.data || [];

        setProducts(fetchedProducts);
        localStorage.setItem(
          PRODUCT_CACHE_KEY,
          JSON.stringify(fetchedProducts),
        );
        localStorage.setItem(PRODUCT_CACHE_TIME_KEY, now.toString());
      } catch (error) {
        console.error("Fetch error:", error);

        const cachedProducts = JSON.parse(
          localStorage.getItem(PRODUCT_CACHE_KEY),
        );
        if (cachedProducts) {
          setProducts(cachedProducts);
        } else {
          setProducts([]);
        }
      } finally {
        setLoading(false);
      }
    },
    [API_URL],
  );

  useEffect(() => {
    const shouldForceRefresh = location.state?.refresh === true;
    fetchAllProducts(shouldForceRefresh);

    if (shouldForceRefresh) {
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [fetchAllProducts, location.pathname, location.state, navigate]);

  const refreshProducts = useCallback(() => {
    fetchAllProducts(true);
  }, [fetchAllProducts]);

  const updateProductCache = (updatedProducts) => {
    setProducts(updatedProducts);
    localStorage.setItem(PRODUCT_CACHE_KEY, JSON.stringify(updatedProducts));
    localStorage.setItem(PRODUCT_CACHE_TIME_KEY, Date.now().toString());
  };

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
      return navigate("/login");
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
      category: product?.category || "Aquarium",
    });
    toast.success("Added to cart");
  };

  const handleBuyNow = (product) => {
    if (!localStorage.getItem("aqua_token")) {
      return navigate("/login");
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

  const handleDelete = async (id) => {
    const token = localStorage.getItem("aqua_token");

    if (!token) {
      return navigate("/login");
    }

    setDeleteLoadingId(id);

    try {
      const response = await axios.delete(
        `${API_URL}/api/product/deleteProduct/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response?.data?.success) {
        toast.success("Product deleted successfully");
        const updatedProducts = products.filter((item) => item._id !== id);
        updateProductCache(updatedProducts);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete product");
    } finally {
      setDeleteLoadingId(null);
    }
  };

  const handleEdit = (product) => {
    navigate("/admin/add-product", { state: { product } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 px-4 py-6 sm:px-6 sm:py-8 md:px-8 lg:px-10">
      <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            {isAdmin ? "Manage Products" : "Products"}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {isAdmin
              ? "Manage all available products"
              : "Explore and shop all available products"}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {isAdmin && (
            <button
              onClick={() => navigate("/admin/add-product")}
              className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm text-white shadow-sm transition hover:bg-blue-700 sm:text-base"
            >
              + Add Product
            </button>
          )}

          <button
            onClick={refreshProducts}
            className="flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm transition hover:bg-slate-50 sm:text-base"
          >
            <FiRefreshCw size={20} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex min-h-[300px] items-center justify-center">
          <p className="text-center text-sm text-slate-600 sm:text-base">
            Loading products...
          </p>
        </div>
      ) : products.length === 0 ? (
        <div className="flex min-h-[420px] items-center justify-center">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
              <MdOutlineInventory2 className="text-4xl text-slate-500" />
            </div>

            <h3 className="text-2xl font-bold text-slate-900">
              No Product Found
            </h3>

            <p className="mt-2 text-sm text-slate-500 sm:text-base">
              There are no products available right now.
            </p>

            {isAdmin && (
              <button
                onClick={() => navigate("/admin/add-product")}
                className="mt-6 rounded-xl bg-blue-600 px-5 py-3 text-sm text-white shadow-sm transition hover:bg-blue-700 sm:text-base"
              >
                Add Your First Product
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid justify-items-center gap-5 sm:grid-cols-2 sm:gap-6 lg:gap-8 xl:grid-cols-3">
          {products.map((item) => (
            <ProductCard
              key={item._id}
              item={item}
              isAdmin={isAdmin}
              handleDelete={handleDelete}
              handleEdit={handleEdit}
              handleAddToCart={handleAddToCart}
              handleBuyNow={handleBuyNow}
              deleteLoading={deleteLoadingId === item._id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
