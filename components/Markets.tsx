"use client";

import React, { useEffect, useState } from "react";
import MarketItem from "./MarketItem";
import { Market } from "@/data/market";
import { MarketSkeleton } from "./skeletons/MarketSkeleton";
import { apiRequest } from "@/utils/apiRequest";
import { AnimatePresence, motion } from "framer-motion";

const STORAGE_KEY = "markets";

interface MarketsProps {
  activeCategory: string;
  activeSubCategory: string;
  showSavedOnly: boolean;
}

const Markets: React.FC<MarketsProps> = ({
  activeCategory,
  activeSubCategory,
  showSavedOnly
}) => {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [savedMarkets, setSavedMarkets] = useState<string[]>([]);

  const MARKETS_KEY = "markets_cache";

  // ---------------- USER ----------------
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) return;

    const parsed = JSON.parse(userStr);
    setUser(parsed);
    setSavedMarkets(parsed.savedMarkets || []);
  }, []);

  // ---------------- FETCH MARKETS ----------------
  const fetchMarkets = async () => {
    try {
      const res = await apiRequest("/user_market/markets", {
        method: "GET",
        showLoading: false,
      });

      if (res.success && Array.isArray(res.data)) {
        setMarkets(res.data);
        localStorage.setItem(MARKETS_KEY, JSON.stringify(res.data));
      }
    } catch (err) {
      console.error("Failed to fetch markets:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ RUN ONCE + REFRESH EVERY 30s
  useEffect(() => {
    const cached = localStorage.getItem(MARKETS_KEY);

    if (cached) {
      try {
        setMarkets(JSON.parse(cached));
        setLoading(false);
      } catch (err) {
        console.error("Invalid cached markets");
      }
    }

    fetchMarkets();

    const interval = setInterval(fetchMarkets, 30000);

    return () => clearInterval(interval);
  }, []);

  // ---------------- USER ID ----------------
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) return;

    try {
      const parsedUser = JSON.parse(userStr);
      if (parsedUser?._id) setUserId(parsedUser._id);
    } catch (err) {
      console.error(err);
    }
  }, []);

  // ---------------- SAVED ----------------
  useEffect(() => {
    if (!userId) return;

    const fetchSaved = async () => {
      const res = await apiRequest(`/user_market/saved_market`, {
        method: "POST",
        body: { userId },
        showLoading: false,
      });

      if (res.success) {
        const saved = res.data.savedMarkets;

        setUser((prev: any) => {
          if (!prev) return prev;

          const updated = {
            ...prev,
            savedMarkets: Array.isArray(saved)
              ? saved
              : prev.savedMarkets || [],
          };

          localStorage.setItem("user", JSON.stringify(updated));
          return updated;
        });

        setSavedMarkets(saved || []);
      }
    };

    fetchSaved();
  }, [userId]);

  // ---------------- FILTER ----------------
  const finalMarkets = React.useMemo(() => {
    const now = Date.now();
    const GRACE_PERIOD = 60 * 1000;

    let filtered = markets.filter((market) => {
      const end = Number(market.endDate || 0);

      const isSettled =
        market.status?.toUpperCase().trim() === "SETTLED";

      const isExpiredWithGrace = end + GRACE_PERIOD < now;

      if (isSettled || isExpiredWithGrace) return false;

      const matchesSearch =
        activeSubCategory === "All Markets"
          ? true
          : market.question
              ?.toLowerCase()
              .includes(activeSubCategory.toLowerCase()) ||
            market.metadata?.assetSymbol
              ?.toLowerCase()
              .includes(activeSubCategory.toLowerCase());

      const matchesSaved =
        !showSavedOnly || savedMarkets.includes(market._id);

      return matchesSearch && matchesSaved;
    });

    // 🔥 TRENDING (FIXED - NO RANDOM SHUFFLE)
    if (activeCategory === "Trending") {
      const grouped: any = {
        CRYPTO: [],
        SPORT: [],
        SOCIAL: [],
      };

      filtered.forEach((m) => {
        if (grouped[m.marketType]) {
          grouped[m.marketType].push(m);
        }
      });

      return [
        ...grouped.CRYPTO.slice(0, 5),
        ...grouped.SPORT.slice(0, 5),
        ...grouped.SOCIAL.slice(0, 5),
      ];
    }

    // 🔥 NORMAL FILTER
    return filtered
      .filter((market) => {
        return (
          market.marketType?.toUpperCase() ===
            activeCategory?.toUpperCase() ||
          market.category?.toLowerCase() ===
            activeCategory?.toLowerCase()
        );
      })
      .sort((a, b) => {
        const aEnd = Number(a.endDate || 0);
        const bEnd = Number(b.endDate || 0);
        return bEnd - aEnd;
      });
  }, [markets, activeCategory, activeSubCategory, showSavedOnly, savedMarkets]);

  // ---------------- UI ----------------
  if (loading && markets.length === 0) {
    return (
      <div className="p-2 mb-24 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-full lg:px-40 mx-auto">
        {[...Array(5)].map((_, i) => (
          <MarketSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="p-2 mb-24 grid gap-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:px-40 mx">
      {markets.length === 0 ? (
        <p className="text-white text-center">No markets available</p>
      ) : (
        <AnimatePresence>
          {finalMarkets.map((market) => {
            const userOrdersForMarket = orders.filter(
              (o) => o.marketId === market._id
            );

            return (
              <motion.div
                key={market._id + market.status}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <MarketItem
                  market={market}
                  userOrders={userOrdersForMarket}
                  initialSaved={savedMarkets.includes(market._id)}
                  onToggleSaved={(id, isNowSaved) => {
                    const updated = isNowSaved
                      ? [...(user?.savedMarkets || []), id]
                      : (user?.savedMarkets || []).filter(
                          (mId: string) => mId !== id
                        );

                    const newUser = {
                      ...user,
                      savedMarkets: updated,
                    };

                    setUser(newUser);
                    setSavedMarkets(updated);
                    localStorage.setItem("user", JSON.stringify(newUser));
                  }}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      )}
    </div>
  );
};

export default Markets;