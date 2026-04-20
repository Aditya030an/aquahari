import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { FaCloudUploadAlt } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";

const BlogForm = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const finalEditData = location?.state?.blog || null;
  const API_URL = import.meta.env.VITE_APP_API_URL || "http://localhost:8080";

  const [formData, setFormData] = useState({
    title: "",
    tag: "",
    description: "",
    content: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    if (finalEditData) {
      setFormData({
        title: finalEditData?.title || "",
        tag: finalEditData?.tag || "",
        description: finalEditData?.description || "",
        content: finalEditData?.content || "",
      });
      setPreview(finalEditData?.image_url || null);
      setImage(null);
    } else {
      setFormData({
        title: "",
        tag: "",
        description: "",
        content: "",
      });
      setPreview(null);
      setImage(null);
    }
  }, [finalEditData]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const validateForm = () => {
    if (!localStorage.getItem("aqua_token")) {
      toast.error("Please login first");
      return false;
    }

    if (!formData.title.trim()) {
      toast.error("Title is required");
      return false;
    }

    if (!formData.tag.trim()) {
      toast.error("Tag is required");
      return false;
    }

    if (!formData.description.trim()) {
      toast.error("Description is required");
      return false;
    }

    if (!formData.content.trim()) {
      toast.error("Content is required");
      return false;
    }

    if (!finalEditData && !image) {
      toast.error("Image is required");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const token = localStorage.getItem("aqua_token");
    setLoading(true);

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("tag", formData.tag);
      data.append("description", formData.description);
      data.append("content", formData.content);

      if (image) {
        data.append("image", image);
      }

      if (finalEditData) {
        await axios.put(`${API_URL}/api/blogs/${finalEditData._id}`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success("Blog updated");
      } else {
        await axios.post(`${API_URL}/api/blogs`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success("Blog created");
      }

      sessionStorage.removeItem("aqua_blogs");

      navigate("/admin/all-blogs", {
        replace: true,
        state: { refresh: true },
      });
    } catch (err) {
      console.log("blog submit error", err);
      toast.error(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex h-full max-w-6xl items-center">
      <div className="relative flex h-full max-h-[95vh] w-full flex-col overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4 sm:px-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              {finalEditData ? "Update Blog" : "Add New Blog"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Create a clean and engaging blog post.
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="h-full">
            <div className="grid grid-cols-1 gap-6 p-4 sm:p-6 lg:grid-cols-[0.95fr_1.05fr] lg:gap-8">
              <div className="space-y-5">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
                  <h3 className="mb-4 text-base sm:text-lg font-semibold text-slate-800">
                    Cover Image
                  </h3>

                  <div className="flex h-64 sm:h-80 items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-slate-300 bg-white">
                    {preview ? (
                      <img
                        src={preview}
                        alt="Preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="text-center text-slate-400 px-4">
                        <FaCloudUploadAlt className="mx-auto mb-3 text-4xl" />
                        <p className="font-medium">Image preview</p>
                        <p className="mt-1 text-sm">Upload a blog cover image</p>
                      </div>
                    )}
                  </div>

                  <label className="mt-4 flex cursor-pointer items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                    Upload Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-5">
                  <h3 className="mb-4 text-base sm:text-lg font-semibold text-slate-800">
                    Basic Info
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        Blog Title
                      </label>
                      <input
                        name="title"
                        placeholder="Enter blog title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        Tag
                      </label>
                      <input
                        name="tag"
                        placeholder="Enter blog tag"
                        value={formData.tag}
                        onChange={handleChange}
                        required
                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-5">
                <div className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-5">
                  <h3 className="mb-4 text-base sm:text-lg font-semibold text-slate-800">
                    Blog Content
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        Short Description
                      </label>
                      <textarea
                        name="description"
                        placeholder="Write a short description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="4"
                        required
                        className="w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        Full Content
                      </label>
                      <textarea
                        name="content"
                        placeholder="Write full blog content"
                        value={formData.content}
                        onChange={handleChange}
                        rows="14"
                        required
                        className="w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                      />
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
                  className="w-full sm:w-auto rounded-2xl cursor-pointer bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading
                    ? finalEditData
                      ? "Updating..."
                      : "Submitting..."
                    : finalEditData
                    ? "Update Blog"
                    : "Publish Blog"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BlogForm;