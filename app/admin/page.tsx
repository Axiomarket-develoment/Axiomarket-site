"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import CategoriesFilter from "@/components/CategoriesFilter";
import DownBar from "@/components/DownBar";
import MobileNav from "@/components/MobileNav";
import Image from "next/image";

import { apiRequest } from "@/utils/apiRequest";
import AdminEndedMarkets from "@/components/AdminEndedMarket";

export default function AdminMarketPage() {
  const router = useRouter();

  // ✅ SAME FILTER STATES
  const [activeCategory, setActiveCategory] = useState("Trending");
  const [activeSubCategory, setActiveSubCategory] =
    useState("All Markets");

  const [showSavedOnly, setShowSavedOnly] = useState(false);

  // ✅ AUTH GATE
  const [checkingAuth, setCheckingAuth] = useState(true);

  // ==========================
  // CHECK ADMIN
  // ==========================
  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    try {
      const res = await apiRequest("/admin_auth/check_me", {
        method: "GET",
        showLoading: false,
        showSuccess: false,
        showError: false,
      });

      if (!res.success || !res.data?.isAdmin) {
        router.replace("/market");
        return;
      }
    } catch (err) {
      console.log(err);
      router.replace("/market");
    } finally {
      setCheckingAuth(false);
    }
  };

  // ✅ HARD GATE
  if (checkingAuth) {
    return null;
  }

  return (
    <div>
      {/* MOBILE BACKGROUND */}
      <div className="fixed inset-0 bg-[#000000] opacity-90 lg:hidden block z-10" />

      <div className="absolute inset-0 lg:hidden z-0">
        <Image
          src="/img/waitlist/wlbg.svg"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* DESKTOP CONTAINER */}
      <div className="relative z-20 flex justify-center">
        <div className="w-full flex flex-col min-h-[60px]">

          {/* NAV */}
          <MobileNav />

          {/* FILTERS */}
          <div className="lg:px-30 lg:mb-14">

            <CategoriesFilter
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              activeSubCategory={activeSubCategory}
              setActiveSubCategory={setActiveSubCategory}
              showSavedOnly={showSavedOnly}
              setShowSavedOnly={setShowSavedOnly}
            />

          </div>

          {/* ADMIN MARKETS */}
          <AdminEndedMarkets
            activeCategory={activeCategory}
            activeSubCategory={activeSubCategory}
            showSavedOnly={showSavedOnly}
          />

          {/* FOOTER */}
          {/* <DownBar /> */}

        </div>
      </div>
    </div>
  );
}