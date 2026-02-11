import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0)

  const steps = [
    {
      title: 'Capture',
      description: 'Point your camera at any vegetable or upload an image from your gallery.',
      icon: (
        <img src="/assets/icons/icon_outline_camera.svg" alt="" className="w-6 h-6 brightness-0 invert" />
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
        <img src="/assets/icons/icon_imageprocessing.png" alt="" className="w-6 h-6 brightness-0 invert" />
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
        <img src="/assets/icons/icon_classification.png" alt="" className="w-6 h-6 brightness-0 invert" />
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
        <img src="/assets/icons/icon_outline_check.svg" alt="" className="w-6 h-6 brightness-0 invert" />
      ),
      details: [
        'Clear visual indicators show freshness level at a glance',
        'Actionable recommendations help you decide what to do next',
      ],
      visual: '/assets/icons/realtime.svg',
    },
  ]

  return (
    <section id="how-it-works" className="bg-primary py-20 lg:py-28 relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-[0.07]">
        <div className="absolute top-20 right-20 w-64 h-64 border border-white rounded-full" />
        <div className="absolute bottom-20 left-10 w-48 h-48 border border-white rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-white rounded-full" />
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
          <span className="text-white/60 text-sm font-medium tracking-wider uppercase mb-3 block">
            Simple Process
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold text-white">
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
                      ? 'bg-white/10 border-l-4 border-white'
                      : 'border-l-4 border-transparent hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                        activeStep === index
                          ? 'bg-white/15 text-white'
                          : 'bg-white/10 text-white/40'
                      }`}
                    >
                      {step.icon}
                    </div>
                    <div>
                      <span
                        className={`text-base font-semibold block transition-colors ${
                          activeStep === index ? 'text-white' : 'text-white/50'
                        }`}
                      >
                        {step.title}
                      </span>
                      <span className="text-[11px] text-white/40">
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
                className="bg-white/10 rounded-xl p-5 border border-white/10 shadow-sm mt-auto"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center text-white">
                    {steps[activeStep].icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{steps[activeStep].title}</h3>
                    <p className="text-white/40 text-xs">Step {activeStep + 1} of {steps.length}</p>
                  </div>
                </div>
                <p className="text-white/70 text-sm leading-relaxed mb-3">
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
                      <div className="w-4 h-4 bg-white/15 rounded-full flex items-center justify-center mt-0.5 shrink-0">
                        <div className="w-1.5 h-1.5 bg-white rounded-full" />
                      </div>
                      <p className="text-white/60 text-xs leading-relaxed">{detail}</p>
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
                <div className="bg-white/10 border border-white/10 rounded-2xl p-5 shadow-sm">
                  {/* Step progress bar */}
                  <div className="grid grid-cols-4 gap-2 mb-5">
                    {steps.map((_, i) => (
                      <div key={i} className="relative">
                        <div
                          className={`h-1.5 rounded-full transition-all duration-500 ${
                            i <= activeStep ? 'bg-white' : 'bg-white/20'
                          }`}
                        />
                        {i === activeStep && (
                          <motion.div
                            layoutId="stepIndicator"
                            className="absolute -top-1 right-0 w-3.5 h-3.5 bg-white rounded-full border-2 border-primary shadow-sm"
                            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                          />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* App screenshot placeholder */}
                  <div className="bg-white/5 rounded-xl overflow-hidden border border-white/10 mb-4">
                    <div className="aspect-[16/9] flex flex-col items-center justify-center p-8">
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.4 }}
                        className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center mb-4"
                      >
                        <img
                          src={steps[activeStep].visual}
                          alt=""
                          className="w-10 h-10 opacity-60 invert"
                        />
                      </motion.div>
                      <p className="text-white/50 text-sm text-center">
                        App screenshot for "{steps[activeStep].title}" step
                      </p>
                      <p className="text-white/30 text-[10px] mt-1">(Replace with actual screenshot)</p>
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
                            i === activeStep ? 'bg-white scale-125' : 'bg-white/30 hover:bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                    {activeStep < steps.length - 1 ? (
                      <button
                        onClick={() => setActiveStep(activeStep + 1)}
                        className="text-sm text-primary bg-white px-5 py-2 rounded-full hover:bg-white/90 transition-colors cursor-pointer shadow-sm"
                      >
                        Next Step →
                      </button>
                    ) : (
                      <button
                        onClick={() => setActiveStep(0)}
                        className="text-sm text-primary bg-white px-5 py-2 rounded-full hover:bg-white/90 transition-colors cursor-pointer shadow-sm"
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
