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

    const filter1 = ["Trending", "Crypto", "Meme Coins", "Sports", "Stocks", "X", "Politics", "Entertainment"];

    const filterMap: Record<string, string[]> = {
        Trending: ["All Markets", "$AVAX", "$BTC", "$ETH", "Chelsea", "Oil", "Trump", "Tesla", "Apple"],
        Crypto: ["All Markets", "$AVAX", "$BTC", "$ETH", "$SOL", "$BNB", "$SUI"],
        "Meme Coins": ["All Markets", "$DOGE", "$SHIB"],
        Sports: ["All Markets", "Man Utd", "Real Madrid", "Barcelona", "Chelsea", "Bayern Munich", "Juventus", "Inter Milan", "Napoli", "Liverpool"],
        Stocks: ["All Markets", "MTN", "GTBank", "Dangote Cement", "BUA Foods", "Apple", "Microsoft", "Alphabet", "Tesla", "Meta"],
        X: ["All Markets", "Ronaldo", " Fabrizio Romano", "United Stand"],
        Webx: ["All Markets", "Xeus", "Papa Kyenn", " Maliel", "Sensei", "Wale Moca"],
        Politics: ["All Markets", "Donald Trump", "Tinubu"],
        Entertainment: ["All Markets", "Wizkid", "Rema", "Davido", "Burna Boy", "Justin Bieber"],
    };

    const [activeFilter1, setActiveFilter1] = useState(filter1[0]);
    const [activeFilter2, setActiveFilter2] = useState("All Markets");

    const filter2 = filterMap[activeFilter1] || ["All Markets"];

    return (
        <div className="flex  flex-col gap-2 w-full">

            {/* Filter 1 */}
            <div className="flex overflow-x-auto lg:overflow-visible scrollbar-custom pb-2 lg:flex-wrap lg:gap-3">
                {filter1.map((item) => (
                    <button
                        key={item}
                        onClick={() => {
                            setActiveFilter1(item);
                            setActiveCategory(item);
                            setActiveSubCategory("All Markets");
                            setActiveFilter2("All Markets");
                            setShowSavedOnly(false);
                        }}
                        className={`whitespace-nowrap flex items-center gap-2 rounded-full transition-all duration-300 transform
              px-3 py-2 text-sm
              lg:px-4 lg:py-2.5 lg:text-base
              ${item === "Trending" ? "mr-3 lg:mr-0" : ""}
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
            <div className="flex scrollbar-custom overflow-x-auto lg:overflow-visible gap-2 lg:gap-3 pb-2 lg:flex-wrap items-center">

                {/* Bookmark */}
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
                    className={`ml-3 lg:ml-0 relative rounded-full
    bg-gradient-to-r from-[#1B1B1B] to-[#181818]
    p-[1px] shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]
    transition-transform duration-300 hover:scale-110
    ${showSavedOnly ? " ring-[#fff]" : ""}`}
                >
                    <div className="bg-[#1E1E1E] rounded-full flex justify-center items-center px-2 py-2 relative w-9 h-9 lg:w-11 lg:h-11">
                        <MdOutlineBookmarkBorder
                            className={`absolute text-2xl transition-all duration-300
        ${showSavedOnly ? "opacity-0 scale-75" : "opacity-100 scale-100 text-[#C8C8C8]"}`}
                        />
                        <MdBookmark
                            className={`absolute text-2xl transition-all duration-300
        ${showSavedOnly ? "opacity-100 scale-100 text-[#fff]" : "opacity-0 scale-75"}`}
                        />
                    </div>
                </div>

                {/* Sub Filters */}
                {filter2.map((item) => (
                    <button
                        key={item}
                        onClick={() => {
                            setActiveSubCategory(item);
                            setActiveFilter2(item);
                            setShowSavedOnly(false);
                        }}
                        className={`whitespace-nowrap rounded-full transition-all duration-300 transform
  px-3 py-2.5 text-sm
  lg:px-4 lg:py-3 lg:text-base
  ${!showSavedOnly && activeFilter2 === item
                                ? "text-[#E4E4E4] bg-[#0C0C0C] scale-105 font-semibold shadow-md"
                                : "text-[#8B8B8B] hover:bg-white/20 hover:scale-105"
                            }`}
                    >
                        {item}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CategoriesFilter;