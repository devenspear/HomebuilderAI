'use client'

import { useState, useEffect } from 'react'
import SplashPage from './splash-page'
import MobileRestriction from './mobile-restriction'
import { isMobileDevice } from '@/lib/device-detection'

export default function SplashGate({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Check if device is mobile after component mounts
    setIsMobile(isMobileDevice())
    setIsLoaded(true)
  }, [])

  const handleEnter = () => {
    setShowSplash(false)
  }

  // Don't render anything until we've checked device type
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-pulse text-white">Loading...</div>
      </div>
    )
  }

  // Show mobile restriction page for mobile devices
  if (isMobile) {
    return <MobileRestriction />
  }

  // Show splash page for desktop devices
  if (showSplash) {
    return <SplashPage onEnter={handleEnter} />
  }

  // Show main app for desktop devices after splash
  // Redirect to /home after splash
  if (typeof window !== 'undefined') {
    window.location.href = '/home'
  }
  return null
}