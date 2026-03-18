"use client"

import Image from 'next/image'
import React, { useState } from 'react'
import { Eye, EyeOff } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"

const page = () => {
  const router = useRouter()

  const socialAuth = [
    { label: "Google", image: "/img/login/google.png" },
    { label: "Apple", image: "/img/login/apple.png" }
  ]

  const [showPassword, setShowPassword] = useState(false)
  const [isSignup, setIsSignup] = useState(false)
  const [isForgot, setIsForgot] = useState(false)

  const handleButtonClick = () => {
    // Navigate to /market for now (UI only)
    router.push("/market")
  }

  return (
    <div className='text-white'>
      <div className="relative h-[100dvh] p-4 lg:justify-center lg:mt-54 lg:ml-32 flex flex-col overflow-hidden">
        <div className='fixed inset-0 bg-[#000000] opacity-50 lg:hidden block z-10' />
        <div className="absolute inset-0 lg:hidden z-0">
          <Image
            src="/img/waitlist/wlbg.svg"
            alt="Background"
            fill
            className="object-cover"
            priority
          />
        </div>

        <Image
          src="/img/home/logofull.svg"
          alt="Logo"
          width={100}
          height={100}
          className="w-58 object-cover z-10 left-6 top-6 lg:hidden"
        />

        {/* CONTENT */}
        <div className="relative z-10 w-full flex flex-col gap-4 max-w-md mx-auto mb-12 mt-12">

          <h1 className='text-2xl font-semibold'>
            {isForgot ? "Forgot Password" : isSignup ? "Create Account" : "Login"}
          </h1>

          <div className='text-[#8B8B8B] mb-8'>
            {isForgot ? (
              <>
                Already have an account?{" "}
                <span
                  onClick={() => { setIsForgot(false); setIsSignup(false) }}
                  className="text-white underline cursor-pointer"
                >
                  Login
                </span>
              </>
            ) : isSignup ? (
              <>
                Already have an account?{" "}
                <span
                  onClick={() => setIsSignup(false)}
                  className="text-white underline cursor-pointer"
                >
                  Login
                </span>
              </>
            ) : (
              <>
                Don't have an account?{" "}
                <span
                  onClick={() => setIsSignup(true)}
                  className="text-white underline cursor-pointer"
                >
                  Create Account
                </span>
              </>
            )}
          </div>

          <AnimatePresence mode="wait">
            {!isForgot && !isSignup && (
              <motion.div
                key="login"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col gap-4"
              >
                {/* Email */}
                <div className='w-full bg-[#0A0A0B] rounded-md'>
                  <input
                    type="email"
                    placeholder="Email"
                    className='bg-transparent py-3 w-full px-2 placeholder:text-sm placeholder:text-white/50 text-white focus:outline-none rounded-md focus:ring-1 focus:ring-gray-500'
                  />
                </div>

                {/* Password */}
                <div className='w-full bg-[#0A0A0B] rounded-md relative'>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className='bg-transparent py-3 w-full px-2 pr-10 placeholder:text-sm border-white/20 placeholder:text-white/50 text-white focus:outline-none rounded-md focus:ring-1 focus:ring-gray-500'
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <span
                  onClick={() => setIsForgot(true)}
                  className="text-sm flex w-full justify-end underline text-[#8B8B8B] cursor-pointer hover:underline -mt-3"
                >
                  Forgot Password?
                </span>
              </motion.div>
            )}

            {isSignup && !isForgot && (
              <motion.div
                key="signup"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col gap-4"
              >
                <div className="flex gap-4">
                  <div className="w-full bg-[#0A0A0B] rounded-md">
                    <input
                      type="text"
                      placeholder="First Name"
                      className='bg-transparent py-3 w-full px-2 placeholder:text-sm placeholder:text-white/50 text-white focus:outline-none rounded-md focus:ring-1 focus:ring-gray-500'
                    />
                  </div>
                  <div className="w-full bg-[#0A0A0B] rounded-md">
                    <input
                      type="text"
                      placeholder="Last Name"
                      className='bg-transparent py-3 w-full px-2 placeholder:text-sm placeholder:text-white/50 text-white focus:outline-none rounded-md focus:ring-1 focus:ring-gray-500'
                    />
                  </div>
                </div>
                <div className='w-full bg-[#0A0A0B] rounded-md'>
                  <input
                    type="email"
                    placeholder="Email"
                    className='bg-transparent py-3 w-full px-2 placeholder:text-sm border-white/20 placeholder:text-white/50 text-white focus:outline-none rounded-md focus:ring-1 focus:ring-gray-500'
                  />
                </div>
                <div className='w-full bg-[#0A0A0B] rounded-md relative'>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className='bg-transparent py-3 w-full px-2 pr-10 placeholder:text-sm border-white/20 placeholder:text-white/50 text-white focus:outline-none rounded-md focus:ring-1 focus:ring-gray-500'
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <motion.label
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.25 }}
                  className="relative z-10 my-6 flex items-center gap-2 text-sm text-[#8B8B8B]"
                >
                  <input type="checkbox" className="accent-white" />
                  I agree to the{" "}
                  <span className="underline text-white cursor-pointer">Terms & Conditions</span>
                </motion.label>
              </motion.div>
            )}

            {isForgot && (
              <motion.div
                key="forgot"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col gap-4"
              >
                <div className='w-full bg-[#0A0A0B] rounded-md'>
                  <input
                    type="email"
                    placeholder="Email"
                    className='bg-transparent py-3 w-full px-2 placeholder:text-sm border-white/20 placeholder:text-white/50 text-white focus:outline-none rounded-md focus:ring-1 focus:ring-gray-500'
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        <button
          onClick={handleButtonClick}
          className="bg-white z-10 hover:bg-white/40 text-black py-2.5 font-semibold px-4 rounded-lg transition"
        >
          {isForgot ? "Reset Password" : isSignup ? "Create Account" : "Login"}
        </button>

        {!isForgot && (
          <>
            <div className="w-full flex z-10 items-center gap-4 my-6">
              <div className="flex-1 h-[1px] bg-white/30" />
              <span className="text-xs text-white/70 whitespace-nowrap">
                {isSignup ? "Or sign up with" : "Or login with"}
              </span>
              <div className="flex-1 h-[1px] bg-white/30" />
            </div>

            <div className="relative z-10 flex w-full gap-4 w-64">
              {socialAuth.map((item, index) => (
                <button
                  key={index}
                  className="flex items-center w-full justify-center gap-3 border border-white/70 rounded-lg py-3 px-4 hover:bg-white/10 transition"
                >
                  <Image
                    src={item.image}
                    alt={item.label}
                    width={20}
                    height={20}
                  />
                  <span>  {item.label}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default page