export const MarketSkeleton = () => {
  return (
    <div className="bg-[#0C0C0C] rounded-2xl p-4 animate-pulse border border-[#1a1a1a]">
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-[#1a1a1a]" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-2/3 bg-[#1a1a1a] rounded" />
          <div className="h-2 w-1/3 bg-[#1a1a1a] rounded" />
        </div>
      </div>

      {/* Chart / Main Block */}
      <div className="h-24 w-full bg-[#1a1a1a] rounded-xl mb-4" />

      {/* Options (YES / NO style buttons) */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="h-10 bg-[#1a1a1a] rounded-lg" />
        <div className="h-10 bg-[#1a1a1a] rounded-lg" />
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center">
        <div className="h-3 w-1/4 bg-[#1a1a1a] rounded" />
        <div className="h-3 w-1/5 bg-[#1a1a1a] rounded" />
      </div>
    </div>
  );
};