"use client";

import React, { useEffect, useState, useMemo } from "react";
import HistoryCard from "@/components/HistoryCard";
import DownBar from "@/components/DownBar";
import MobileNav from "@/components/MobileNav";
import { apiRequest } from "@/utils/apiRequest";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

/* ================= TYPES ================= */

type HistoryItem = {
    id: string;
    marketId: string;
    marketQuestion: string;
    outcomePicked: string;
    amountStaked: number;
    potentialWin: number;
    marketResult?: string | null;
    marketStatus?: string;
    userOutcome: "PENDING" | "WIN" | "LOSE";
    image?: string | null;
    date: string;
};

type HistoryCardItem = {
    id: string;
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
    const [totalStaked, setTotalStaked] = useState(0);
    const [totalPotentialWin, setTotalPotentialWin] = useState(0);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("All");

    /* ================= DERIVED FILTER ================= */

    const filteredItems = useMemo(() => {
        if (activeTab === "Ongoing") {
            return historyItems.filter(h => h.userOutcome === "PENDING");
        }
        if (activeTab === "Win") {
            return historyItems.filter(h => h.userOutcome === "WIN");
        }
        if (activeTab === "Lose") {
            return historyItems.filter(h => h.userOutcome === "LOSE");
        }
        return historyItems;
    }, [activeTab, historyItems]);

    /* ================= TOTAL WIN ================= */

    const totalWin = useMemo(() => {
        return historyItems
            .filter(item => item.userOutcome === "WIN")
            .reduce((sum, item) => sum + (item.potentialWin || 0), 0);
    }, [historyItems]);

    /* ================= FETCH ================= */

    const stats = useMemo(() => {
        let items = historyItems;

        if (activeTab === "Win") {
            items = historyItems.filter(i => i.userOutcome === "WIN");
        } else if (activeTab === "Lose") {
            items = historyItems.filter(i => i.userOutcome === "LOSE");
        } else if (activeTab === "Ongoing") {
            items = historyItems.filter(i => i.userOutcome === "PENDING");
        }

        const totalStaked = items.reduce(
            (sum, i) => sum + (i.amountStaked || 0),
            0
        );

        const totalWin = items
            .filter(i => i.userOutcome === "WIN")
            .reduce((sum, i) => sum + (i.potentialWin || 0), 0);

        const totalLoss = items
            .filter(i => i.userOutcome === "LOSE")
            .reduce((sum, i) => sum + (i.amountStaked || 0), 0);

        const totalPotentialWin = items.reduce(
            (sum, i) => sum + (i.potentialWin || 0),
            0
        );

        return {
            totalStaked,
            totalWin,
            totalLoss,
            totalPotentialWin,
        };
    }, [activeTab, historyItems]);



    useEffect(() => {
        const fetchHistory = async () => {
            setLoading(true);

            const { success, data } = await apiRequest(
                "/user_history/get_history",
                {
                    method: "GET",
                    showLoading: false,
                },
            );

            if (success && data?.history) {
                setHistoryItems(data.history);
                setTotalStaked(data.totalStaked);
                setTotalPotentialWin(data.totalPotentialWin);
            } else {
                setHistoryItems([]);
                setTotalStaked(0);
                setTotalPotentialWin(0);
            }

            setLoading(false);
        };

        fetchHistory();
    }, []);

    /* ================= TAB CLICK ================= */

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
    };

    /* ================= MAPPING ================= */

    const mappedItems: HistoryCardItem[] = filteredItems.map((item) => ({
        id: item.id,
        marketQuestion: item.marketQuestion || "Unknown Market",
        outcomePicked: item.outcomePicked || "N/A",
        amountStaked: item.amountStaked ?? 0,
        potentialWin: item.potentialWin ?? 0,
        userOutcome: item.userOutcome ?? "PENDING",
        image: item.image || undefined,
        date: item.date || new Date().toISOString(),
    }));

    /* ================= SKELETON ================= */

    const SkeletonCard = () => (
        <div className="w-full p-4 rounded-xl bg-[#111] border border-white/5 animate-pulse">
            <div className="h-10 w-1/2 bg-[#222] rounded mb-3"></div>
            <div className="h-8 w-1/3 bg-[#222] rounded mb-2"></div>
            <div className="h-8 w-1/4 bg-[#222] rounded"></div>
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


    /* ================= UI ================= */

    return (
        <>
            <MobileNav />
            <DownBar />

            <div className="p-5">
                {!historyItems.length ? (
                    <div className="flex flex-col items-center justify-center mt-20 text-center">
                        <Image
                            alt=""
                            width={120}
                            height={120}
                            src="/img/downbar/db3.svg"
                            className="grayscale opacity-60"
                        />

                        <p className="text-lg text-gray-400 cursor-pointer font-semibold">No history yet</p>
                        {/* <p className="text-gray-400 text-sm mt-2">
                            Start placing predictions to see them here
                        </p> */}
                    </div>
                ) : (
                    <>
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
                                            activeTab === tab ? "#FF394A" : "#0C0C0C",
                                        cursor: "pointer",
                                    }}
                                >
                                    {tab}
                                </motion.button>
                            ))}
                        </div>

                        {/* Stats */}
                        <div className="flex w-full rounded-lg items-center px-3 bg-[#090909] py-3 border border-white/5 justify-between">
                            <div>
                                <p className="text-[#8B8B8B] text-[12px]">Total Staked</p>
                                <motion.p
                                    key={stats.totalStaked}
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="font-semibold"
                                >
                                    ${stats.totalStaked.toFixed(2)}
                                </motion.p>
                            </div>

                            <div className="w-px h-10 bg-[#8b8b8b1c]" />

                            <AnimatePresence mode="wait">
                                {activeTab === "All" && (
                                    <motion.div
                                        key="all"
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -5 }}
                                        className="flex gap-6 mr-4"
                                    >
                                        <div>
                                            <p className="text-[#8B8B8B] text-[12px]">Potential Win</p>
                                            <p className="text-[#56CD00] font-semibold">
                                                ${stats.totalPotentialWin.toFixed(2)}
                                            </p>
                                        </div>

                                        <div className="w-px h-10 bg-[#8b8b8b1c]" />

                                        <div>
                                            <p className="text-[#8B8B8B] text-[12px]">Total Win</p>
                                            <p className="text-[#56CD00] font-semibold">
                                                ${stats.totalWin.toFixed(2)}
                                            </p>
                                        </div>
                                    </motion.div>
                                )}

                                {activeTab === "Win" && (
                                    <motion.div
                                        key="win"
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                    >
                                        <p className="text-[#8B8B8B] text-[12px]">Total Win</p>
                                        <p className="text-[#56CD00] font-semibold">
                                            ${stats.totalWin.toFixed(2)}
                                        </p>
                                    </motion.div>
                                )}

                                {activeTab === "Lose" && (
                                    <motion.div
                                        key="lose"
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                    >
                                        <p className="text-[#8B8B8B] text-[12px]">Total Loss</p>
                                        <p className="text-red-500 font-semibold">
                                            ${stats.totalLoss.toFixed(2)}
                                        </p>
                                    </motion.div>
                                )}

                                {activeTab === "Ongoing" && (
                                    <motion.div
                                        key="ongoing"
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                    >
                                        <p className="text-[#8B8B8B] text-[12px]">Potential Win</p>
                                        <p className="text-[#56CD00] font-semibold">
                                            ${stats.totalPotentialWin.toFixed(2)}
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Cards */}
                        <motion.div className="flex flex-col gap-3 mt-4">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex flex-col gap-3"
                                >
                                    {mappedItems.length ? (
                                        mappedItems.map((item) => (
                                            <motion.div
                                                key={item.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                            >
                                                <HistoryCard history={item} />
                                            </motion.div>
                                        ))
                                    ) : (
                                        <p className="text-center text-gray-400 mt-10">
                                            No items for this category
                                        </p>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </motion.div>
                    </>
                )}
            </div>
        </>
    );
}