import React, { useEffect, useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion'

/**
 * PhoneMockup — animated phone simulating the FreshLens app experience.
 *
 * STRICT 5-phase sequential loop (no overlap, no glitching):
 *   Phase 0  Logo         — FreshLens logo display                  (2.0 s)
 *   Phase 1  Capturing    — viewfinder + dramatic shutter flash     (1.5 s)
 *   Phase 2  Analyzing    — spinner popup overlay                   (1.0 s)
 *   Phase 3  Results      — static result page                      (4.0 s)
 *   Phase 4  Reset        — clean fade-out before restart            (1.0 s)
 *
 * Total loop: ~9.5 s (including transition time)
 *
 * Entrance: Dramatic spin-in with scroll-based parallax after entry.
 * Floating: Continuous vertical bob with ground shadow platform.
 */

const PHASE_DURATIONS = [2000, 1500, 1000, 4000, 1000]

function PhoneMockup({ isVisible }) {
  const [hasEntryCompleted, setHasEntryCompleted] = useState(false)

  // Scroll-based parallax effects
  const { scrollY } = useScroll()
  const smoothScrollY = useSpring(scrollY, { stiffness: 100, damping: 30 })
  const parallaxY = useTransform(smoothScrollY, [0, 500], [0, -60])
  const rotateX = useTransform(smoothScrollY, [0, 400], [0, 12])
  const rotateY = useTransform(smoothScrollY, [0, 400], [0, -8])
  const scale = useTransform(smoothScrollY, [0, 300], [1, 0.92])

  const [phase, setPhase] = useState(0)
  const phaseRef = useRef(0)
  const timerRef = useRef(null)

  // Strict sequential phase advancement — single timer, no overlap
  const advancePhase = useCallback(() => {
    const next = (phaseRef.current + 1) % 5
    phaseRef.current = next
    setPhase(next)
    timerRef.current = setTimeout(advancePhase, PHASE_DURATIONS[next])
  }, [])

  useEffect(() => {
    phaseRef.current = 0
    setPhase(0)
    timerRef.current = setTimeout(advancePhase, PHASE_DURATIONS[0])
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [advancePhase])

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 150,
        scale: 0.3,
        rotateY: 180,
        rotateX: 45,
      }}
      animate={isVisible ? {
        opacity: 1,
        y: 0,
        scale: 1,
        rotateY: 0,
        rotateX: 0,
      } : {}}
      transition={{
        duration: 1.4,
        delay: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94],
        rotateY: { duration: 1.2, ease: [0.34, 1.56, 0.64, 1] },
        rotateX: { duration: 1, ease: 'easeOut' },
      }}
      onAnimationComplete={() => setHasEntryCompleted(true)}
      style={{
        y: hasEntryCompleted ? parallaxY : 0,
        perspective: 1200,
      }}
      className="relative flex justify-center"
    >
      {/* Floating bob */}
      <motion.div
        animate={{ y: [0, -18, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          rotateX: hasEntryCompleted ? rotateX : 0,
          rotateY: hasEntryCompleted ? rotateY : 0,
          scale: hasEntryCompleted ? scale : 1,
          transformStyle: 'preserve-3d',
        }}
        className="relative"
      >
        <motion.div
          className="relative w-64 lg:w-72 h-125 lg:h-140"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Glow */}
          <motion.div
            animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.08, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 bg-primary/30 rounded-[3rem] blur-3xl -z-10"
          />

          {/* Phone Frame */}
          <div className="absolute inset-0 bg-linear-to-b from-accent to-gray-900 rounded-[2.5rem] p-2 shadow-2xl">
            <div className="absolute -right-1 top-24 w-1 h-16 bg-accent rounded-l-sm" />
            <div className="absolute -left-1 top-20 w-1 h-8 bg-accent rounded-r-sm" />
            <div className="absolute -left-1 top-32 w-1 h-12 bg-accent rounded-r-sm" />

            {/* Screen */}
            <div className="w-full h-full bg-white rounded-4xl overflow-hidden relative">
              {/* Notch */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-full flex items-center justify-center gap-2 z-30">
                <div className="w-2 h-2 bg-gray-800 rounded-full" />
                <div className="w-3 h-3 bg-gray-800 rounded-full" />
              </div>

              {/* Status Bar */}
              <div className="absolute top-3 left-4 right-4 flex justify-between items-center text-gray-400 text-[10px] z-20 px-2">
                <span>9:41</span>
                <div className="flex gap-1">
                  <div className="w-3.5 h-1.5 bg-gray-300 rounded-sm" />
                  <div className="w-3.5 h-1.5 bg-gray-300 rounded-sm" />
                  <div className="w-5 h-2.5 bg-gray-400 rounded-sm" />
                </div>
              </div>

              {/* ═══════ PHASE 0: LOGO (2s) ═══════ */}
              <AnimatePresence mode="wait">
                {phase === 0 && (
                  <motion.div
                    key="logo-phase"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 z-10 flex flex-col items-center justify-center"
                  >
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
                      animate={{ scale: 1, opacity: 1, rotate: 0 }}
                      transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
                      className="w-24 h-24 rounded-2xl flex items-center justify-center mb-3 relative"
                    >
                      <img src="/assets/logo/freshlens_logo.png" alt="FreshLens" className="w-20 h-20 object-contain" />
                      {/* Subtle glow ring */}
                      <motion.div
                        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute inset-0 border-2 border-primary/30 rounded-2xl"
                      />
                    </motion.div>
                    <motion.p
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-gray-800 font-semibold text-base"
                    >
                      FreshLens
                    </motion.p>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="text-gray-400 text-[10px] mt-1"
                    >
                      AI Freshness Scanner
                    </motion.p>
                    {/* Ready indicator */}
                    <motion.div
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 48 }}
                      transition={{ delay: 1, duration: 0.6 }}
                      className="h-0.5 bg-primary/50 rounded-full mt-4"
                    />
                  </motion.div>
                )}

                {/* ═══════ PHASE 1: CAPTURING (1.5s) — Dramatic Shutter ═══════ */}
                {phase === 1 && (
                  <motion.div
                    key="capture-phase"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0 z-10"
                  >
                    {/* Mini header */}
                    <div className="absolute top-12 left-0 right-0 text-center z-10">
                      <div className="w-9 h-9 rounded-lg mx-auto mb-1 flex items-center justify-center">
                        <img src="/assets/logo/freshlens_logo.png" alt="FreshLens" className="w-9 h-9 object-contain" />
                      </div>
                      <span className="text-gray-700 font-medium text-[11px]">FreshLens</span>
                    </div>

                    {/* Viewfinder */}
                    <div className="absolute top-28 left-3 right-3 bottom-28 rounded-2xl overflow-hidden bg-black/40 border border-white/5">
                      {/* Tomato */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <img
                          src="/assets/icons/tomato.png"
                          alt="Tomato"
                          className="w-28 h-28 object-contain drop-shadow-lg"
                        />
                      </div>

                      {/* Focus pulse ring around tomato */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <motion.div
                          initial={{ scale: 1.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: [0, 0.6, 0.6] }}
                          transition={{ duration: 0.4, ease: 'easeOut' }}
                          className="w-32 h-32 border-2 border-primary rounded-xl"
                        />
                        {/* Secondary focus ring */}
                        <motion.div
                          initial={{ scale: 2, opacity: 0 }}
                          animate={{ scale: 1.15, opacity: [0, 0.3, 0] }}
                          transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
                          className="absolute w-36 h-36 border border-primary/50 rounded-xl"
                        />
                      </div>

                      {/* Scan line — fast sweep */}
                      <motion.div
                        initial={{ y: '-10%' }}
                        animate={{ y: '900%' }}
                        transition={{ duration: 0.8, ease: 'easeInOut' }}
                        className="absolute inset-x-0 top-0 h-1.5 bg-linear-to-r from-transparent via-primary to-transparent"
                      />

                      {/* Corner brackets */}
                      <div className="absolute top-3 left-3 w-6 h-6 border-l-2 border-t-2 border-primary/60 rounded-tl-lg" />
                      <div className="absolute top-3 right-3 w-6 h-6 border-r-2 border-t-2 border-primary/60 rounded-tr-lg" />
                      <div className="absolute bottom-3 left-3 w-6 h-6 border-l-2 border-b-2 border-primary/60 rounded-bl-lg" />
                      <div className="absolute bottom-3 right-3 w-6 h-6 border-r-2 border-b-2 border-primary/60 rounded-br-lg" />

                      {/* AF label */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="absolute top-4 left-10 text-[8px] text-primary font-mono font-bold tracking-wider"
                      >
                        AF ●
                      </motion.div>

                      {/* ── CAMERA SHUTTER FLASH — inside viewfinder only ── */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 0, 0.95, 0] }}
                        transition={{ duration: 0.5, delay: 0.7, times: [0, 0, 0.3, 1] }}
                        className="absolute inset-0 bg-white rounded-2xl z-40 pointer-events-none"
                      />

                      {/* Shutter iris closing effect — inside viewfinder only */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 0, 1, 1, 0] }}
                        transition={{ duration: 0.8, delay: 0.65, times: [0, 0, 0.15, 0.7, 1] }}
                        className="absolute inset-0 z-30 pointer-events-none flex items-center justify-center overflow-hidden rounded-2xl"
                      >
                        {/* Shutter blades */}
                        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                          <motion.div
                            key={deg}
                            initial={{ scaleY: 0 }}
                            animate={{ scaleY: [0, 0, 1, 1, 0] }}
                            transition={{ duration: 0.8, delay: 0.65, times: [0, 0, 0.2, 0.6, 1] }}
                            className="absolute w-[120%] h-3 bg-gray-900/90 origin-center"
                            style={{ transform: `rotate(${deg}deg)` }}
                          />
                        ))}
                      </motion.div>
                    </div>

                    {/* Capture indicator — "Photo captured" */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: [0, 0, 1, 1, 0], y: [10, 10, 0, 0, -5] }}
                      transition={{ duration: 1.2, delay: 0.8, times: [0, 0, 0.2, 0.7, 1] }}
                      className="absolute bottom-32 left-0 right-0 flex justify-center z-40 pointer-events-none"
                    >
                      <div className="bg-black/70 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/10 flex items-center gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full" />
                        <span className="text-white text-[10px] font-medium">Image Captured</span>
                      </div>
                    </motion.div>

                    {/* Bottom capture bar */}
                    <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-6 pb-2">
                      <div className="w-8 h-8 bg-gray-200 rounded-full" />
                      {/* Shutter button — pulses then locks */}
                      <motion.div
                        animate={{
                          scale: [1, 1.15, 0.9, 1],
                          borderColor: ['rgba(209,213,219,0.5)', 'rgba(156,163,175,0.5)', 'rgba(40,90,83,0.8)', 'rgba(40,90,83,0.6)'],
                        }}
                        transition={{ duration: 1, delay: 0.3, times: [0, 0.3, 0.5, 1] }}
                        className="w-12 h-12 bg-primary rounded-full border-3 border-gray-300 relative"
                      >
                        {/* Inner ring */}
                        <motion.div
                          initial={{ scale: 1 }}
                          animate={{ scale: [1, 0.6, 1] }}
                          transition={{ duration: 0.5, delay: 0.6 }}
                          className="absolute inset-1 rounded-full border-2 border-gray-300"
                        />
                      </motion.div>
                      <div className="w-8 h-8 bg-gray-200 rounded-full" />
                    </div>
                  </motion.div>
                )}

                {/* ═══════ PHASE 2: ANALYZING (1s) ═══════ */}
                {phase === 2 && (
                  <motion.div
                    key="analyze-phase"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 z-10"
                  >
                    {/* Background — keep viewfinder visible but dimmed */}
                    <div className="absolute top-28 left-3 right-3 bottom-28 rounded-2xl overflow-hidden bg-black/40 border border-white/5">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <img
                          src="/assets/icons/tomato.png"
                          alt="Tomato"
                          className="w-28 h-28 object-contain drop-shadow-lg opacity-60"
                        />
                        {/* Detection bounding box */}
                        <motion.div
                          initial={{ opacity: 0, scale: 1.2 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="absolute w-28 h-28 border-2 border-primary rounded-lg"
                        >
                          <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-primary rounded-tl" />
                          <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-primary rounded-tr" />
                          <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-primary rounded-bl" />
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-primary rounded-br" />
                        </motion.div>
                      </div>
                    </div>

                    {/* Analyzing popup */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.7 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                      className="absolute inset-0 flex items-center justify-center z-20"
                    >
                      <div className="bg-black/70 backdrop-blur-md rounded-2xl px-6 py-5 flex flex-col items-center gap-3 border border-white/10">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="w-10 h-10 border-3 border-transparent border-t-primary border-r-primary/30 rounded-full"
                        />
                        <p className="text-white font-semibold text-sm">Analyzing...</p>
                        <p className="text-white/40 text-[10px]">AI processing image</p>
                      </div>
                    </motion.div>
                  </motion.div>
                )}

                {/* ═══════ PHASE 3: RESULTS (4s) ═══════ */}
                {phase === 3 && (
                  <motion.div
                    key="results-phase"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    className="absolute inset-0 z-10 bg-white"
                  >
                    <div className="absolute top-11 left-0 right-0 bottom-0 px-3 flex flex-col">
                      {/* Back arrow + title */}
                      <div className="flex items-center gap-2 mb-3 pt-2">
                        <div className="w-7 h-7 bg-gray-100 rounded-lg flex items-center justify-center">
                          <svg className="w-3.5 h-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                          </svg>
                        </div>
                        <p className="text-gray-800 font-semibold text-sm">Scan Result</p>
                      </div>

                      {/* Tomato image */}
                      <div className="bg-gray-50 rounded-xl p-4 flex justify-center mb-3 border border-gray-200">
                        <img src="/assets/icons/tomato.png" alt="Scanned tomato" className="w-20 h-20 object-contain" />
                      </div>

                      {/* Classification Label */}
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="text-gray-500 text-[10px]">Classification</p>
                          <p className="text-emerald-400 font-bold text-base">Fresh Tomato</p>
                        </div>
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.3 }}
                          className="bg-emerald-500/20 px-2.5 py-1 rounded-full"
                        >
                          <p className="text-emerald-400 text-[10px] font-semibold">94.2%</p>
                        </motion.div>
                      </div>

                      {/* Confidence bar */}
                      <div className="mb-4">
                        <div className="flex justify-between text-[10px] mb-1">
                          <span className="text-gray-500">Confidence</span>
                          <span className="text-emerald-400 font-bold">94.2%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                          <motion.div
                            initial={{ width: '0%' }}
                            animate={{ width: '94.2%' }}
                            transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
                            className="h-full rounded-full bg-linear-to-r from-emerald-500 to-emerald-400"
                          />
                        </div>
                      </div>

                      {/* Recommendations */}
                      <div className="mb-4 flex-1">
                        <p className="text-gray-500 text-[10px] font-semibold uppercase tracking-wider mb-2">Recommendations</p>
                        <div className="space-y-2">
                          {[
                            'Safe to consume — this vegetable is fresh',
                            'Store in refrigerator to maintain freshness',
                            'Best consumed within 3–5 days',
                          ].map((rec, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.5 + i * 0.15 }}
                              className="flex items-start gap-2"
                            >
                              <div className="w-3.5 h-3.5 bg-emerald-500/20 rounded-full flex items-center justify-center mt-0.5 shrink-0">
                                <span className="text-emerald-400 text-[7px]">✓</span>
                              </div>
                              <p className="text-gray-500 text-[9px] leading-relaxed">{rec}</p>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Buttons */}
                      <div className="flex gap-2 pb-4">
                        <div className="flex-1 bg-primary rounded-xl py-2.5 flex items-center justify-center gap-1.5">
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          </svg>
                          <span className="text-white text-[10px] font-semibold">Scan Again</span>
                        </div>
                        <div className="flex-1 bg-gray-100 rounded-xl py-2.5 flex items-center justify-center gap-1.5 border border-gray-200">
                          <svg className="w-3 h-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4" />
                          </svg>
                          <span className="text-gray-500 text-[10px] font-semibold">Home</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ═══════ PHASE 4: RESET (1s) ═══════ */}
                {phase === 4 && (
                  <motion.div
                    key="reset-phase"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0 z-10 bg-white flex items-center justify-center"
                  >
                    <motion.div
                      initial={{ scale: 1, opacity: 1 }}
                      animate={{ scale: 0.8, opacity: 0.3 }}
                      transition={{ duration: 0.8, ease: 'easeInOut' }}
                      className="w-18 h-18 rounded-2xl flex items-center justify-center"
                    >
                      <img src="/assets/logo/freshlens_logo.png" alt="FreshLens" className="w-14 h-14 object-contain" />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Screen Reflection (always visible) */}
              <motion.div
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 4, repeat: Infinity, repeatDelay: 3, ease: 'easeInOut' }}
                className="absolute inset-0 bg-linear-to-r from-transparent via-gray-200/20 to-transparent skew-x-12 pointer-events-none z-30"
              />
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* ── Ground Shadow / Floating Platform ── */}
      {/* Outer soft ambient shadow - positioned clearly below phone */}
      <motion.div
        animate={{
          scaleX: [1, 1.08, 1],
          scaleY: [1, 0.8, 1],
          opacity: [0.75, 0.5, 0.75],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-80 h-20 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(ellipse 80% 65% at center, rgba(40,90,83,0.6) 0%, rgba(0,0,0,0.35) 35%, transparent 60%)',
          borderRadius: '50%',
          filter: 'blur(10px)',
        }}
      />
      {/* Inner concentrated shadow */}
      <motion.div
        animate={{
          scaleX: [1, 1.12, 1],
          scaleY: [1, 0.65, 1],
          opacity: [0.9, 0.6, 0.9],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-56 h-10 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 40%, transparent 60%)',
          borderRadius: '50%',
          filter: 'blur(5px)',
        }}
      />
    </motion.div>
  )
}

export default PhoneMockup
