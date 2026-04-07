import Image from "next/image";
import TimeRangeSelector from "./TimeRangeSelector";

export function MarketStats({ market, totalVolume }: { market: any; totalVolume: number }) {
    const tradeCount = market.subMarkets.reduce((acc: number, sub: any) => acc + sub.tradeCount, 0);
    return (
        <div className="flex mb-3 -mt-5 text-sm text-[#8B8B8B] justify-between items-center gap-2">
            <div className="flex items-center gap-2">
                <Image src={'/img/market/total.svg'} className="w-6" alt="" width={100} height={100} />
                <p>{tradeCount} Trade</p>
                <p>${totalVolume}</p>
            </div>
            <TimeRangeSelector />
        </div>
    );
}