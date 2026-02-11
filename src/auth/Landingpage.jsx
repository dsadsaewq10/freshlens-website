import React, { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import SplashScreen from '../pages/landingpage/components/SplashScreen'
import Header from '../pages/landingpage/components/Header'
import Hero from '../pages/landingpage/components/Hero'
import Features from '../pages/landingpage/components/Features'
import HowItWorks from '../pages/landingpage/components/HowItWorks'
import Technology from '../pages/landingpage/components/Technology'
import Dataset from '../pages/landingpage/components/Dataset'
import Footer from '../pages/landingpage/components/Footer'

function Landingpage() {
  const [showSplash, setShowSplash] = useState(true)
  const [isLoaded, setIsLoaded] = useState(false)

  // Check if splash was already shown in this session
  useEffect(() => {
    const hasSeenSplash = sessionStorage.getItem('freshlens-splash-shown')
    if (hasSeenSplash) {
      setShowSplash(false)
      setIsLoaded(true)
    }
  }, [])

  const handleSplashComplete = () => {
    setShowSplash(false)
    setIsLoaded(true)
    sessionStorage.setItem('freshlens-splash-shown', 'true')
  }

  return (
    <div className="bg-background min-h-screen">
      {/* Splash Screen */}
      <AnimatePresence>
        {showSplash && (
          <SplashScreen onComplete={handleSplashComplete} />
        )}
      </AnimatePresence>

      {/* Main Content */}
      <Header isLoaded={isLoaded} />
      <main>
        <div className="snap-section">
          <Hero isLoaded={isLoaded} />
        </div>
        <div className="snap-section">
          <Features />
        </div>
        <div className="snap-section">
          <HowItWorks />
        </div>
        <div className="snap-section">
          <Dataset />
        </div>
        <div className="snap-section">
          <Technology />
        </div>
        <div className="snap-section">
          <Footer />
        </div>
      </main>
    </div>
  )
}

export default Landingpage