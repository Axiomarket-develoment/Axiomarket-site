"use client"

import Image from "next/image";
import React, { useState } from "react";
import { MdOutlineBookmarkBorder, MdBookmark } from "react-icons/md";


interface Props {
    activeCategory: string;
    setActiveCategory: (cat: string) => void;
    activeSubCategory: string;
    setActiveSubCategory: (sub: string) => void;
    showSavedOnly: boolean;
    setShowSavedOnly: (val: boolean) => void;
}

const CategoriesFilter: React.FC<Props> = ({
    activeCategory,
    setActiveCategory,
    activeSubCategory,
    setActiveSubCategory,
    showSavedOnly,
    setShowSavedOnly,
}) => {
    const filter1 = ["Trending", "Crypto", "Stocks", "Sports", "Politics", "Finance", "Entertainment", "Tech"];
    const filter2 = ["All Markets", "Avax", "Jesus", "BTC", "Ronaldo", "Donald Trump"];

    const [activeFilter1, setActiveFilter1] = useState(filter1[0]);
    const [activeFilter2, setActiveFilter2] = useState(filter2[0]);

    return (
        <div className="flex flex-col gap- w-full">
            {/* Filter 1 */}
            <div className="flex overflow-x-auto scrollbar-custom pb-2">
                {filter1.map((item) => (
                    <button
                        key={item}
                        onClick={() => {
                            setActiveFilter1(item); // for local UI
                            setActiveCategory(item); // notify parent
                        }}
                        className={`whitespace-nowrap text-sm flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-300 transform
              ${item === "Trending" ? "mr-3" : ""}
              ${activeFilter1 === item ? "text-[#FF394A] font-semibold scale-105" : "text-[#8B8B8B] hover:bg-white/10 hover:scale-105"}
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



            <div className="flex scrollbar-custom overflow-x-auto gap-1 pb-2 items-center">
                {/* Bookmark button */}
                <div
                    onClick={() => {
                        const next = !showSavedOnly;
                        setShowSavedOnly(next);

                        if (next) {
                            setActiveSubCategory("All Markets");
                            setActiveFilter2("All Markets");
                        }
                    }}

                    style={{
                        border: "1px solid transparent",
                        background:
                            "linear-gradient(#0D0D0D, #0D0D0D) padding-box, linear-gradient(90deg, rgba(255,255,255,0.5), #262626, #000000) border-box",
                    }}

                    className={`ml-3  relative rounded-full
    bg-gradient-to-r from-[#1B1B1B] to-[#181818]
    p-[1px] shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]
    transition-transform duration-300 hover:scale-110
    ${showSavedOnly ? " ring-[#fff]" : ""}`}
                >
                    <div className="bg-[#1E1E1E] rounded-full flex justify-center items-center px-2 py-2 relative w-9 h-9">

                        {/* Outline Icon */}
                        <MdOutlineBookmarkBorder
                            className={`absolute text-2xl transition-all duration-300
        ${showSavedOnly ? "opacity-0 scale-75" : "opacity-100 scale-100 text-[#C8C8C8]"}`}
                        />

                        {/* Filled Icon */}
                        <MdBookmark
                            className={`absolute text-2xl transition-all duration-300
        ${showSavedOnly ? "opacity-100 scale-100 text-[#fff]" : "opacity-0 scale-75"}`}
                        />

                    </div>
                </div>
                {/* Other subcategory buttons */}
                {filter2.map((item) => (
                    <button
                        key={item}
                        onClick={() => {
                            setActiveSubCategory(item);
                            setShowSavedOnly(false); // optional: reset saved filter
                        }}
                        className={`whitespace-nowrap px-3 py-2.5 text-sm rounded-full transition-all duration-300 transform
  ${!showSavedOnly && activeSubCategory === item
                                ? "text-[#E4E4E4] bg-[#0C0C0C] scale-105 font-semibold shadow-md"
                                : "text-[#8B8B8B] hover:bg-white/20 hover:scale-105"
                            }`}    >
                        {item}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CategoriesFilter;