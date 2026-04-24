"use client"

import Image from 'next/image'
import React, { useState } from 'react'
import { motion } from 'framer-motion'

const Waitlist = () => {
    const [email, setEmail] = useState("")

    return (
        <>
            <div className="hidden lg:block absolute right-0 top-0 h-full w-1/2">
                <Image
                    src="/img/waitlist/wlbg.svg"
                    alt="Background"
                    fill
                    className="object-cover"
                    priority
                />
            </div>
            <div className="relative h-[100dvh] lg:justify-center lg:mt-54 lg:ml-32 flex flex-col overflow-hidden">

                {/* Background for mobile */}
                <div className="absolute inset-0 lg:hidden">
                    <Image
                        src="/img/waitlist/wlbg.svg"
                        alt="Background"
                        fill
                        className="object-cover"
                        priority
                    />
                </div>

                {/* Right-side image for desktop */}

                <div className='fixed inset-0 bg-[#050505] opacity-60 lg:block hidden z-0' />
                {/* Logo Top */}
                <div className=" lg:hidden z-10 px-10 pt-8">
                    <Image
                        src="/img/logofull.svg"
                        alt="Logo"
                        width={200}
                        height={40}
                        className="object-contain"
                    />
                </div>
                <div className=" hidden lg:flex z-10 px-10 pt-8">
                    <Image
                        src="/img/home/logofull.svg"
                        alt="Logo9"
                        width={200}
                        height={40}
                        className="object-contain"
                    />
                </div>

                {/* Main Content */}
                <div className="relative lg:hidden z-10 h-full flex flex-col justify-end  px-6 lg:px-20 flex-1 text-white max-w-xl">

                    <h1 className="text-3xl lg:text-5xl font-bold leading-tight">
                        Waitlist
                    </h1>

                    <p className="mt-4 text-2xl font-semibold lg:text-base 
               bg-gradient-to-r 
               from-[#343434] 
               via-[#505050] 
               to-[#8B8B8B] 
               bg-clip-text 
               text-transparent">
                        Take your Finance From Zero to Hero
                    </p>
                    <p className="mt-4 text-sm lg:text-base text-gray-300">
                        Next gen prediction market. AxioMarket is coming soon to transform how you make predictions and give you more leverage in the market.
                    </p>

                    <div className='flex justify-stretch  lg:flex-row mb-12 gap-2 items-center mt-8 w-full'>

                        <motion.input
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6, duration: 0.6 }}
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full lg:w-80 placeholder:text-[#8B8B8B] text-[#8B8B8B] placeholder:text-xs rounded-[10px] bg-black text-white px-4 py-3 focus:outline-none "
                        />

                        <motion.button
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8, duration: 0.6 }}
                            className='lg:mt-0 bg-[white] w-1/3  text-xs text-[#050505] font-semibold rounded-[10px] px-2 py-3.5 hover:bg-[#00c800] t transition-colors duration-200'
                        >
                            Join Waitlist
                        </motion.button>

                    </div>
                </div>
                <div className="relative hidden lg:block z-10 h-full  flex-col justify-end  px-6 lg:px-10 flex-1 text-white max-w-xl">

                    <h1 className="text-3xl lg:text-5xl font-bold leading-tight">
                        Waitlist
                    </h1>

                    <p className="mt-4 text-2xl font-semibold lg:text-5xl 
               bg-gradient-to-r 
               from-[#343434] 
               via-[#505050] 
               to-[#8B8B8B] 
               bg-clip-text 
               text-transparent">
                        Take your Finance From Zero to Hero
                    </p>
                    <p className="mt-4 text-sm lg:text-base text-gray-300">
                        Next gen prediction market. AxioMarket is coming soon to transform how you make predictions and give you more leverage in the market.
                    </p>

                    <div className='flex justify-stretch  lg:flex-row mb-12 gap-2 items-center mt-8 w-full'>

                        <motion.input
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6, duration: 0.6 }}
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full lg:w-130 placeholder:text-[#8B8B8B] placeholder:lg:text-[16px]  lg:text-[16px] text-[#8B8B8B] placeholder:text-xs rounded-[10px] bg-black text-white px-4 py-3 focus:outline-none "
                        />

                        <motion.button
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8, duration: 0.6 }}
                            className='lg:mt-0 bg-[white] w-1/3 lg:w-[30%]  text-xs text-[#050505] lg:text-base font-semibold rounded-[10px] px-2 lg:py-2.5 py-3.5 hover:bg-[#00c800] t transition-colors duration-200'
                        >
                            Join Waitlist
                        </motion.button>

                    </div>
                </div>

            </div>
        </>
    )
}

export default Waitlist