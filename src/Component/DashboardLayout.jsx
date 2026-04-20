import React, { useMemo, useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import {
  FaBoxOpen,
  FaPlusCircle,
  FaBlogger,
  FaClipboardList,
  FaBars,
  FaTimes,
} from "react-icons/fa";

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const user = useMemo(() => {
    return JSON.parse(localStorage.getItem("aqua_user")) || null;
  }, []);

  const menuItems = [
    {
      name: "All Product",
      path: "/admin/all-products",
      icon: <FaBoxOpen />,
    },
    {
      name: "Add Product",
      path: "/admin/add-product",
      icon: <FaPlusCircle />,
    },
    {
      name: "All Blogs",
      path: "/admin/all-blogs",
      icon: <FaBlogger />,
    },
    {
      name: "Add Blogs",
      path: "/admin/add-blogs",
      icon: <FaPlusCircle />,
    },
    {
      name: "All Orders",
      path: "/admin/all-orders",
      icon: <FaClipboardList />,
    },
  ];

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50 flex relative">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static top-0 left-0 z-50 h-full lg:h-auto w-[280px] bg-[#07101f] text-white shadow-2xl transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
          <div>
            <h2 className="text-xl font-semibold">Admin Dashboard</h2>
            <p className="text-xs text-gray-400 mt-1 break-all">
              {user?.email}
            </p>
          </div>

          <button
            className="lg:hidden text-white text-xl"
            onClick={() => setSidebarOpen(false)}
          >
            <FaTimes />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-gray-300 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 mt-auto border-t border-white/10">
          <Link
            to="/"
            className="block w-full text-center px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-sm transition"
          >
            Back to Website
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0">
        {/* Top bar for mobile */}
        <div className="lg:hidden sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700"
          >
            <FaBars />
          </button>

          <h1 className="text-sm font-semibold text-slate-800">Dashboard</h1>

          <div className="w-10" />
        </div>

        <main className="">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 max-h-[84vh] overflow-y-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}