// app/market/page.tsx
"use client";

import dynamic from "next/dynamic";

const MarketClient = dynamic(() => import("./MarketClient"), { ssr: false });

export default function Page() {
  return <MarketClient />;
}