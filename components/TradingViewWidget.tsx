"use client";

import { useEffect, useRef } from "react";

declare global {
    interface Window {
        TradingView: any;
    }
}

export default function TradingViewWidget({
    symbol = "BINANCE:SOLUSDT",
    interval = "1",
}: {
    symbol?: string;
    interval?: string;
}) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        container.innerHTML = "";

        const script = document.createElement("script");
        script.src = "https://s3.tradingview.com/tv.js";
        script.async = true;

        script.onload = () => {
            if (!window.TradingView) return;

            new window.TradingView.widget({
                container_id: container.id,
                width: "100%",
                height: 400,
                symbol,
                interval,
                timezone: "Etc/UTC",
                theme: "dark",
                style: "1",
                locale: "en",
            });
        };

        container.appendChild(script);

        return () => {
            container.innerHTML = "";
        };
    }, [symbol, interval]);

    return <div id="tradingview_container" ref={containerRef} />;
}