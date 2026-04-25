"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebaseClient";
import toast from "react-hot-toast";
import { FiLogOut } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const MobileNav = () => {
  const pathname = usePathname();
  const router = useRouter();
  const isMarketPage = pathname === "/market/";

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const userStr =
    typeof window !== "undefined" ? localStorage.getItem("user") : null;

  const [mounted, setMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!token && !!userStr);
  const [avaxBalance, setAvaxBalance] = useState<string>("0.0");

  // ✅ NEW: logout modal state
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    setMounted(true);

    if (!token || !userStr) {
      setIsLoggedIn(false);
      return;
    }

    try {
      const user = JSON.parse(userStr);
      const userId = user?._id;

      if (!userId) {
        setIsLoggedIn(false);
        return;
      }

      setIsLoggedIn(true);

      const ref = doc(db, "users", userId);

      const unsubscribe = onSnapshot(ref, (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          setAvaxBalance(data?.avaxBalance ?? "0.0");
        }
      });

      return () => unsubscribe();
    } catch (err) {
      console.error("User parse error:", err);
      setIsLoggedIn(false);
    }
  }, [token, userStr]);

  const handleLogout = () => {
    // 🔥 Clear EVERYTHING in localStorage
    localStorage.clear();

    toast.success("Logged out successfully");


    setTimeout(() => {
      router.push("/login");
    }, 800);
  };

  useEffect(() => {
    setShowLogoutModal(false);
  }, [pathname]);

  return (
    <div className="w-full flex justify-center">

      <div className="flex justify-between items-center w-full p-3 lg:px-30">

        {/* LEFT */}
        <div className="flex items-center gap-8">
          <Image
            width={100}
            height={100}
            className="w-32"
            alt="Market Logo"
            src="/img/market/logofull.svg"
          />

          {/* DESKTOP NAV */}
          <div className="hidden lg:flex items-center gap-6">
            <p className="text-sm text-[#8B8B8B]">Market</p>
            <p className="text-sm text-[#8B8B8B]">P2P</p>
            <p className="text-sm text-[#8B8B8B]">History</p>
            <p className="text-sm text-[#8B8B8B]">Profile</p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-1">

          {/* BALANCE */}
          <div
            className="px-3 py-1 gap-2 flex items-center rounded-full text-sm font-medium cursor-pointer"
            style={{
              border: "1px solid transparent",
              background:
                "linear-gradient(#0D0D0D, #0D0D0D) padding-box, linear-gradient(90deg, rgba(255,255,255,0.5), #262626, #000000) border-box",
            }}
            onClick={() => {
              if (mounted && !isLoggedIn) router.push("/login");
            }}
          >
            {!mounted ? (
              <div className="w-16 h-4 bg-gray-700 animate-pulse rounded" />
            ) : isLoggedIn ? (
              <>
                <Image
                  width={20}
                  height={20}
                  alt="AVAX"
                  src="/img/market/avax.svg"
                />
                <p className="text-sm font-light text-white">
                  {avaxBalance}
                </p>
              </>
            ) : (
              <p className="text-sm font-semibold px-2 text-white">
                Login
              </p>
            )}
          </div>

          {/* 🔥 LOGOUT ICON */}
          {isLoggedIn && (
            <button
              onClick={() => setShowLogoutModal(true)}
              className="p-2 rounded-full hover:bg-white/10 transition"
            >
              <FiLogOut className="text-white/50 text-lg" />
            </button>
          )}
        </div>

      </div>

      {/* 🔥 LOGOUT MODAL */}
      <AnimatePresence>
        {showLogoutModal && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-[#0C0C0C] p-6 rounded-2xl w-[90%] max-w-sm border border-[#222]"
              initial={{ scale: 0.8, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.8, y: 30, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >

              <h2 className="text-white text-lg font-semibold mb-3">
                Confirm Logout
              </h2>

              <p className="text-sm text-gray-400 mb-6">
                Are you sure you want to log out?
              </p>

              <div className="flex gap-3 justify-end">

                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="px-4 py-2 rounded-lg bg-[#1a1a1a] text-white text-sm"
                >
                  Cancel
                </button>

                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-lg bg-[#FF394A] text-white text-sm"
                >
                  Logout
                </button>

              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default MobileNav;