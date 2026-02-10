import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function SplashScreen({ onComplete }) {
  // Phases: 'focus' -> 'capture' -> 'scan' -> 'analyze' -> 'complete' -> 'exit'
  const [phase, setPhase] = useState('focus')

  useEffect(() => {
    // Timeline: focus (0.5s) -> capture (0.3s) -> scan (0.8s) -> analyze (0.8s) -> complete (0.3s) -> exit (0.6s)
    const captureTimer = setTimeout(() => setPhase('capture'), 500)
    const scanTimer = setTimeout(() => setPhase('scan'), 800)
    const analyzeTimer = setTimeout(() => setPhase('analyze'), 1600)
    const completeTimer = setTimeout(() => setPhase('complete'), 2400)
    const exitTimer = setTimeout(() => setPhase('exit'), 2700)
    const finishTimer = setTimeout(() => onComplete(), 3200)

    return () => {
      clearTimeout(captureTimer)
      clearTimeout(scanTimer)
      clearTimeout(analyzeTimer)
      clearTimeout(completeTimer)
      clearTimeout(exitTimer)
      clearTimeout(finishTimer)
    }
  }, [onComplete])

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={phase === 'exit' ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="fixed inset-0 z-[100] bg-primary flex items-center justify-center overflow-hidden"
    >
      {/* Camera Viewfinder Grid Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full" style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Main Camera Frame */}
      <div className="relative">
        {/* Outer Focus Ring - Animates during focus phase */}
        <motion.div
          initial={{ scale: 1.5, opacity: 0 }}
          animate={
            phase === 'focus' ? { scale: 1, opacity: 1 } :
            phase === 'capture' ? { scale: 0.95, opacity: 0.5 } :
            { scale: 1, opacity: 0.3 }
          }
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="absolute -inset-8 border-2 border-white/40 rounded-[2.5rem]"
        />

        {/* Camera Focus Corners */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: phase === 'exit' ? 0 : 1 }}
          transition={{ duration: 0.3 }}
          className="absolute -inset-4"
        >
          {/* Top Left Corner */}
          <motion.div
            initial={{ x: -20, y: -20, opacity: 0 }}
            animate={
              phase === 'focus' ? { x: 0, y: 0, opacity: 1 } :
              phase === 'capture' ? { x: 4, y: 4, opacity: 1 } :
              { x: 0, y: 0, opacity: 0.6 }
            }
            transition={{ duration: 0.3 }}
            className="absolute top-0 left-0 w-6 h-6 border-l-3 border-t-3 border-white rounded-tl-lg"
            style={{ borderWidth: '3px 0 0 3px' }}
          />
          {/* Top Right Corner */}
          <motion.div
            initial={{ x: 20, y: -20, opacity: 0 }}
            animate={
              phase === 'focus' ? { x: 0, y: 0, opacity: 1 } :
              phase === 'capture' ? { x: -4, y: 4, opacity: 1 } :
              { x: 0, y: 0, opacity: 0.6 }
            }
            transition={{ duration: 0.3 }}
            className="absolute top-0 right-0 w-6 h-6 border-white rounded-tr-lg"
            style={{ borderWidth: '3px 3px 0 0' }}
          />
          {/* Bottom Left Corner */}
          <motion.div
            initial={{ x: -20, y: 20, opacity: 0 }}
            animate={
              phase === 'focus' ? { x: 0, y: 0, opacity: 1 } :
              phase === 'capture' ? { x: 4, y: -4, opacity: 1 } :
              { x: 0, y: 0, opacity: 0.6 }
            }
            transition={{ duration: 0.3 }}
            className="absolute bottom-0 left-0 w-6 h-6 border-white rounded-bl-lg"
            style={{ borderWidth: '0 0 3px 3px' }}
          />
          {/* Bottom Right Corner */}
          <motion.div
            initial={{ x: 20, y: 20, opacity: 0 }}
            animate={
              phase === 'focus' ? { x: 0, y: 0, opacity: 1 } :
              phase === 'capture' ? { x: -4, y: -4, opacity: 1 } :
              { x: 0, y: 0, opacity: 0.6 }
            }
            transition={{ duration: 0.3 }}
            className="absolute bottom-0 right-0 w-6 h-6 border-white rounded-br-lg"
            style={{ borderWidth: '0 3px 3px 0' }}
          />
        </motion.div>

        {/* Camera Shutter Flash Effect */}
        <AnimatePresence>
          {phase === 'capture' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 0.3, times: [0, 0.1, 1] }}
              className="absolute -inset-20 bg-white rounded-full z-20"
            />
          )}
        </AnimatePresence>

        {/* Logo Container with Scanning Effect */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={
            phase === 'exit' 
              ? { scale: 1.5, opacity: 0, y: -50 }
              : { scale: 1, opacity: 1, y: 0 }
          }
          transition={{ duration: phase === 'exit' ? 0.5 : 0.4, ease: 'easeOut' }}
          className="relative w-36 h-36"
        >
          {/* Logo Background */}
          <div className="w-full h-full bg-white/15 rounded-3xl backdrop-blur-sm border border-white/30 flex items-center justify-center overflow-hidden">
            {/* PLACEHOLDER: Add your logo image here */}
            {/* Replace this with: <img src="/path-to-your-logo.png" alt="FreshLens Logo" className="w-20 h-20 object-contain" /> */}
            <motion.span
              animate={phase === 'complete' ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.3 }}
              className="text-white text-6xl font-bold relative z-10"
            >
              F
            </motion.span>

            {/* Horizontal Scan Line */}
            <AnimatePresence>
              {phase === 'scan' && (
                <motion.div
                  initial={{ y: '-100%' }}
                  animate={{ y: '100%' }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: 'linear' }}
                  className="absolute inset-x-0 h-1 bg-gradient-to-b from-transparent via-white to-transparent"
                  style={{ boxShadow: '0 0 20px 5px rgba(255,255,255,0.5)' }}
                />
              )}
            </AnimatePresence>

            {/* Scan Grid Overlay */}
            <AnimatePresence>
              {(phase === 'scan' || phase === 'analyze') && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.3 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `
                      linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)
                    `,
                    backgroundSize: '12px 12px'
                  }}
                />
              )}
            </AnimatePresence>
          </div>

          {/* Circular Scanning Ring */}
          <AnimatePresence>
            {phase === 'analyze' && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0, rotate: 0 }}
                animate={{ scale: 1, opacity: 1, rotate: 360 }}
                exit={{ scale: 1.2, opacity: 0 }}
                transition={{ 
                  rotate: { duration: 0.8, ease: 'linear' },
                  scale: { duration: 0.3 },
                  opacity: { duration: 0.2 }
                }}
                className="absolute -inset-2"
              >
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle
                    cx="50"
                    cy="50"
                    r="48"
                    fill="none"
                    stroke="rgba(255,255,255,0.3)"
                    strokeWidth="1"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="48"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeDasharray="75 225"
                    strokeLinecap="round"
                  />
                </svg>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Success Checkmark Ring */}
          <AnimatePresence>
            {phase === 'complete' && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute -inset-2 border-2 border-white rounded-[2rem]"
              />
            )}
          </AnimatePresence>
        </motion.div>

        {/* Status Text */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="mt-8 text-center"
        >
          <motion.h1
            className="text-3xl md:text-4xl font-bold text-white mb-2"
            animate={phase === 'exit' ? { opacity: 0, y: -20 } : {}}
            transition={{ duration: 0.3 }}
          >
            FreshLens
          </motion.h1>
          
          {/* Dynamic Status Text */}
          <motion.div className="h-6 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.p
                key={phase}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="text-white/70 text-sm font-medium"
              >
                {phase === 'focus' && 'Focusing...'}
                {phase === 'capture' && 'Capturing...'}
                {phase === 'scan' && 'Scanning image...'}
                {phase === 'analyze' && 'Analyzing freshness...'}
                {phase === 'complete' && 'Ready!'}
                {phase === 'exit' && ''}
              </motion.p>
            </AnimatePresence>
          </motion.div>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="mt-6 w-48 mx-auto"
        >
          <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: '0%' }}
              animate={{ 
                width: 
                  phase === 'focus' ? '15%' :
                  phase === 'capture' ? '30%' :
                  phase === 'scan' ? '60%' :
                  phase === 'analyze' ? '85%' :
                  phase === 'complete' ? '100%' :
                  '100%'
              }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="h-full bg-white rounded-full"
            />
          </div>
        </motion.div>
      </div>

      {/* Camera UI Elements - Decorative */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === 'exit' ? 0 : 0.5 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="absolute top-6 left-6 flex items-center gap-2"
      >
        <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
        <span className="text-white/60 text-xs font-mono">REC</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === 'exit' ? 0 : 0.5 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="absolute top-6 right-6 text-white/60 text-xs font-mono"
      >
        AI VISION
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === 'exit' ? 0 : 0.5 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="absolute bottom-6 left-6 text-white/60 text-xs font-mono"
      >
        YOLOv8
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === 'exit' ? 0 : 0.5 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="absolute bottom-6 right-6 text-white/60 text-xs font-mono"
      >
        FRESHLENS v1.0
      </motion.div>

      {/* Crosshair Center Markers */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === 'exit' ? 0 : 0.2 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="absolute inset-0 pointer-events-none"
      >
        {/* Horizontal line */}
        <div className="absolute top-1/2 left-0 right-0 h-px bg-white/20" />
        {/* Vertical line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/20" />
      </motion.div>
    </motion.div>
  )
}

export default SplashScreen
