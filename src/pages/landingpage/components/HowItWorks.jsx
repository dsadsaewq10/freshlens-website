import React, { useState } from 'react'
import AnimatedSection from '../../../components/AnimatedSection'

function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0)

  const steps = [
    {
      title: 'Capture Image',
      description: 'Take a photo of the vegetable using your smartphone camera or upload an existing image.',
      details: [
        'Use your phone\'s camera for real-time detection.',
        'Or upload a saved image from your gallery for quick analysis.',
      ]
    },
    {
      title: 'AI Analysis',
      description: 'Our YOLOv8 model processes the image and analyzes visual features to detect freshness indicators.',
      details: [
        'YOLOv8 scans for color, texture, and decay patterns.',
        'Optimized TFLite model runs directly on your device for fast results.',
      ]
    },
    {
      title: 'Classification',
      description: 'The system classifies the vegetable into freshness categories with confidence scores.',
      details: [
        'Multi-class classification from Fresh to Spoiled.',
        'Confidence scores help you understand the reliability of each result.',
      ]
    },
    {
      title: 'Get Results',
      description: 'Receive instant results with detailed freshness assessment and recommendations.',
      details: [
        'Clear visual indicators show the freshness level at a glance.',
        'Actionable recommendations help you decide what to do next.',
      ]
    }
  ]

  return (
    <section id="how-it-works" className="bg-primary py-20 lg:py-28 relative overflow-hidden">
      {/* Subtle gradient overlays */}
      <div className="absolute top-0 right-0 w-1/5 h-1/2 bg-white/3 rounded-l-full" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-white/3 rounded-tr-full" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <AnimatedSection>
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-16">
            How FreshLens Works...
          </h2>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          
          {/* Left Side - Step Navigation */}
          <div className="lg:col-span-4">
            <div className="space-y-2">
              {steps.map((step, index) => (
                <button
                  key={step.title}
                  onClick={() => setActiveStep(index)}
                  className={`w-full text-left px-5 py-4 rounded-xl transition-all duration-300 cursor-pointer ${
                    activeStep === index
                      ? 'bg-white/10 border-l-4 border-white'
                      : 'border-l-4 border-transparent hover:bg-white/5'
                  }`}
                >
                  <span className={`text-lg font-semibold transition-colors ${
                    activeStep === index ? 'text-white' : 'text-white/40'
                  }`}>
                    {step.title}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Right Side - Active Step Content */}
          <div className="lg:col-span-8">
            <AnimatedSection key={activeStep}>
              <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4">
                {steps[activeStep].title}
              </h3>

              <div className="space-y-3 mb-8">
                {steps[activeStep].details.map((detail, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-white rounded-full mt-2.5 shrink-0" />
                    <p className="text-white/70 leading-relaxed">{detail}</p>
                  </div>
                ))}
              </div>

              {/* Visual Card */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 lg:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>

                {/* Step Visual */}
                <div className="grid grid-cols-4 gap-3 mb-6">
                  {steps.map((_, i) => (
                    <div
                      key={i}
                      className={`h-2 rounded-full transition-all duration-500 ${
                        i <= activeStep ? 'bg-white' : 'bg-white/10'
                      }`}
                    />
                  ))}
                </div>

                <div className="bg-white/5 rounded-xl p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold text-xl">
                        {String(activeStep + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <div>
                      <p className="text-white font-semibold text-lg">{steps[activeStep].title}</p>
                      <p className="text-white/60 text-sm">Step {activeStep + 1} of {steps.length}</p>
                    </div>
                  </div>
                  <p className="text-white/60 leading-relaxed">
                    {steps[activeStep].description}
                  </p>
                  
                  {/* Image Placeholder */}
                  <div className="mt-6 bg-white/10 rounded-lg overflow-hidden">
                    <div className="aspect-video flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                          <svg className="w-8 h-8 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <p className="text-white/40 text-sm">Step {activeStep + 1} Visual</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>

        </div>
      </div>
    </section>
  )
}

export default HowItWorks
