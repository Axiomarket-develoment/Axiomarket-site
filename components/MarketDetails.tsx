"use client"; // important, because we are using hooks
import { useState } from "react";
import { useSearchParams } from "next/navigation";

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

export default function MarketDetails({ market, logo }: any) {
    const [activeTab, setActiveTab] = useState<Tab>("Chart");
    const [modalData, setModalData] = useState<{
        outcome: string | null;
        odds: number | null;
        subMarketId?: string;
    } | null>(null);

    const isSport = market.marketType === "SPORT";
    const isCrypto = market.marketType === "CRYPTO";

    const totalVolume = market.subMarkets.reduce((acc: number, sub: any) => acc + sub.totalVolume, 0);
    const singleSub = market.subMarkets.length === 1 && market.subMarkets[0].question === market.question;

    const handleSelectOption = (data: any) => {
        setModalData({ ...data });
    };

    return (
        <div className="space-y-6 px-4 pb-35">
            {/* Market Header */}
            <MarketHeader market={market} isCrypto={isCrypto} logo={logo} />

            {/* Crypto chart */}
            {isCrypto && market.metadata?.asset && <TradingViewRechart coinId={market.metadata.asset} />}
            {isCrypto && <MarketStats market={market} totalVolume={totalVolume} />}

            {/* Sticky Tabs */}
            <div className="sticky top-0 z-50  backdrop-blur-sm pt-2">
                <Tabs activeTab={activeTab} onChange={setActiveTab} />
            </div>

            <div className="sticky top-16 z-50  pt-2 backdrop-blur-sm">
                <SubMarkets
                    subMarkets={market.subMarkets}
                    isSport={isSport}
                    singleSub={singleSub}
                    market={market}
                    onSelectOption={handleSelectOption} // ✅ pass callback
                />
            </div>

            {/* Trigger Order Modal */}
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

            {/* Other tab content */}
            {activeTab === "AI" && <AiInsight market={market} />}
            {activeTab === "Chat" && <UserChat conversationId={market.conversationId} />}
            {activeTab === "Chart" && isCrypto && market.metadata && <CryptoInfo market={market} />}
            {isSport && <SportTeams event={market.event} />}
            {market.marketType === "SOCIAL" && <SocialInfo market={market} />}
            <MarketFooter market={market} totalVolume={totalVolume} isSport={isSport} />
        </div>
    );
}