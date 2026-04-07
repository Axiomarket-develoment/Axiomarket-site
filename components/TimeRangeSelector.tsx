import { useState } from "react";

export default function TimeRangeSelector() {
  const [active, setActive] = useState("1D"); // default active

  const ranges = ["1H", "1D", "1W", "1M", "MAX"];

  return (
    <div className="flex gap-2">
      {ranges.map((range) => (
        <div
          key={range}
          onClick={() => setActive(range)}
          className={`cursor-pointer rounded ${
            active === range ? " text-white" : "text-[#8B8B8B]"
          }`}
        >
          {range}
        </div>
      ))}
    </div>
  );
}