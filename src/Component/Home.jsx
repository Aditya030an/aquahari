import React from "react";
import { Link, useNavigate } from "react-router-dom";
import fish from "./photos/fish.jpg";
import { motion } from "framer-motion";
import video4 from "./photos/video5.mp4";
import video5 from "./photos/video6.mp4";
import video8 from "./photos/video9.mp4";
import { FaArrowRight, FaInstagram } from "react-icons/fa";
import logo from "./photos/logodesign.png";
import r1 from "./photos/review.jpeg";
import r2 from "./photos/review1.jpeg";
import r3 from "./photos/review2.jpeg";
import r4 from "./photos/review3.jpeg";
import r5 from "./photos/review4.jpeg";
import r6 from "./photos/review5.jpeg";
import r7 from "./photos/review7.jpeg";
import AllProducts from "./AllProducts";

const reviews = [r1, r2, r3, r4, r5, r6, r7];

const instagramPosts = [
  "https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?q=80&w=900&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1711658202904-4efd9d1ca9fb?q=80&w=900&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1772718460103-4fb28ce6fc0b?q=80&w=900&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1765464949998-93773ccb6cbf?q=80&w=900&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1763052414019-57e4aa1f0b04?q=80&w=900&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1759222859663-4df7dbb9761b?q=80&w=900&auto=format&fit=crop",
];

const videos = [
  {
    src: video4,
    className:
      "lg:col-span-2 h-[240px] sm:h-[320px] lg:h-[420px] rounded-3xl",
  },
  {
    src: video5,
    className: "h-[220px] sm:h-[240px] lg:h-[198px] rounded-2xl",
  },
  {
    src: video8,
    className: "h-[220px] sm:h-[240px] lg:h-[198px] rounded-2xl",
  },
];

export default function Hero() {
  const navigate = useNavigate();

  return (
    <>
      {/* HERO */}
      <section className="w-full min-h-screen bg-gradient-to-br from-[#e6f7f5] via-[#d4f1ee] to-[#c2e9e5] flex flex-col items-center justify-center px-4 sm:px-6 text-center pt-24 pb-16">
        <div className="text-center">
          <img
            src={logo}
            alt="AquaHari Logo"
            className="w-44 sm:w-56 md:w-72 lg:w-96 mx-auto mb-4"
            fetchPriority="high"
          />
        </div>

        <p className="max-w-4xl text-[#4b6b6a] text-base sm:text-lg md:text-xl leading-relaxed mb-8 sm:mb-10 px-2">
          Where Aquatic Care Meets Passion! We are dedicated to the vibrant
          ecosystem of aquatic life, specializing in fishes and turtles. Our
          commitment extends beyond providing healthy pets; we empower hobbyists
          and pet keepers with essential knowledge on water parameters, tank
          environments, nutrition, and healthcare. Join our community and
          experience expert guidance along with a selection of high-quality
          fishes and turtles to ensure your aquatic pets thrive!
        </p>

        <button
          onClick={() => navigate("/all_products")}
          className="cursor-pointer flex items-center gap-3 bg-[#8ed1b2] hover:bg-[#7cc5a6] text-[#063d3a] px-6 sm:px-8 py-3 rounded-full text-base sm:text-lg font-medium transition duration-300 shadow-md hover:shadow-xl"
        >
          SHOP <FaArrowRight />
        </button>
      </section>

      {/* OUR SERVICES */}
      <section className="w-full bg-gradient-to-br from-[#e6f7f5] via-[#d4f1ee] to-[#c2e9e5] py-20 sm:py-24 lg:py-28 px-4 sm:px-6">
        <div className="w-full flex justify-center mb-10 sm:mb-12">
          <div className="w-28 sm:w-40 h-[2px] bg-[#6ec1a6] rounded-full opacity-70"></div>
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center text-3xl sm:text-4xl md:text-5xl font-semibold text-[#063d3a] mb-12 sm:mb-16 lg:mb-20 tracking-wide"
        >
          OUR SERVICES
        </motion.h2>

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 sm:gap-10 lg:gap-12">
          <Link to="/all_blogs">
            <motion.div
              whileHover={{ rotateY: 6, rotateX: -6, scale: 1.03 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="relative group overflow-hidden rounded-3xl cursor-pointer bg-white/20 backdrop-blur-xl border border-white/30 shadow-[0_20px_60px_rgba(0,0,0,0.2)] hover:shadow-[0_30px_80px_rgba(110,193,166,0.4)] transition duration-500"
            >
              <img
                src={fish}
                alt="Fish care blogs"
                className="w-full h-[240px] sm:h-[280px] md:h-[300px] object-cover transition duration-700 group-hover:scale-110"
                loading="lazy"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

              <div className="absolute inset-0 flex items-center justify-center px-4">
                <h3 className="text-white text-2xl sm:text-3xl font-semibold tracking-wide text-center">
                  Fish Care Blogs
                </h3>
              </div>
            </motion.div>
          </Link>

          <Link to="/all_products">
            <motion.div
              whileHover={{ rotateY: -6, rotateX: -6, scale: 1.03 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="relative group overflow-hidden rounded-3xl cursor-pointer bg-white/20 backdrop-blur-xl border border-white/30 shadow-[0_20px_60px_rgba(0,0,0,0.2)] hover:shadow-[0_30px_80px_rgba(110,193,166,0.4)] transition duration-500"
            >
              <img
                src="https://images.unsplash.com/photo-1693560561064-54e0552f8f2f?q=80&w=1200&auto=format&fit=crop"
                alt="Aquatic products"
                className="w-full h-[240px] sm:h-[280px] md:h-[300px] object-cover transition duration-700 group-hover:scale-110"
                loading="lazy"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

              <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-8">
                <h3 className="text-white text-xl sm:text-2xl font-semibold underline">
                  Order Now
                </h3>

                <p className="text-white text-sm opacity-90 self-end group-hover:translate-x-2 transition">
                  Read More →
                </p>
              </div>
            </motion.div>
          </Link>
        </div>
      </section>

      <AllProducts />

      {/* VIDEO GALLERY */}
      <section className="w-full py-20 sm:py-24 lg:py-28 px-4 sm:px-6 bg-[#FAFAF8]">
        <div className="max-w-6xl mx-auto mb-10 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-[#1F212E]">
            Video Gallery
          </h2>
          <p className="text-gray-500 mt-2 text-sm sm:text-base">
            Real aquarium work & insights
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <motion.div
            whileHover={{ scale: 1.01 }}
            className={`relative ${videos[0].className} overflow-hidden group`}
          >
            <video
              src={videos[0].src}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/10"></div>
          </motion.div>

          <div className="flex flex-col gap-4 sm:gap-6">
            {[1, 2].map((index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.01 }}
                className={`relative ${videos[index].className} overflow-hidden group`}
              >
                <video
                  src={videos[index].src}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/10"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* INSTAGRAM */}
      <section className="relative py-20 sm:py-24 lg:py-28 mt-16 sm:mt-20 lg:mt-28 bg-white overflow-hidden">
        <div className="absolute top-[-120px] left-[-120px] w-[300px] h-[300px] bg-[#9EC07F]/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-120px] right-[-120px] w-[300px] h-[300px] bg-[#9EC07F]/10 blur-[120px] rounded-full"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-6">
              <FaInstagram className="text-3xl text-[#1F212E]" />
              <span className="text-lg font-semibold text-[#1F212E]">
                Instagram
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1F212E] mb-6 leading-tight">
              Follow us on <br />
              <span className="text-[#9EC07F]">@AquaHari</span>
            </h2>

            <p className="text-base sm:text-lg text-gray-500 mb-8 max-w-xl">
              Gentle pet care tips, emergency guidance & real stories — shared
              daily by our veterinarians.
            </p>

            <motion.a
              whileHover={{ scale: 1.05 }}
              href="https://www.instagram.com/aquahariofficial?igsh=eXl2cnp4NjlzdDU2&utm_source=qr"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-6 sm:px-8 py-4 rounded-full bg-[#1F212E] text-white font-semibold hover:bg-[#2b2e3f] transition shadow-md"
            >
              Visit Instagram <FaArrowRight />
            </motion.a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            viewport={{ once: true }}
            className="rounded-3xl border border-gray-200 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.06)] p-4 sm:p-6"
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {instagramPosts.map((img, i) => (
                <div
                  key={i}
                  className="group relative aspect-square overflow-hidden rounded-xl cursor-pointer"
                >
                  <img
                    src={img}
                    alt={`Instagram post ${i + 1}`}
                    className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
                    loading="lazy"
                  />

                  <div className="absolute inset-0 bg-[#1F212E]/30 opacity-0 group-hover:opacity-100 transition duration-500" />

                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-500">
                    <div className="bg-[#9EC07F] p-2 rounded-full shadow-md">
                      <FaInstagram className="text-[#1F212E] text-lg" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-6 text-center text-sm text-gray-500">
              Follow us for real pet care updates 🐾
            </p>
          </motion.div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="w-full py-20 sm:py-24 lg:py-28 bg-[#FAFAF8] overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-10 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-[#1F212E]">
            Customer Reviews 💬
          </h2>
        </div>

        <div className="overflow-hidden">
          <motion.div
            className="flex gap-4 sm:gap-6"
            animate={{ x: ["0%", "-100%"] }}
            transition={{
              ease: "linear",
              duration: 25,
              repeat: Infinity,
            }}
          >
            {[...reviews, ...reviews].map((img, i) => (
              <div
                key={i}
                className="min-w-[220px] sm:min-w-[260px] md:min-w-[320px] rounded-2xl overflow-hidden shadow-sm"
              >
                <img
                  src={img}
                  alt={`Customer review ${i + 1}`}
                  className="w-full h-[320px] sm:h-[360px] md:h-[400px] object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
}