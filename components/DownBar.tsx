"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import toast from "react-hot-toast";

type DownBarItem = {
    label: string;
    path: string;
    icon: string;
};

const DownBar = () => {
    const router = useRouter();
    const pathname = usePathname();
    const [clicked, setClicked] = React.useState<string | null>(null);

    const downbars: DownBarItem[] = [
        { label: "Market", path: "/market", icon: "/img/downbar/db1.svg" },
        { label: "P2P", path: "/p2p", icon: "/img/downbar/db2.svg" },
        { label: "History", path: "/history", icon: "/img/downbar/db3.svg" },
        { label: "Profile", path: "/profile", icon: "/img/downbar/db4.svg" },
    ];
   const handleClick = (item: DownBarItem) => {
    if (item.path === "/history") {
        const user = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        if (!user || !token) {
            toast("Please login to continue");

            setTimeout(() => {
                router.push("/login");
            }, 800);

            return;
        }
    }

    router.push(item.path);
};

    return (
        <div className="fixed bottom-8 left-0 w-full flex justify-center md:hidden z-40">
            <div className="rounded-[40px] p-[1px] bg-[linear-gradient(92.38deg,#FF394A_0%,rgba(96,96,96,0.05)_100%)]">
                <div className="bg-[#0D0D0D] w-full max-w-fit py-1.5 rounded-[39px] flex items-center justify-around px-1">

                    {downbars.map((item) => {
                        const normalize = (p: string) => p.replace(/\/$/, "");

                        const isActive =
                            normalize(pathname).includes(normalize(item.path)) ||
                            clicked === item.path;
                            

                        return (
                            <div
                                key={item.label}
                                onClick={() => handleClick(item)}
                                className="flex items-center gap-2 cursor-pointer px-2 py-2 rounded-full transition-all duration-300"
                            >
                                <img src={item.icon} alt={item.label} className="w-5 h-5" />

                                <span
                                    className={`text-[#FF394A] whitespace-nowrap transition-all duration-300
                                    ${isActive
                                            ? "max-w-[120px] opacity-100"
                                            : "max-w-0 opacity-0 overflow-hidden"
                                        }`}
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