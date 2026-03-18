import React, { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import StepPhoneMockup from './StepPhoneMockup'

function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0)
  const sectionRef = useRef(null)
  const rightRef = useRef(null)
  const isHoveringRight = useRef(false)

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
      visual: '/assets/icons/icon_scan.svg',
    },
    {
      title: 'Analyze',
      description: 'YOLOv8 processes the image and analyzes visual features for freshness indicators.',
      icon: (
        <img src="/assets/icons/icon_analyze.png" alt="" className="w-6 h-6 brightness-0 invert" />
      ),
      details: [
        'YOLOv8 scans for color, texture, and decay patterns',
        'TFLite model runs directly on your device',
      ],
      visual: '/assets/icons/icon_accuracy.svg',
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
      visual: '/assets/icons/icon_fresh.svg',
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
      visual: '/assets/icons/icon_realtime.svg',
    },
  ]

  // Track hover state on right side
  const handleRightEnter = useCallback(() => { isHoveringRight.current = true }, [])
  const handleRightLeave = useCallback(() => { isHoveringRight.current = false }, [])

  // Scroll-based tab advancement when at the bottom of the section
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    let lastScrollTime = 0
    const handleWheel = (e) => {
      if (e.deltaY <= 0) return // only handle scrolling down

      const rect = section.getBoundingClientRect()
      const sectionBottom = rect.bottom
      const viewportHeight = window.innerHeight

      // Check if we're near the bottom of the section
      if (sectionBottom <= viewportHeight + 80) {
        if (isHoveringRight.current && activeStep < steps.length - 1) {
          const now = Date.now()
          if (now - lastScrollTime > 400) {
            lastScrollTime = now
            e.preventDefault()
            setActiveStep(prev => Math.min(prev + 1, steps.length - 1))
          }
        }
        // If hovering left or at last step, let default scroll behavior happen
      }
    }

    section.addEventListener('wheel', handleWheel, { passive: false })
    return () => section.removeEventListener('wheel', handleWheel)
  }, [activeStep, steps.length])

  return (
    <section ref={sectionRef} id="how-it-works" className="bg-primary pt-20 pb-16 lg:pt-32 lg:pb-24 min-h-screen flex items-start relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-[0.07]">
        <div className="absolute top-20 right-20 w-64 h-64 border border-white rounded-full" />
        <div className="absolute bottom-20 left-10 w-48 h-48 border border-white rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="mb-18"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-white">
            How FreshLens Works
          </h2>
        </motion.div>

        {/* Three-column layout: Left (step tabs), Center (content), Right (phone mockup) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-start">
          {/* ── LEFT: Step tabs only ── */}
          <div className="lg:col-span-3 flex flex-col">
            <div className="space-y-1.5">
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
          </div>

          {/* ── CENTER: Step content (text only) ── */}
          <div
            ref={rightRef}
            className="lg:col-span-5 lg:pl-6 lg:pr-4"
            onMouseEnter={handleRightEnter}
            onMouseLeave={handleRightLeave}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
              >
                {/* Step header */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-white/15 rounded-xl flex items-center justify-center text-white">
                    {steps[activeStep].icon}
                  </div>
                  <div>
                    <h3 className="text-3xl lg:text-4xl font-bold text-white">{steps[activeStep].title}</h3>
                  </div>
                </div>

                {/* Description */}
                <p className="text-white/80 text-lg leading-relaxed mb-8">
                  {steps[activeStep].description}
                </p>

                {/* Details */}
                <div className="space-y-5">
                  {steps[activeStep].details.map((detail, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center mt-0.5 shrink-0">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                      <p className="text-white/70 text-base leading-relaxed">{detail}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ── RIGHT: Phone Mockup ── */}
          <div className="lg:col-span-4 flex justify-center lg:justify-end items-center lg:sticky lg:top-24 pt-8 lg:pt-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, scale: 0.9, x: 30 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95, x: -20 }}
                transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <StepPhoneMockup step={activeStep} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
