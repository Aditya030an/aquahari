import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { MdEdit, MdDelete } from "react-icons/md";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function AllBlogs({ isAdmin }) {
  const navigate = useNavigate();
  const location = useLocation();
  const API_URL = import.meta.env.VITE_APP_API_URL || "http://localhost:8080";

  const [blogs, setBlogs] = useState(() => {
    const cached = sessionStorage.getItem("aqua_blogs");
    return cached ? JSON.parse(cached) : [];
  });

  const [loading, setLoading] = useState(blogs.length === 0);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);

  const updateBlogsCache = (blogList) => {
    setBlogs(blogList);
    sessionStorage.setItem("aqua_blogs", JSON.stringify(blogList));
  };

  const fetchAllBlogs = useCallback(
    async (forceRefresh = false) => {
      try {
        const cached = sessionStorage.getItem("aqua_blogs");

        if (cached && !forceRefresh) {
          setBlogs(JSON.parse(cached));
          setLoading(false);
          return;
        }

        setLoading(true);
        const res = await axios.get(`${API_URL}/api/blogs`);
        updateBlogsCache(res.data || []);
      } catch (error) {
        console.log("fetchAllBlogs error", error);
        toast.error("Failed to load blogs");
      } finally {
        setLoading(false);
      }
    },
    [API_URL]
  );

  useEffect(() => {
    const shouldForceRefresh = location.state?.refresh === true;
    fetchAllBlogs(shouldForceRefresh);

    if (shouldForceRefresh) {
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [fetchAllBlogs, location.pathname, location.state, navigate]);

  const handleDelete = async (id) => {
    const token = localStorage.getItem("aqua_token");

    if (!token) {
      toast.error("Please login first");
      return;
    }

    try {
      setDeleteLoadingId(id);

      await axios.delete(`${API_URL}/api/blogs/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Deleted successfully");
      await fetchAllBlogs(true);
    } catch (err) {
      console.log("delete error", err);
      toast.error(err?.response?.data?.message || "Something went wrong");
    } finally {
      setDeleteLoadingId(null);
    }
  };

  const handleEdit = (blog) => {
    navigate("/admin/add-blogs", { state: { blog } });
  };

  return (
    <div className="relative overflow-hidden min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.08),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.08),transparent_35%)]" />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16 lg:py-20">
        <div className="flex flex-col gap-5 sm:gap-6 md:flex-row md:items-center md:justify-between mb-10 sm:mb-14">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900"
            >
              Insights & Articles
            </motion.h2>

            <p className="mt-3 max-w-2xl text-sm sm:text-base text-slate-500 leading-relaxed">
              Explore helpful aquarium tips, care guides, and practical insights.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-[250px] items-center justify-center">
            <AiOutlineLoading3Quarters className="text-3xl animate-spin text-slate-500" />
          </div>
        ) : blogs.length === 0 ? (
          <div className="flex min-h-[250px] items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white/70 text-slate-500 text-lg font-medium">
            No blogs found
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:gap-7 md:grid-cols-2 xl:grid-cols-3">
            {blogs.map((blog, index) => (
              <motion.article
                key={blog._id}
                initial={{ opacity: 0, y: 45 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: index * 0.08 }}
                className="group relative overflow-hidden rounded-[28px] border border-slate-200/70 bg-white/80 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
              >
                {isAdmin && (
                  <div className="absolute right-4 top-4 z-20 flex gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition">
                    <button
                      onClick={() => handleEdit(blog)}
                      className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white shadow-md transition hover:bg-slate-100"
                    >
                      <MdEdit className="text-blue-600 text-lg" />
                    </button>

                    <button
                      onClick={() => handleDelete(blog._id)}
                      className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white shadow-md transition hover:bg-slate-100"
                    >
                      {deleteLoadingId === blog._id ? (
                        <AiOutlineLoading3Quarters className="animate-spin text-red-500 text-lg" />
                      ) : (
                        <MdDelete className="text-red-600 text-lg" />
                      )}
                    </button>
                  </div>
                )}

                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <img
                    src={blog.image_url || "/products/dummyImg.jpg"}
                    alt={blog.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="p-5 sm:p-6">
                  <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-700">
                    {blog.tag}
                  </span>

                  <h3 className="mt-4 line-clamp-2 text-xl font-semibold leading-snug text-slate-900">
                    {blog.title}
                  </h3>

                  <p className="mt-3 line-clamp-3 text-sm sm:text-[15px] leading-6 text-slate-600">
                    {blog.description}
                  </p>

                  <Link
                    to={`/blog_details/${blog._id}`}
                    className="inline-flex items-center gap-2 mt-6 text-sm sm:text-base font-semibold text-blue-600 transition hover:text-indigo-600"
                  >
                    Read Article
                    <span className="transition group-hover:translate-x-1">→</span>
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}