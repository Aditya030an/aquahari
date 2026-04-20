import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaShoppingCart, FaUserCircle, FaBars, FaTimes } from "react-icons/fa";
import logo from "./photos/logodesign.png";

export default function Navbar() {
  const location = useLocation();

  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const navItems = [
    { name: "About", path: "/About" },
    { name: "Contact Us", path: "/Contact" },
    { name: "Shop", path: "/all_products" },
    { name: "Consultation", path: "/consultation" },
    { name: "Blog", path: "/all_blogs" },
  ];

  useEffect(() => {
    const loadData = () => {
      const cart = JSON.parse(localStorage.getItem("aqua_cart")) || [];
      const storedUser = JSON.parse(localStorage.getItem("aqua_user"));

      setCartCount(cart?.length);
      setUser(storedUser);
    };

    loadData();

    // 🔥 Listen for login/logout changes
    window.addEventListener("userChanged", loadData);

    return () => {
      window.removeEventListener("userChanged", loadData);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }

      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setShowMobileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setShowMobileMenu(false);
    setShowDropdown(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("aqua_user");
    localStorage.removeItem("aqua_token");

    window.dispatchEvent(new Event("userChanged"));

    setUser(null);
    setShowDropdown(false);
    setShowMobileMenu(false);
  };

  const isActive = (path) => location.pathname === path;

  console.log("user" , user);

  return (
    <header className="sticky top-0 z-[999] w-full bg-[#050816]/90 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-20 flex items-center justify-between gap-4">
          {/* LOGO */}
          <Link to="/" className="flex items-center shrink-0 group">
            <img
              src={logo}
              alt="Aquahari logo"
              className="h-12 sm:h-14 object-contain transition duration-300 group-hover:scale-105"
            />
          </Link>

          {/* DESKTOP MENU */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link
              to="/"
              className={`relative text-sm tracking-wide transition ${
                isActive("/")
                  ? "text-blue-400 font-medium"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              HOME
              <span
                className={`absolute left-0 -bottom-2 h-[2px] transition-all duration-300 ${
                  isActive("/") ? "w-full bg-blue-500" : "w-0"
                }`}
              />
            </Link>

            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative text-sm tracking-wide transition ${
                  isActive(item.path)
                    ? "text-blue-400 font-medium"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                {item.name}
                <span
                  className={`absolute left-0 -bottom-2 h-[2px] transition-all duration-300 ${
                    isActive(item.path) ? "w-full bg-blue-500" : "w-0"
                  }`}
                />
              </Link>
            ))}

            {user?.email === import.meta.env.VITE_APP_ADMIN_EMAIL && (
              <Link
                to="/admin/all-products"
                className={`relative text-sm tracking-wide transition ${
                  location.pathname.startsWith("/admin")
                    ? "text-blue-400 font-medium"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                Dashboard
                <span
                  className={`absolute left-0 -bottom-2 h-[2px] transition-all duration-300 ${
                    location.pathname.startsWith("/admin")
                      ? "w-full bg-blue-500"
                      : "w-0"
                  }`}
                />
              </Link>
            )}
          </nav>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* CART */}
            <Link
              to="/my_cart"
              className="relative w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition"
            >
              <FaShoppingCart className="text-lg text-gray-200" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 flex items-center justify-center bg-blue-600 text-white text-[11px] rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* DESKTOP AUTH */}
            <div className="hidden lg:flex items-center">
              {user ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setShowDropdown((prev) => !prev)}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-gray-200 transition"
                  >
                    <FaUserCircle className="text-2xl" />
                  </button>

                  {showDropdown && (
                    <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                      <div className="px-4 py-3 border-b bg-gray-50">
                        <p className="text-xs text-gray-500">Signed in as</p>
                        <p className="text-sm font-medium text-gray-800 break-all">
                          {user?.email}
                        </p>
                      </div>

                      {user?.email === import.meta.env.VITE_APP_ADMIN_EMAIL && (
                        <Link
                          to="/admin/all-products"
                          className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition"
                        >
                          Dashboard
                        </Link>
                      )}

                      <Link
                        to="/my_order"
                        className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition"
                      >
                        My Order
                      </Link>

                      <Link
                        to="/my_consultations"
                        className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition border-t"
                      >
                        My Consultations
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    to="/login"
                    className="px-4 py-2 rounded-full border border-white/20 text-gray-200 hover:bg-white hover:text-black transition text-sm"
                  >
                    Login
                  </Link>

                  <Link
                    to="/signup"
                    className="px-4 py-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition shadow-md text-sm"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* MOBILE MENU BUTTON */}
            <button
              onClick={() => setShowMobileMenu((prev) => !prev)}
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white transition"
            >
              {showMobileMenu ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      {showMobileMenu && (
        <div className="lg:hidden border-t border-white/10 bg-[#07101f]/95 backdrop-blur-xl">
          <div
            ref={mobileMenuRef}
            className="max-w-7xl mx-auto px-4 sm:px-6 py-5 space-y-4"
          >
            <Link
              to="/"
              className={`block text-sm font-medium ${
                isActive("/") ? "text-blue-400" : "text-gray-200"
              }`}
            >
              HOME
            </Link>

            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block text-sm font-medium ${
                  isActive(item.path) ? "text-blue-400" : "text-gray-200"
                }`}
              >
                {item.name}
              </Link>
            ))}

            <div className="pt-4 border-t border-white/10">
              {user ? (
                <div className="space-y-3">
                  <div className="px-3 py-3 rounded-2xl bg-white/5">
                    <p className="text-xs text-gray-400">Signed in as</p>
                    <p className="text-sm text-white break-all">
                      {user?.email}
                    </p>
                  </div>

                  {user?.email === import.meta.env.VITE_APP_ADMIN_EMAIL && (
                    <Link
                      to="/admin/all-products"
                      className="block px-3 py-3 rounded-xl text-sm text-gray-200 bg-white/5 hover:bg-white/10 transition"
                    >
                      Dashboard
                    </Link>
                  )}

                  <Link
                    to="/my_order"
                    className="block px-3 py-3 rounded-xl text-sm text-gray-200 bg-white/5 hover:bg-white/10 transition"
                  >
                    My Order
                  </Link>

                  <Link
                    to="/my_consultations"
                    className="block px-3 py-3 rounded-xl text-sm text-gray-200 bg-white/5 hover:bg-white/10 transition"
                  >
                    My Consultations
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-3 rounded-xl text-sm text-red-400 bg-red-500/10 hover:bg-red-500/20 transition"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    to="/login"
                    className="text-center px-4 py-3 rounded-full border border-white/20 text-gray-200 hover:bg-white hover:text-black transition text-sm"
                  >
                    Login
                  </Link>

                  <Link
                    to="/signup"
                    className="text-center px-4 py-3 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition text-sm"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
