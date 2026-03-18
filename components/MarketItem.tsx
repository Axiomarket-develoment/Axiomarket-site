import { type Market } from "@/data/market";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type Props = {
    market: Market;
};

const MarketItem: React.FC<Props> = ({ market }) => {
    const isSport = market.marketType === "SPORT";
    const isCrypto = market.marketType === "CRYPTO";


    const getTimeLeft = (endDate: string) => {
        const now = new Date().getTime();
        const end = new Date(endDate).getTime();

        const diff = end - now;

        if (diff <= 0) return "Ended";

        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(diff / (1000 * 60 * 60));

        if (hours > 0) return `${hours}h`;
        return `${minutes}m`;
    };
    const timeText = getTimeLeft(market.endDate);

    const formatCompact = (num: number) => {
        if (num >= 1_000_000) {
            return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
        }
        if (num >= 1_000) {
            return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
        }
        return num.toString();
    };

    const totalVolume = market.subMarkets.reduce(
        (acc, sub) => acc + sub.totalVolume,
        0
    );

    const singleSub =
        market.subMarkets.length === 1 &&
        market.subMarkets[0].question === market.question;

    const options = market.subMarkets[0].options;

    const oddsValues = options.map(opt => opt.odds || 0);

    const maxOdd = Math.max(...oddsValues);
    const minOdd = Math.min(...oddsValues);

    return (

        <Link href={`/market/${market.id}`}>

            <div className="bg-[#0C0C0C] text-white rounded-2xl p-3 relative overflow-hidden">

                {/* 🟣 CRYPTO BACKGROUND (DULL CHART) */}
                {isCrypto && (
                    <div className=" inset-0  mb-3">
                        <img
                            src={market.metadata?.chartImage}
                            alt="chart"
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}


                {/* 🟢 SPORT TEAMS */}
                {/* 🟢 SPORT TEAMS */}
                {isSport && market.event && market.event.participants && market.event.participantImages && (
                    <div className="flex items-center justify-between mb-3">
                        {/* Left Image */}
                        <img
                            src={market.event.participantImages[0]}
                            alt={market.event.participants[0]}
                            className="w-10 h-10"
                        />

                        {/* Center Text */}
                        <div className="flex items-center gap-2 text-sm font-semibold">
                            <span>{market.event.participants[0]}</span>
                            <span className="text-gray-400">vs</span>
                            <span>{market.event.participants[1]}</span>
                        </div>

                        {/* Right Image */}
                        <img
                            src={market.event.participantImages[1]}
                            alt={market.event.participants[1]}
                            className="w-10 h-10 "
                        />
                    </div>
                )}

                <div className="flex items-center gap-4 my-2">

                    {/* logo  */}
                    {isCrypto && (
                        <img
                            src={market.metadata?.assetLogo}
                            alt="logo"
                            className="w-6 h-6 mb-2"
                        />
                    )}

                    {/* 🧠 QUESTION */}
                    {!isSport && (
                        <h2 className="text-lg font-semibold mb-3 relative z-10">
                            {market.question}
                        </h2>
                    )}
                </div>


                {/* 📊 SUB MARKETS */}
                <div className="space-y-3 relative z-10">

                    {market.subMarkets.map((sub, i) => {
                        const oddsValues = sub.options.map(opt => opt.odds || 0);
                        const maxOdd = Math.max(...oddsValues);
                        const minOdd = Math.min(...oddsValues);

                        return (
                            <div key={i} className={`rounded-xl ${isSport ? "flex gap-2" : singleSub ? "flex gap-2" : "flex w-full items-center justify-between"}`}>
                                {!singleSub && !isSport && (
                                    <p className="text-sm mb-2">{sub.question}</p>
                                )}

                                <div className={`flex ${singleSub || isSport ? "w-full gap-2" : "w-1/2 gap-2"}`}>
                                    {sub.options.map((opt, j) => {
                                        const isMax = opt.odds === maxOdd;
                                        const isMin = opt.odds === minOdd;

                                        const textColor = maxOdd === minOdd
                                            ? "text-white"
                                            : isMax
                                                ? "text-[#FF394A]"
                                                : isMin
                                                    ? "text-[#56CD00]"
                                                    : "text-white";

                                        return (
                                            <button
                                                key={j}
                                                className={`flex-1 flex  ${!singleSub ? "w-full" : ""} font-semibold justify-center items-center gap-1 py-4 bg-[#222] hover:bg-[#333] transition p-1 rounded-md text-xs ${textColor}`}
                                            >
                                                <div>{opt.label}</div>
                                                <p>-</p>
                                                <div>{opt.odds}x</div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="flex item-center mb-4 justify-between text-xs text-[#8B8B8B]">
                    <div className="flex  my-4 gap-2 -mb-2 item-center">

                        <Image src={'/img/market/total.svg'} className="w-6 -mt-2" alt="" width={100} height={100} />
                        <p className="">{market.tradeCount} Trade</p>
                        <p className="">{market.subMarkets.reduce((acc, sub) => acc + sub.tradeCount, 0)}</p>
                        <p>${formatCompact(totalVolume)}</p>
                    </div>
                    <div className="flex mt-4 gap-2 -mb-2 items-center">
                        <p>
                            {timeText === "Ended" ? "Ended" : `Ends in ${timeText}`}
                        </p>
                        <Image
                            src="/img/market/save.svg"
                            className="w-6"
                            alt=""
                            width={100}
                            height={100}
                        />
                    </div>
                </div>

            </div>

        </Link>
    );
};

export default MarketItem;