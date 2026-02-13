import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * SplashScreen — 2-second camera-viewfinder splash with centered logo.
 *
 * Timeline (2 000 ms total):
 *   0 ms    show     — viewfinder frame + logo fade in
 *   300 ms  scan     — scan line sweeps across logo
 *   900 ms  ready    — brief pulse + "Ready!"
 *   1 500 ms exit    — fade out begins
 *   2 000 ms finish  — onComplete fires
 */

function SplashScreen({ onComplete }) {
  const [phase, setPhase] = useState('show')

  useEffect(() => {
    const scanTimer   = setTimeout(() => setPhase('scan'),  300)
    const readyTimer  = setTimeout(() => setPhase('ready'), 900)
    const exitTimer   = setTimeout(() => setPhase('exit'),  1500)
    const finishTimer = setTimeout(() => onComplete(),      2000)

    return () => {
      clearTimeout(scanTimer)
      clearTimeout(readyTimer)
      clearTimeout(exitTimer)
      clearTimeout(finishTimer)
    }
  }, [onComplete])

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={phase === 'exit' ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="fixed inset-0 z-100 bg-primary flex items-center justify-center overflow-hidden"
    >
      {/* Subtle grid background */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Crosshair markers */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === 'exit' ? 0 : 0.15 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute top-1/2 left-0 right-0 h-px bg-white/30" />
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/30" />
      </motion.div>

      {/* Centered content */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={
          phase === 'exit'
            ? { scale: 1.3, opacity: 0, y: -30 }
            : { scale: 1, opacity: 1, y: 0 }
        }
        transition={{ duration: phase === 'exit' ? 0.5 : 0.35, ease: 'easeOut' }}
        className="flex flex-col items-center"
      >
        {/* Camera viewfinder frame around logo */}
        <div className="relative w-36 h-36 mb-6">
          {/* Viewfinder corner brackets — animated in */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === 'exit' ? 0 : 1 }}
            transition={{ duration: 0.25, delay: 0.05 }}
            className="absolute -inset-4"
          >
            {/* Top-left */}
            <motion.div
              initial={{ x: -12, y: -12, opacity: 0 }}
              animate={{ x: 0, y: 0, opacity: 1 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="absolute top-0 left-0 w-7 h-7"
              style={{ borderWidth: '3px 0 0 3px', borderColor: 'rgba(255,255,255,0.7)', borderStyle: 'solid', borderRadius: '6px 0 0 0' }}
            />
            {/* Top-right */}
            <motion.div
              initial={{ x: 12, y: -12, opacity: 0 }}
              animate={{ x: 0, y: 0, opacity: 1 }}
              transition={{ duration: 0.3, ease: 'easeOut', delay: 0.05 }}
              className="absolute top-0 right-0 w-7 h-7"
              style={{ borderWidth: '3px 3px 0 0', borderColor: 'rgba(255,255,255,0.7)', borderStyle: 'solid', borderRadius: '0 6px 0 0' }}
            />
            {/* Bottom-left */}
            <motion.div
              initial={{ x: -12, y: 12, opacity: 0 }}
              animate={{ x: 0, y: 0, opacity: 1 }}
              transition={{ duration: 0.3, ease: 'easeOut', delay: 0.05 }}
              className="absolute bottom-0 left-0 w-7 h-7"
              style={{ borderWidth: '0 0 3px 3px', borderColor: 'rgba(255,255,255,0.7)', borderStyle: 'solid', borderRadius: '0 0 0 6px' }}
            />
            {/* Bottom-right */}
            <motion.div
              initial={{ x: 12, y: 12, opacity: 0 }}
              animate={{ x: 0, y: 0, opacity: 1 }}
              transition={{ duration: 0.3, ease: 'easeOut', delay: 0.1 }}
              className="absolute bottom-0 right-0 w-7 h-7"
              style={{ borderWidth: '0 3px 3px 0', borderColor: 'rgba(255,255,255,0.7)', borderStyle: 'solid', borderRadius: '0 0 6px 0' }}
            />
          </motion.div>

          {/* Outer focus ring that pulses on ready */}
          <AnimatePresence>
            {phase === 'ready' && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.3, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute -inset-5 border-2 border-white/50 rounded-[1.75rem]"
              />
            )}
          </AnimatePresence>

          {/* Logo box */}
          <div className="w-full h-full rounded-2xl flex items-center justify-center overflow-hidden relative">
            <motion.img
              src="/assets/logo/freshlens_logo.png"
              alt="FreshLens"
              animate={phase === 'ready' ? { scale: [1, 1.15, 1] } : {}}
              transition={{ duration: 0.25 }}
              className="w-32 h-32 object-contain relative z-10"
            />

            {/* Scan line sweep */}
            <AnimatePresence>
              {phase === 'scan' && (
                <motion.div
                  initial={{ y: '-100%' }}
                  animate={{ y: '100%' }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: 'linear' }}
                  className="absolute inset-x-0 h-1 bg-linear-to-b from-transparent via-white to-transparent"
                  style={{ boxShadow: '0 0 20px 5px rgba(255,255,255,0.5)' }}
                />
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-1.5">FreshLens</h1>

        {/* Subtitle */}
        <motion.p className="text-white/60 text-sm font-medium h-5">
          <AnimatePresence mode="wait">
            <motion.span
              key={phase}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
            >
              {phase === 'show' && 'Initializing...'}
              {phase === 'scan' && 'Scanning...'}
              {phase === 'ready' && 'Ready!'}
              {phase === 'exit' && ''}
            </motion.span>
          </AnimatePresence>
        </motion.p>

        {/* Progress bar */}
        <div className="mt-5 w-40">
          <div className="h-1 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: '0%' }}
              animate={{
                width:
                  phase === 'show'  ? '20%' :
                  phase === 'scan'  ? '60%' :
                  phase === 'ready' ? '100%' :
                  '100%',
              }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="h-full bg-white rounded-full"
            />
          </div>
        </div>
      </motion.div>

      {/* Corner camera UI labels */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === 'exit' ? 0 : 0.4 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="absolute top-6 left-6 flex items-center gap-2"
      >
        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
        <span className="text-white/60 text-xs font-mono">FreshLens</span>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === 'exit' ? 0 : 0.4 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="absolute top-6 right-6 text-white/60 text-xs font-mono"
      >
        AI VISION
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === 'exit' ? 0 : 0.4 }}
        transition={{ duration: 0.4, delay: 0.25 }}
        className="absolute bottom-6 left-6 text-white/60 text-xs font-mono"
      >
        YOLOv8
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === 'exit' ? 0 : 0.4 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="absolute bottom-6 right-6 text-white/60 text-xs font-mono"
      >
        v1.0
      </motion.div>
    </motion.div>
  )
}

export default SplashScreen
