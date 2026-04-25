"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { apiRequest } from "@/utils/apiRequest";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    const handleLogout = () => {
      localStorage.clear();
      toast.error("Session expired. Please log in again.");
      window.location.href = "/login";
    };

    const checkAuth = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        // ❌ no token → stop everything, just allow navigation
        if (interval) clearInterval(interval);
        return;
      }

      const res = await apiRequest("/user_auth/check-token", {
        method: "POST",
        body: { token },
        showLoading: false,
      });

      const data = res.data;

      // ❌ invalid token → logout
      if (!res.success || !data?.valid) {
        handleLogout();
        return;
      }

      // ✅ valid token → stop checking
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
    };

    checkAuth(); // run once immediately

    const token = localStorage.getItem("token");

    // ✅ only start interval if token exists
    if (token) {
      interval = setInterval(checkAuth, 30000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const width = window.innerWidth;

    if (width >= 1024) {
      router.replace("/home");
    } else {
      router.replace("/market");
    }
  }, [router]);

  return null;
}