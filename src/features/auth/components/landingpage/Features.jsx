import React from 'react'
import AnimatedSection from '../../../../components/AnimatedSection'
import realtimeIcon from '../../../../assets/icons/realtime.svg'
import accuracyIcon from '../../../../assets/icons/accuracy.svg'
import freshIcon from '../../../../assets/icons/fresh.svg'
import offlineIcon from '../../../../assets/icons/offline.svg'
import scanIcon from '../../../../assets/icons/scan.svg'
import mobileIcon from '../../../../assets/icons/mobile.svg'

function Features() {
  const features = [
    {
      title: 'Real-Time Detection',
      description: 'Instant freshness analysis with sub-second processing using optimized YOLOv8 inference.',
      icon: realtimeIcon
    },
    {
      title: 'High Accuracy',
      description: '89% average accuracy across all vegetable classes for reliable freshness assessment.',
      icon: accuracyIcon
    },
    {
      title: 'Multi-Class Classification',
      description: 'Classify vegetables into 3-5 freshness levels from fresh to spoiled.',
      icon: freshIcon
    },
    {
      title: 'Offline Capable',
      description: 'Works without internet connection after initial model download for use anywhere.',
      icon: offlineIcon
    },
    {
      title: 'Easy to Use',
      description: 'Simple point-and-scan interface designed for quick and intuitive operation.',
      icon: scanIcon
    },
    {
      title: 'Mobile Optimized',
      description: 'Lightweight model optimized for smooth performance on Android devices.',
      icon: mobileIcon
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
                {/* Icon */}
                <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center mb-5">
                  <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center">
                    <img src={feature.icon} alt={feature.title} className="w-6 h-6 brightness-0 invert" />
                  </div>
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
