"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { doc, onSnapshot, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseClient";
import { apiRequest } from "@/utils/apiRequest";

interface MarketHeaderProps {
    market: any;
    isCrypto: boolean;
    logo?: string | null;
    userId?: string | null; // pass userId if available
}

export function MarketHeader({ market, isCrypto, logo: propLogo, userId }: MarketHeaderProps) {
    const [logo, setLogo] = useState<string | null>(propLogo || null);
    const [loading, setLoading] = useState(!propLogo);
    const [saving, setSaving] = useState(false);
    const [bookmarked, setBookmarked] = useState(false);

    // Listen to Firestore savedMarkets for this user
    useEffect(() => {
        if (!userId) return;

        const userRef = doc(db, "users", userId);
        const unsubscribe = onSnapshot(userRef, (snapshot) => {
            if (!snapshot.exists()) return;
            const data = snapshot.data();
            setBookmarked(data.savedMarkets?.includes(market._id) || false);
        });

        return () => unsubscribe();
    }, [userId, market._id]);

    // Load crypto logo (cache first)
    useEffect(() => {
        if (!isCrypto) return;

        const coinIdRaw = market.metadata?.assetId || market.metadata?.asset;
        if (!coinIdRaw) return;

        const coinId = coinIdRaw.toLowerCase() === "avalanche" ? "avalanche-2" : coinIdRaw.toLowerCase();
        const cacheStr = localStorage.getItem("logoCache");
        const cache = cacheStr ? JSON.parse(cacheStr) : {};

        if (cache[coinId]) {
            setLogo(cache[coinId]);
            setLoading(false);
            return;
        }

        setLoading(true);
        fetch(`https://api.coingecko.com/api/v3/coins/${coinId}`)
            .then((res) => res.json())
            .then((data) => {
                setLogo(data.image.thumb);
                localStorage.setItem("logoCache", JSON.stringify({ ...cache, [coinId]: data.image.thumb }));
            })
            .catch(() => setLogo(propLogo || null))
            .finally(() => setLoading(false));
    }, [isCrypto, market.metadata, propLogo]);


    const handleSaveClick = async (e: React.MouseEvent) => {

        console.log("slicked")
        e.stopPropagation();
        e.preventDefault();

        if (!userId) {
            console.log("❌ No userId");
            return;
        }

        if (saving) return; // 🚫 prevent spam clicks

        setSaving(true);

        const action = bookmarked ? "unsave" : "save";

        try {
            const token = localStorage.getItem("token");

            console.log("🚀 Saving market:", market._id, action);

            const { success } = await apiRequest("/user_market/save_market", {
                method: "POST",
                body: { marketId: market._id, action, token },
                showLoading: false,
            });

            if (success) {
                console.log("✅ Saved successfully");

                // ⚡ instant UI feedback
            } else {
                console.log("❌ API failed");
            }

        } catch (err) {
            console.error("❌ Save failed", err);
        } finally {
            setSaving(false);
        }
    };
    return (
        <div className="flex items-center justify-between w-full gap-4">
            <div className="flex items-center gap-2">
                {isCrypto && (
                    <div className={`w-12 h-12 rounded-full overflow-hidden bg-gray-800 flex items-center justify-center ${loading ? "animate-pulse" : ""}`}>
                        <Image src={logo || "https://via.placeholder.com/52x52.png?text=?"} alt="logo" width={52} height={52} />
                    </div>
                )}
                <h1 className="text-sm max-w-52 font-bold flex-1">{market.question}</h1>
            </div>

            {/* Bookmark */}
            <motion.div
                className="w-8 h-8 cursor-pointer relative"
                onClick={handleSaveClick}
                whileTap={{ scale: 0.9 }}
            >
                {/* Outline */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="#f1f5f9" className="w-8 h-8 absolute top-0 left-0">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 5v16l7-5 7 5V5a2 2 0 00-2-2H7a2 2 0 00-2 2z" />
                </svg>

                {/* Filled */}
                <AnimatePresence>
                    {bookmarked && (
                        <motion.svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-8 h-8 absolute top-0 left-0" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} fill="#fff">
                            <path d="M5 5v16l7-5 7 5V5a2 2 0 00-2-2H7a2 2 0 00-2 2z" />
                        </motion.svg>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}