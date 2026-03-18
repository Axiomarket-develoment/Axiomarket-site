"use client"

import Image from 'next/image'
import React from 'react'
import { IoIosArrowRoundBack } from "react-icons/io";
import { usePathname, useRouter } from "next/navigation";



const MobileNav = () => {


    const userBalance = "0.001"
    const pathname = usePathname();
    const router = useRouter();

    const isMarketPage = pathname === "/market";
    return (
        <div className="flex justify-between w-full p-4" >

            {
                isMarketPage ? (

                    <Image
                        width={100}
                        height={100}
                        alt=''
                        src={"/img/market/logofull.svg"}
                    />
                )

                    : (

                        <button
                            onClick={() => router.back()}
                            className="flex items-center gap-2 text-sm font-medium"
                        >
                            <span>←</span>
                            <span>Back</span>
                        </button>
                    )
            }



            <div className=" px-2 py-1 gap-2 flex rounded-full text-sm font-medium transition-colors duration-300"
                style={{
                    border: "1px solid transparent",
                    background:
                        "linear-gradient(#0D0D0D, #0D0D0D) padding-box, linear-gradient(90deg, rgba(255,255,255,0.5), #262626, #000000) border-box",
                }}>
                <Image
                    width={20}
                    height={100}
                    alt=""
                    src="/img/market/avax.svg"
                />
                <p className='text-sm font-light'>{userBalance}</p>
            </div>
        </div>
    )
}

export default MobileNav