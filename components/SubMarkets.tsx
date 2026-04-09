"use client";

import { toast } from "react-hot-toast";

// Helper to get time left
const getTimeLeft = (endDate: number | string) => {
  const now = new Date().getTime();
  const end = new Date(endDate).getTime();
  const diff = end - now;

  if (diff <= 0) return "Ended";

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return `${hours}h ${minutes}m ${seconds}s`;
};

export function SubMarkets({
  subMarkets,
  isSport,
  singleSub,
  onSelectOption,
  market,
}: any) {
  return (
    <div className="space-y-3 relative z-10">
      {subMarkets.map((sub: any, i: number) => {
        // ✅ Calculate liquidity per submarket
        const totalLiquidity = sub.outcomes?.reduce(
          (acc: number, o: any) => acc + Number(o.pool || 0),
          0
        );

        return (
          <div
            key={i}
            className={`rounded-xl ${isSport
                ? "flex gap-2"
                : singleSub
                  ? "flex gap-2"
                  : "flex w-full items-center justify-between"
              }`}
          >
            {!singleSub && !isSport && (
              <p className="text-sm mb-2">{sub.question}</p>
            )}

            <div
              className={`flex w-full ${singleSub || isSport ? "w-full gap-4" : "w-1/2 gap-2"
                }`}
            >
              {sub.outcomes?.map((opt: any, j: number) => {
                const liquidity = Number(opt.liquidity || 0);

                // ✅ Default = 50%
                let percentage = 50;

                if (totalLiquidity > 0) {
                  percentage = (liquidity / totalLiquidity) * 100;
                }

                const formattedPercentage = percentage.toFixed(0);

                // ✅ Determine max/min for coloring
                const percentages = sub.outcomes.map((o: any) =>
                  totalLiquidity > 0
                    ? (Number(o.liquidity || 0) / totalLiquidity) * 100
                    : 50
                );

                const max = Math.max(...percentages);
                const min = Math.min(...percentages);

                const isMax = percentage === max;
                const isMin = percentage === min;

                const textColor =
                  totalLiquidity === 0
                    ? "text-white"
                    : isMax
                      ? "text-[#56CD00]"
                      : isMin
                        ? "text-[#FF394A]"
                        : "text-white";

                const handleClick = (e: React.MouseEvent) => {
                  e.stopPropagation();

                  if (getTimeLeft(market.endDate) === "Ended") {
                    toast("⚠️ Market has ended. You cannot place orders.");
                    return;
                  }

                  onSelectOption?.({
                    outcome: opt.label,
                    odds: opt.odds,
                    subMarketId: sub._id,
                  });
                };

                return (
                  <button
                    key={j}
                    onClick={handleClick}
                    className={`flex-1 flex ${!singleSub ? "w-full" : ""
                      } font-semibold justify-center items-center py-4 bg-[#0C0C0C] hover:bg-[#333] transition rounded-full text-xs ${textColor}`}
                  >
                    <div className="flex gap-1 items-center">
                      <span>{opt.label}</span>
                      <p>-</p>
                      <span className=" opacity-70">
                        {formattedPercentage}%
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}