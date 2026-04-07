"use client";

import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  Line,
  CartesianGrid,
} from "recharts";
import { apiRequest } from "@/utils/apiRequest";

type CandleData = {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
};

type Props = { coinId: string };

export function TradingViewRechart({ coinId }: Props) {
  const [data, setData] = useState<CandleData[]>([]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    const fetchData = async () => {
      try {
        const { success, data: resp } = await apiRequest<{ prices: [number, number][] }>(
          `/user_market/chart/${coinId}`,
          { method: "GET", showLoading: false }
        );

        if (!success || !resp?.prices) return;

        const candles = resp.prices.map(([timestamp, price]) => ({
          time: new Date(timestamp).toLocaleTimeString(),
          open: price,
          high: price,
          low: price,
          close: price,
        }));

        setData(candles.slice(-100));
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
    interval = setInterval(fetchData, 60000); // 🔥 match backend limit

    return () => clearInterval(interval);
  }, [coinId]);
  return (
    <ResponsiveContainer width="100%" height={400}>
      <ComposedChart data={data}>
        <CartesianGrid stroke="#334155" />
        <XAxis dataKey="time" tick={{ fill: "#f1f5f9" }} />
        <YAxis tick={{ fill: "#f1f5f9" }} domain={['dataMin', 'dataMax']} />
        <Tooltip
          contentStyle={{ backgroundColor: "#1e293b", border: "none" }}
          itemStyle={{ color: "#f1f5f9" }}
        />
        {/* High-Low as bar */}
        <Bar
          dataKey="high"
          fill="#4ade80"
          shape={(props: any) => {
            const { x, y, width, height, payload } = props;
            const lowY = props.y + props.height;
            const highY = props.y;
            return (
              <line
                x1={x + width / 2}
                y1={highY}
                x2={x + width / 2}
                y2={lowY}
                stroke="#000000"
                strokeWidth={2}
              />
            );
          }}
        />
        {/* Close price line */}
        <Line type="monotone" dataKey="close" stroke="#facc15" dot={false} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}