import React, { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
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
  const [showBackToTop, setShowBackToTop] = useState(false)

  // Check if splash was already shown in this session
  useEffect(() => {
    const hasSeenSplash = sessionStorage.getItem('freshlens-splash-shown')
    if (hasSeenSplash) {
      setShowSplash(false)
      setIsLoaded(true)
    }
  }, [])

  // Track scroll position for back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSplashComplete = () => {
    setShowSplash(false)
    setIsLoaded(true)
    sessionStorage.setItem('freshlens-splash-shown', 'true')
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
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
        <div className="snap-section" style={{ justifyContent: 'flex-start' }}>
          <Technology />
          <Footer />
        </div>
      </main>

      {/* Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-primary hover:bg-primary/90 text-white rounded-full shadow-lg flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Back to top"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Landingpage