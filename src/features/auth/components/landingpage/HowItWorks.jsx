import React from 'react'
import AnimatedSection from '../../../../components/AnimatedSection'

function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'Capture Image',
      description: 'Take a photo of the vegetable using your smartphone camera or upload an existing image.'
    },
    {
      number: '02',
      title: 'AI Analysis',
      description: 'Our YOLOv8 model processes the image and analyzes visual features to detect freshness indicators.'
    },
    {
      number: '03',
      title: 'Classification',
      description: 'The system classifies the vegetable into freshness categories with confidence scores.'
    },
    {
      number: '04',
      title: 'Get Results',
      description: 'Receive instant results with detailed freshness assessment and recommendations.'
    }
  ]

  return (
    <section id="how-it-works" className="bg-background py-20 lg:py-28">
      <div className="max-w-6xl mx-auto px-6">
        <AnimatedSection className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-accent mb-4">
            How It Works
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            FreshLens uses advanced computer vision to analyze vegetable freshness 
            in just a few simple steps.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <AnimatedSection key={step.number} delay={index * 0.1}>
              <div className="relative">
                {/* Connector line for desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-primary/20 -z-10" />
                )}
                
                <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  {/* Step number */}
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-6">
                    <span className="text-white font-bold text-xl">{step.number}</span>
                  </div>

                  {/* Icon placeholder */}
                  <div className="w-12 h-12 bg-background rounded-lg flex items-center justify-center mb-4">
                    {/* PLACEHOLDER: Add step icon here */}
                    <div className="w-6 h-6 bg-primary/20 rounded" />
                  </div>

                  <h3 className="text-xl font-semibold text-accent mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">
                    {step.description}
                  </p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
