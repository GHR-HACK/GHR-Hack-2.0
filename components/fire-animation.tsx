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
          <Image src="/newlogo.png" alt="GHR Hack 2.0 Logo" fill className="object-contain" priority />
        </div>

        <h2
          className="text-3xl md:text-6xl sm:text-xl font-bold tracking-wider mt-2 font-red-hat-display"
          style={{
            backgroundImage: "linear-gradient(135deg, #ff6b35 0%, #a855f7 50%, #ff6b35 100%)",
            backgroundSize: "200% 200%",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            animation: `gradientShift 4s ease-in-out infinite`,
            textShadow: "none",
            filter: "drop-shadow(0 0 30px rgba(255, 107, 53, 0.4)) drop-shadow(0 0 20px rgba(168, 85, 247, 0.3))",
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

        <button className="bg-[#3770ff] p-1 px-4 rounded-md">
        <a href="https://ghrhack2.devfolio.co/">
          <div className="text-white apply-button rounded w-full max-w-xs h-10 md:h-12 flex items-center justify-center">
            <div className="relative w-6 h-6 md:w-8 md:h-8 mr-2">
              <Image src="/Dev.png" alt="DEVFOLIO LOGO" fill className="object-contain" />
            </div>
            <span className="text-md md:text-lg">Register Here</span>
          </div>
        </a>
        </button>

        <div className="mt-8 flex flex-col items-center gap-4">
          <h3 className="text-white/60 text-lg font-medium font-red-hat-display">Powered By</h3>
          <div className="flex items-center justify-center gap-8 flex-wrap">
            <div className="relative w-32 h-16 md:w-40 md:h-20">
              <Image 
                src="/DEVFOLIO.jpg" 
                alt="DEVFOLIO LOGO" 
                fill 
                className="object-contain"
              />
            </div>
            <div className="relative w-32 h-16 md:w-40 md:h-20">
              <Image 
                src="/ETHindia.jpg" 
                alt="ETHINDIA LOGO" 
                fill 
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes gradientShift {
          0%, 100% {
            background-position: 0% 50%;
            filter: drop-shadow(0 0 30px rgba(255, 107, 53, 0.4)) drop-shadow(0 0 20px rgba(168, 85, 247, 0.3));
          }
          50% {
            background-position: 100% 50%;
            filter: drop-shadow(0 0 40px rgba(255, 107, 53, 0.6)) drop-shadow(0 0 30px rgba(168, 85, 247, 0.5));
          }
        }
      `}</style>
    </div>
  )
}
