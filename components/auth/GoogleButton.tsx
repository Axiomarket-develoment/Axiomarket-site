"use client";

import { useGoogleLogin } from "@react-oauth/google";
import { apiRequest } from "@/utils/apiRequest";
import { useRouter } from "next/navigation";
import Image from "next/image";
import React from "react";

const GoogleButton: React.FC = () => {
  const router = useRouter();

  const login = useGoogleLogin({
    onSuccess: async (response) => {
      console.log("Google login response:", response);
      const accessToken = response.access_token;

      // Fetch user info from Google API
      const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const userInfo = await userInfoRes.json();
      console.log("Google user info:", userInfo);

      // Now send to your backend
      const res = await apiRequest("/user_auth/google", {
        method: "POST",
        body: { token: accessToken }, // or ID token if you want
      });

      if (res.success && res.data?.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        router.push("/market");
      }
    },
  });

  return (
    <button
      onClick={() => login()}
      className="flex items-center justify-center gap-3 border border-[#E4E4E4]/20 text-white font-semibold rounded-full bg-transparent py-3 px-4 hover:bg-gray-100 transition w-full"
    >
      <Image src="/img/login/google.png" alt="Google" width={20} height={20} />
      
    </button>
  );
};

export default GoogleButton;