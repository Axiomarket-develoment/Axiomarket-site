"use client"

import Image from "next/image";
import React, { useState } from "react";
import { MdOutlineBookmarkBorder } from "react-icons/md";

const CategoriesFilter = () => {
    const filter1 = ["Trending", "Crypto", "Stocks", "Sports", "Politics", "Finance", "Entertainment", "Tech"];
    const filter2 = ["All Markets", "Avax", "Jesus", "BTC", "Ronaldo", "Donald Trump"];

    const [activeFilter1, setActiveFilter1] = useState(filter1[0]);
    const [activeFilter2, setActiveFilter2] = useState(filter2[0]);

    return (
        <div className="flex flex-col gap-4 w-full">

            {/* Filter 1 */}
            <div className="flex overflow-x-auto scrollbar-custom pb-2">
                {filter1.map((item) => (
                    <button
                        key={item}
                        onClick={() => setActiveFilter1(item)}
                        className={`
                            whitespace-nowrap text-sm flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-300 
                            transform
                            ${item === "Trending" ? "mr-3" : ""}
                            ${activeFilter1 === item 
                                ? "text-[#FF394A] font-semibold scale-105"
                                : "text-[#8B8B8B] hover:bg-white/10 hover:scale-105"}
                        `}
                    >
                        {item === "Trending" && (
                            <Image
                                width={20}
                                height={20}
                                alt=""
                                src={`/img/market/${item.toLowerCase()}.svg`}
                                className="transition-transform duration-300 ease-in-out"
                            />
                        )}
                        <p className="transition-colors duration-300">{item}</p>
                    </button>
                ))}
            </div>

            {/* Filter 2 */}
            <div className="flex scrollbar-custom overflow-x-auto gap-2 pb-2">
                <div className="bg-[#1E1E1E] ml-3 flex justify-center items-center rounded-md px-2 py-1.5
                                transition-transform duration-300 hover:scale-110 hover:bg-white/10">
                    <MdOutlineBookmarkBorder className="text-[#C8C8C8] text-2xl font-light transition-colors duration-300 hover:text-white" />
                </div>

                {filter2.map((item) => (
                    <button
                        key={item}
                        onClick={() => setActiveFilter2(item)}
                        className={`
                            whitespace-nowrap px-3 text-sm rounded-md transition-all duration-300 transform
                            ${activeFilter2 === item
                                ? "text-black bg-white scale-105 font-semibold shadow-md"
                                : "text-[#8B8B8B] hover:bg-white/20 hover:scale-105"}
                        `}
                    >
                        {item}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CategoriesFilter;