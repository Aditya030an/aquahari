import React, { useEffect, useMemo, useState } from "react";
import { FaShoppingCart, FaBolt } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import {
  MdDelete,
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdOutlineZoomOutMap,
} from "react-icons/md";
import { Link } from "react-router-dom";

export default function ProductCard({
  item,
  isAdmin,
  handleDelete,
  handleEdit,
  handleAddToCart,
  handleBuyNow,
  deleteLoading,
}) {
  const images = useMemo(
    () =>
      item?.images?.length ? item.images : [{ url: "/products/dummyImg.jpg" }],
    [item],
  );

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [viewerIndex, setViewerIndex] = useState(0);
  const [showViewer, setShowViewer] = useState(false);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    setActiveImageIndex(0);
    setViewerIndex(0);
    setQty(1);
  }, [item]);

  useEffect(() => {
    document.body.style.overflow = showViewer ? "hidden" : "auto";

    const handleKeyDown = (e) => {
      if (!showViewer) return;
      if (e.key === "Escape") setShowViewer(false);
      if (e.key === "ArrowLeft") prevViewerImage();
      if (e.key === "ArrowRight") nextViewerImage();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showViewer, images.length]);

  const prevImage = () => {
    if (!images.length) return;
    setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextImage = () => {
    if (!images.length) return;
    setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevViewerImage = () => {
    if (!images.length) return;
    setViewerIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextViewerImage = () => {
    if (!images.length) return;
    setViewerIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const openViewer = () => {
    setViewerIndex(activeImageIndex);
    setShowViewer(true);
  };

  const originalPrice = Number(item?.price || 0);
  const discount = Number(item?.discount || 0);
  const finalPrice = Math.max(
    0,
    Math.round(originalPrice - (originalPrice * discount) / 100),
  );

  // Since item.quantity is bottle capacity now, stock should not depend on it
  const isOutOfStock = Number(item?.stock || item?.availableStock || 1) <= 0;

  console.log("item", item);
  console.log("item discount", item?.discount);

  return (
    <>
      <div className="group relative w-full overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-r from-slate-50 via-white to-slate-50" />

        {/* Image Section */}
        <div className="relative p-3 sm:p-4">
          <div className="relative overflow-hidden rounded-[24px] border border-slate-100 bg-gradient-to-br from-slate-50 via-white to-slate-100">
            {/* Admin Delete */}
            {isAdmin && (
              <div className="absolute right-3 top-3 z-20 flex gap-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="flex h-10 w-10 items-center cursor-pointer justify-center rounded-full border border-white/70 bg-white/90 text-slate-700 shadow-md backdrop-blur transition hover:scale-105 hover:bg-white"
                >
                  ✏️
                </button>

                <button
                  onClick={() => handleDelete(item?._id)}
                  disabled={deleteLoading}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/90 text-slate-700 shadow-md backdrop-blur transition hover:scale-105 hover:bg-white disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {deleteLoading ? (
                    <AiOutlineLoading3Quarters className="animate-spin text-lg text-red-500" />
                  ) : (
                    <MdDelete className="text-xl text-red-500" />
                  )}
                </button>
              </div>
            )}

            {/* Badges */}
            <div className="absolute left-3 top-3 z-20 flex flex-wrap gap-2">
              {discount > 0 && (
                <span className="rounded-full bg-emerald-500 px-2.5 py-1 text-[10px] font-semibold text-white shadow-sm sm:text-xs">
                  {discount}% OFF
                </span>
              )}

              {isOutOfStock ? (
                <span className="rounded-full bg-red-500 px-2.5 py-1 text-[10px] font-semibold text-white shadow-sm sm:text-xs">
                  Out of Stock
                </span>
              ) : (
                <span className="rounded-full bg-slate-900 px-2.5 py-1 text-[10px] font-semibold text-white shadow-sm sm:text-xs">
                  Available
                </span>
              )}
            </div>

            {/* Zoom button */}
            <button
              onClick={openViewer}
              className="absolute bottom-3 right-3 z-20 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/70 bg-white/90 text-slate-700 shadow-md backdrop-blur transition hover:scale-105 hover:bg-white"
            >
              <MdOutlineZoomOutMap className="text-xl" />
            </button>

            {/* Main Image */}
            <div className="relative flex h-60 items-center justify-center p-4 sm:h-72 lg:h-60">
              <img
                src={images[activeImageIndex]?.url}
                alt={item?.name || "product"}
                onClick={openViewer}
                className="h-full w-full cursor-pointer object-contain transition duration-500 group-hover:scale-[1.04]"
              />
            </div>

            {/* Arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/70 bg-white/85 text-slate-700 shadow-md backdrop-blur transition hover:scale-105 hover:bg-white"
                >
                  <MdKeyboardArrowLeft size={24} />
                </button>

                <button
                  onClick={nextImage}
                  className="absolute right-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/70 bg-white/85 text-slate-700 shadow-md backdrop-blur transition hover:scale-105 hover:bg-white"
                >
                  <MdKeyboardArrowRight size={24} />
                </button>
              </>
            )}

            {/* Dots */}
            {images.length > 1 && (
              <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-white/85 px-3 py-1.5 backdrop-blur">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImageIndex(i)}
                    className={`h-2 cursor-pointer rounded-full transition-all duration-300 ${
                      activeImageIndex === i
                        ? "w-6 bg-slate-900"
                        : "w-2 bg-slate-300 hover:bg-slate-400"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="px-4 pb-4 sm:px-5 sm:pb-5">
          <div className="space-y-4">
            {/* Title */}
            <div>
              <Link
                to={`/product_details/${item?._id}`}
                className="line-clamp-2 text-base font-semibold leading-snug text-slate-900 transition hover:text-black sm:text-lg"
              >
                {item?.name}
              </Link>

              <p className="mt-1 text-sm font-medium text-slate-500">
                {item?.capacity || "Bottle size not available"}
              </p>
            </div>

            {/* Price */}
            <div className="flex items-end justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                    ₹{finalPrice}
                  </p>

                  {discount > 0 && (
                    <span className="text-sm text-slate-400 line-through sm:text-base">
                      ₹{originalPrice}
                    </span>
                  )}
                </div>

                <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                  Delivery starts from ₹{Number(item?.baseDeliveryPrice || 0)}
                </p>
              </div>

              {discount > 0 && (
                <span className="shrink-0 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 sm:text-sm">
                  {discount}% OFF
                </span>
              )}
            </div>

            {/* Quantity selector */}
            <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-slate-700">Quantity</p>
                <p className="text-xs text-slate-500">Adjust before checkout</p>
              </div>

              <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-1 shadow-sm">
                <button
                  onClick={() => setQty((prev) => (prev > 1 ? prev - 1 : 1))}
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-lg font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  -
                </button>

                <span className="min-w-[28px] text-center text-sm font-semibold text-slate-900">
                  {qty}
                </span>

                <button
                  onClick={() => setQty((prev) => prev + 1)}
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-lg font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  +
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                disabled={isOutOfStock}
                onClick={() =>
                  handleBuyNow({
                    ...item,
                    qty,
                  })
                }
                className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 sm:text-base"
              >
                <FaBolt className="text-sm" />
                Order Now
              </button>

              <button
                disabled={isOutOfStock}
                onClick={() =>
                  handleAddToCart({
                    ...item,
                    qty,
                  })
                }
                className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 sm:text-base"
              >
                <FaShoppingCart className="text-sm" />
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Viewer */}
      {showViewer && (
        <div className="fixed inset-0 z-[9999] bg-black/95">
          <div className="relative flex h-screen w-full flex-col px-3 py-3 sm:px-6 sm:py-6">
            <button
              onClick={() => setShowViewer(false)}
              className="absolute right-3 top-3 z-30 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white/10 text-xl text-white backdrop-blur transition hover:bg-white/20 sm:right-6 sm:top-6 sm:h-11 sm:w-11 sm:text-2xl"
            >
              ✕
            </button>

            {images.length > 1 && (
              <>
                <button
                  onClick={prevViewerImage}
                  className="absolute left-2 top-1/2 z-30 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20 sm:left-6 sm:h-12 sm:w-12"
                >
                  <MdKeyboardArrowLeft size={24} className="sm:hidden" />
                  <MdKeyboardArrowLeft size={30} className="hidden sm:block" />
                </button>

                <button
                  onClick={nextViewerImage}
                  className="absolute right-2 top-1/2 z-30 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20 sm:right-6 sm:h-12 sm:w-12"
                >
                  <MdKeyboardArrowRight size={24} className="sm:hidden" />
                  <MdKeyboardArrowRight size={30} className="hidden sm:block" />
                </button>
              </>
            )}

            <div className="flex h-full w-full flex-col items-center justify-center overflow-hidden">
              <div className="flex w-full flex-1 items-center justify-center overflow-hidden pt-10 sm:pt-12">
                <img
                  src={images[viewerIndex]?.url}
                  alt={item?.name || "product"}
                  className="max-h-full max-w-full rounded-xl object-contain sm:rounded-2xl"
                />
              </div>

              {images.length > 1 && (
                <div className="mt-3 w-full max-w-6xl pb-1 sm:mt-5">
                  <div className="mx-auto flex w-max min-w-full justify-start gap-2 px-1 sm:justify-center sm:gap-3">
                    {images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setViewerIndex(i)}
                        className={`shrink-0 cursor-pointer overflow-hidden rounded-xl border-2 transition ${
                          viewerIndex === i
                            ? "scale-105 border-white"
                            : "border-transparent opacity-60 hover:opacity-100"
                        }`}
                      >
                        <img
                          src={img?.url}
                          alt={`thumbnail-${i}`}
                          className="h-14 w-14 object-cover sm:h-20 sm:w-20"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
