"use client"

import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { apiRequest } from '@/utils/apiRequest'

const Waitlist = () => {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)

  const [percentage, setPercentage] = useState(10)
  const [slotsLeft, setSlotsLeft] = useState(null)


  useEffect(() => {
    const fetchStats = async () => {
      const { success, data } = await apiRequest(
        "/user_ambassador/ambassador_stats",
        { method: "GET" }
      );

      if (success) {
        setSlotsLeft(data.ambassadorSlots);
        setPercentage(data.percent); // 🔥 IMPORTANT
      }
    };

    fetchStats();
  }, []);


  const refreshStats = async () => {
    const { success, data } = await apiRequest(
      "/user_ambassador/ambassador_stats",
      { method: "GET" }
    );

    if (success) {
      setSlotsLeft(data.ambassadorSlots);
      setPercentage(data.percent);
    }
  };

  
  const handleJoinWaitlist = async () => {
    if (!email) {
      toast.error("Please enter your email")
      return
    }

    setLoading(true)
    const { success } = await apiRequest("/user_ambassador/ambassador_register", {
      method: "POST",
      body: { email },
      showSuccess: true,
    })
    setLoading(false)

    if (success) {
      setEmail("")
      refreshStats();
    }
  }

  return (
    <>
      {/* Backgrounds */}
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
        <div className="absolute inset-0 lg:hidden">
          <Image
            src="/img/waitlist/wlbg.svg"
            alt="Background"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className='fixed inset-0 bg-[#050505] opacity-60 lg:block hidden z-0' />

        {/* Logo */}
        <div className=" lg:hidden z-10 px-6 pt-8">
          <Image
            src="/img/home/logofull.svg"
            alt="Logo"
            width={200}
            height={40}
            className="object-contain"
          />
        </div>
        <div className=" hidden lg:flex z-10 px-6 pt-8">
          <Image
            src="/img/logofull.svg"
            alt="Logo"
            width={200}
            height={40}
            className="object-contain"
          />
        </div>



        {/* Main Content */}
        <div className="relative lg:hidden z-10 h-full flex flex-col justify-end px-4 lg:px-20 flex-1 text-white max-w-xl">
          <h1 className="text-3xl lg:text-5xl font-bold leading-tight">Ambassador Program</h1>
          <p className="mt-4 text-2xl font-semibold lg:text-base 
            bg-gradient-to-r from-[#343434] via-[#505050] to-[#8B8B8B] 
            bg-clip-text text-transparent">
            Take your Finance From Zero to Hero
          </p>
          <p className="mt-4 text-sm lg:text-base text-gray-300">
            Axiomarket is coming soon. Join Ambassador Program to get {percentage}% on Every Market you create on Axiomarket.
          </p>



          <p className="mt-2 text-sm text-green-400">
            {slotsLeft !== null ? `${slotsLeft} ambassador slots left` : "Loading slots..."}
          </p>
          <div className='flex justify-stretch lg:flex-row mb-12 gap-2 items-center mt-8 w-full'>
            <motion.input
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full lg:w-[320px] border border-white/10 placeholder:text-[#8B8B8B] placeholder:lg:text-[16px] text-[#8B8B8B] rounded-[10px] bg-black text-sm px-4 py-3 lg:text-[16px] focus:outline-none"
            />

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              onClick={handleJoinWaitlist}
              disabled={loading}
              className='lg:mt-0 bg-[white] w-1/3 text-xs text-[#050505] rounded-[10px] px-2 py-3.5 hover:bg-[#00c800] t transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {loading ? "Joining..." : "Join"}
            </motion.button>
          </div>
        </div>

        {/* Desktop version */}
        <div className="relative hidden lg:block z-10 h-full flex-col justify-end px-6 lg:px-10 flex-1 text-white max-w-xl">
          <h1 className="text-3xl lg:text-5xl font-bold leading-tight">Waitlist</h1>
          <p className="mt-4 text-2xl font-semibold lg:text-5xl 
            bg-gradient-to-r from-[#343434] via-[#505050] to-[#8B8B8B] 
            bg-clip-text text-transparent">
            Take your Finance From Zero to Hero
          </p>
          <p className="mt-4 text-sm lg:text-base text-gray-300">
            Axiomarket is coming soon. Join Ambassador Program to get {percentage}% on Every Market you create on Axiomarket.
          </p>

          <div className='flex justify-stretch lg:flex-row mb-12 gap-2 items-center mt-8 w-full'>
            <motion.input
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-2 border-white lg:w-130 placeholder:text-[#8B8B8B] lg:text-[16px] text-[#8B8B8B] rounded-[10px] bg-black text-white px-4 py-3 focus:outline-none"
            />

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              onClick={handleJoinWaitlist}
              disabled={loading}
              className='lg:mt-0 bg-[white] w-1/3 lg:w-[30%] text-xs lg:text-base font-semibold text-[#050505] rounded-[10px] px-2 lg:py-2.5 py-3.5 hover:bg-[#00c800] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {loading ? "Joining..." : "Join"}
            </motion.button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Waitlist