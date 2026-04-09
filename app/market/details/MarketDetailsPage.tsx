"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import MobileNav from "@/components/MobileNav";
import MarketDetails from "@/components/MarketDetails";
import DownBar from "@/components/DownBar";
import { Market } from "@/data/market";
import { MarketDetailsSkeleton } from "@/components/skeletons/MarketDetailsSkeleton";



export default function MarketPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [market, setMarket] = useState<Market | null>(null);
  const [logo, setLogo] = useState<string | null>(null);

  useEffect(() => {
    // First, try to read from localStorage
    const storedMarket = localStorage.getItem("selectedMarket");
    if (storedMarket) {
      setMarket(JSON.parse(storedMarket));
    }

    // Get logo from query param
    const logoParam = searchParams?.get("logo");
    if (logoParam) {
      setLogo(logoParam);

      // Remove the query param from URL
      const url = new URL(window.location.href);
      url.searchParams.delete("logo");
      router.replace(url.pathname + url.search);
    }

    return () => {
      // Clean AI insight keys
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("aiInsight_")) localStorage.removeItem(key);
      });
    };
  }, []);

  return (
    <div className="space-y-4 pb-35 h-screen relative">
      <MobileNav />

      {/* Show skeleton if market is not loaded */}
      {!market ? (
        <MarketDetailsSkeleton />
      ) : (
        <MarketDetails market={market} logo={logo} />
      )}

      <DownBar />
    </div>
  );
}