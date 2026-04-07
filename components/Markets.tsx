"use client";

import React, { useEffect, useState } from "react";
import MarketItem from "./MarketItem";
import { Market } from "@/data/market";
import { MarketSkeleton } from "./skeletons/MarketSkeleton";
import { db } from "@/lib/firebaseClient";
import { collection, query, orderBy, onSnapshot, where } from "firebase/firestore";
import { AnimatePresence, motion } from "framer-motion";

const STORAGE_KEY = "markets";

const Markets = () => {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // 0️⃣ Get userId from localStorage
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setUserId(user._id); // MongoDB uses _id
      } catch (err) {
        console.error("Failed to parse user from localStorage:", err);
      }
    }

    // 1️⃣ Load cached markets
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      setMarkets(JSON.parse(cached));
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!userId) return; // wait until we have userId

    // 2️⃣ Subscribe to Firestore orders for this user
    const ordersQuery = query(
      collection(db, "orders"),
      where("userId", "==", userId)
    );

    const unsubscribeOrders = onSnapshot(ordersQuery, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ _id: doc.id, ...doc.data() }));
      setOrders(data);
    });

    // 3️⃣ Subscribe to Firestore markets
    const marketsQuery = query(collection(db, "markets"), orderBy("createdAt", "desc"));
    const unsubscribeMarkets = onSnapshot(marketsQuery, (snapshot) => {
      const liveMarkets = snapshot.docs.map((doc) => {
        const { _id, ...rest } = doc.data() as Market; // remove _id from doc.data()
        return {
          _id: doc.id, // use Firestore document ID
          ...rest
        };
      });
      setMarkets(liveMarkets);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(liveMarkets));
      setLoading(false);
    });

    return () => {
      unsubscribeOrders();
      unsubscribeMarkets();
    };
  }, [userId]);

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
          {markets.map((market, index) => {
            const userOrdersForMarket = orders.filter((o) => o.marketId === market._id);

            // console.log("📝 Orders for market:", market._id, userOrdersForMarket); // ← LOG HERE

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