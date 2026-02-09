import React from 'react'
import AnimatedSection from '../../../../components/AnimatedSection'

function Features() {
  const features = [
    {
      title: 'Real-Time Detection',
      description: 'Instant freshness analysis with sub-second processing using optimized YOLOv8 inference.'
    },
    {
      title: 'High Accuracy',
      description: '89% average accuracy across all vegetable classes for reliable freshness assessment.'
    },
    {
      title: 'Multi-Class Classification',
      description: 'Classify vegetables into 3-5 freshness levels from fresh to spoiled.'
    },
    {
      title: 'Offline Capable',
      description: 'Works without internet connection after initial model download for use anywhere.'
    },
    {
      title: 'Easy to Use',
      description: 'Simple point-and-scan interface designed for quick and intuitive operation.'
    },
    {
      title: 'Mobile Optimized',
      description: 'Lightweight model optimized for smooth performance on Android devices.'
    }
  ]

  return (
    <section id="features" className="bg-white py-20 lg:py-28">
      <div className="max-w-6xl mx-auto px-6">
        <AnimatedSection className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-accent mb-4">
            Key Features
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            FreshLens combines cutting-edge AI technology with an intuitive 
            interface to deliver accurate vegetable freshness detection.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <AnimatedSection key={feature.title} delay={index * 0.1}>
              <div className="bg-background rounded-2xl p-6 h-full hover:shadow-lg transition-shadow">
                {/* Icon placeholder */}
                <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center mb-5">
                  {/* PLACEHOLDER: Add feature icon here */}
                  <div className="w-7 h-7 bg-white/30 rounded-lg" />
                </div>
                
                <h3 className="text-xl font-semibold text-accent mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features
