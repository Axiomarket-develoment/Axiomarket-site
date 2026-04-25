"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import CategoriesFilter from "@/components/CategoriesFilter";
import DownBar from "@/components/DownBar";
import Markets from "@/components/Markets";
import MobileNav from "@/components/MobileNav";
import Image from "next/image";

export default function MarketClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // ✅ STATE MUST BE HERE
  const [activeCategory, setActiveCategory] = useState("Trending");
  const [activeSubCategory, setActiveSubCategory] = useState("All Markets");
  const [showSavedOnly, setShowSavedOnly] = useState(false);

  useEffect(() => {
    const token = searchParams.get("token");
    const user = searchParams.get("user");

    if (token && user) {
      try {
        const decodedUser = JSON.parse(atob(decodeURIComponent(user)));
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(decodedUser));
        router.replace("/market");
      } catch (err) {
        console.error("Failed to decode user:", err);
      }
    }
  }, [searchParams, router]);

  return (
    <div>
      {/* Mobile background (keep as is) */}
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

      {/* ✅ NEW DESKTOP CONTAINER */}
      <div className="relative z-20 flex justify-center">
        <div className="w-full  flex flex-col min-h-[60px]">

          <MobileNav />

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

          <Markets
            activeCategory={activeCategory}
            activeSubCategory={activeSubCategory}
            showSavedOnly={showSavedOnly}
          />

          <DownBar />

        </div>
      </div>
    </div>
  );
}