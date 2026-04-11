import { type Market } from "@/data/market";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import TriggerOrderModal from "./TriggerOrderModal";

import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { apiRequest } from "@/utils/apiRequest";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";


import { useRouter } from "next/navigation";
import SuccessScreen from "./SuccessScreen";


type Props = {
    market: Market;
    userOrders: any[];
    initialSaved?: boolean;
    onToggleSaved?: (marketId: string, isSaved: boolean) => void;
};

type Outcome = {
    label: string;
    odds?: number;
    count?: number;
    liquidity?: number;
    pool?: number;
    volume?: number;
};


export const formatCompact = (num: number) => {
    if (num >= 1_000_000) {
        return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
    }
    if (num >= 1_000) {
        return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
    }
    return num.toString();
};



type MarketOption = {
    label: string;
    odds: number;
};



const getTimeLeft = (endDate: string, status?: string) => {
    // 🔥 PRIORITY CHECK
    if (status === "SETTLED") return "Settled";

    const now = new Date().getTime();
    const end = new Date(endDate).getTime();

    const diff = end - now;

    if (diff <= 0) return "Ended";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return `${hours}h ${minutes}m ${seconds}s`;
};

const MarketItem: React.FC<Props> = ({ market, userOrders, onToggleSaved, initialSaved = false }) => {
    const [modalOpen, setModalOpen] = useState(false);

    // Keep all your original states
    const isSport = market.marketType === "SPORT";
    const isCrypto = market.marketType === "CRYPTO";

    const [timeLeft, setTimeLeft] = useState(
        getTimeLeft(market.endDate, market.status)
    );
    const [logo, setLogo] = useState<string | null>(null);
    const [selectedOutcome, setSelectedOutcome] = useState<string | null>(null);
    const [selectedOdds, setSelectedOdds] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [imgLoading, setImgLoading] = useState(true);
    const router = useRouter();
    const [isSaved, setIsSaved] = useState(initialSaved);
    const [logoCache, setLogoCache] = useState<Record<string, string>>({});
    const [showSuccess, setShowSuccess] = useState(false);

    const LOGO_STORAGE_KEY = "logoCache";

    const handleSaveClick = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (loading) return;

        setLoading(true);
        const action = isSaved ? "unsave" : "save";
        const token = localStorage.getItem("token");

        const { success } = await apiRequest(`/user_market/save_market`, {
            method: "POST",
            body: { marketId: market._id, action, token }, // ✅ include token in body
            showLoading: false,
        });

        if (success) {
            const newState = !isSaved;
            setIsSaved(newState);

            onToggleSaved?.(market._id, newState); // 🔥 THIS IS THE KEY

            toast.success(`Market ${action === "save" ? "saved" : "unsaved"} ✅`);
        }

        else {
            toast.error("Failed to update saved market ⚠️");
        }
        setLoading(false);
    };

    useEffect(() => {
        setIsSaved(initialSaved);
    }, [initialSaved]);

    const handleMarketClick = () => {
        // Save market to localStorage
        localStorage.setItem("selectedMarket", JSON.stringify(market));

        // Navigate to details page with _id and logo in query params
        router.push(`/market/details?_id=${market.id}&logo=${logo || ""}`);
    };

    useEffect(() => {
        if (!isCrypto || !market.metadata?.asset) return;

        const coinIdRaw = market.metadata.asset;
        const coinId = coinIdRaw.toLowerCase() === "avalanche" ? "avalanche-2" : coinIdRaw.toLowerCase();

        const LOGO_STORAGE_KEY = "logoCache";

        // Get the existing cache
        const cacheStr = localStorage.getItem(LOGO_STORAGE_KEY);
        const cache: Record<string, string> = cacheStr ? JSON.parse(cacheStr) : {};

        // Already cached? Use it
        if (cache[coinId]) {
            setLogo(cache[coinId]);
            setLoading(false);
            return;
        }

        let intervalId: NodeJS.Timeout;

        const fetchLogo = async () => {
            try {
                const res = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}`);
                const data = await res.json();

                if (data?.image?.thumb) {
                    setLogo(data.image.thumb);
                    setLoading(false);

                    // Update cache
                    const updatedCache = { ...cache, [coinId]: data.image.thumb };
                    localStorage.setItem(LOGO_STORAGE_KEY, JSON.stringify(updatedCache));

                    // Stop the retry loop
                    if (intervalId) clearInterval(intervalId);
                }
            } catch (err) {
                // fail silently, retry will happen automatically
                console.log("Logo fetch failed, retrying in 3s...");
            }
        };

        // Initial fetch
        fetchLogo();

        // Retry every 3 seconds until successful
        intervalId = setInterval(fetchLogo, 3000);

        // Clean up on unmount
        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [isCrypto, market.metadata?.asset]);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(getTimeLeft(market.endDate, market.status));
        }, 1000);

        return () => clearInterval(interval);
    }, [market.endDate, market.status]);

    const totalVolume = market.subMarkets.reduce(
        (acc, sub) => acc + sub.totalVolume,
        0
    );
    const timeText = getTimeLeft(market.endDate, market.status);

    const singleSub =
        market.subMarkets.length === 1 &&
        market.subMarkets[0].question === market.question;

    // New function: handle option click
    const handleOptionClick = (e: React.MouseEvent, outcome: string, odds: number) => {
        e.stopPropagation();

        // 🔒 Check if user is logged in
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("user");

        if (!token || !user) {
            // Not logged in → redirect to /login
            router.push("/login");
            return;
        }

        // Check if market ended
        if (getTimeLeft(market.endDate) === "Ended") {
            if (typeof window !== "undefined") {
                toast("⚠️ Market has ended. You cannot place orders.");
            }
            return; // Exit early
        }

        // Otherwise, open modal
        setSelectedOutcome(outcome);  // store "YES" or "NO"
        setSelectedOdds(odds);        // store the odds for that option
        setModalOpen(true);
    };
    // Total trades across all subMarkets & outcomes
    // Total trades
    const totalTrades = market.subMarkets.reduce(
        (acc, sub) => acc + (sub.tradeCount || 0),
        0
    );
    // Total liquidity
    const totalLiquidity = market.subMarkets.reduce(
        (accSub, sub) =>
            accSub +
            sub.outcomes.reduce((accOutcome: number, o: Outcome) => accOutcome + Number(o.liquidity ?? 0), 0),
        0
    );

    const closeModal = () => setModalOpen(false);
    return (
        <>
            {modalOpen && (
                <TriggerOrderModal
                    onClose={() => setModalOpen(false)}
                    onSuccess={() => setShowSuccess(true)} // ✅ trigger success overlay
                    market={market}
                    logo={logo}
                    outcome={selectedOutcome}
                    odds={selectedOdds}
                    endDate={market.endDate}
                />
            )}

            {showSuccess && (
                <SuccessScreen
                    isOpen={showSuccess}
                    onClose={() => setShowSuccess(false)}
                />
            )}
            <div className="relative bg-[#0C0C0C] text-white rounded-2xl p-3 overflow-hidden">
                {/* Wrap only the clickable area (excluding buttons) */}
                {/* <Link href={`/market/${market.id}`}>
                    <div className="absolute inset-0 z-0" />
                </Link> */}
                <div className="flex items-center  gap-2">


                    {/* CRYPTO LOGO */}
                    {isCrypto && (
                        <div className="relative mb-2 w-10 h-10 rounded-full overflow-hidden">
                            {/* Skeleton / Loading placeholder */}
                            {imgLoading && (
                                <div className="absolute inset-0 bg-gray-800 animate-pulse" />
                            )}

                            <Image
                                src={logo || "/img/logo2.svg"} // fallback if logo not yet fetched
                                alt="logo"
                                width={40}
                                height={40}
                                className={`w-10 h-10  rounded-full object-cover`}
                                onLoadingComplete={() => setImgLoading(false)} // hide skeleton when loaded
                            />
                        </div>
                    )}

                    {/* QUESTION */}
                    {!isSport && (
                        <div onClick={handleMarketClick}>

                            <h2 className="text-sm font-semibold mb-3 relative z-10">
                                {market.question}
                            </h2>
                        </div>

                    )}
                </div>

                {/* SUB MARKETS */}
                <div className="space-y-3 relative z-10">
                    {market.subMarkets.map((sub, i) => {
                        const options: MarketOption[] = sub.outcomes.map((o: Outcome) => ({
                            label: String(o.label),
                            odds: Number(o.odds ?? 1),
                        }));

                        const pools = sub.outcomes.map((o) => Number(o.pool ?? 0));
                        const totalPool = pools.reduce((a: any, b: any) => a + b, 0);

                        const minPercentage = 35; // minimum visible percent

                        let percentages: number[] = [];

                        if (totalPool === 0) {
                            // If no liquidity at all, split equally
                            percentages = new Array(options.length).fill(100 / options.length);
                        } else {
                            // Calculate raw percentages
                            const rawPercentages = pools.map((p: number) => (p / totalPool) * 100);

                            // Count how many are below the minimum
                            const belowMin = rawPercentages.filter((p: number) => p < minPercentage).length;
                            const totalExtra = belowMin * minPercentage; // total space these options need

                            const totalAboveMin = rawPercentages
                                .filter((p: number) => p >= minPercentage)
                                .reduce((a: any, b: any) => a + b, 0);

                            percentages = rawPercentages.map((p: number) => {
                                if (p < minPercentage) return minPercentage;
                                // Scale down the bigger ones to keep total 100
                                return p - ((p - minPercentage) / totalAboveMin) * totalExtra;
                            });
                        }

                        return (
                            <div key={i} className={`rounded-xl ${isSport ? "flex gap-2" : singleSub ? "flex gap-2" : "flex w-full items-center justify-between"}`}>
                                {!singleSub && !isSport && <p className="text-sm mb-2">{sub.question}</p>}

                                <div className="flex w-full gap-2">
                                    {options.map((opt, j) => {
                                        const percentage = percentages[j];
                                        const formattedPercentage = percentage.toFixed(0);

                                        const maxPool = Math.max(...pools);
                                        const minPool = Math.min(...pools);

                                        const textColor =
                                            maxPool === minPool
                                                ? "text-white"
                                                : pools[j] === maxPool
                                                    ? "text-[#56CD00]"
                                                    : pools[j] === minPool
                                                        ? "text-[#FF394A]"
                                                        : "text-white";

                                        return (
                                            <button
                                                key={j}
                                                onClick={(e) => handleOptionClick(e, opt.label, opt.odds)}
                                                className={`flex-1 w-full flex justify-center items-center gap-1 py-4 bg-[#222] hover:bg-[#333] transition p-1 rounded-md text-xs ${textColor} relative z-20`}
                                            >
                                                <div>{opt.label}</div>
                                                <p>-</p>
                                                <span className="opacity-70">{formattedPercentage}%</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* FOOTER */}

                <div className="flex item-center mb-4 justify-between text-xs text-[#8B8B8B] relative z-10">
                    <div className="flex my-4 gap-2 -mb-2 item-center">
                        <Image
                            src={"/img/market/total.svg"}
                            className="w-6 -mt-2"
                            alt=""
                            width={100}
                            height={100}
                        />
                        {/* Total trades across all subMarkets */}
                        <p>{totalTrades}</p>
                        <p>${formatCompact(totalVolume)}</p>
                    </div>

                    <div className="flex mt-4 gap-2 -mb-2 items-center">
                        <p>
                            {timeText === "Settled"
                                ? "Settled"
                                : timeText === "Ended"
                                    ? "Ended"
                                    : `Ends in ${timeText}`}
                        </p>
                        <motion.div
                            className="cursor-pointer w-6 h-6 flex items-center justify-center text-gray-600"
                            onClick={handleSaveClick}
                            whileTap={{ scale: 0.8 }}
                            whileHover={{ scale: 1.2 }}
                            animate={{ rotate: isSaved ? 360 : 0, scale: isSaved ? 1.2 : 1 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                            {isSaved ? <FaBookmark size={15} color="#C8C8C8" /> : <FaRegBookmark size={16} color="#C8C8C8" />}
                        </motion.div>
                    </div>
                </div>

            </div>
        </>
    );
};

export default MarketItem;