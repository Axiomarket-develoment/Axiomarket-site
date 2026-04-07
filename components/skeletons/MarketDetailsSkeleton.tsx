"use client";
import React from "react";

export function MarketDetailsSkeleton() {
    return (
        <div className="space-y-6 px-4 pb-35 animate-pulse">
            {/* Header skeleton */}
            <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-[#0C0C0C] rounded-full" />
                <div className="flex-1 space-y-2">
                    <div className="h-4 bg-[#0C0C0C] rounded w-3/4" />
                    <div className="h-3 bg-[#0C0C0C] rounded w-1/2" />
                </div>
            </div>

            {/* Chart skeleton */}
            <div className="w-full h-40 bg-[#0C0C0C] rounded-xl" />

            {/* Stats skeleton */}
            <div className="flex gap-4">
                <div className="flex-1 h-10 bg-[#0C0C0C] rounded-xl" />
                <div className="flex-1 h-10 bg-[#0C0C0C] rounded-xl" />
                <div className="flex-1 h-10 bg-[#0C0C0C] rounded-xl" />
            </div>

            {/* Tabs skeleton */}
            <div className="flex gap-2 mt-4">
                <div className="w-20 h-8 bg-[#0C0C0C] rounded-full" />
                <div className="w-20 h-8 bg-[#0C0C0C] rounded-full" />
                <div className="w-20 h-8 bg-[#0C0C0C] rounded-full" />
            </div>

            {/* SubMarkets skeleton */}
            <div className="space-y-3 mt-4">
                {[1, 2, 3].map((_, i) => (
                    <div key={i} className="flex gap-2">
                        <div className="flex-1 h-12 bg-[#0C0C0C] rounded-full" />
                        <div className="flex-1 h-12 bg-[#0C0C0C] rounded-full" />
                        <div className="flex-1 h-12 bg-[#0C0C0C] rounded-full" />
                    </div>
                ))}
            </div>

            {/* Footer skeleton */}
            <div className="w-full h-12 bg-[#0C0C0C] rounded-xl mt-6" />
        </div>
    );
}