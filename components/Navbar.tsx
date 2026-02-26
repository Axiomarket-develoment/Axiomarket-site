"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
import { FaTwitter } from "react-icons/fa";
import ThemeSwitch from "./ThemeSwitch";

export default function Navbar() {
  const [modalOpen, setModalOpen] = useState(false);

  const toggleModal = () => setModalOpen(prev => !prev);

  return (
    <div className="sticky backdrop-blur-2xl top-0 shadow-2xl rounded-b-3xl border-b border-red-100 ">
      {/* Navbar */}
      <div className="flex items-center justify-between w-full max-w-6xl mx-auto py-2 pr-3">
        <Image width={70} height={70} src="/img/logo.png" alt="Axio Market Logo" />

        <div className="flex items-center gap-6">
          <button
            onClick={toggleModal}
            className="text-sm font-medium hover:text-red-600 dark:hover:text-red-400 transition-colors duration-300"
          >
            Sign Up
          </button>
          <ThemeSwitch />
        </div>
      </div>

      {/* Modal + Overlay */}
      <AnimatePresence>
        {modalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={toggleModal}
              className="fixed inset-0 bg-black backdrop-blur-sm z-40"
            />

            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed bottom-0 left-0 w-full max-w-md mx-auto bg-white dark:bg-black p-6 shadow-2xl rounded-t-3xl z-50"
            >
              <h2 className="text-2xl font-bold mb-6 text-center text-black dark:text-white">
                Create Your Account
              </h2>
              {/* Sign-up buttons / inputs */}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}