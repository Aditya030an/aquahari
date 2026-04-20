import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { API } from "../api";
import { motion } from "framer-motion";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function BlogDetails() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/blogs/${id}`);
        setBlog(res.data);
      } catch (error) {
        console.log("fetchBlog error", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <AiOutlineLoading3Quarters className="text-3xl animate-spin text-slate-500" />
      </div>
    );
  }

  if (!blog) {
    return (
      <h2 className="py-20 text-center text-lg font-medium text-slate-600">
        Blog not found
      </h2>
    );
  }

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 font-[lato]">
      <Link
        to="/all_blogs"
        className="inline-flex items-center text-sm sm:text-base font-semibold text-blue-600 transition hover:text-blue-700 hover:underline"
      >
        ← Back to Blogs
      </Link>

      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-slate-900"
      >
        {blog?.title}
      </motion.h1>

      <p className="mt-3 inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs sm:text-sm font-semibold text-blue-700">
        {blog?.tag}
      </p>

      <div className="mt-8 overflow-hidden rounded-[28px] border border-slate-200 bg-slate-100 shadow-lg">
        <img
          src={blog?.image_url}
          className="w-full max-h-[520px] object-cover"
          alt={blog?.title}
        />
      </div>

      {blog?.description && (
        <p className="mt-8 text-base sm:text-lg leading-8 text-slate-600">
          {blog.description}
        </p>
      )}

      <div className="mt-8 rounded-3xl bg-white p-5 sm:p-7 lg:p-8 shadow-sm border border-slate-200">
        <p className="whitespace-pre-wrap text-[15px] sm:text-lg leading-8 text-slate-700">
          {blog?.content}
        </p>
      </div>
    </section>
  );
}