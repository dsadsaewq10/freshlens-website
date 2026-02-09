import React, { useEffect, useState } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'

function PhoneMockup({ isVisible }) {
  const [hasEntryCompleted, setHasEntryCompleted] = useState(false)
  const [currentScreen, setCurrentScreen] = useState(0)

  // Scroll-based parallax effects
  const { scrollY } = useScroll()
  
  // Smooth spring for parallax movement
  const smoothScrollY = useSpring(scrollY, { stiffness: 100, damping: 30 })
  
  // Parallax transforms based on scroll - only active after entry animation
  const parallaxY = useTransform(smoothScrollY, [0, 500], [0, -60])
  const rotateX = useTransform(smoothScrollY, [0, 400], [0, 12])
  const rotateY = useTransform(smoothScrollY, [0, 400], [0, -8])
  const scale = useTransform(smoothScrollY, [0, 300], [1, 0.92])

  // Cycle through app screens
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentScreen((prev) => (prev + 1) % 3)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  // Screen content for animation
  const screens = [
    { title: 'Scan', subtitle: 'Point camera at vegetable' },
    { title: 'Analyze', subtitle: 'AI processing image' },
    { title: 'Result', subtitle: 'Fresh - 89% confidence' }
  ]

  return (
    <motion.div
      // Dramatic spinning entrance animation
      initial={{ 
        opacity: 0, 
        y: 150, 
        scale: 0.3, 
        rotateY: 180,
        rotateX: 45
      }}
      animate={isVisible ? { 
        opacity: 1, 
        y: 0, 
        scale: 1,
        rotateY: 0,
        rotateX: 0
      } : {}}
      transition={{ 
        duration: 1.4,
        delay: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94],
        rotateY: { duration: 1.2, ease: [0.34, 1.56, 0.64, 1] },
        rotateX: { duration: 1, ease: 'easeOut' }
      }}
      onAnimationComplete={() => setHasEntryCompleted(true)}
      style={{ 
        y: hasEntryCompleted ? parallaxY : 0,
        perspective: 1200
      }}
      className="relative flex justify-center"
    >
      {/* Floating/Levitating Animation Container */}
      <motion.div
        animate={{
          y: [0, -20, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        style={{
          rotateX: hasEntryCompleted ? rotateX : 0,
          rotateY: hasEntryCompleted ? rotateY : 0,
          scale: hasEntryCompleted ? scale : 1,
          transformStyle: 'preserve-3d'
        }}
        className="relative"
      >
        {/* 3D Phone Container */}
        <motion.div
          className="relative w-64 lg:w-72 h-[500px] lg:h-[560px]"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Glow effect behind phone */}
          <motion.div
            animate={{
              opacity: [0.3, 0.5, 0.3],
              scale: [1, 1.08, 1]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className="absolute inset-0 bg-primary/30 rounded-[3rem] blur-3xl -z-10"
          />

          {/* Phone Frame */}
          <div className="absolute inset-0 bg-gradient-to-b from-accent to-gray-900 rounded-[2.5rem] p-2 shadow-2xl">
            {/* Side Buttons */}
            <div className="absolute -right-1 top-24 w-1 h-16 bg-accent rounded-l-sm" />
            <div className="absolute -left-1 top-20 w-1 h-8 bg-accent rounded-r-sm" />
            <div className="absolute -left-1 top-32 w-1 h-12 bg-accent rounded-r-sm" />

            {/* Screen */}
            <div className="w-full h-full bg-gradient-to-b from-primary/20 to-primary/40 rounded-[2rem] overflow-hidden relative">
              {/* Notch */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-accent rounded-full flex items-center justify-center gap-2 z-10">
                <div className="w-2 h-2 bg-gray-700 rounded-full" />
                <div className="w-3 h-3 bg-gray-700 rounded-full" />
              </div>

              {/* PLACEHOLDER: Replace this entire screen content with your app screenshot */}
              {/* Use: <img src="/path-to-app-screenshot.png" alt="App Screenshot" className="w-full h-full object-cover" /> */}
              
              {/* Animated Screen Content */}
              <div className="absolute inset-0 pt-12 px-4 flex flex-col">
                {/* Status Bar */}
                <div className="flex justify-between items-center text-white/60 text-xs mb-4 px-2">
                  <span>9:41</span>
                  <div className="flex gap-1">
                    <div className="w-4 h-2 bg-white/40 rounded-sm" />
                    <div className="w-4 h-2 bg-white/40 rounded-sm" />
                    <div className="w-6 h-3 bg-white/60 rounded-sm" />
                  </div>
                </div>

                {/* App Header */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5 }}
                  className="text-center mb-4"
                >
                  <div className="w-10 h-10 bg-white/20 rounded-xl mx-auto mb-2 flex items-center justify-center">
                    {/* PLACEHOLDER: Add app icon here */}
                    <span className="text-white font-bold">F</span>
                  </div>
                  <span className="text-white font-semibold text-sm">FreshLens</span>
                </motion.div>

                {/* Camera Viewfinder */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.7 }}
                  className="flex-1 bg-black/30 rounded-2xl mx-2 mb-4 relative overflow-hidden"
                >
                  {/* Scanning Animation */}
                  <motion.div
                    animate={{
                      y: ['0%', '100%', '0%']
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      ease: 'linear'
                    }}
                    className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary/80 to-transparent"
                  />

                  {/* Corner brackets */}
                  <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-white/50 rounded-tl-lg" />
                  <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-white/50 rounded-tr-lg" />
                  <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-white/50 rounded-bl-lg" />
                  <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-white/50 rounded-br-lg" />

                  {/* Center placeholder for vegetable image */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    {/* PLACEHOLDER: Add vegetable scan image here */}
                    <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center">
                      <div className="w-12 h-12 bg-white/20 rounded-full" />
                    </div>
                  </div>
                </motion.div>

                {/* Animated Result Cards */}
                <motion.div 
                  className="mx-2 mb-4"
                  key={currentScreen}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-semibold text-sm">
                          {screens[currentScreen].title}
                        </p>
                        <p className="text-white/60 text-xs">
                          {screens[currentScreen].subtitle}
                        </p>
                      </div>
                      <motion.div
                        animate={currentScreen === 1 ? { rotate: 360 } : {}}
                        transition={{ duration: 1, repeat: currentScreen === 1 ? Infinity : 0, ease: 'linear' }}
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          currentScreen === 2 ? 'bg-green-500/30' : 'bg-white/20'
                        }`}
                      >
                        {currentScreen === 2 ? (
                          <span className="text-green-400 text-xs">✓</span>
                        ) : (
                          <div className="w-4 h-4 bg-white/30 rounded-full" />
                        )}
                      </motion.div>
                    </div>
                    
                    {/* Progress indicator */}
                    <div className="flex gap-1 mt-2">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className={`h-1 flex-1 rounded-full ${
                            i <= currentScreen ? 'bg-primary' : 'bg-white/20'
                          }`}
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: i <= currentScreen ? 1 : 0 }}
                          transition={{ duration: 0.3 }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Bottom Navigation */}
                <div className="flex justify-center gap-6 pb-4">
                  <div className="w-10 h-10 bg-white/10 rounded-full" />
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-14 h-14 bg-primary rounded-full border-4 border-white/30"
                  />
                  <div className="w-10 h-10 bg-white/10 rounded-full" />
                </div>
              </div>

              {/* Screen Reflection Effect */}
              <motion.div
                animate={{
                  x: ['-100%', '200%']
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  repeatDelay: 3,
                  ease: 'easeInOut'
                }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 pointer-events-none"
              />
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Ground Shadow */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.15, 0.3]
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        className="absolute -bottom-8 w-48 h-8 bg-black/20 rounded-full blur-xl"
      />
    </motion.div>
  )
}

export default PhoneMockup
