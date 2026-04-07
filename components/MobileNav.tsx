"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { convertUSDToAvax, formatBalance } from "@/utils/getAvaxPrice";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebaseClient";

const MobileNav = () => {
  const pathname = usePathname();
  const router = useRouter();
  const isMarketPage = pathname === "/market/";

  const [mounted, setMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userBalance, setUserBalance] = useState("0.0");

  useEffect(() => {
    let unsubscribe = null;

    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    // ✅ Always mark mounted
    setMounted(true);

    if (token && user) {
      try {
        const parsedUser = JSON.parse(user);
        setIsLoggedIn(true);

        const userId = parsedUser._id;

        // ✅ Show cached instantly (fast UX)
        const cached = localStorage.getItem("cachedBalance");
        if (cached) setUserBalance(cached);

        // 🔥 Firestore realtime listener
        unsubscribe = onSnapshot(
          doc(db, "users", userId),
          async (docSnap) => {
            if (docSnap.exists()) {
              const data = docSnap.data();

              const rawBalance = data?.balance?.testnet || 0;

              // ✅ Convert to AVAX
              const avaxValue = await convertUSDToAvax(rawBalance);
              const formatted = formatBalance(avaxValue);

              setUserBalance(formatted);

              // cache it
              localStorage.setItem("cachedBalance", formatted);
            }
          }
        );
      } catch (err) {
        console.error("Failed to parse user:", err);
      }
    } else {
      setIsLoggedIn(false);
      setUserBalance("0.0");
    }

    // ✅ Proper cleanup
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  return (
    <div className="flex justify-between items-center w-full p-4">
      {isMarketPage ? (
        <Image width={100} height={100} alt="" src="/img/market/logofull.svg" />
      ) : (
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm font-medium"
        >
          <span>←</span>
          <span>Back</span>
        </button>
      )}

      <div
        className="px-2 py-1 gap-2 flex items-center rounded-full text-sm font-medium cursor-pointer"
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
            <Image width={20} height={20} alt="" src="/img/market/avax.svg" />
            <p className="text-sm font-light">{userBalance}</p>
          </>
        ) : (
          <p className="text-sm font-semibold px-2 text-white">Login</p>
        )}
      </div>
    </div>
  );
};

export default MobileNav;