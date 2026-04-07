"use client";

import Image from "next/image";
import { API_URL } from "@/utils/apiRequest";
import React from "react";

const XButton: React.FC = () => {
  const handleLogin = () => {
    // Redirect to your backend X/Twitter auth endpoint
    window.location.href = `${API_URL}/user_auth/twitter`;
  };

  return (
    <button
      onClick={handleLogin}
      className="flex items-center justify-center gap-3 border border-[#E4E4E4]/30 rounded-full py-3 px-4 hover:bg-white/10 transition w-full"
    >
      <Image src="/img/login/x.svg" alt="X" width={20} height={20} className="" />
      {/* <span>X</span> */}
    </button>
  );
};

export default XButton;