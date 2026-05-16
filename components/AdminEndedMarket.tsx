"use client";

import React, { useEffect, useState } from "react";
import MarketItem from "@/components/MarketItem";
import { MarketSkeleton } from "@/components/skeletons/MarketSkeleton";
import { apiRequest } from "@/utils/apiRequest";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  activeCategory: string;
  activeSubCategory: string;
  showSavedOnly: boolean;
}

const AdminEndedMarkets: React.FC<Props> = ({
  activeCategory,
  activeSubCategory,
  showSavedOnly
}) => {
  const [markets, setMarkets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMarkets();
  }, []);

  const fetchMarkets = async () => {
    try {
      setLoading(true);

      const res = await apiRequest("/admin_market/ended", {
        method: "GET",
        showLoading: false,
        showError: false,
        showSuccess: false,
      });

      if (res.success) {
        setMarkets(res.data.markets || []);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // SAME FILTER LOGIC STYLE
  // =========================
  const finalMarkets = React.useMemo(() => {

    const safeCategory = activeCategory?.toLowerCase?.() || "";
    const safeSubCategory =
      activeSubCategory?.toLowerCase?.() || "";

    let filtered = [...markets];

    // =========================
    // SUBCATEGORY FILTER
    // =========================
    filtered = filtered.filter((market) => {

      if (
        !safeSubCategory ||
        safeSubCategory === "all markets"
      ) {
        return true;
      }

      const question =
        market.question?.toLowerCase?.() || "";

      const symbol =
        market.metadata?.assetSymbol?.toLowerCase?.() || "";

      return (
        question.includes(safeSubCategory) ||
        symbol.includes(safeSubCategory)
      );
    });

    // =========================
    // CATEGORY FILTER
    // =========================
    if (
      safeCategory &&
      safeCategory !== "trending"
    ) {
      filtered = filtered.filter((market) => {

        const marketType =
          market.marketType?.toLowerCase?.() || "";

        const category =
          market.category?.toLowerCase?.() || "";

        return (
          marketType === safeCategory ||
          category === safeCategory
        );
      });
    }

    // =========================
    // SORT
    // =========================
    return filtered.sort((a, b) => {

      const aEnd = Number(a.endDate || 0);
      const bEnd = Number(b.endDate || 0);

      if (bEnd !== aEnd) {
        return bEnd - aEnd;
      }

      return a._id.localeCompare(b._id);
    });

  }, [markets, activeCategory, activeSubCategory]);

  // =========================
  // LOADING UI (same style as main)
  // =========================
  if (loading && markets.length === 0) {
    return (
      <div className="p-2 mb-24 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:px-40 ">
        {[...Array(5)].map((_, i) => (
          <MarketSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="p-2 mb-24 grid gap-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:px-40 ">

      {finalMarkets.length === 0 ? (
        <p className="text-white/50 text-center col-span-full">
          No ended markets found
        </p>
      ) : (
        <AnimatePresence>
          {finalMarkets.map((market) => (
            <motion.div
              key={market._id}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4 }}
            >
              <MarketItem
                mode="admin"
                market={market}
                userOrders={[]} // admin doesn't need this
                initialSaved={false}
                onToggleSaved={() => { }}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      )}
    </div>
  );
};

export default AdminEndedMarkets;