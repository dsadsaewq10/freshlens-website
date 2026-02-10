import React from 'react'
import AnimatedSection from '../../../components/AnimatedSection'

function Technology() {
  const stats = [
    { label: 'Model', value: 'YOLOv8' },
    { label: 'Accuracy', value: '89%+' },
    { label: 'Inference Speed', value: '<50ms' },
    { label: 'Training Images', value: '9,355+' },
    { label: 'Resolution', value: '640×640' },
    { label: 'Classes', value: '3–5' }
  ]

  const highlights = [
    'Fine-tuned YOLOv8 for vegetable freshness classification',
    'TensorFlow Lite optimized for on-device mobile inference',
    'Multi-class detection from Fresh to Spoiled with confidence scores',
    'Trained on a curated dataset of annotated vegetable images'
  ]

  return (
    <section id="technology" className="bg-background py-20 lg:py-28 min-h-screen flex items-center">
      <div className="max-w-6xl mx-auto px-6 w-full">
        <AnimatedSection>
          <div className="bg-primary rounded-3xl p-10 lg:p-16 relative overflow-hidden">
            {/* Subtle gradient overlays */}
            <div className="absolute top-0 right-0 w-1/4 h-full bg-white/3 rounded-l-full" />
            <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-white/3 rounded-tr-full" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
              {/* Left - Text */}
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-white mb-5">
                  Powered by Advanced AI
                </h2>
                <p className="text-white/70 text-lg leading-relaxed mb-8">
                  FreshLens uses a fine-tuned YOLOv8 model with TensorFlow Lite, 
                  trained on thousands of vegetable images for real-time 
                  freshness detection directly on mobile devices — no server required.
                </p>

                <ul className="space-y-3 mb-10">
                  {highlights.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-white/50 rounded-full mt-2.5 shrink-0" />
                      <span className="text-white/60 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-3">
                  <a href="#how-it-works" className="bg-white text-primary font-semibold px-7 py-3.5 rounded-full text-sm hover:bg-white/90 transition-colors">
                    Learn More
                  </a>
                  <a href="https://github.com/dsadsaewq10/freshlens-website" target="_blank" rel="noopener noreferrer" className="border border-white/30 text-white font-semibold px-7 py-3.5 rounded-full text-sm hover:bg-white/10 transition-colors">
                    View on GitHub
                  </a>
                </div>
              </div>

              {/* Right - Stats Grid */}
              <div className="grid grid-cols-2 gap-4 lg:mt-10">
                {stats.map((stat) => (
                  <div key={stat.label} className="bg-white/10 border border-white/15 rounded-xl p-6">
                    <p className="text-white/50 text-sm mb-2">{stat.label}</p>
                    <p className="text-white font-bold text-xl">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}

export default Technology
