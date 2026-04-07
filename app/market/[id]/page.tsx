"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import MobileNav from "@/components/MobileNav";
import MarketDetails from "@/components/MarketDetails";
import DownBar from "@/components/DownBar";
import { Market } from "@/data/market";
import { MarketDetailsSkeleton } from "@/components/skeletons/MarketDetailsSkeleton";

interface Props {
  id: string;
}

export default function MarketPage({ id }: Props) {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [market, setMarket] = useState<Market | null>(null);
  const [logo, setLogo] = useState<string | null>(null);

  useEffect(() => {
    const cached = localStorage.getItem("markets");
    if (cached) {
      const markets = JSON.parse(cached);
      const found = markets.find((m: { id: string }) => m.id === params.id);
      setMarket(found || null);
    }

    // ✅ Get logo from query param once
    const logoParam = searchParams?.get("logo");
    if (logoParam) {
      setLogo(logoParam);

      // Remove logo param from URL without reload
      const url = new URL(window.location.href);
      url.searchParams.delete("logo");
      router.replace(url.pathname + url.search); // keep other query params if any
    }

    return () => {
      // Cleanup AI insight keys
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("aiInsight_")) localStorage.removeItem(key);
      });
    };
  }, [params.id]);

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