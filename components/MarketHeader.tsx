"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface MarketHeaderProps {
    market: any;
    isCrypto: boolean;
    logo?: string | null; // <-- optional logo from props
}

export function MarketHeader({ market, isCrypto, logo: propLogo }: MarketHeaderProps) {
    const [logo, setLogo] = useState<string | null>(propLogo || null);
    const [loading, setLoading] = useState(!propLogo); // if we have propLogo, no need to show loading
    const [bookmarked, setBookmarked] = useState(false);

    useEffect(() => {
        const coinIdRaw = market.metadata?.assetId || market.metadata?.asset;
        if (!isCrypto || !coinIdRaw) return;

        // Special case for Avalanche
        const coinId = coinIdRaw.toLowerCase() === "avalanche" ? "avalanche-2" : coinIdRaw;

        setLoading(true);
        fetch(`https://api.coingecko.com/api/v3/coins/${coinId}`)
            .then((res) => {
                if (!res.ok) throw new Error("Coin not found");
                return res.json();
            })
            .then((data) => setLogo(data.image.thumb))
            .catch(() => {
                if (propLogo) setLogo(propLogo); // fallback to prop logo if fetch fails
                else setLogo(null);
            })
            .finally(() => setLoading(false));
    }, [isCrypto, market.metadata, propLogo]);

    return (
        <div className="flex items-center justify-between w-full gap-4">
            <div className="flex items-center gap-2">
                {isCrypto && (
                    <div
                        className={`w-12 h-12 rounded-full overflow-hidden bg-gray-800 flex items-center justify-center ${
                            loading ? "animate-pulse" : ""
                        }`}
                    >
                        <Image
                            src={
                                logo ||
                                "https://via.placeholder.com/52x52.png?text=?"
                            }
                            alt="logo"
                            width={52}
                            height={52}
                        />
                    </div>
                )}

                {isCrypto && (
                    <h1 className="text-sm max-w-52 font-bold flex-1">{market.question}</h1>
                )}
            </div>

            {/* Animated Bookmark */}
            <motion.div
                className="w-8 h-8 cursor-pointer relative"
                onClick={() => setBookmarked(!bookmarked)}
                whileTap={{ scale: 0.9 }}
            >
                {/* Outline Bookmark */}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="#f1f5f9"
                    className="w-8 h-8 absolute top-0 left-0"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 5v16l7-5 7 5V5a2 2 0 00-2-2H7a2 2 0 00-2 2z"
                    />
                </svg>

                {/* Filled Bookmark */}
                <AnimatePresence>
                    {bookmarked && (
                        <motion.svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            className="w-8 h-8 absolute top-0 left-0"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            fill="#FF394A"
                        >
                            <path d="M5 5v16l7-5 7 5V5a2 2 0 00-2-2H7a2 2 0 00-2 2z" />
                        </motion.svg>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}