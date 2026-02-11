import React from 'react'
import { motion } from 'framer-motion'
import SectionScanLine from '../../../components/SectionScanLine'

/* ─── Inline Infographic Illustrations ─── */

function PulseRadar() {
  return (
    <div className="relative h-36 flex items-center justify-center">
      {/* Pulse rings */}
      {[0, 0.6, 1.2].map((delay, i) => (
        <motion.div
          key={i}
          animate={{ scale: [1, 2.2], opacity: [0.35, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, delay, ease: 'easeOut' }}
          className="absolute w-14 h-14 rounded-full border-2 border-primary/30"
        />
      ))}
      {/* Center icon */}
      <div className="relative z-10 w-14 h-14 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
        <img src="/assets/icons/realtime.svg" alt="" className="w-7 h-7 brightness-0 invert" />
      </div>
      {/* Speed dashes */}
      <motion.div
        animate={{ x: [0, 6, 0] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute right-6 flex flex-col gap-1.5"
      >
        <div className="w-10 h-[3px] bg-primary/30 rounded-full" />
        <div className="w-7 h-[3px] bg-primary/20 rounded-full" />
        <div className="w-4 h-[3px] bg-primary/10 rounded-full" />
      </motion.div>
    </div>
  )
}

function TargetBullseye() {
  return (
    <div className="relative h-36 flex items-center justify-center">
      {/* Concentric rings */}
      {[72, 52, 32].map((size, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 0.5, delay: 0.15 * i }}
          className="absolute rounded-full border-2"
          style={{
            width: size * 1.5,
            height: size * 1.5,
            borderColor: i === 0 ? 'rgba(40,90,83,0.15)' : i === 1 ? 'rgba(40,90,83,0.25)' : 'rgba(40,90,83,0.4)',
          }}
        />
      ))}
      {/* Center check */}
      <motion.div
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: false }}
        transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.5 }}
        className="relative z-10 w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/20"
      >
        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </motion.div>
    </div>
  )
}

function FreshnessSpectrum() {
  const levels = [
    { label: 'Fresh', color: '#10b981' },
    { label: 'Mild', color: '#84cc16' },
    { label: 'Moderate', color: '#eab308' },
    { label: 'Severe', color: '#f97316' },
    { label: 'Spoiled', color: '#ef4444' },
  ]
  return (
    <div className="relative h-36 flex flex-col items-center justify-center gap-3 px-4">
      {/* Gradient bar */}
      <div className="w-full max-w-[220px] relative">
        <div className="h-4 rounded-full overflow-hidden" style={{
          background: 'linear-gradient(to right, #10b981, #84cc16, #eab308, #f97316, #ef4444)',
        }} />
        {/* Tick dots */}
        <div className="flex justify-between mt-2">
          {levels.map((lvl, i) => (
            <motion.div
              key={lvl.label}
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: false }}
              transition={{ delay: 0.1 * i, type: 'spring', stiffness: 400 }}
              className="flex flex-col items-center"
            >
              <div className="w-2.5 h-2.5 rounded-full border-2 border-white shadow-sm" style={{ background: lvl.color }} />
              <span className="text-[8px] text-gray-400 mt-1 font-medium">{lvl.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
      {/* Classification icon */}
      <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
        <img src="/assets/icons/fresh.svg" alt="" className="w-5 h-5" style={{ filter: 'brightness(0) saturate(100%) invert(27%) sepia(17%) saturate(1400%) hue-rotate(120deg)' }} />
      </div>
    </div>
  )
}

function OfflineVisual() {
  return (
    <div className="relative h-36 flex items-center justify-center gap-5">
      {/* WiFi off */}
      <div className="relative">
        <svg className="w-12 h-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0" />
        </svg>
        {/* Slash line */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-0.5 bg-red-400 rounded-full -rotate-45 origin-center"
        />
      </div>
      {/* Arrow */}
      <svg className="w-5 h-5 text-primary/30" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
      {/* Device with check */}
      <div className="relative">
        <div className="w-14 h-20 rounded-xl border-2 border-primary/30 flex items-center justify-center bg-primary/5">
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: false }}
            transition={{ type: 'spring', stiffness: 300, delay: 0.5 }}
          >
            <svg className="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </motion.div>
        </div>
        <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-1 rounded-full bg-primary/20" />
      </div>
    </div>
  )
}

function StepFlow() {
  const steps = [
    { icon: '📷', label: 'Point' },
    { icon: '🧠', label: 'Scan' },
    { icon: '✅', label: 'Result' },
  ]
  return (
    <div className="relative h-36 flex items-center justify-center">
      <div className="flex items-center gap-2">
        {steps.map((step, i) => (
          <React.Fragment key={step.label}>
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: false }}
              transition={{ delay: 0.2 * i, type: 'spring', stiffness: 300 }}
              className="flex flex-col items-center gap-1.5"
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl ${
                i === 1 ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-primary/10'
              }`}>
                {step.icon}
              </div>
              <span className="text-[10px] font-medium text-gray-400">{step.label}</span>
            </motion.div>
            {i < steps.length - 1 && (
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: false }}
                transition={{ delay: 0.15 + 0.2 * i, duration: 0.3 }}
                className="mb-4"
              >
                <svg className="w-5 h-5 text-primary/30" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </motion.div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

/* ─── Feature Definitions ─── */

const features = [
  {
    title: 'Real-Time Detection',
    description: 'Instant freshness analysis with sub-second inference directly on your device.',
    Visual: PulseRadar,
  },
  {
    title: 'High Accuracy',
    description: 'Reliable freshness assessment powered by a fine-tuned YOLOv8 model.',
    Visual: TargetBullseye,
  },
  {
    title: 'Multi-Class Classification',
    description: 'Classifies vegetables across a full freshness spectrum from fresh to spoiled.',
    Visual: FreshnessSpectrum,
  },
  {
    title: 'Offline Capable',
    description: 'Works without internet — all AI inference runs locally after initial setup.',
    Visual: OfflineVisual,
  },
  {
    title: 'Easy to Use',
    description: 'Simple three-step workflow: point, scan, and get results instantly.',
    Visual: StepFlow,
  },
]

/* ─── Main Component ─── */

const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }
const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

function Features() {
  return (
    <section id="features" className="bg-surface py-20 lg:py-28 relative overflow-hidden">
      {/* Background organic shapes */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-primary/[0.03] rounded-full blur-2xl" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-primary/[0.03] rounded-full blur-3xl" />
      </div>
      <SectionScanLine duration={8} />
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            Core Capabilities
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold text-accent mb-4">
            Key Features
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Combining cutting-edge AI with an intuitive interface for
            accurate vegetable freshness detection.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: '-80px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-5"
        >
          {features.map((feature, index) => {
            const Visual = feature.Visual
            return (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                className={`group ${index < 3 ? 'lg:col-span-2' : 'lg:col-span-3'}`}
              >
                <div className="bg-white rounded-2xl p-6 h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-transparent hover:border-primary/10 relative overflow-hidden micro-hover glow-pulse">
                  {/* Decorative corner */}
                  <div className="absolute top-0 right-0 w-28 h-28 bg-primary/[0.03] rounded-bl-full" />

                  <div className="relative z-10">
                    {/* Infographic Visual */}
                    <Visual />

                    <h3 className="text-xl font-semibold text-accent mb-2 text-center">
                      {feature.title}
                    </h3>
                    <p className="text-gray-500 leading-relaxed text-sm text-center">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

export default Features
