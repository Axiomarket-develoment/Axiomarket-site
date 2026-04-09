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

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const userStr = typeof window !== "undefined" ? localStorage.getItem("user") : null;
  const cachedBalance = typeof window !== "undefined" ? localStorage.getItem("cachedBalance") : null;

  const [mounted, setMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!token && !!userStr);
  const [userBalance, setUserBalance] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);

    if (!token || !userStr) {
      setIsLoggedIn(false);
      setUserBalance("0.0");
      return;
    }

    try {
      const parsedUser = JSON.parse(userStr);
      const userId = parsedUser?._id; // ✅ use 'id' not '_id'

      if (!userId) {
        console.warn("No user ID found in localStorage user object");
        setIsLoggedIn(false);
        setUserBalance("0.0");
        return;
      }

      setIsLoggedIn(true);

      const userDocRef = doc(db, "users", userId);
      const unsubscribe = onSnapshot(userDocRef, async (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          const rawBalance = data?.balance?.testnet;

          if (rawBalance !== undefined && rawBalance !== null) {
            const avaxValue = await convertUSDToAvax(rawBalance);
            const formatted = formatBalance(avaxValue);

            setUserBalance(formatted);
            localStorage.setItem("cachedBalance", formatted);
          }
          // if Firestore balance missing, keep previous balance
        }
      });

      return () => unsubscribe();
    } catch (err) {
      console.error("Failed to parse user:", err);
      setIsLoggedIn(false);
      setUserBalance("0.0");
    }
  }, [token, userStr]);

  return (
    <div className="flex justify-between items-center w-full p-4 ">
      {isMarketPage ? (
        <Image width={100} height={100} className="w-32" alt="Market Logo" src="/img/market/logofull.svg" />
      ) : (
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm font-medium text-white"
        >
          <span>←</span>
          <span>Back</span>
        </button>
      )}

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
        {!mounted || userBalance === null ? (
          <div className="w-16 h-4 bg-gray-700 animate-pulse rounded" />
        ) : isLoggedIn ? (
          <>
            <Image width={20} height={20} alt="AVAX" src="/img/market/avax.svg" />
            <p className="text-sm font-light text-white">{userBalance}</p>
          </>
        ) : (
          <p className="text-sm font-semibold px-2 text-white">Login</p>
        )}
      </div>
    </div>
  );
};

export default MobileNav;