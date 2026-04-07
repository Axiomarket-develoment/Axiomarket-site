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

export function SubMarkets({ subMarkets, isSport, singleSub, onSelectOption, market }: any) {
  return (
    <div className="space-y-3 relative z-10">
      {subMarkets.map((sub: any, i: number) => {
        const oddsValues = sub.outcomes?.map((opt: any) => opt.odds || 0) || [];
        const maxOdd = Math.max(...oddsValues);
        const minOdd = Math.min(...oddsValues);

        return (
          <div
            key={i}
            className={`rounded-xl ${
              isSport ? "flex gap-2" : singleSub ? "flex gap-2" : "flex w-full items-center justify-between"
            }`}
          >
            {!singleSub && !isSport && <p className="text-sm mb-2">{sub.question}</p>}

            <div className={`flex w-full ${singleSub || isSport ? "w-full gap-4" : "w-1/2 gap-2"}`}>
              {sub.outcomes?.map((opt: any, j: number) => {
                const isMax = opt.odds === maxOdd;
                const isMin = opt.odds === minOdd;
                const textColor =
                  maxOdd === minOdd ? "text-white" : isMax ? "text-[#56CD00]" : isMin ? "text-[#FF394A]" : "text-white";

                const handleClick = (e: React.MouseEvent) => {
                  e.stopPropagation();

                  // Check if market has ended
                  if (getTimeLeft(market.endDate) === "Ended") {
                    if (typeof window !== "undefined") {
                      toast("⚠️ Market has ended. You cannot place orders.");
                    }
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
                    className={`flex-1 flex ${!singleSub ? "w-full" : ""} font-semibold justify-center items-center gap-1 py-4 bg-[#0C0C0C] hover:bg-[#333] transition p-1 rounded-full text-xs ${textColor}`}
                    onClick={handleClick}
                  >
                    <div>{opt.label}</div>
                    <p>-</p>
                    <div>{opt.odds % 1 === 0 ? `${opt.odds}.0` : opt.odds}x</div>
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