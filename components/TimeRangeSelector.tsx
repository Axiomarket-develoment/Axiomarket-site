import { useRef, useEffect } from "react";

export default function TimeRangeSelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  const ranges = [
    { label: "1m", value: "1m" },
    { label: "5m", value: "5m" },
    { label: "15m", value: "15m" },
    { label: "1H", value: "1h" },
    { label: "1D", value: "1d" },
    { label: "1W", value: "1w" },
    { label: "1M", value: "1mo" },
    { label: "MAX", value: "max" },
  ];

  const containerRef = useRef<HTMLDivElement>(null);

  // optional: auto-scroll to active item
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const activeItem = el.querySelector("[data-active='true']");
    activeItem?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [value]);

  return (
    <div className="relative">
      {/* scrollable container */}
      <div
        ref={containerRef}
        className="flex  max-w-40 overflow-x-auto no-scrollbar whitespace-nowrap px-2 py-1"
      >
        {ranges.map((r) => (
          <div
            key={r.value}
            data-active={value === r.value}
            onClick={() => onChange(r.value)}
            className={`cursor-pointer text-xs shrink-0 px-2 py-1 rounded-md transition ${
              value === r.value ? "text-white" : "text-[#8B8B8B]"
            }`}
          >
            {r.label}
          </div>
        ))}
      </div>

      {/* subtle scroll hint fade */}
      <div className="absolute right-0 top-0 h-full w-6 bg-gradient-to-l from-black/80 to-transparent pointer-events-none" />
    </div>
  );
}