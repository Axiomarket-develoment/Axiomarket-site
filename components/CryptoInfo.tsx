import CountdownTimer from "./CountdownTimer";

export function CryptoInfo({ market }: { market: any }) {

    const formatPrice = (value: number | string) => {
        const num = Number(value);
        if (isNaN(num)) return "0";
        return num.toFixed(5).replace(/\.?0+$/, "");
    };

    return (
        <div className="text-xs lg:text-sm xl:text-base text-[#8B8B8B] gap-8 justify-between item-center space-y-1 flex">

            <div className="flex items-center gap-8">
                <div>
                    <p className="lg:text-sm xl:text-base">Target Price</p>                    <p className="lg:text-lg xl:text-xl font-semibold text-white">
                        ${formatPrice(market.metadata.startPrice)}
                    </p>
                </div>

                <div className="w-px bg-[#8B8B8B] h-10" />

                <div>
                    <p className="lg:text-sm xl:text-base">Current Price:</p>                    <p className="lg:text-lg xl:text-xl font-semibold text-white">
                        ${formatPrice(market.metadata.targetPrice)}
                    </p>
                </div>
            </div>

            <div className="w-px bg-[#8B8B8B] h-10" />

            <div className="flex items-center gap-2 lg:text-sm xl:text-base">                <img src="/img/market/clock.svg" alt="clock" />
                <CountdownTimer endDate={market.endDate} />
            </div>
        </div>
    );
}