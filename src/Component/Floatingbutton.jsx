import { motion } from "framer-motion";
import { FaWhatsapp, FaYoutube } from "react-icons/fa";

export default function FloatingButtons() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 80 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed bottom-6 right-6 flex flex-col gap-4 z-50"
    >

      {/* WHATSAPP */}
      <motion.a
        href="https://wa.me/919044634523?text=Hi%20I%20want%20consultation"
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.15 }}
        animate={{ y: [0, -6, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="relative w-14 h-14 flex items-center justify-center rounded-full 
                   bg-[#25D366] text-white shadow-lg"
      >
        {/* PULSE */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-30 animate-ping"></span>

        <FaWhatsapp className="text-2xl relative z-10" />
      </motion.a>

      {/* YOUTUBE */}
      <motion.a
        href="https://youtube.com/@aquahariofficial?si=sjANusivQxnEjz5U"
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.15 }}
        animate={{ y: [0, -4, 0] }}
        transition={{ repeat: Infinity, duration: 2.5 }}
        className="w-14 h-14 flex items-center justify-center rounded-full 
                   bg-[#FF0000] text-white shadow-lg"
      >
        <FaYoutube className="text-2xl" />
      </motion.a>

    </motion.div>
  );
}