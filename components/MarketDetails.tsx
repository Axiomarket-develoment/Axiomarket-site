"use client";

import { useState } from "react";
import { Market } from "@/data/market";

type Props = {
    market: Market;
};

export default function MarketDetails({ market }: Props) {
    const [selected, setSelected] = useState<{
        subIndex: number;
        optIndex: number;
    } | null>(null);

    const isSport = market.marketType === "SPORT";
    const isCrypto = market.marketType === "CRYPTO";
    return (
        <div className="space-y-6">

            {/* 🔥 MARKET LEVEL INFO */}
            <div className="p-4 rounded-xl bg-[#111] space-y-2">
                <h1 className="text-xl font-bold">{market.question}</h1>



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

                <p className="text-sm text-gray-400">
                    {new Date(market.startDate).toLocaleString()} →{" "}
                    {new Date(market.endDate).toLocaleString()}
                </p>

                {/* 🪙 CRYPTO */}
                {market.marketType === "CRYPTO" && market.metadata && (
                    <div className="text-sm space-y-1">
                        <p>Asset: {market.metadata.asset}</p>
                        <p>Start Price: ${market.metadata.startPrice}</p>
                        <p>Target Price: ${market.metadata.targetPrice}</p>
                        <p>Direction: {market.metadata.direction}</p>
                    </div>
                )}

                {/* ⚽ SPORT */}
                {market.marketType === "SPORT" && market.event && (
                    <div className="text-sm">
                        <p>{market.event.participants?.[0]} vs {market.event.participants?.[1]}</p>
                        <p>League: {market.event.league}</p>
                        <p>Kickoff: {market.event.startTime}</p>
                    </div>
                )}

                {/* 🌍 SOCIAL */}
                {market.marketType === "SOCIAL" && (
                    <div className="text-sm">
                        <p>Public sentiment driven market</p>
                        <p>Duration: {market.durationMinutes} mins</p>
                    </div>
                )}
            </div>

            {/* 📊 SUB MARKETS */}
            {market.subMarkets.map((sub, i) => {
                const totalLiquidity = sub.options.reduce((acc, o) => acc + o.liquidity, 0);

                return (
                    <div key={i} className="border p-4 rounded-xl space-y-3">
                        <h2 className="font-bold text-lg">{sub.question}</h2>

                        {/* 🧠 SUB STATS */}
                        <div className="text-xs text-gray-400 flex gap-4">
                            <p>Status: {sub.status}</p>
                            <p>Volume: ${sub.totalVolume}</p>
                            <p>Trades: {sub.tradeCount}</p>
                            <p>Liquidity: ${totalLiquidity}</p>
                        </div>

                        {/* 🎯 OPTIONS */}
                        <div className="flex gap-2">
                            {sub.options.map((opt, j) => {
                                const probability = opt.odds ? (1 / opt.odds) * 100 : 0;

                                return (
                                    <button
                                        key={j}
                                        onClick={() => setSelected({ subIndex: i, optIndex: j })}
                                        className="px-4 py-2 bg-[#222] rounded-lg hover:bg-[#333] text-sm"
                                    >
                                        {opt.label} ({opt.odds}x)
                                    </button>
                                );
                            })}
                        </div>

                        {/* 🔍 OPTION DETAILS */}
                        {selected?.subIndex === i && (() => {
                            const opt = sub.options[selected.optIndex];
                            const probability = opt.odds ? (1 / opt.odds) * 100 : 0;

                            return (
                                <div className="mt-4 p-4 bg-[#111] rounded-lg text-sm space-y-2">
                                    <p><strong>Option:</strong> {opt.label}</p>
                                    <p><strong>Odds:</strong> {opt.odds}x</p>
                                    <p><strong>Implied Probability:</strong> {probability.toFixed(2)}%</p>
                                    <p><strong>Liquidity:</strong> ${opt.liquidity}</p>
                                    <p><strong>Volume:</strong> ${opt.volume}</p>
                                    <p><strong>Trades:</strong> {opt.count}</p>

                                    {/* 💰 SIMPLE PNL PREVIEW */}
                                    <div className="pt-2 border-t border-gray-700">
                                        <p className="text-xs text-gray-400">If you bet $100:</p>
                                        <p className="font-semibold">
                                            Potential Return: ${(100 * (opt.odds || 0)).toFixed(2)}
                                        </p>
                                    </div>

                                    {/* 🏁 RESULT (if settled) */}
                                    {opt.result !== undefined && (
                                        <p>
                                            Result:{" "}
                                            {opt.result === null
                                                ? "Pending"
                                                : opt.result
                                                    ? "Won"
                                                    : "Lost"}
                                        </p>
                                    )}
                                </div>
                            );
                        })()}
                    </div>
                );
            })}
        </div>
    );
}