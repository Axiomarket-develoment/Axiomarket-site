"use client";

import { useEffect, useState } from "react";
import { CryptoInfo } from "./CryptoInfo";
import { TradingViewRechart } from "./LiveChart";
import { MarketFooter } from "./MarketFooter";
import { MarketHeader } from "./MarketHeader";
import { MarketStats } from "./MarketStats";
import { Tab, Tabs } from "./MarketTabs";
import { SocialInfo } from "./SocialInfo";
import { SportTeams } from "./SportTeams";
import { SubMarkets } from "./SubMarkets";
import AiInsight from "./AiInsight";
import TriggerOrderModal from "./TriggerOrderModal";
import UserChat from "./ChatRoom";
import TradingViewWidget from "./TradingViewWidget";

function normalizeAsset(asset: string) {
    return asset
        ?.toLowerCase()
        ?.replace("$", "")
        ?.trim();
}

function mapToTradingViewSymbol(asset: string) {
    const clean = normalizeAsset(asset);

    const map: Record<string, string> = {
        bitcoin: "BINANCE:BTCUSDT",
        btc: "BINANCE:BTCUSDT",

        ethereum: "BINANCE:ETHUSDT",
        eth: "BINANCE:ETHUSDT",

        solana: "BINANCE:SOLUSDT",
        sol: "BINANCE:SOLUSDT",

        dogecoin: "BINANCE:DOGEUSDT",
        doge: "BINANCE:DOGEUSDT",

        avalanche: "BINANCE:AVAXUSDT",
        avax: "BINANCE:AVAXUSDT",

        "avalanche-coin": "BINANCE:AVAXUSDT",

        binancecoin: "BINANCE:BNBUSDT",
        bnb: "BINANCE:BNBUSDT",
    };

    return map[clean] || "BINANCE:BTCUSDT";
}

function convertInterval(interval: string) {
    const map: Record<string, string> = {
        "1m": "1",
        "5m": "5",
        "15m": "15",
        "1h": "60",
        "1d": "D",
    };

    return map[interval] || "5";
}

export default function MarketDetails({ market, logo }: any) {
    const [activeTab, setActiveTab] = useState<Tab>("Chart");
    const [modalData, setModalData] = useState<any>(null);
    const [userId, setUserId] = useState<string | null>(null); // 👈 ADD THIS
    const [interval, setInterval] = useState("5m");

    // ✅ GET USER FROM LOCAL STORAGE
    useEffect(() => {
        const userStr = localStorage.getItem("user");

        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                if (user?._id) {
                    setUserId(user._id);
                } else {
                    console.warn("User has no _id");
                }
            } catch (err) {
                console.error("Failed to parse user", err);
            }
        }
    }, []);

    const isSport = market.marketType === "SPORT";
    const isCrypto = market.marketType === "CRYPTO";

    const totalVolume = market.subMarkets.reduce(
        (acc: number, sub: any) => acc + sub.totalVolume,
        0
    );

    const singleSub =
        market.subMarkets.length === 1 &&
        market.subMarkets[0].question === market.question;

    const handleSelectOption = (data: any) => {
        setModalData({ ...data });
    };

    return (
        <div className="space-y-6 px-4 pb-35">

            {/* ✅ FIXED HERE */}
            <MarketHeader
                market={market}
                userId={userId}   // 👈 CORRECT USER ID
                isCrypto={isCrypto}
                logo={logo}
            />

            {isCrypto && market.metadata?.asset && (
                <TradingViewWidget
                    key={mapToTradingViewSymbol(market.metadata.asset)}
                    symbol={mapToTradingViewSymbol(market.metadata.asset)}
                    interval={convertInterval(interval)}
                />
            )}

            {isCrypto && (
                <MarketStats
                    market={market}
                    totalVolume={totalVolume}
                    interval={interval}
                    setInterval={setInterval}
                />)}

            <div className=" z-50 backdrop-blur-sm pt-2">
                <Tabs activeTab={activeTab} onChange={setActiveTab} />
            </div>

            <div className=" z-50 pt-2 backdrop-blur-sm">
                <SubMarkets
                    subMarkets={market.subMarkets}
                    isSport={isSport}
                    singleSub={singleSub}
                    market={market}
                    onSelectOption={handleSelectOption}
                />
            </div>

            {modalData && (
                <TriggerOrderModal
                    onClose={() => setModalData(null)}
                    market={market}
                    logo={logo}
                    outcome={modalData.outcome}
                    odds={modalData.odds}
                    endDate={market.endDate}
                />
            )}

            <div style={{ display: activeTab === "AI" ? "block" : "none" }}>
                <AiInsight market={market} />
            </div>

            {activeTab === "Chat" && (
                <UserChat conversationId={market.conversationId} />
            )}

            {activeTab === "Chart" && isCrypto && market.metadata && (
                <CryptoInfo market={market} />
            )}

            {isSport && <SportTeams event={market.event} />}
            {market.marketType === "SOCIAL" && (
                <SocialInfo market={market} />
            )}

            <MarketFooter
                market={market}
                totalVolume={totalVolume}
                isSport={isSport}
            />
        </div>
    );
}