"use client"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function CookieConsent() {
    const [show, setShow] = useState(false)

    useEffect(() => {
        const consent = localStorage.getItem("cookieConsent")
        if (!consent) {
            setShow(true)
        }
    }, [])

    const acceptCookies = () => {
        localStorage.setItem("cookieConsent", "true")
        setShow(false)
    }

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ y: 80, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 80, opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#0D0D0D] border border-white/10 rounded-xl px-6 py-4 shadow-xl flex items-center gap-4 z-50"
                >
                    <p className="text-sm text-[#8B8B8B] pr-12">
                        We set essential cookies to help run our websites and services. By clicking Accept, you consent to the use of additional cookies for analytics and marketing.
                        Feel free to update your settings at any time. Read more in our Cookie Policy.
                    </p>

                    <div className="flex gap-4">
                        <button
                            onClick={acceptCookies}
                            className="px-6 py-3 cursor-pointer rounded-[10px] bg-[#171717] text-white text-sm font-medium"
                        >
                            Decline
                        </button>
                        <button
                            onClick={acceptCookies}
                            className="px-6 py-3 cursor-pointer rounded-[10px] bg-[#56CD00] text-black text-sm font-medium"
                        >
                            Accept
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}