"use client";

import React, { useEffect, useState } from "react";
import MarketItem from "./MarketItem";
import { Market } from "@/data/market";
import { MarketSkeleton } from "./skeletons/MarketSkeleton";
import { db } from "@/lib/firebaseClient";
import { collection, query, orderBy, onSnapshot, where, doc } from "firebase/firestore";
import { AnimatePresence, motion } from "framer-motion";

const STORAGE_KEY = "markets";

function shuffleArray(array: Market[]) {
  return [...array].sort(() => Math.random() - 0.5);
}

interface MarketsProps {
  activeCategory: string;
  activeSubCategory: string;
  showSavedOnly: boolean;
}

const Markets: React.FC<MarketsProps> = ({ activeCategory, activeSubCategory, showSavedOnly }) => {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [savedMarkets, setSavedMarkets] = useState<string[]>([]);


  const handleToggleSaved = (marketId: string, isNowSaved: boolean) => {
    setSavedMarkets((prev) => {
      if (isNowSaved) return [...prev, marketId];
      return prev.filter((id) => id !== marketId);
    });
  };

  useEffect(() => {
    if (!userId) return;

    const userRef = doc(db, "users", userId);

    const unsubscribeUser = onSnapshot(userRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setSavedMarkets(data.savedMarkets || []);
      }
    });

    return () => unsubscribeUser();
  }, [userId]);

  // 0️⃣ Load user from localStorage synchronously
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const parsedUser = JSON.parse(userStr);
        if (parsedUser?._id) {
          setUserId(parsedUser._id);
        } else {
          console.warn("User object missing _id:", parsedUser);
        }
      } catch (err) {
        console.error("Failed to parse user from localStorage:", err);
      }
    }
  }, []);

  // 1️⃣ Load cached markets immediately for fast UX
  useEffect(() => {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      try {
        const parsedMarkets = JSON.parse(cached);
        setMarkets(parsedMarkets);
        setLoading(false);
      } catch (err) {
        console.error("Failed to parse cached markets:", err);
      }
    }
  }, []);

  // 2️⃣ Subscribe to Firestore orders for the user (only if userId exists)
  useEffect(() => {
    if (!userId) return;

    const ordersQuery = query(
      collection(db, "orders"),
      where("userId", "==", userId)
    );

    const unsubscribeOrders = onSnapshot(ordersQuery, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ _id: doc.id, ...doc.data() }));
      setOrders(data);
    });

    return () => {
      unsubscribeOrders();
    };
  }, [userId]);


  const finalMarkets = React.useMemo(() => {
    const now = Date.now();

    const filtered = markets.filter((market) => {
      const matchesSearch =
        activeSubCategory === "All Markets"
          ? true
          : market.question?.toLowerCase().includes(activeSubCategory.toLowerCase()) ||
          market.metadata?.assetSymbol?.toLowerCase().includes(activeSubCategory.toLowerCase());

      const isSettled = market.status === "SETTLED";
      if (isSettled) return false;

      const matchesCategory =
        activeCategory === "Trending" ||
        market.marketType?.toLowerCase() === activeCategory.toLowerCase();

      const matchesSaved =
        !showSavedOnly || savedMarkets.includes(market._id);

      return matchesCategory && matchesSearch && matchesSaved;
    });

    return filtered.sort((a, b) => {
      const getPriority = (m: Market) =>
        new Date(m.endDate).getTime() < now ? 2 : 1;

      return getPriority(a) - getPriority(b);
    });
  }, [markets, activeCategory, activeSubCategory, showSavedOnly, savedMarkets]);



  // 3️⃣ Subscribe to Firestore markets
  useEffect(() => {
    const marketsQuery = query(collection(db, "markets"), orderBy("createdAt", "desc"),);

    const unsubscribeMarkets = onSnapshot(marketsQuery, (snapshot) => {
      const liveMarkets: Market[] = snapshot.docs.map((doc) => {
        const data = doc.data() as Partial<Omit<Market, "_id" | "id">>; // allow partial
        return {
          _id: doc.id,
          id: doc.id, // also set `id`
          question: data.question || "",
          conversationId: data.conversationId || "",
          marketType: data.marketType as Market["marketType"] || "CRYPTO",
          subMarkets: (data.subMarkets || []).map((sub: any) => ({
            ...sub,
            outcomes: (sub.outcomes || []).map((o: any) => ({
              label: o.label || "",
              liquidity: o.liquidity || 0,
              volume: o.volume || 0,
              count: o.count || 0,
              odds: o.odds || 1,
              result: o.result ?? null,
            })),
          })), startDate: data.startDate || "",
          endDate: data.endDate || "",
          durationMinutes: data.durationMinutes || 0,
          metadata: data.metadata,
          status: data.status || "PENDING",
          totalVolume: data.totalVolume || 0,
          tradeCount: data.tradeCount || 0,
          featured: data.featured,
          category: data.category,
          createdAt: data.createdAt || "",
        };
      });
      setMarkets(liveMarkets);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(liveMarkets));
      setLoading(false);
    });

    return () => {
      unsubscribeMarkets();
    };
  }, []);

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
            const userOrdersForMarket = orders.filter((o) => o.marketId === market._id);

            return (
              <motion.div
                key={market._id || index}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <MarketItem
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