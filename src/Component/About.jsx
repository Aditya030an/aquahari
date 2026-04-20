import React from "react";
import { motion } from "framer-motion";
import { FaInstagram } from "react-icons/fa";
import { FaArrowRight, FaPlay } from "react-icons/fa";
import banner from "./photos/image.png";
import founder from "./photos/founder.jpeg";
const missionPoints = [
  "To simplify fish keeping for beginners",
  "To share practical and real aquarium knowledge",
  "To create helpful and easy-to-understand content",
  "To promote responsible and natural fish care",
  "To build a strong community of aquarium enthusiasts",
];
const points = [
  "Set up and maintain aquariums",
  "Understand fish behavior and care",
  "Learn beginner to advanced fish keeping",
  "Avoid common mistakes",
  "Explore natural ways to improve fish health",
];

const pointer = [
  "Real experience-based knowledge",
  "Beginner-friendly content",
  "Simple and practical guidance",
  "Focus on fish health and well-being",
  "A growing and trusted community",
];
export default function AboutPage() {
  return (
    <div className="bg-white text-[#1F212E] overflow-hidden">
      {/* HERO SECTION */}
      <section className="relative py-32 px-6 text-center">
        {/* Glow */}
        <div className="absolute top-[-120px] left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-[#9EC07F]/20 blur-[120px] rounded-full"></div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-bold mb-6 relative z-10"
        >
          About <span className="text-[#9EC07F]">Aquahari</span>
        </motion.h1>

        <p className="max-w-2xl mx-auto text-gray-500 text-lg relative z-10">
          Aquahari is a platform dedicated to fish keeping, aquarium knowledge,
          and natural fish care — helping you build healthier aquariums with
          confidence.
        </p>
      </section>

      {/* STORY SECTION */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          {/* IMAGE */}
          <motion.img
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            src={banner}
            alt="about"
            className="rounded-3xl shadow-lg object-cover"
          />

          {/* TEXT */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            <h2 className="text-3xl md:text-4xl font-semibold mb-6">
              Our Story
            </h2>

            <p className="text-gray-600 mb-6 leading-relaxed">
              Aquahari began with a simple passion — a deep interest in aquatic
              life and the desire to understand fish beyond just keeping them.
            </p>

            <p className="text-gray-600 mb-6 leading-relaxed">
              Like many beginners, we faced confusion, mistakes, and challenges
              while maintaining aquariums. From water issues to fish stress, the
              journey was full of learning.
            </p>

            <p className="text-gray-600 leading-relaxed">
              Instead of relying only on random advice, we started exploring,
              experimenting, and sharing real experiences. <br />
              That’s how Aquahari was created — not just as a brand, but as a
              platform to share knowledge, simplify fish keeping, and help
              others avoid the same mistakes. Today, Aquahari continues to grow
              as both a content platform and a trusted name in aquarium care.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="w-full py-28 px-6 bg-[#FAFAF8]">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16">
          {/* VISION */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-3xl md:text-4xl font-semibold mb-6 text-[#1F212E]">
              Our Vision
            </h2>

            <p className="text-gray-600 leading-relaxed text-lg">
              To become a leading platform in India for aquarium knowledge, fish
              care education, and natural aquatic solutions — empowering every
              pet lover to build healthy and sustainable aquatic environments.
            </p>
          </motion.div>

          {/* MISSION */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-3xl md:text-4xl font-semibold mb-6 text-[#1F212E]">
              Our Mission
            </h2>

            <div className="space-y-4">
              {missionPoints.map((point, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 bg-white p-4 rounded-xl border border-gray-200 
                     shadow-sm hover:shadow-md transition"
                >
                  {/* DOT */}
                  <div className="w-3 h-3 mt-2 rounded-full bg-[#9EC07F]"></div>

                  <p className="text-gray-600 text-sm md:text-base">{point}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="relative w-full py-28 px-6 bg-white overflow-hidden">
        {/* SOFT GREEN GLOW */}
        <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-[#9EC07F]/20 blur-[120px] rounded-full"></div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          {/* LEFT – IMAGE */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="relative"
          >
            <img
              src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1200"
              alt="Aquarium"
              className="rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.12)] object-cover"
            />

            {/* FLOATING CARD */}
            <div className="absolute -bottom-6 -right-6 bg-white px-6 py-4 rounded-xl shadow-lg border border-gray-100">
              <p className="text-sm text-gray-600">
                Natural • Healthy • Sustainable
              </p>
            </div>
          </motion.div>

          {/* RIGHT – TEXT */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            <h2 className="text-3xl md:text-5xl font-semibold text-[#1F212E] mb-6">
              Our Approach
            </h2>

            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              We believe fish keeping should be{" "}
              <span className="text-[#1F212E] font-medium">simple</span>,{" "}
              <span className="text-[#1F212E] font-medium">informed</span>, and{" "}
              <span className="text-[#9EC07F] font-medium">natural</span>.
            </p>

            <p className="text-gray-600 leading-relaxed mb-6">
              Through our content, we focus on real experiences, practical tips,
              and methods that actually work. Instead of complicated theories,
              we provide clear and useful guidance that anyone can follow.
            </p>

            <p className="text-gray-600 leading-relaxed">
              Our goal is to help you build an aquarium that is not only{" "}
              <span className="text-[#9EC07F] font-medium">beautiful</span>, but
              also <span className="text-[#1F212E] font-medium">healthy</span>{" "}
              and{" "}
              <span className="text-[#1F212E] font-medium">sustainable</span>.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Founder */}
      <section className="relative w-full py-28 px-6 bg-[#FAFAF8] overflow-hidden">
        {/* SOFT GLOW */}
        <div className="absolute top-[-100px] right-[-100px] w-[300px] h-[300px] bg-[#9EC07F]/20 blur-[120px] rounded-full"></div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          {/* LEFT – IMAGE */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            <img
              src={founder}
              alt="Owner"
              className="rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.12)] object-cover"
            />
          </motion.div>

          {/* RIGHT – TEXT */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            <h2 className="text-3xl md:text-5xl font-semibold text-[#1F212E] mb-6">
              About the Founder
            </h2>

            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              I am a dedicated biology student and aquatic enthusiast with over{" "}
              <span className="text-[#9EC07F] font-medium">
                12 years of hands-on experience
              </span>
              . My journey began at the age of 7, driven by a deep curiosity and
              passion for aquatic life.
            </p>

            <p className="text-gray-600 leading-relaxed mb-6">
              Over the years, I have developed strong expertise in aquatic
              animals, reptiles, and especially turtles. I specialize in
              diagnosing and treating fish and turtle diseases, maintaining
              optimal water parameters, and ensuring a healthy aquatic
              ecosystem.
            </p>

            <p className="text-gray-600 leading-relaxed mb-6">
              I also have extensive experience in fish breeding, understanding
              species behavior, and creating ideal environments for growth and
              reproduction. My approach combines scientific knowledge with
              real-world experience.
            </p>

            <p className="text-gray-600 leading-relaxed">
              This is not just a hobby — it’s a long-term commitment to
              understanding and caring for aquatic life at a deeper level.
            </p>

            {/* EXPERIENCE BADGE */}
            <div className="mt-8 inline-block px-6 py-3 rounded-full bg-[#1F212E] text-white text-sm">
              12+ Years Experience in Aquatics
            </div>
          </motion.div>
        </div>
      </section>

      <section className="relative w-full py-28 px-6 bg-[#FAFAF8] overflow-hidden">
        {/* SOFT GLOW */}
        <div className="absolute top-[-100px] right-[-100px] w-[300px] h-[300px] bg-[#9EC07F]/20 blur-[120px] rounded-full"></div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          {/* LEFT – TEXT */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            <h2 className="text-3xl md:text-5xl font-semibold text-[#1F212E] mb-6">
              What We Do
            </h2>

            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              Aquahari is more than just a website. We create meaningful,
              practical content that helps you build and maintain healthy
              aquatic environments with confidence.
            </p>

            <p className="text-gray-600 leading-relaxed">
              We also share real-life aquarium experiences, tips, and insights —
              helping you learn what truly works, not just theory.
            </p>
          </motion.div>

          {/* RIGHT – CARDS */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {points.map((item, i) => (
              <div
                key={i}
                className="group bg-white p-5 rounded-2xl border border-gray-200 
                         shadow-sm hover:shadow-md transition duration-300"
              >
                {/* ICON DOT */}
                <div className="w-3 h-3 bg-[#9EC07F] rounded-full mb-3"></div>

                <p className="text-gray-700 text-sm leading-relaxed">{item}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="relative w-full py-28 px-6 bg-white overflow-hidden">
        {/* SOFT GREEN GLOW */}
        <div className="absolute bottom-[-120px] left-1/2 -translate-x-1/2 w-[320px] h-[320px] bg-[#9EC07F]/20 blur-[120px] rounded-full"></div>

        <div className="max-w-3xl mx-auto text-center">
          {/* TITLE */}
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-semibold text-[#1F212E] mb-6"
          >
            Our Community
          </motion.h2>

          {/* TEXT */}
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600 leading-relaxed mb-6"
          >
            Aquahari is a growing community of people who truly care about{" "}
            <span className="text-[#9EC07F] font-medium">aquatic life</span>.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 leading-relaxed mb-10"
          >
            Through our content and presence on social platforms, we connect
            with fish keepers across India — helping them learn, grow, and build
            better, healthier aquariums together.
          </motion.p>

          {/* FOLLOW CARD */}
          <motion.a
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            href="https://www.instagram.com/aquahariofficial?igsh=eXl2cnp4NjlzdDU2&utm_source=qr"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-4 px-8 py-4 rounded-full 
               bg-[#1F212E] text-white font-semibold 
               shadow-md hover:bg-[#2b2e3f] transition"
          >
            <FaInstagram className="text-lg" />
            Follow @AquahariOfficial
          </motion.a>
        </div>
      </section>

      <section className="relative w-full py-28 px-6 bg-[#FAFAF8] overflow-hidden">
        {/* SOFT GLOW */}
        <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-[#9EC07F]/20 blur-[120px] rounded-full"></div>

        <div className="max-w-6xl mx-auto text-center">
          {/* HEADING */}
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-semibold text-[#1F212E] mb-12"
          >
            Why Choose Aquahari
          </motion.h2>

          {/* GRID */}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {pointer.map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -6 }}
                className="group bg-white p-6 rounded-2xl border border-gray-200 
                         shadow-sm hover:shadow-md transition duration-300 text-left"
              >
                {/* TOP LINE ACCENT */}
                <div className="w-10 h-[3px] bg-[#9EC07F] mb-4 rounded-full"></div>

                <p className="text-gray-700 font-medium leading-relaxed">
                  {item}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative w-full py-32 px-6 bg-[#1F212E] overflow-hidden text-center text-white">
        {/* GLOW EFFECT */}
        <div className="absolute top-[-120px] left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-[#9EC07F]/20 blur-[140px] rounded-full"></div>

        <div className="max-w-3xl mx-auto relative z-10">
          {/* HEADLINE */}
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-semibold mb-6 leading-tight"
          >
            Start your aquarium journey with the{" "}
            <span className="text-[#9EC07F]">right knowledge</span>.
          </motion.h2>

          {/* SUBTEXT */}
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-300 mb-10 text-lg"
          >
            Learn, explore, and build a better environment for your fish with
            Aquahari.
          </motion.p>

          {/* BUTTONS */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            {/* PRIMARY */}
            <a
              href="#"
              className="group px-8 py-4 rounded-full bg-[#9EC07F] text-[#1F212E] font-semibold 
                 flex items-center gap-2 hover:scale-105 transition"
            >
              Explore Content{" "}
              <FaArrowRight className="group-hover:translate-x-1 transition" />
            </a>

            {/* SECONDARY */}
            <a
              href="https://youtube.com/@aquahariofficial?si=sjANusivQxnEjz5U"
              target="_blank"
              rel="noopener noreferrer"
              className="group px-8 py-4 rounded-full border border-white/30 text-white font-semibold 
                 flex items-center gap-2 hover:bg-white/10 transition"
            >
              Visit Our Channel <FaPlay />
            </a>

            {/* TERTIARY */}
            <a
              href="#"
              className="px-6 py-4 text-[#9EC07F] font-semibold hover:underline"
            >
              Get Started
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
