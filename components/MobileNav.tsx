"use client";

import Image from "next/image";
import React, { useEffect, useState, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FiLogOut } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { io } from "socket.io-client";
import { API_URL } from "@/utils/apiRequest";
import { FaPlus } from "react-icons/fa";

import { GoPlus } from "react-icons/go";
import CreateMarket from "./createmarket/CreateMarket";


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
  const [loggingOut, setLoggingOut] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showComingSoon, setShowComingSoon] = useState(false);

  const [showCreateMarket, setShowCreateMarket] = useState(false);

  // ✅ keep single socket instance
  const socketRef = useRef<any>(null);

  // =========================
  // INIT USER
  // =========================
  useEffect(() => {
    setMounted(true);

    const userStr = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!userStr || !token) {
      setIsLoggedIn(false);
      return;
    }

    try {
      const parsedUser = JSON.parse(userStr);

      setUser(parsedUser);
      setIsLoggedIn(true);
    } catch (err) {
      console.error("User parse error:", err);
      setIsLoggedIn(false);
    }
  }, []);

  // =========================
  // LOCAL STORAGE SYNC
  // =========================
  useEffect(() => {
    const sync = () => {
      const userStr = localStorage.getItem("user");
      if (userStr) setUser(JSON.parse(userStr));
    };

    window.addEventListener("storage", sync);

    return () => window.removeEventListener("storage", sync);
  }, []);

  // =========================
  // 🔥 SOCKET CONNECTION
  // =========================
  useEffect(() => {
    if (!user?._id) return;

    if (socketRef.current) return;

    // console.log("🔌 Connecting socket...");

    const socket = io(API_URL, {
      transports: ["websocket"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);

      // ✅ MUST MATCH BACKEND
      socket.emit("auth", user._id);
    });

    // ✅ MUST MATCH BACKEND EMIT EVENT NAME
    socket.on("balance-update", (data: any) => {
      console.log("💰 Balance update received:", data);

      setUser((prev: any) => {
        if (!prev) return prev;

        const updatedUser = {
          ...prev,

          // ✅ IMPORTANT: update nested balance object
          balance: {
            ...prev.balance,
            testnet: data.testnet,
            locked: data.locked,
          },

          // optional derived value
          avaxBalance: data.avaxBalance,
        };

        localStorage.setItem("user", JSON.stringify(updatedUser));

        return updatedUser;
      });
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [user?._id]);


  // LOGOUT

  const handleLogout = () => {
    setLoggingOut(true);

    setTimeout(() => {
      localStorage.clear();

      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }

      toast.success("Logged out successfully");

      setLoggingOut(false);

      router.push("/login");
    }, 2000);
  };



  useEffect(() => {
    setShowLogoutModal(false);
  }, [pathname]);


  return (
    <div className="w-full flex justify-center">

      <CreateMarket
        open={showCreateMarket}
        onClose={() => setShowCreateMarket(false)}
        onSubmit={() => {
          setShowCreateMarket(false);
          setShowComingSoon(true);
        }}
      />
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

          <div className="hidden lg:flex items-center gap-6">
            <p className="text-sm text-[#8B8B8B]">Market</p>
            <p className="text-sm text-[#8B8B8B]">P2P</p>
            <p className="text-sm text-[#8B8B8B]">History</p>
            <p className="text-sm text-[#8B8B8B]">Profile</p>
          </div>
        </div>



        {/* RIGHT */}
        <div className="flex items-center gap-1">



          <div
            onClick={() => {
              // temporary switch
              const featureLive = true;

              if (featureLive) {
                setShowCreateMarket(true);
              } else {
                setShowComingSoon(true);
              }
            }} className="h-6 w-6 flex justify-center items-center rounded-full cursor-pointer hover:scale-105 transition"
            style={{
              border: "1px solid transparent",
              background:
                "linear-gradient(#0D0D0D, #0D0D0D) padding-box, linear-gradient(90deg, rgba(255,255,255,0.5), #262626, #000000) border-box",
            }}
          >
            <GoPlus className="text-white/40 text-base" />
          </div>


          {/* BALANCE */}
          <div
            className="px-2 -mr-1 py-1 gap-2 flex items-center rounded-full text-sm font-medium cursor-pointer"
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
              <div className="w-fit h-4 bg-gray-700 animate-pulse rounded" />
            ) : isLoggedIn ? (
              <>
                <Image
                  width={16}
                  height={16}
                  alt="AVAX"
                  src="/img/market/avax.svg"
                />
                <p className="text-xs font-light text-white">
                  {user?.avaxBalance ?? "0.0"}
                </p>
              </>
            ) : (
              <p className="text-sm font-semibold px-2 text-white">
                Login
              </p>
            )}
          </div>
          {/* LOGOUT */}
          {isLoggedIn && (
            <button
              onClick={() => setShowLogoutModal(true)}
              className="p-2 rounded-full hover:bg-white/10 transition"
            >
              <FiLogOut className="text-white/40 text-sm" />
            </button>
          )}
        </div>
      </div>

      {/* LOGOUT MODAL */}
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
                  disabled={loggingOut}
                  className="px-4 py-2 rounded-lg bg-[#FF394A] text-white text-sm flex items-center gap-2 justify-center min-w-[90px]"
                >
                  {loggingOut ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    "Logout"
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showComingSoon && (
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowComingSoon(false)}
          >
            <motion.div
              className="relative w-[90%] max-w-sm rounded-3xl p-6 text-center border border-white/10 bg-gradient-to-b from-[#0f0f0f] to-[#070707] shadow-2xl"
              initial={{ scale: 0.7, y: 40, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.7, y: 40, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* glow orb */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-24 h-24 bg-purple-500/30 blur-2xl rounded-full" />

              {/* icon */}
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                  🚀
                </div>
              </div>

              {/* title */}
              <h2 className="text-white text-lg font-semibold">
                Market Creation
              </h2>

              {/* subtitle */}
              <p className="text-gray-400 text-sm mt-2">
                This feature is coming soon. We’re building something powerful for you.
              </p>

              {/* badge */}
              <div className="mt-4 inline-flex px-3 py-1 rounded-full text-xs text-white/70 bg-white/5 border border-white/10">
                In Development
              </div>

              {/* button */}
              <button
                onClick={() => setShowComingSoon(false)}
                className="mt-6 w-full py-2 rounded-xl bg-white text-black text-sm font-medium hover:opacity-90 transition"
              >
                Got it
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


    </div>
  );
};

export default MobileNav;