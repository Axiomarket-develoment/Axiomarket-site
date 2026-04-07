"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

type DownBarItem = {
    label: string;
    path: string;
    icon: string;
};

const DownBar = () => {
    const router = useRouter();
    const pathname = usePathname(); // current path
    const [active, setActive] = useState<string>("");

    const downbars: DownBarItem[] = [
        { label: "Market", path: "/market", icon: "/img/downbar/db1.svg" },
        { label: "P2P", path: "/market", icon: "/img/downbar/db2.svg" },
        { label: "History", path: "/history", icon: "/img/downbar/db3.svg" },
        { label: "Profile", path: "/market", icon: "/img/downbar/db4.svg" },
    ];

    // Update active based on current pathname
    useEffect(() => {
        const match = downbars.find(item => pathname.startsWith(item.path));
        if (match) setActive(match.label);
    }, [pathname]);

    const handleClick = (item: DownBarItem) => {
        router.push(item.path);
        setActive(item.label);
    };

    return (
        <div className="fixed bottom-8 left-0 w-full flex justify-center md:hidden z-40">
            {/* Gradient border wrapper */}
            <div className="rounded-[40px] p-[1px] bg-[linear-gradient(92.38deg,#FF394A_0%,rgba(96,96,96,0.05)_100%)]">
                {/* Inner navbar */}
                <div className="bg-[#0D0D0D] w-full max-w-fit py-1.5 rounded-[39px] flex items-center justify-around px-1">
                    {downbars.map((item) => {
                        const isActive = active === item.label;
                        return (
                            <div
                                key={item.label}
                                onClick={() => handleClick(item)}
                                className={`flex items-center gap-2 cursor-pointer transition-all duration-300 px-3 py-2 rounded-full`}
                            >
                                <img src={item.icon} alt={item.label} className="w-5 h-5" />
                                <span
                                    className={`text-[#FF394A] transition-all duration-600 overflow-hidden whitespace-nowrap ${isActive ? "max-w-[120px] opacity-100" : "max-w-0 opacity-0"}`}
                                >
                                    {item.label}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default DownBar;