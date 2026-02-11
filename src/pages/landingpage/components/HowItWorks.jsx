import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SectionScanLine from '../../../components/SectionScanLine'

function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0)

  const steps = [
    {
      title: 'Capture',
      description: 'Point your camera at any vegetable or upload an image from your gallery.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      details: [
        'Use your phone camera for real-time detection',
        'Or upload a saved image from your gallery',
      ],
      visual: '/assets/icons/scan.svg',
    },
    {
      title: 'Analyze',
      description: 'YOLOv8 processes the image and analyzes visual features for freshness indicators.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      details: [
        'YOLOv8 scans for color, texture, and decay patterns',
        'TFLite model runs directly on your device',
      ],
      visual: '/assets/icons/accuracy.svg',
    },
    {
      title: 'Classify',
      description: 'The system classifies the vegetable into freshness categories with confidence scores.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      details: [
        'Multi-class classification from Fresh to Spoiled',
        'Confidence scores show reliability of each result',
      ],
      visual: '/assets/icons/fresh.svg',
    },
    {
      title: 'Results',
      description: 'Get instant results with detailed freshness assessment.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      details: [
        'Clear visual indicators show freshness level at a glance',
        'Actionable recommendations help you decide what to do next',
      ],
      visual: '/assets/icons/realtime.svg',
    },
  ]

  const primaryFilter =
    'brightness(0) saturate(100%) invert(28%) sepia(12%) saturate(1800%) hue-rotate(120deg) brightness(95%)'

  return (
    <section id="how-it-works" className="bg-surface py-20 lg:py-28 relative overflow-hidden">
      {/* Per-section scan line */}
      <SectionScanLine duration={7} />

      {/* Background patterns */}
      <div className="absolute inset-0 opacity-[0.07]">
        <div className="absolute top-20 right-20 w-64 h-64 border border-primary rounded-full" />
        <div className="absolute bottom-20 left-10 w-48 h-48 border border-primary rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-primary rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <span className="text-gray-500 text-sm font-medium tracking-wider uppercase mb-3 block">
            Simple Process
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold text-accent">
            How FreshLens Works
          </h2>
        </motion.div>

        {/* Two-column layout: Left (tabs + description), Right (screenshot + step details) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* ── LEFT: Step tabs ── */}
          <div className="lg:col-span-4 flex flex-col">
            {/* Step buttons */}
            <div className="space-y-1.5 mb-6">
              {steps.map((step, index) => (
                <motion.button
                  key={step.title}
                  onClick={() => setActiveStep(index)}
                  whileHover={{ x: 4 }}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: false }}
                  transition={{ delay: index * 0.08 }}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 cursor-pointer ${
                    activeStep === index
                      ? 'bg-primary/5 border-l-4 border-primary'
                      : 'border-l-4 border-transparent hover:bg-white/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                        activeStep === index
                          ? 'bg-primary/15 text-primary'
                          : 'bg-gray-200 text-gray-400'
                      }`}
                    >
                      {step.icon}
                    </div>
                    <div>
                      <span
                        className={`text-base font-semibold block transition-colors ${
                          activeStep === index ? 'text-accent' : 'text-gray-400'
                        }`}
                      >
                        {step.title}
                      </span>
                      <span className="text-[11px] text-gray-400">
                        Step {index + 1}
                      </span>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Description — positioned at bottom of left column */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm mt-auto"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                    {steps[activeStep].icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-accent">{steps[activeStep].title}</h3>
                    <p className="text-gray-400 text-xs">Step {activeStep + 1} of {steps.length}</p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-3">
                  {steps[activeStep].description}
                </p>
                <div className="space-y-2">
                  {steps[activeStep].details.map((detail, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-start gap-2"
                    >
                      <div className="w-4 h-4 bg-primary/15 rounded-full flex items-center justify-center mt-0.5 shrink-0">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                      </div>
                      <p className="text-gray-500 text-xs leading-relaxed">{detail}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ── RIGHT: Screenshot + Step indicator ── */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
              >
                {/* Screenshot card */}
                <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                  {/* Step progress bar */}
                  <div className="grid grid-cols-4 gap-2 mb-5">
                    {steps.map((_, i) => (
                      <div key={i} className="relative">
                        <div
                          className={`h-1.5 rounded-full transition-all duration-500 ${
                            i <= activeStep ? 'bg-primary' : 'bg-gray-200'
                          }`}
                        />
                        {i === activeStep && (
                          <motion.div
                            layoutId="stepIndicator"
                            className="absolute -top-1 right-0 w-3.5 h-3.5 bg-primary rounded-full border-2 border-white shadow-sm"
                            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                          />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* App screenshot placeholder */}
                  <div className="bg-background rounded-xl overflow-hidden border border-gray-100 mb-4">
                    <div className="aspect-[16/9] flex flex-col items-center justify-center p-8">
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.4 }}
                        className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mb-4"
                      >
                        <img
                          src={steps[activeStep].visual}
                          alt=""
                          className="w-10 h-10 opacity-60"
                          style={{ filter: primaryFilter }}
                        />
                      </motion.div>
                      <p className="text-gray-400 text-sm text-center">
                        App screenshot for "{steps[activeStep].title}" step
                      </p>
                      <p className="text-gray-300 text-[10px] mt-1">(Replace with actual screenshot)</p>
                    </div>
                  </div>

                  {/* Navigation buttons */}
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      {steps.map((step, i) => (
                        <button
                          key={i}
                          onClick={() => setActiveStep(i)}
                          className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                            i === activeStep ? 'bg-primary scale-125' : 'bg-gray-300 hover:bg-gray-400'
                          }`}
                        />
                      ))}
                    </div>
                    {activeStep < steps.length - 1 ? (
                      <button
                        onClick={() => setActiveStep(activeStep + 1)}
                        className="text-sm text-white bg-primary px-5 py-2 rounded-full hover:bg-primary/90 transition-colors cursor-pointer shadow-sm"
                      >
                        Next Step →
                      </button>
                    ) : (
                      <button
                        onClick={() => setActiveStep(0)}
                        className="text-sm text-white bg-primary px-5 py-2 rounded-full hover:bg-primary/90 transition-colors cursor-pointer shadow-sm"
                      >
                        Start Over ↺
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
