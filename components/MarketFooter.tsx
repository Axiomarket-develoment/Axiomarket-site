import Image from "next/image";
import CountdownTimer from "./CountdownTimer";
import { formatCompact } from "./MarketItem";

export function MarketFooter({ market, totalVolume, isSport }: any) {
    if (!isSport) return null;

    const tradeCount = market.subMarkets.reduce((acc: number, sub: any) => acc + sub.tradeCount, 0);

    return (
        <div className="flex justify-between px-4 text-[#8B8B8B] w-full text-sm">
            <div className="flex items-center gap-2">
                <Image src={'/img/market/total.svg'} className="w-6" alt="" width={100} height={100} />
                <p>{tradeCount} Trade</p>
                <p>${formatCompact(totalVolume)}</p>
            </div>

            {market.event && (
                <div className="text-sm flex items-center gap-2">
                    <img src="/img/market/clock.svg" alt="clock" />
                    <CountdownTimer endDate={market.endDate} />
                </div>
            )}
        </div>
    );
}