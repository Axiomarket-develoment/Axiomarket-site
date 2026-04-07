"use client";

import Image from "next/image";
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { API_URL, apiRequest } from "@/utils/apiRequest";
import { GoogleLogin } from "@react-oauth/google";
import GoogleButton from "@/components/auth/GoogleButton";
import XButton from "@/components/auth/XButton";

const Page: React.FC = () => {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [isForgot, setIsForgot] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ==========================
  // LOGIN HANDLER
  // ==========================
  const handleLogin = async () => {
    const res = await apiRequest("/auth/login", {
      method: "POST",
      body: { email, password },
      showSuccess: true,
    });

    if (res.success && res.data?.token) {
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      router.push("/market");
    }
  };

  return (
    <div className="text-white">
      <div className="relative h-[100dvh] p-4 lg:justify-center lg:mt-54 lg:ml-32 flex flex-col overflow-hidden">

        {/* Background */}
        <div className="fixed inset-0 bg-[#000000] opacity-50 lg:hidden block z-10" />
        <div className="absolute inset-0 lg:hidden z-0">
          <Image
            src="/img/waitlist/wlbg.svg"
            alt="Background"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Logo */}
        <Image
          src="/img/home/logofull.svg"
          alt="Logo"
          width={100}
          height={100}
          className="w-58 object-cover z-10 left-6 top-6 lg:hidden"
        />

        {/* CONTENT */}
        <div className="relative z-10 w-full flex flex-col gap-4 max-w-md mx-auto mb-12 mt-12">

          <h1 className="text-2xl font-semibold">
            {isForgot
              ? "Forgot Password"
              : isSignup
                ? "Create Account"
                : "Login"}
          </h1>

          {/* Switch Links */}
          <div className="text-[#8B8B8B] mb-8">
            {isForgot ? (
              <>
                Already have an account?{" "}
                <span
                  onClick={() => {
                    setIsForgot(false);
                    setIsSignup(false);
                  }}
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

            {/* LOGIN */}
            {!isForgot && !isSignup && (
              <motion.div
                key="login"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col gap-4"
              >
                {/* 👇 Hidden dummy inputs to block browser autofill */}
                <input type="text" name="fakeuser" autoComplete="username" style={{ display: "none" }} />
                <input type="password" name="fakepass" autoComplete="new-password" style={{ display: "none" }} />

                {/* Email */}
                <div className="w-full bg-[#0A0A0B] rounded-md">
                  <input
                    type="email"
                    placeholder="Email"
                    name="real_email_123"
                    autoComplete="off"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-transparent py-3 w-full px-2 text-white focus:outline-none rounded-md focus:ring-1 focus:ring-gray-500"
                  />
                </div>

                {/* Password */}
                <div className="w-full bg-[#0A0A0B] rounded-md relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    name="real_password_123"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-transparent py-3 w-full px-2 pr-10 text-white focus:outline-none rounded-md focus:ring-1 focus:ring-gray-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <span
                  onClick={() => setIsForgot(true)}
                  className="text-sm flex justify-end underline text-[#8B8B8B] cursor-pointer"
                >
                  Forgot Password?
                </span>
              </motion.div>
            )}

            {/* FORGOT */}
            {isForgot && (
              <motion.div
                key="forgot"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col gap-4"
              >
                <input
                  type="email"
                  placeholder="Email"
                  className="bg-[#0A0A0B] py-3 px-2 rounded-md"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* BUTTON */}
        <button
          onClick={() => {
            if (!isSignup && !isForgot) handleLogin();
          }}
          className="bg-white z-10 text-black py-2.5 font-semibold rounded-lg"
        >
          {isForgot
            ? "Reset Password"
            : isSignup
              ? "Create Account"
              : "Login"}
        </button>

        {/* SOCIAL LOGIN */}
        {!isForgot && (
          <>
            <div className="flex items-center gap-4 my-6 z-10">
              <div className="flex-1 h-[1px] bg-white/30" />
              <span className="text-xs text-white/70">
                Or login with
              </span>
              <div className="flex-1 h-[1px] bg-white/30" />
            </div>

            <div className="flex w-full gap-4 z-10">
              {/* GOOGLE */}
              <GoogleButton />
              {/* X */}
              <XButton />

            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Page;