import Image from "next/image";
import TimeRangeSelector from "./TimeRangeSelector";

export function MarketStats({
    market,
    totalVolume,
    interval,
    setInterval,
}: {
    market: any;
    totalVolume: number;
    interval: string;
    setInterval: (v: string) => void;
}) {
    const tradeCount = market.subMarkets.reduce(
        (acc: number, sub: any) => acc + sub.tradeCount,
        0
    );

    return (
        <div className="flex mb-3 -mt-8 text-sm text-[#8B8B8B] justify-between items-center gap-2">
            <div className="flex items-center gap-2">
                <p>{tradeCount} Trade</p>
                <p>${totalVolume}</p>
            </div>

            <TimeRangeSelector value={interval} onChange={setInterval} />
        </div>
    );
}