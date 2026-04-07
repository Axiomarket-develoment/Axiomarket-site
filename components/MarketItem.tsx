import { type Market } from "@/data/market";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import TriggerOrderModal from "./TriggerOrderModal";
import { Loader2 } from "lucide-react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import toast from "react-hot-toast";



type Props = {
    market: Market;
    userOrders: any[];
};

type Outcome = {
    label: string | number;
    odds?: number | string;
    count?: number;
    liquidity?: number;
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



const getTimeLeft = (endDate: string) => {
    const now = new Date().getTime();
    const end = new Date(endDate).getTime();

    const diff = end - now;

    if (diff <= 0) return "Ended";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return `${hours}h ${minutes}m ${seconds}s`;
};

const MarketItem: React.FC<Props> = ({ market, userOrders }) => {
    const [modalOpen, setModalOpen] = useState(false);

    // Keep all your original states
    const isSport = market.marketType === "SPORT";
    const isCrypto = market.marketType === "CRYPTO";

    const [timeLeft, setTimeLeft] = useState(getTimeLeft(market.endDate));

    const [logo, setLogo] = useState<string | null>(null);
    const [selectedOutcome, setSelectedOutcome] = useState<string | null>(null);
    const [selectedOdds, setSelectedOdds] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [imgLoading, setImgLoading] = useState(true);


    useEffect(() => {
        if (!isCrypto || !market.metadata?.asset) return;

        const coinIdRaw = market.metadata.asset;
        const coinId = coinIdRaw.toLowerCase() === "avalanche" ? "avalanche-2" : coinIdRaw;

        let mounted = true; // prevent state updates after unmount
        setLoading(true);

        fetch(`https://api.coingecko.com/api/v3/coins/${coinId}`)
            .then(res => {
                if (!res.ok) throw new Error("Coin not found");
                return res.json();
            })
            .then(data => {
                if (!mounted) return;
                setLogo(data.image.thumb);
            })
            .catch(() => mounted && setLogo(null))
            .finally(() => mounted && setLoading(false));

        return () => {
            mounted = false;
        };
    }, [isCrypto, market.metadata?.asset]);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(getTimeLeft(market.endDate));
        }, 1000); // update every second

        return () => clearInterval(interval); // cleanup on unmount
    }, [market.endDate]);

    const totalVolume = market.subMarkets.reduce(
        (acc, sub) => acc + sub.totalVolume,
        0
    );
    const timeText = getTimeLeft(market.endDate);


    const singleSub =
        market.subMarkets.length === 1 &&
        market.subMarkets[0].question === market.question;

    // New function: handle option click
    const handleOptionClick = (e: React.MouseEvent, outcome: string, odds: number) => {
        e.stopPropagation();

        // Check if market ended
        if (getTimeLeft(market.endDate) === "Ended") {
            // Show toast instead
            if (typeof window !== "undefined") {
                // Replace with your toast library if you have one
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
                    onClose={closeModal}
                    market={market}
                    logo={logo}
                    outcome={selectedOutcome}
                    odds={selectedOdds}
                    endDate={market.endDate} // ✅ pass raw endDate instead (better)
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
                        <Link href={{
                            pathname: `/market/${market.id}`,
                            query: { logo: logo || "" }
                        }}>
                            <h2 className="text-sm font-semibold mb-3 relative z-10">
                                {market.question}
                            </h2>
                        </Link>
                    )}
                </div>

                {/* SUB MARKETS */}
                <div className="space-y-3 relative z-10">
                    {market.subMarkets.map((sub, i) => {
                        const options: MarketOption[] = sub.outcomes.map((o: Outcome) => ({
                            label: String(o.label),
                            odds: Number(o.odds ?? 1), // force number
                        }));

                        const oddsValues = options.map((opt) => opt.odds ?? 0);
                        const maxOdd = Math.max(...oddsValues);
                        const minOdd = Math.min(...oddsValues);

                        return (
                            <div
                                key={i}
                                className={`rounded-xl ${isSport ? "flex gap-2" : singleSub ? "flex gap-2" : "flex w-full items-center justify-between"
                                    }`}
                            >
                                {!singleSub && !isSport && <p className="text-sm mb-2">{sub.question}</p>}

                                <div className="flex w-full gap-2">
                                    {options.map((opt, j) => {
                                        const isMax = opt.odds === maxOdd;
                                        const isMin = opt.odds === minOdd;

                                        const textColor =
                                            maxOdd === minOdd
                                                ? "text-white"
                                                : isMax
                                                    ? "text-[#56CD00]"
                                                    : isMin
                                                        ? "text-[#FF394A]"
                                                        : "text-white";

                                        const userOrderForOption = userOrders.find((o) => {
                                            const orderSubId = o.subMarketId;
                                            const orderMarketId = o.marketId;

                                            const orderLabel = o.side === "BUY" ? "YES" : o.side === "SELL" ? "NO" : "";

                                            // Normalize both sides to string & uppercase
                                            if (String(opt.label).toUpperCase() !== orderLabel) return false;

                                            if (orderSubId && sub._id && orderSubId.toString() === sub._id.toString()) return true;

                                            if (orderMarketId && orderMarketId.toString() === market.id.toString()) return true;

                                            return false;
                                        });

                                        let statusIndicator = null;
                                        if (userOrderForOption) {
                                            if (userOrderForOption.status === "OPEN" || userOrderForOption.status === "PARTIAL") {
                                                statusIndicator = <div className="flex gap-1">
                                                    {/* <span className="w-2 h-2 bg-[#56CD00] rounded-full animate-pulse"></span> */}
                                                    <span className="w-2 h-2 bg-[#938e00] rounded-full animate-pulse animation-delay-150"></span>
                                                    {/* <span className="w-2 h-2 bg-white rounded-full animate-pulse animation-delay-300"></span> */}
                                                </div>

                                            } else if (userOrderForOption.status === "FILLED") {
                                                statusIndicator = <div className="ml-2 text-green-400 font-bold">✅</div>;
                                            }
                                        }


                                        return (
                                            <button
                                                key={j}
                                                onClick={(e) => handleOptionClick(e, opt.label, opt.odds)}
                                                className={`flex-1 w-full flex ${!singleSub ? "w-full" : ""} font-semibold justify-center items-center gap-1 py-4 bg-[#222] hover:bg-[#333] transition p-1 rounded-md text-xs ${textColor} relative z-20`}
                                            >
                                                <div>{opt.label}</div>
                                                <p>-</p>
                                                <div>{opt.odds % 1 === 0 ? `${opt.odds}.0` : opt.odds}x</div>
                                                {/* {statusIndicator && <div className="absolute right-2 top-2">{statusIndicator}</div>} */}

                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>




                {/* FOOTER */}
                <Link href={{
                    pathname: `/market/${market.id}`,
                    query: { logo: logo || "" }
                }}>
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
                            <p>{timeText === "Ended" ? "Ended" : `Ends in ${timeText}`}</p>
                            <Image
                                src="/img/market/save.svg"
                                className="w-6"
                                alt=""
                                width={100}
                                height={100}
                            />
                        </div>
                    </div>
                </Link>
            </div>
        </>
    );
};

export default MarketItem;