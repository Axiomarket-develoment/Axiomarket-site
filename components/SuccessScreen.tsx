"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface Props {
  isOpen: boolean;
  onClose?: () => void;
}

const SuccessScreen: React.FC<Props> = ({ isOpen, onClose }) => {

  // ✅ Auto close after animation
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose?.();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/30 backdrop-blur-md z-[60] flex justify-center items-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-[#050505] w-full max-w-md h-screen rounded-t-2xl p-8 flex flex-col items-center justify-center"
            initial={{ y: 200 }}
            animate={{ y: 0 }}
            exit={{ y: 200 }}
            transition={{ type: "spring", stiffness: 250, damping: 25 }}
          >
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: [1, 1.1, 1], opacity: 1 }}
              transition={{ duration: 1, repeat: Infinity, repeatType: "loop" }}
              className="w-20 h-20 flex items-center justify-center rounded-full border-2 border-red-600 p-1"
            >
              <Image
                src="/img/logo2.svg"
                alt="success"
                width={60}
                height={60}
                className="rounded-full"
              />
            </motion.div>

            <p className="text-white font-semibold text-lg">
              It's game time
            </p>


          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SuccessScreen;