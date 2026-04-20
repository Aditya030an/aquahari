import React from "react";
export default function Footer() {
  return (
    <footer className="relative bg-[#050507] text-white mt-24">
      <div className="relative bg-white py-6 border-t border-gray-200 overflow-hidden">
        {/* subtle gradient glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-50 via-white to-indigo-50 opacity-60"></div>

        <div className="relative max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* LEFT TEXT */}
          <div className="text-sm text-gray-700">
            Designed & Developed by{" "}
            <a
              href="https://pegalagency.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-black hover:text-purple-600 transition"
            >
              Pegal Agency
            </a>
          </div>

          {/* CENTER DIVIDER */}
          <div className="hidden md:block h-6 w-px bg-gray-300"></div>

          {/* RIGHT TEXT */}
          <div className="text-sm text-gray-700 flex items-center gap-1">
            © 2026
            <a
              href="https://aquahari.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 font-medium text-black hover:text-purple-600 transition"
            >
              aquahari.in
            </a>
            – All Rights Reserved
          </div>
        </div>
      </div>
    </footer>
  );
}
