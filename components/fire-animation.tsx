"use client"

import { useEffect } from "react"

import { useState } from "react"
import Image from "next/image"
import ParticlesWeb from "@/components/particles-web"

export default function FireAnimation() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Use requestIdleCallback for better performance
    if ("requestIdleCallback" in window) {
      requestIdleCallback(() => setMounted(true))
    } else {
      setTimeout(() => setMounted(true), 0)
    }
  }, [])

  return (
    <div className="w-full h-screen bg-neutral-950 relative overflow-hidden flex items-center justify-center">
      <ParticlesWeb />

      <div className="text-center relative z-10 flex flex-col items-center justify-center gap-4">
        <div className="w-56 h-56 md:w-64 md:h-64 relative">
          <Image src="/logo.png" alt="GHR Hack 2.0 Logo" fill className="object-contain" priority />
        </div>

        <h2
          className="text-3xl md:text-6xl sm:text-xl font-bold tracking-wider mt-2 font-red-hat-display"
          style={{
            backgroundImage: "linear-gradient(135deg, #e9552b 0%, #680b7d 50%, #e9552b 100%)",
            backgroundSize: "200% 200%",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            animation: `gradientShift 4s ease-in-out infinite`,
            textShadow: "none",
            filter: "drop-shadow(0 0 30px rgba(233, 85, 43, 0.4)) drop-shadow(0 0 20px rgba(104, 11, 125, 0.3))",
            fontFamily: "var(--font-red-hat-display), sans-serif",
          }}
        >
          COMING SOON...
        </h2>
        <h4 
          className="text-white/80 text-2xl font-medium text-center font-red-hat-display"
          style={{
            filter: "drop-shadow(0 0 10px rgba(255, 255, 255, 0.5)) drop-shadow(0 0 20px rgba(255, 255, 255, 0.3)) drop-shadow(0 0 30px rgba(255, 255, 255, 0.2))",
            fontFamily: "var(--font-red-hat-display), sans-serif",
          }}
        >
          With More Bigger Opportunities
        </h4>
      </div>

      <style>{`
        @keyframes gradientShift {
          0%, 100% {
            background-position: 0% 50%;
            filter: drop-shadow(0 0 30px rgba(233, 85, 43, 0.4)) drop-shadow(0 0 20px rgba(104, 11, 125, 0.3));
          }
          50% {
            background-position: 100% 50%;
            filter: drop-shadow(0 0 40px rgba(233, 85, 43, 0.6)) drop-shadow(0 0 30px rgba(104, 11, 125, 0.5));
          }
        }
      `}</style>
    </div>
  )
}
