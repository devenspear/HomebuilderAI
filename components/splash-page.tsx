'use client'

import { useState } from 'react'
import Button from './ui/button'

interface SplashPageProps {
  onEnter: () => void
}

export default function SplashPage({ onEnter }: SplashPageProps) {
  const [isAnimating, setIsAnimating] = useState(false)

  const handleEnter = () => {
    setIsAnimating(true)
    setTimeout(() => {
      onEnter()
    }, 500)
  }

  return (
    <div
      className={`fixed inset-0 bg-black z-[100] flex items-center justify-center transition-opacity duration-500 ${
        isAnimating ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="text-center max-w-5xl mx-auto px-8 space-y-12">
        {/* Main Title */}
        <div className="space-y-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-white leading-tight tracking-wide">
            HomebuilderAI Interactive
          </h1>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-thin text-white/80 leading-relaxed">
            Proof of Concept
          </h2>
        </div>

        {/* Divider */}
        <div className="w-24 h-px bg-white/30 mx-auto"></div>

        {/* Description */}
        <div className="space-y-6 text-white/75">
          <p className="text-lg md:text-xl font-light leading-relaxed tracking-wide">
            This private demo explores how the HomebuilderAI ebook series—<span className="text-white font-medium italic">The New Rules for New Home Sales</span> by <span className="text-white font-medium">Myers Barnes</span>—can come alive as an interactive experience.
          </p>

          <p className="text-base md:text-lg font-light leading-relaxed tracking-wide">
            It is an early prototype: not all features or data are fully operational, and functionality is intentionally limited to illustrate core concepts like <span className="text-blue-300 font-medium">Aiglish™</span>, <span className="text-purple-300 font-medium">AI Frames</span>, and the <span className="text-pink-300 font-medium">AI Sales Flow™</span>.
          </p>

          <p className="text-base md:text-lg font-light leading-relaxed tracking-wide">
            This work is derived from and inspired by Myers Barnes&apos; book; proceed to experience a guided glimpse of what an AI-visible, action-driven sales system can feel like.
          </p>
        </div>

        {/* Call to Action */}
        <div className="space-y-6 pt-8">
          <p className="text-white/60 text-sm md:text-base font-light tracking-widest uppercase">
            Click Below to Access the Demo
          </p>

          <button
            onClick={handleEnter}
            className="group relative inline-flex items-center justify-center px-12 py-4 text-lg font-medium text-white bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-300 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:ring-offset-2 focus:ring-offset-black animate-pulse"
          >
            <span className="relative z-10 tracking-wide font-semibold">Enter Demo</span>

            {/* Animated glow effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-30 group-hover:opacity-50 blur-xl transition-opacity duration-300 animate-pulse"></div>

            {/* Pulsing ring effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-20 animate-ping"></div>

            {/* Arrow icon */}
            <svg
              className="ml-3 w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>

        {/* Copyright footer */}
        <div className="pt-16 text-white/50 text-sm">
          Copyright © 2025 Myers Barnes Associates, Inc. All rights reserved.
        </div>
      </div>
    </div>
  )
}