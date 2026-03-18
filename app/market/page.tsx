import CategoriesFilter from "@/components/CategoriesFilter";
import DownBar from "@/components/DownBar";
import Markets from "@/components/Markets";
import MobileNav from "@/components/MobileNav";
import Image from "next/image";
import React from "react";


export const metadata = {
    title: "AxioMarket || Markets",
    description: "All active markets",
};

export default function MarketsPage() {
    return (

        <div>

            <div className='fixed inset-0 bg-[#000000] opacity-90 lg:hidden block z-10' />
            <div className="absolute inset-0 lg:hidden z-0">
                <Image
                    src="/img/waitlist/wlbg.svg"
                    alt="Background"
                    fill
                    className="object-cover"
                    priority
                />
            </div>
            <div className="relative z-20 flex flex-col min-h-[60px]">
                <MobileNav />
                <CategoriesFilter />
                <Markets />




                <DownBar />
            </div>

        </div>
    )
}