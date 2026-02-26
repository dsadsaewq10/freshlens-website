import React from 'react'
import AnimatedSection from '../../../components/AnimatedSection'

function Benefits() {
  const benefits = [
    {
      category: 'Sustainability',
      title: 'Reduce Food Waste',
      description: 'Make informed decisions about vegetable quality to minimize unnecessary waste and maximize freshness.',
      icon: '/assets/icons/icon_foodwaste.svg'
    },
    {
      category: 'Efficiency',
      title: 'Save Time',
      description: 'Instant classification results eliminate guesswork and speed up quality assessment processes.',
      icon: '/assets/icons/icon_realtime.svg'
    },
    {
      category: 'Economics',
      title: 'Cost Savings',
      description: 'Avoid purchasing spoiled vegetables and optimize inventory management with accurate freshness data.',
      icon: '/assets/icons/icon_affordable.svg'
    },
    {
      category: 'Accessibility',
      title: 'Easy to Use',
      description: 'Simple point-and-scan interface makes freshness detection accessible to everyone, no expertise required.',
      icon: '/assets/icons/icon_scan.svg'
    },
    {
      category: 'Accuracy',
      title: 'Reliable Results',
      description: 'AI-powered analysis provides consistent and objective freshness assessments you can trust.',
      icon: '/assets/icons/icon_accuracy.svg'
    },
    {
      category: 'Mobility',
      title: 'Mobile Ready',
      description: 'Use FreshLens anywhere with our Android app - at the grocery store, restaurant, or home.',
      icon: '/assets/icons/icon_mobile.svg'
    }
  ]

  return (
    <section id="benefits" className="bg-white py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20">
          
          {/* Left Side - Heading & Description */}
          <AnimatedSection>
            <span className="text-primary font-medium text-sm mb-3 block">
              / Why FreshLens?
            </span>
            <h2 className="text-4xl lg:text-5xl font-bold text-accent leading-tight mb-6">
              The FreshLens Difference
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              Built with cutting-edge YOLOv8 technology, FreshLens delivers 
              accurate vegetable freshness detection you can rely on — whether 
              at home, in the store, or across the supply chain.
            </p>
            <div className="flex items-center gap-6">
              <a href="#features" className="text-primary font-semibold flex items-center gap-2 hover:gap-3 transition-all">
                Explore Features <span>›</span>
              </a>
            </div>
          </AnimatedSection>

          {/* Right Side - Benefits Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
            {benefits.map((benefit, index) => (
              <AnimatedSection key={benefit.title} delay={index * 0.1}>
                <div className={`py-6 ${index < benefits.length - 2 ? 'border-b border-gray-100' : ''}`}>
                  <div className="flex gap-4 items-start">
                    {/* Icon */}
                    <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                      <img src={benefit.icon} alt={benefit.title} className="w-7 h-7" style={{ filter: 'brightness(0) saturate(100%) invert(29%) sepia(15%) saturate(1200%) hue-rotate(120deg) brightness(95%) contrast(90%)' }} />
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1">
                      <span className="text-primary font-medium text-xs block">
                        {benefit.category}
                      </span>
                      <h3 className="text-lg font-bold text-accent mb-1">
                        {benefit.title}
                      </h3>
                      <p className="text-gray-500 text-sm leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}

export default Benefits
