import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/* ─────────────────────────────────────────────
   Phone frame shell shared by every step.
   Children = the screen content.
   ───────────────────────────────────────────── */
function PhoneFrame({ children }) {
  return (
    <div className="relative w-48 lg:w-56 mx-auto">
      {/* Subtle glow behind frame */}
      <div className="absolute inset-0 bg-primary/20 rounded-[2.5rem] blur-2xl -z-10" />

      {/* Outer device shell */}
      <div className="bg-linear-to-b from-accent to-gray-900 rounded-[2.2rem] p-1.5 shadow-2xl">
        {/* Side buttons */}
        <div className="absolute -right-0.75 top-20 w-0.75 h-10 bg-accent rounded-l-sm" />
        <div className="absolute -left-0.75 top-16 w-0.75 h-5 bg-accent rounded-r-sm" />
        <div className="absolute -left-0.75 top-24 w-0.75 h-8 bg-accent rounded-r-sm" />

        {/* Screen area */}
        <div className="w-full aspect-[9/19.5] bg-white rounded-[1.9rem] overflow-hidden relative">
          {/* Notch */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-4 bg-black rounded-full flex items-center justify-center gap-1.5 z-30">
            <div className="w-1.5 h-1.5 bg-gray-800 rounded-full" />
            <div className="w-2 h-2 bg-gray-800 rounded-full" />
          </div>

          {/* Status bar */}
          <div className="absolute top-2 left-3 right-3 flex justify-between items-center text-gray-400 text-[8px] z-20 px-1">
            <span>9:41</span>
            <div className="flex gap-0.5">
              <div className="w-2.5 h-1 bg-gray-300 rounded-sm" />
              <div className="w-2.5 h-1 bg-gray-300 rounded-sm" />
              <div className="w-3.5 h-1.5 bg-gray-400 rounded-sm" />
            </div>
          </div>

          {/* Screen content */}
          {children}

          {/* Reflection glare */}
          <div className="absolute inset-0 bg-linear-to-r from-transparent via-gray-200/10 to-transparent skew-x-12 pointer-events-none z-30" />
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════
   STEP 0 — Capture
   Camera viewfinder with shutter animation
   ═══════════════════════════════════════════════ */
function CaptureScreen() {
  return (
    <div className="absolute inset-0 z-10">
      {/* Mini header */}
      <div className="absolute top-8 left-0 right-0 text-center z-10">
        <div className="w-8 h-8 rounded-md mx-auto flex items-center justify-center">
          <img src="/assets/logo/freshlens_logo.png" alt="FreshLens" className="w-7 h-7 object-contain" />
        </div>
        <span className="text-gray-700 font-medium text-[9px]">FreshLens</span>
      </div>

      {/* Viewfinder */}
      <div className="absolute top-21 left-2.5 right-2.5 bottom-20 rounded-xl overflow-hidden bg-black/40 border border-white/5">
        {/* Tomato subject */}
        <div className="absolute inset-0 flex items-center justify-center">
          <img src="/assets/icons/tomato.png" alt="Tomato" className="w-20 h-20 object-contain drop-shadow-lg" />
        </div>

        {/* Focus ring */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div
            initial={{ scale: 1.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.7 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="w-24 h-24 border-2 border-primary rounded-lg"
          />
        </div>

        {/* Scan line sweep */}
        <motion.div
          initial={{ y: '0%' }}
          animate={{ y: '100%' }}
          transition={{ duration: 1.5, ease: 'linear', repeat: Infinity, repeatDelay: 1.5 }}
          className="absolute inset-x-0 top-0 h-0.5 bg-linear-to-r from-transparent via-primary to-transparent opacity-70"
        />

        {/* Corner brackets */}
        <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-primary/60 rounded-tl" />
        <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-primary/60 rounded-tr" />
        <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-primary/60 rounded-bl" />
        <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-primary/60 rounded-br" />

        {/* AF label */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="absolute top-3 left-7 text-[6px] text-primary font-mono font-bold tracking-wider"
        >
          AF ●
        </motion.div>

        {/* Shutter flash — contained within viewfinder only */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.9, 0] }}
          transition={{ duration: 0.5, delay: 1.5, times: [0, 0.4, 1], repeat: Infinity, repeatDelay: 3.5 }}
          className="absolute inset-0 bg-white rounded-xl z-40 pointer-events-none"
        />
      </div>

      {/* "Image Captured" badge */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 1, 0] }}
        transition={{ duration: 1.5, delay: 1.9, times: [0, 0.15, 0.75, 1], repeat: Infinity, repeatDelay: 2.6 }}
        className="absolute bottom-24 left-0 right-0 flex justify-center z-40 pointer-events-none"
      >
        <div className="bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10 flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 bg-primary rounded-full" />
          <span className="text-white text-[8px] font-medium">Image Captured</span>
        </div>
      </motion.div>

      {/* Bottom capture bar */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-4 pb-1.5">
        <div className="w-6 h-6 bg-gray-200 rounded-full" />
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
          className="w-9 h-9 bg-primary rounded-full border-2 border-gray-300"
        />
        <div className="w-6 h-6 bg-gray-200 rounded-full" />
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════
   STEP 1 — Analyze
   Analyzing popup with spinner
   ═══════════════════════════════════════════════ */
function AnalyzeScreen() {
  return (
    <div className="absolute inset-0 z-10">
      {/* Background: dimmed viewfinder with tomato + bounding box */}
      <div className="absolute top-20 left-2.5 right-2.5 bottom-20 rounded-xl overflow-hidden bg-black/40 border border-white/5">
        <div className="absolute inset-0 flex items-center justify-center">
          <img src="/assets/icons/tomato.png" alt="Tomato" className="w-20 h-20 object-contain drop-shadow-lg opacity-50" />
          {/* Bounding box */}
          <motion.div
            initial={{ opacity: 0, scale: 1.2 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="absolute w-20 h-20 border-2 border-primary rounded-lg"
          >
            <div className="absolute -top-0.5 -left-0.5 w-2 h-2 border-t-2 border-l-2 border-primary rounded-tl" />
            <div className="absolute -top-0.5 -right-0.5 w-2 h-2 border-t-2 border-r-2 border-primary rounded-tr" />
            <div className="absolute -bottom-0.5 -left-0.5 w-2 h-2 border-b-2 border-l-2 border-primary rounded-bl" />
            <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 border-b-2 border-r-2 border-primary rounded-br" />
          </motion.div>
        </div>
      </div>

      {/* Analyzing popup overlay */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        className="absolute inset-0 flex items-center justify-center z-20"
      >
        <div className="bg-black/70 backdrop-blur-md rounded-xl px-5 py-4 flex flex-col items-center gap-2 border border-white/10">
          {/* Spinner */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-8 h-8 border-2 border-transparent border-t-primary border-r-primary/30 rounded-full"
          />
          <p className="text-white font-semibold text-xs">Analyzing...</p>
          <p className="text-white/40 text-[8px]">AI processing image</p>
        </div>
      </motion.div>
    </div>
  )
}

/* ═══════════════════════════════════════════════
   STEP 2 — Classify
   Shows classification result with label + confidence
   ═══════════════════════════════════════════════ */
function ClassifyScreen() {
  return (
    <div className="absolute inset-0 z-10 bg-white">
      <div className="absolute top-8 left-0 right-0 bottom-0 px-3 flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-1.5 mb-3 pt-1">
          <div className="w-5 h-5 bg-gray-100 rounded-md flex items-center justify-center">
            <svg className="w-2.5 h-2.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </div>
          <p className="text-gray-800 font-semibold text-[10px]">Classification</p>
        </div>

        {/* Vegetable image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-gray-50 rounded-lg p-3 flex justify-center mb-3 border border-gray-200"
        >
          <img src="/assets/icons/tomato.png" alt="Scanned tomato" className="w-16 h-16 object-contain" />
        </motion.div>

        {/* Classification label */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-3"
        >
          <p className="text-gray-400 text-[8px] uppercase tracking-wider mb-0.5">Detected Vegetable</p>
          <p className="text-gray-800 font-bold text-lg">Tomato</p>
        </motion.div>

        {/* Freshness classification */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-50 rounded-lg p-2.5 mb-3 border border-gray-200"
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-500 text-[8px]">Freshness Category</p>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.6 }}
              className="bg-emerald-500/20 px-2 py-0.5 rounded-full"
            >
              <p className="text-emerald-400 text-[8px] font-semibold">Fresh</p>
            </motion.div>
          </div>

          {/* Confidence bars */}
          <div className="space-y-1.5">
            {[
              { label: 'Fresh', pct: 94, color: 'bg-emerald-400' },
              { label: 'Mild', pct: 4, color: 'bg-amber-400' },
              { label: 'Spoiled', pct: 2, color: 'bg-red-400' },
            ].map((item, i) => (
              <div key={item.label}>
                <div className="flex justify-between text-[7px] mb-0.5">
                  <span className="text-gray-500">{item.label}</span>
                  <span className="text-gray-600 font-medium">{item.pct}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1 overflow-hidden">
                  <motion.div
                    initial={{ width: '0%' }}
                    animate={{ width: `${item.pct}%` }}
                    transition={{ duration: 0.8, delay: 0.5 + i * 0.15, ease: 'easeOut' }}
                    className={`h-full rounded-full ${item.color}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Model info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <p className="text-gray-400 text-[7px]">YOLOv8 · TFLite · 94.2% confidence</p>
        </motion.div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════
   STEP 3 — Results
   Full result screen (mirrors Hero PhoneMockup Phase 3)
   ═══════════════════════════════════════════════ */
function ResultsScreen() {
  return (
    <div className="absolute inset-0 z-10 bg-white">
      <div className="absolute top-8 left-0 right-0 bottom-0 px-2.5 flex flex-col">
        {/* Back arrow + title */}
        <div className="flex items-center gap-1.5 mb-2 pt-1">
          <div className="w-5 h-5 bg-gray-100 rounded-md flex items-center justify-center">
            <svg className="w-2.5 h-2.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </div>
          <p className="text-gray-800 font-semibold text-[10px]">Scan Result</p>
        </div>

        {/* Tomato image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-gray-50 rounded-lg p-3 flex justify-center mb-2 border border-gray-200"
        >
          <img src="/assets/icons/tomato.png" alt="Scanned tomato" className="w-14 h-14 object-contain" />
        </motion.div>

        {/* Classification */}
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-gray-500 text-[7px]">Classification</p>
            <p className="text-emerald-400 font-bold text-sm">Fresh Tomato</p>
          </div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.3 }}
            className="bg-emerald-500/20 px-2 py-0.5 rounded-full"
          >
            <p className="text-emerald-400 text-[8px] font-semibold">94.2%</p>
          </motion.div>
        </div>

        {/* Confidence bar */}
        <div className="mb-3">
          <div className="flex justify-between text-[7px] mb-0.5">
            <span className="text-gray-500">Confidence</span>
            <span className="text-emerald-400 font-bold">94.2%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: '94.2%' }}
              transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
              className="h-full rounded-full bg-linear-to-r from-emerald-500 to-emerald-400"
            />
          </div>
        </div>

        {/* Recommendations */}
        <div className="mb-3 flex-1">
          <p className="text-gray-500 text-[7px] font-semibold uppercase tracking-wider mb-1.5">Recommendations</p>
          <div className="space-y-1.5">
            {[
              'Safe to consume — this vegetable is fresh',
              'Store in refrigerator to maintain freshness',
              'Best consumed within 3–5 days',
            ].map((rec, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.12 }}
                className="flex items-start gap-1.5"
              >
                <div className="w-3 h-3 bg-emerald-500/20 rounded-full flex items-center justify-center mt-0.5 shrink-0">
                  <span className="text-emerald-400 text-[6px]">✓</span>
                </div>
                <p className="text-gray-500 text-[7px] leading-relaxed">{rec}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-1.5 pb-3">
          <div className="flex-1 bg-primary rounded-lg py-2 flex items-center justify-center gap-1">
            <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            </svg>
            <span className="text-white text-[8px] font-semibold">Scan Again</span>
          </div>
          <div className="flex-1 bg-gray-100 rounded-lg py-2 flex items-center justify-center gap-1 border border-gray-200">
            <svg className="w-2.5 h-2.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4" />
            </svg>
            <span className="text-gray-500 text-[8px] font-semibold">Home</span>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Main export — renders phone with the correct
   screen content based on the active step index.
   ───────────────────────────────────────────── */
const screens = [CaptureScreen, AnalyzeScreen, ClassifyScreen, ResultsScreen]

function StepPhoneMockup({ step = 0 }) {
  const Screen = screens[step] ?? CaptureScreen

  return (
    <div className="relative">
      {/* Circular arc background design behind phone */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
        {/* Large outer arc */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="absolute w-72 h-72 lg:w-80 lg:h-80 rounded-full border border-white/10"
        />
        {/* Medium arc */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="absolute w-56 h-56 lg:w-64 lg:h-64 rounded-full border border-white/[0.07]"
        />
        {/* Inner glow arc */}
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="absolute w-44 h-44 lg:w-52 lg:h-52 rounded-full border border-white/4"
        />
        {/* Subtle center glow */}
        <div className="absolute w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
        {/* Half arc accent — top-right */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.12 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="absolute w-64 h-64 lg:w-72 lg:h-72 rounded-full border-2 border-white/20"
          style={{ clipPath: 'inset(0 0 50% 50%)' }}
        />
      </div>

      <PhoneFrame>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -15 }}
            transition={{ duration: 0.35 }}
            className="absolute inset-0"
          >
            <Screen />
          </motion.div>
        </AnimatePresence>
      </PhoneFrame>
    </div>
  )
}

export default StepPhoneMockup
