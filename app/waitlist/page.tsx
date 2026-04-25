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
          
      </div>
    </>
  )
}

export default Waitlist