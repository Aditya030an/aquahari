import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  FaTimes,
  FaCloudUploadAlt,
  FaPlus,
  FaGripVertical,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

export default function ProductForm() {
  const location = useLocation();
  const navigate = useNavigate();

  const finalEditData = location.state?.product || null;
  const isEditMode = !!finalEditData;

  const API_URL = import.meta.env.VITE_APP_API_URL || "http://localhost:8080";
  const fileInputRef = useRef(null);
  const MAX_IMAGES = 10;

  const [form, setForm] = useState({
    name: "",
    description: "",
    capacity: "",
    price: "",
    discount: "",
    baseDeliveryPrice: "",
    deliveryPricePerBottle: "",
  });

  const [images, setImages] = useState([]);
  const [removedExistingImages, setRemovedExistingImages] = useState([]);
  const [activeImage, setActiveImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragIndex, setDragIndex] = useState(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    setRemovedExistingImages([]);

    if (finalEditData) {
      setForm({
        name: finalEditData?.name || "",
        description: finalEditData?.description || "",
        capacity: finalEditData?.capacity || "",
        price: finalEditData?.price || "",
        discount: finalEditData?.discount || "",
        baseDeliveryPrice: finalEditData?.baseDeliveryPrice || "",
        deliveryPricePerBottle: finalEditData?.deliveryPricePerBottle || "",
      });

      const existingImages =
        finalEditData?.images?.map((img, index) => ({
          id: img.public_id || `${img.url}-${index}`,
          url: img.url,
          preview: img.url,
          public_id: img.public_id,
          isExisting: true,
          name: `existing-${index}`,
        })) || [];

      setImages(existingImages);
      setActiveImage(existingImages?.[0]?.preview || null);
    } else {
      setForm({
        name: "",
        description: "",
        capacity: "",
        price: "",
        discount: "",
        baseDeliveryPrice: "",
        deliveryPricePerBottle: "",
      });
      setImages([]);
      setActiveImage(null);
    }
  }, [finalEditData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImages = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const availableSlots = MAX_IMAGES - images.length;

    if (availableSlots <= 0) {
      toast.error(`You can upload maximum ${MAX_IMAGES} images`);
      return;
    }

    const newImages = files.slice(0, availableSlots).map((file) => {
      const preview = URL.createObjectURL(file);
      return {
        id: `${file.name}-${file.lastModified}-${Math.random()
          .toString(36)
          .slice(2, 8)}`,
        file,
        url: preview,
        preview,
        name: file.name,
        isExisting: false,
      };
    });

    setImages((prev) => {
      const updated = [...prev, ...newImages].slice(0, MAX_IMAGES);
      if (!activeImage && updated.length > 0) {
        setActiveImage(updated[0].preview);
      }
      return updated;
    });

    e.target.value = "";
  };

  const removeImage = (index) => {
    setImages((prev) => {
      const removedImage = prev[index];
      const updated = prev.filter((_, i) => i !== index);

      if (removedImage?.isExisting) {
        setRemovedExistingImages((old) => [
          ...old,
          {
            public_id: removedImage.public_id,
            url: removedImage.url,
          },
        ]);
      } else if (removedImage?.preview?.startsWith("blob:")) {
        URL.revokeObjectURL(removedImage.preview);
      }

      if (removedImage?.preview === activeImage) {
        setActiveImage(updated.length ? updated[0].preview : null);
      }

      return updated;
    });
  };

  const moveImage = (fromIndex, toIndex) => {
    if (
      fromIndex < 0 ||
      toIndex < 0 ||
      fromIndex >= images.length ||
      toIndex >= images.length
    ) {
      return;
    }

    setImages((prev) => {
      const updated = [...prev];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      return updated;
    });
  };

  const handleDragStart = (index) => {
    setDragIndex(index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (dropIndex) => {
    if (dragIndex === null || dragIndex === dropIndex) {
      setDragIndex(null);
      return;
    }

    setImages((prev) => {
      const updated = [...prev];
      const [draggedItem] = updated.splice(dragIndex, 1);
      updated.splice(dropIndex, 0, draggedItem);
      return updated;
    });

    setDragIndex(null);
  };

  const previewDeliveryExamples = () => {
    const base = Number(form.baseDeliveryPrice || 0);
    const perBottle = Number(form.deliveryPricePerBottle || 0);

    return {
      one: base,
      two: base + perBottle,
      three: base + perBottle * 2,
      four: base + perBottle * 3,
    };
  };

  const finalPrice = useMemo(() => {
    const price = Number(form.price || 0);
    const discount = Number(form.discount || 0);

    if (!price) return 0;
    if (!discount) return price;

    return Math.max(0, Math.round(price - (price * discount) / 100));
  }, [form.price, form.discount]);

  const deliveryPreview = previewDeliveryExamples();

  const validateForm = () => {
    if (
      !form.name.trim() ||
      !form.description.trim() ||
      !form.capacity.trim() ||
      form.price === "" ||
      form.baseDeliveryPrice === "" ||
      form.deliveryPricePerBottle === ""
    ) {
      toast.error("Please fill all required fields");
      return false;
    }

    if (images.length === 0) {
      toast.error("Please keep at least 1 image");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const token = localStorage.getItem("aqua_token");
    if (!token) {
      toast.error("Please login first");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", form.name.trim());
      formData.append("description", form.description.trim());
      formData.append("capacity", form.capacity.trim());
      formData.append("price", form.price);
      formData.append("discount", form.discount);
      formData.append("baseDeliveryPrice", form.baseDeliveryPrice);
      formData.append("deliveryPricePerBottle", form.deliveryPricePerBottle);
      formData.append("removedImages", JSON.stringify(removedExistingImages));

      const existingImagesOrder = images
        .filter((img) => img.isExisting)
        .map((img) => ({
          public_id: img.public_id,
          url: img.url,
        }));

      formData.append("existingImagesOrder", JSON.stringify(existingImagesOrder));

      images.forEach((img) => {
        if (!img.isExisting && img.file) {
          formData.append("images", img.file);
        }
      });

      let response;

      if (isEditMode) {
        response = await axios.put(
          `${API_URL}/api/product/${finalEditData._id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        response = await axios.post(
          `${API_URL}/api/product/addProduct`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      if (response?.data?.success) {
        toast.success(
          isEditMode
            ? "Product updated successfully"
            : "Product added successfully"
        );

        localStorage.removeItem("aqua_products");
        localStorage.removeItem("aqua_products_last_fetch");

        navigate("/admin/all-products", {
          replace: true,
          state: { refresh: true },
        });
      }
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          (isEditMode ? "Update failed" : "Upload failed")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full w-full flex-col rounded-3xl border border-slate-200 bg-white shadow-2xl">
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
            {isEditMode ? "Edit Product" : "Add Product"}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {isEditMode
              ? "Update product details and images"
              : "Create a product with pricing, discount, delivery, and image ordering"}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <form onSubmit={handleSubmit} className="h-full">
          <div className="grid grid-cols-1 gap-6 p-4 sm:p-6 lg:grid-cols-2 lg:gap-8">
            <div className="space-y-5">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-base font-semibold text-slate-800 sm:text-lg">
                    Product Images
                  </h3>
                  <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">
                    {images.length} / {MAX_IMAGES}
                  </span>
                </div>

                <div className="flex h-64 sm:h-80 lg:h-[26rem] items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-slate-300 bg-white">
                  {activeImage ? (
                    <img
                      src={activeImage}
                      alt="Preview"
                      className="h-full w-full object-contain p-3"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center text-slate-400">
                      <FaCloudUploadAlt className="mb-3 text-4xl" />
                      <p className="text-sm font-medium sm:text-base">
                        Image preview will appear here
                      </p>
                      <p className="mt-1 text-xs sm:text-sm">
                        Upload up to 10 product images
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-4 overflow-x-auto pb-2">
                  <div className="flex gap-3">
                    <label
                      className={`flex h-20 w-20 shrink-0 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed transition ${
                        images.length >= MAX_IMAGES
                          ? "cursor-not-allowed border-slate-200 bg-slate-100 opacity-60"
                          : "border-slate-300 bg-white hover:border-slate-400 hover:bg-slate-50"
                      }`}
                    >
                      <FaPlus className="mb-1 text-slate-500" />
                      <span className="text-xs text-slate-500">Upload</span>
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        disabled={images.length >= MAX_IMAGES}
                        onChange={handleImages}
                        className="hidden"
                      />
                    </label>

                    {images.map((img, i) => (
                      <div
                        key={img.id}
                        draggable
                        onDragStart={() => handleDragStart(i)}
                        onDragOver={handleDragOver}
                        onDrop={() => handleDrop(i)}
                        onClick={() => setActiveImage(img.preview)}
                        className={`relative h-24 w-24 shrink-0 cursor-pointer overflow-hidden rounded-2xl border bg-white transition ${
                          activeImage === img.preview
                            ? "border-slate-900 ring-2 ring-slate-900"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <img
                          src={img.preview}
                          alt={img.name || "product-image"}
                          className="h-full w-full object-cover"
                        />

                        <div className="absolute left-1 top-1 cursor-grab rounded-full bg-black/70 p-1 text-white">
                          <FaGripVertical size={10} />
                        </div>

                        <div className="absolute bottom-1 left-1 right-1 flex items-center justify-between gap-1">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              moveImage(i, i - 1);
                            }}
                            className="flex h-6 w-6 items-center justify-center rounded-full bg-black/70 text-white hover:bg-black disabled:opacity-40"
                            disabled={i === 0}
                          >
                            <FaArrowLeft size={9} />
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              moveImage(i, i + 1);
                            }}
                            className="flex h-6 w-6 items-center justify-center rounded-full bg-black/70 text-white hover:bg-black disabled:opacity-40"
                            disabled={i === images.length - 1}
                          >
                            <FaArrowRight size={9} />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeImage(i);
                          }}
                          className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500/90 text-white transition hover:bg-red-600"
                        >
                          <FaTimes size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <p className="mt-3 text-xs text-slate-500 sm:text-sm">
                  Drag images to reorder. First image will act as main display image.
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <div className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-5">
                <h3 className="mb-4 text-base font-semibold text-slate-800 sm:text-lg">
                  Product Details
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Product Name
                    </label>
                    <input
                      name="name"
                      value={form.name}
                      required
                      placeholder="Enter product name"
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={form.description}
                      required
                      placeholder="Write product description"
                      onChange={handleChange}
                      rows="5"
                      className="w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Bottle Size (Capacity)
                    </label>
                    <input
                      name="capacity"
                      value={form.capacity}
                      required
                      type="text"
                      placeholder="e.g. 500ml / 1L / 5L / 20L"
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        Product Price
                      </label>
                      <input
                        name="price"
                        value={form.price}
                        required
                        type="number"
                        min="0"
                        placeholder="Enter product price"
                        onChange={handleChange}
                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        Discount %
                      </label>
                      <input
                        name="discount"
                        value={form.discount}
                        type="number"
                        min="0"
                        max="100"
                        placeholder="e.g. 10"
                        onChange={handleChange}
                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        Base Delivery Price
                      </label>
                      <input
                        name="baseDeliveryPrice"
                        value={form.baseDeliveryPrice}
                        required
                        type="number"
                        min="0"
                        placeholder="e.g. 100"
                        onChange={handleChange}
                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        Delivery Increase Per Bottle
                      </label>
                      <input
                        name="deliveryPricePerBottle"
                        value={form.deliveryPricePerBottle}
                        required
                        type="number"
                        min="0"
                        placeholder="e.g. 33"
                        onChange={handleChange}
                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
                <h3 className="text-base font-semibold text-slate-800 sm:text-lg">
                  Price & Delivery Preview
                </h3>

                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <p className="text-xs text-slate-500">Original Price</p>
                    <p className="mt-1 text-lg font-bold text-slate-900">
                      ₹{Number(form.price || 0)}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <p className="text-xs text-slate-500">Discount</p>
                    <p className="mt-1 text-lg font-bold text-slate-900">
                      {Number(form.discount || 0)}%
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <p className="text-xs text-slate-500">Final Price</p>
                    <p className="mt-1 text-lg font-bold text-green-600">
                      ₹{finalPrice}
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <p className="text-xs text-slate-500">1 Bottle</p>
                    <p className="mt-1 text-lg font-bold text-slate-900">
                      ₹{deliveryPreview.one}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <p className="text-xs text-slate-500">2 Bottles</p>
                    <p className="mt-1 text-lg font-bold text-slate-900">
                      ₹{deliveryPreview.two}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <p className="text-xs text-slate-500">3 Bottles</p>
                    <p className="mt-1 text-lg font-bold text-slate-900">
                      ₹{deliveryPreview.three}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <p className="text-xs text-slate-500">4 Bottles</p>
                    <p className="mt-1 text-lg font-bold text-slate-900">
                      ₹{deliveryPreview.four}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="sticky bottom-0 border-t border-slate-200 bg-white/95 px-4 py-4 backdrop-blur sm:px-6">
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
              <button
                type="submit"
                disabled={loading}
                className="w-full cursor-pointer rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {loading
                  ? isEditMode
                    ? "Updating..."
                    : "Uploading..."
                  : isEditMode
                  ? "Update Product"
                  : "Add Product"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}