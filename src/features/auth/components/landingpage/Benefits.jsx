import React from 'react'
import AnimatedSection from '../../../../components/AnimatedSection'

function Benefits() {
  const benefits = [
    {
      title: 'Reduce Food Waste',
      description: 'Make informed decisions about vegetable quality to minimize unnecessary waste and maximize freshness.',
      category: 'Sustainability'
    },
    {
      title: 'Save Time',
      description: 'Instant classification results eliminate guesswork and speed up quality assessment processes.',
      category: 'Efficiency'
    },
    {
      title: 'Cost Savings',
      description: 'Avoid purchasing spoiled vegetables and optimize inventory management with accurate freshness data.',
      category: 'Economics'
    },
    {
      title: 'Easy to Use',
      description: 'Simple point-and-scan interface makes freshness detection accessible to everyone, no expertise required.',
      category: 'Accessibility'
    },
    {
      title: 'Reliable Results',
      description: 'AI-powered analysis provides consistent and objective freshness assessments you can trust.',
      category: 'Accuracy'
    },
    {
      title: 'Mobile Ready',
      description: 'Use FreshLens anywhere with our Android app - at the grocery store, restaurant, or home.',
      category: 'Mobility'
    }
  ]

  const useCases = [
    {
      title: 'Grocery Shopping',
      description: 'Scan vegetables before purchase to ensure you are getting the freshest produce available.'
    },
    {
      title: 'Restaurant Kitchens',
      description: 'Quality control for incoming produce deliveries to maintain food safety standards.'
    },
    {
      title: 'Home Use',
      description: 'Check stored vegetables to plan meals and reduce household food waste.'
    },
    {
      title: 'Supply Chain',
      description: 'Monitor produce quality throughout distribution for better inventory management.'
    }
  ]

  return (
    <section id="benefits" className="bg-background py-20 lg:py-28">
      <div className="max-w-6xl mx-auto px-6">
        {/* Benefits Grid */}
        <AnimatedSection className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-accent mb-4">
            Why Choose FreshLens?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Experience the advantages of AI-powered vegetable freshness detection 
            in your daily life.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {benefits.map((benefit, index) => (
            <AnimatedSection key={benefit.title} delay={index * 0.08}>
              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 h-full">
                {/* Icon placeholder */}
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  {/* PLACEHOLDER: Add benefit icon here */}
                  <div className="w-6 h-6 bg-primary/30 rounded" />
                </div>
                
                <span className="text-primary text-sm font-medium">
                  {benefit.category}
                </span>
                <h3 className="text-xl font-semibold text-accent mt-1 mb-3">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">
                  {benefit.description}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Use Cases */}
        <AnimatedSection className="text-center mb-12">
          <h3 className="text-2xl lg:text-3xl font-bold text-accent mb-4">
            Use Cases
          </h3>
          <p className="text-gray-600 max-w-xl mx-auto">
            FreshLens is designed for various scenarios where vegetable quality matters.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {useCases.map((useCase, index) => (
            <AnimatedSection key={useCase.title} delay={index * 0.1}>
              <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-primary flex gap-4">
                {/* Icon placeholder */}
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                  {/* PLACEHOLDER: Add use case icon here */}
                  <div className="w-6 h-6 bg-white/30 rounded" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-accent mb-2">
                    {useCase.title}
                  </h4>
                  <p className="text-gray-600">
                    {useCase.description}
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

export default Benefits
