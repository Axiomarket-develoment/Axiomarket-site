import CountdownTimer from "./CountdownTimer";

export function CryptoInfo({ market }: { market: any }) {


    
    return (
        <div className="text-xs text-[#8B8B8B] gap-8 justify-between item-center space-y-1 flex">
            <div className="flex text-sm gap-8">
                <div>
                    <p>Target Price</p>
                    <p className="text-">${market.metadata.startPrice}</p>
                </div>
                <div className="w-px bg-[#8B8B8B] h-10" />
                <div>
                    <p>Current Price:</p>
                    <p>${market.metadata.targetPrice}</p>
                </div>
            </div>
            <div className="w-px bg-[#8B8B8B] h-10" />



            <div className="flex items-center gap-2">
                <img src="/img/market/clock.svg" alt="clock" />
                <CountdownTimer endDate={market.endDate} />
            </div>
        </div>
    );
}