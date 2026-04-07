"use client";

import React, { useEffect, useState } from "react";
import HistoryCard from "@/components/HistoryCard";
import DownBar from "@/components/DownBar";
import MobileNav from "@/components/MobileNav";
import { apiRequest } from "@/utils/apiRequest";
import { motion, AnimatePresence } from "framer-motion";

/* ================= TYPES ================= */

// API TYPE (backend)
type HistoryItem = {
    _id: string;
    userOutcome: "PENDING" | "WIN" | "LOSE";
    stake: number;
    potentialWin: number;
    market: {
        title: string;
        image?: string;
    };
    createdAt: string;
};

// UI TYPE (for HistoryCard)
type HistoryCardItem = {
    marketQuestion: string;
    outcomePicked: string;
    amountStaked: number;
    potentialWin: number;
    userOutcome: "PENDING" | "WIN" | "LOSE";
    image?: string;
    date: string;
};

export default function HistoryPage() {
    const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
    const [filteredItems, setFilteredItems] = useState<HistoryItem[]>([]);

    const [totalStaked, setTotalStaked] = useState(0);
    const [totalPotentialWin, setTotalPotentialWin] = useState(0);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("All");

    /* ================= FETCH ================= */

    useEffect(() => {
        const fetchHistory = async () => {
            setLoading(true);

            const { success, data } = await apiRequest(
                "/user_history/get_history",
                {
                    method: "GET",
                    showLoading: true,
                }
            );

            if (success && data?.history) {
                setHistoryItems(data.history);
                setFilteredItems(data.history);
                setTotalStaked(data.totalStaked);
                setTotalPotentialWin(data.totalPotentialWin);
            } else {
                setHistoryItems([]);
                setFilteredItems([]);
                setTotalStaked(0);
                setTotalPotentialWin(0);
            }

            setLoading(false);
        };

        fetchHistory();
    }, []);

    /* ================= FILTER ================= */

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);

        let filtered = historyItems;

        if (tab === "Ongoing") {
            filtered = historyItems.filter(
                (h) => h.userOutcome === "PENDING"
            );
        } else if (tab === "Win") {
            filtered = historyItems.filter(
                (h) => h.userOutcome === "WIN"
            );
        } else if (tab === "Lose") {
            filtered = historyItems.filter(
                (h) => h.userOutcome === "LOSE"
            );
        }

        setFilteredItems(filtered);
    };

    /* ================= MAPPING ================= */

    const mappedItems: HistoryCardItem[] = filteredItems.map((item) => {
        const market = item.market || { title: "Unknown Market", image: undefined };

        return {
            marketQuestion: market.title,
            outcomePicked: "", // fill if API provides
            amountStaked: item.stake ?? 0,
            potentialWin: item.potentialWin ?? 0,
            userOutcome: item.userOutcome ?? "PENDING",
            image: market.image,
            date: item.createdAt ?? new Date().toISOString(),
        };
    });

    /* ================= SKELETON ================= */

    const SkeletonCard = () => (
        <div className="w-full p-4 rounded-xl bg-[#111] border border-white/5 animate-pulse">
            <div className="h-4 w-1/2 bg-[#222] rounded mb-3"></div>
            <div className="h-3 w-1/3 bg-[#222] rounded mb-2"></div>
            <div className="h-3 w-1/4 bg-[#222] rounded"></div>
        </div>
    );

    /* ================= LOADING ================= */

    if (loading) {
        return (
            <>
                <MobileNav />
                <DownBar />
                <div className="p-5 flex flex-col gap-3">
                    {[...Array(6)].map((_, i) => (
                        <SkeletonCard key={i} />
                    ))}
                </div>
            </>
        );
    }

    if (!historyItems.length) return <p>No history found</p>;

    /* ================= UI ================= */

    return (
        <>
            <MobileNav />
            <DownBar />

            <div className="p-5">
                {/* Tabs */}
                <div className="flex w-full gap-3 justify-between mb-5">
                    {["All", "Ongoing", "Win", "Lose"].map((tab) => (
                        <motion.button
                            key={tab}
                            whileTap={{ scale: 0.95 }}
                            whileHover={{ scale: 1.05 }}
                            className="rounded-full border border-white/5 w-24 text-xs"
                            onClick={() => handleTabChange(tab)}
                            style={{
                                padding: "10px 20px",
                                backgroundColor:
                                    activeTab === tab
                                        ? "#FF394A"
                                        : "#0C0C0C",
                                cursor: "pointer",
                            }}
                        >
                            {tab}
                        </motion.button>
                    ))}
                </div>

                {/* Stats */}
                <div className="flex w-full items-center px-3 bg-[#090909] py-3 border border-white/5 justify-between">
                    <div>
                        <p className="text-[#8B8B8B] text-[12px]">
                            Total Staked
                        </p>
                        <p className="font-semibold">
                            ${totalStaked.toFixed(2)}
                        </p>
                    </div>

                    <div>
                        <p className="text-[#8B8B8B] text-[12px]">
                            Potential Win
                        </p>
                        <p className="text-[#56CD00] font-semibold">
                            ${totalPotentialWin.toFixed(2)}
                        </p>
                    </div>
                </div>

                {/* Cards */}
                <motion.div
                    className="flex w-full flex-col gap-3 mt-4"
                    variants={{
                        hidden: {},
                        show: {
                            transition: {
                                staggerChildren: 0.08,
                            },
                        },
                    }}
                    initial="hidden"
                    animate="show"
                >
                    <AnimatePresence>
                        {mappedItems.length ? (
                            mappedItems.map((item, index) => (
                                <motion.div
                                    key={index}
                                    variants={{
                                        hidden: { opacity: 0, y: 20 },
                                        show: { opacity: 1, y: 0 },
                                        exit: { opacity: 0, y: 20 },
                                    }}
                                    transition={{ duration: 0.3 }}
                                    layout
                                >
                                    <HistoryCard history={item} />
                                </motion.div>
                            ))
                        ) : (
                            <p>No items for this category</p>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </>
    );
}