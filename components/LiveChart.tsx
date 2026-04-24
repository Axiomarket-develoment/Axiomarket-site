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

export function TradingViewRechart({
  coinId,
  interval,
}: {
  coinId: string;
  interval: string;
}) {
  const [data, setData] = useState<any[]>([]);

  function formatTime(timestamp: number, interval: string) {
    const date = new Date(timestamp);

    if (interval === "1m" || interval === "5m" || interval === "15m") {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }

    if (interval === "1h" || interval === "1d") {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }

    if (interval === "1w" || interval === "max") {
      return date.toLocaleDateString([], { month: "short", year: "2-digit" });
    }

    return date.toLocaleTimeString();
  }


  useEffect(() => {
    let intervalId: any;

    const fetchData = async () => {
      try {
        const { success, data: resp } = await apiRequest<{
          candles: any[];
        }>(
          `/user_market/chart/${coinId}?interval=${interval}`,
          { method: "GET", showLoading: false }
        );

        if (!success || !resp?.candles) return;
        const formatted = resp.candles.map((c) => ({
          time: c.time,
          open: c.open,
          high: c.high,
          low: c.low,
          close: c.close,
        }));

        setData(formatted.slice(-120));
      } catch (err) {
        console.error("Chart error:", err);
      }
    };

    fetchData();

    // refresh speed depends on interval
    const refreshMap: Record<string, number> = {
      "1m": 60000,
      "5m": 120000,
      "15m": 180000,
      "1h": 300000,
      "1d": 600000,
    };

    intervalId = setInterval(fetchData, refreshMap[interval] || 60000);

    return () => clearInterval(intervalId);
  }, [coinId, interval]);



  return (
    <ResponsiveContainer width="100%" height={400}>
      <ComposedChart
        data={data}
        margin={{ top: 10, right: 20, left: -24, bottom: 10 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
        <XAxis
          dataKey="time"
          tickFormatter={(value) => {
            const date = new Date(value);

            if (interval === "1m" || interval === "5m" || interval === "15m") {
              return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
            }

            if (interval === "1h" || interval === "1d") {
              return date.toLocaleDateString([], { month: "short", day: "numeric" });
            }

            return date.toLocaleDateString([], { month: "short", day: "numeric" });
          }}
          tick={{ fill: "#94a3b8", fontSize: 11 }}
          minTickGap={25}
          axisLine={{ stroke: "#334155" }}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "#94a3b8", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          domain={["auto", "auto"]}
          width={70}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#0f172a",
            border: "1px solid #334155",
            borderRadius: "8px",
          }}
          labelStyle={{ color: "#94a3b8" }}
          itemStyle={{ color: "#f8fafc" }}
        />
        <Line
          type="monotone"
          dataKey="close"
          stroke="#facc15"
          dot={false}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}