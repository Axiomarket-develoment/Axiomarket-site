"use client";

import React, { useEffect, useState } from "react";
import MarketItem from "./MarketItem";
import { Market } from "@/data/market";
import { MarketSkeleton } from "./skeletons/MarketSkeleton";
import { db } from "@/lib/firebaseClient";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  where,
  doc,
} from "firebase/firestore";
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
  const [savedMarkets, setSavedMarkets] = useState<string[]>([]);
  const [tick, setTick] = useState(0);

  const handleToggleSaved = (marketId: string, isNowSaved: boolean) => {
    setSavedMarkets((prev) => {
      if (isNowSaved) return [...prev, marketId];
      return prev.filter((id) => id !== marketId);
    });
  };

  // ---------------- MARKETS REALTIME ----------------
  useEffect(() => {
    setLoading(true);

    const q = query(
      collection(db, "markets"),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const liveMarkets: Market[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data() as any;

        return {
          _id: docSnap.id,
          id: docSnap.id,
          question: data.question || "",
          conversationId: data.conversationId || "",
          marketType: data.marketType || "CRYPTO",

          // 🔥 FIX: always convert object → array safely
          subMarkets: (data.subMarkets || []).map((sub: any) => ({
            ...sub,
            outcomes: (sub.outcomes || []).map((o: any) => ({
              label: o.label || "",
              liquidity: o.liquidity || 0,
              volume: o.volume || 0,
              count: o.count || 0,
              odds: o.odds || 1,
              result: o.result ?? null,
              percentage: Number(o.percentage ?? 50),
            })),
          })),

          startDate: data.startDate || "",
          endDate: data.endDate || "",
          durationMinutes: data.durationMinutes || 0,
          metadata: data.metadata,
          status: data.status || "PENDING",
          totalVolume: data.totalVolume || 0,
          tradeCount: data.tradeCount || 0,
          createdAt: data.createdAt || "",
        };
      });

      const cleanMarkets = liveMarkets.filter(
        (m) => m.status === "LIVE" || m.status === "ENDED"
      );

      // 🔥 force new reference always (important for React diffing)
      setMarkets([...cleanMarkets]);
      setTick(prev => prev + 1);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  // ---------------- USER ID ----------------
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const parsedUser = JSON.parse(userStr);
        if (parsedUser?._id) setUserId(parsedUser._id);
      } catch (err) {
        console.error("Failed to parse user:", err);
      }
    }
  }, []);

  // ---------------- SAVED ----------------
  useEffect(() => {
    if (!userId) return;

    const userRef = doc(db, "users", userId);

    const unsub = onSnapshot(userRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setSavedMarkets(data.savedMarkets || []);
      }
    });

    return () => unsub();
  }, [userId]);

  // ---------------- ORDERS ----------------
  useEffect(() => {
    if (!userId) return;

    const q = query(collection(db, "orders"), where("userId", "==", userId));

    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({ _id: d.id, ...d.data() }));
      setOrders(data);
    });

    return () => unsub();
  }, [userId]);

  // ---------------- FILTER ----------------
  const finalMarkets = React.useMemo(() => {
    const now = Date.now();

    return markets
      .filter((market) => {
        const matchesSearch =
          activeSubCategory === "All Markets"
            ? true
            : market.question
              ?.toLowerCase()
              .includes(activeSubCategory.toLowerCase()) ||
            market.metadata?.assetSymbol
              ?.toLowerCase()
              .includes(activeSubCategory.toLowerCase());

        const isSettled = market.status === "SETTLED";
        if (isSettled) return false;

        const matchesCategory =
          activeCategory === "Trending" ||
          market.marketType?.toLowerCase() === activeCategory.toLowerCase();

        const matchesSaved =
          !showSavedOnly || savedMarkets.includes(market._id);

        return matchesCategory && matchesSearch && matchesSaved;
      })
      .sort((a, b) => {
        const getPriority = (m: Market) =>
          new Date(m.endDate).getTime() < now ? 2 : 1;

        return getPriority(a) - getPriority(b);
      });
  }, [markets, activeCategory, activeSubCategory, showSavedOnly, savedMarkets]);

  // ---------------- UI ----------------
  if (loading && markets.length === 0) {
    return (
      <div className="p-2 mb-24 grid gap-4">
        {[...Array(5)].map((_, i) => (
          <MarketSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="p-2 mb-24 grid gap-4">
      {markets.length === 0 ? (
        <p className="text-white text-center">No markets available</p>
      ) : (
        <AnimatePresence>
          {finalMarkets.map((market, index) => {
            const userOrdersForMarket = orders.filter(
              (o) => o.marketId === market._id
            );

            return (
              <motion.div
                key={market._id?.toString() ?? index}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <MarketItem
                  key={`${market._id?.toString() ?? index}-${tick}`}
                  market={market}
                  userOrders={userOrdersForMarket}
                  initialSaved={savedMarkets.includes(market._id)}
                  onToggleSaved={handleToggleSaved}
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