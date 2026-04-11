"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebaseClient";

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

          // ✅ THIS IS NOW ALREADY CONVERTED BY BACKEND
          setAvaxBalance(data?.avaxBalance ?? "0.0");
        }
      });

      return () => unsubscribe();
    } catch (err) {
      console.error("User parse error:", err);
      setIsLoggedIn(false);
    }
  }, [token, userStr]);

  return (
    <div className="flex justify-between items-center w-full p-4">
      {isMarketPage ? (
        <Image
          width={100}
          height={100}
          className="w-32"
          alt="Market Logo"
          src="/img/market/logofull.svg"
        />
      ) : (
         <Image
          width={100}
          height={100}
          className="w-32"
          alt="Market Logo"
          src="/img/market/logofull.svg"
        />
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
    </div>
  );
};

export default MobileNav;