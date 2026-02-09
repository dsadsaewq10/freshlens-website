import React, { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import SplashScreen from '../components/landingpage/SplashScreen'
import Header from '../components/landingpage/Header'
import Hero from '../components/landingpage/Hero'
import Features from '../components/landingpage/Features'
import HowItWorks from '../components/landingpage/HowItWorks'
import Technology from '../components/landingpage/Technology'
import Dataset from '../components/landingpage/Dataset'
import Benefits from '../components/landingpage/Benefits'
import CallToAction from '../components/landingpage/CallToAction'
import Footer from '../components/landingpage/Footer'

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
    // Mark splash as shown for this session
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
        <Hero isLoaded={isLoaded} />
        <Features />
        <HowItWorks />
        <Technology />
        <Dataset />
        <Benefits />
        <CallToAction />
      </main>
      <Footer />
    </div>
  )
}

export default Landingpage