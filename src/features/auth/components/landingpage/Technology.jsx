import React from 'react'
import AnimatedSection from '../../../../components/AnimatedSection'

function Technology() {
  const technologies = [
    {
      title: 'YOLOv8',
      subtitle: 'Object Detection',
      description: 'State-of-the-art real-time object detection model optimized for speed and accuracy in vegetable classification tasks.',
      stats: [
        { label: 'Detection Speed', value: '<50ms' },
        { label: 'Accuracy', value: '89%+' }
      ]
    },
    {
      title: 'Computer Vision',
      subtitle: 'Image Analysis',
      description: 'Advanced image processing techniques to extract visual features like color, texture, and shape for freshness assessment.',
      stats: [
        { label: 'Resolution', value: '640px' },
        { label: 'Formats', value: 'JPG/PNG' }
      ]
    },
    {
      title: 'Deep Learning',
      subtitle: 'Neural Networks',
      description: 'Convolutional neural networks trained on thousands of annotated vegetable images for reliable freshness classification.',
      stats: [
        { label: 'Training Images', value: '9,355+' },
        { label: 'Classes', value: '3-5' }
      ]
    }
  ]

  return (
    <section id="technology" className="bg-primary py-20 lg:py-28">
      <div className="max-w-6xl mx-auto px-6">
        <AnimatedSection className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Powered by Advanced Technology
          </h2>
          <p className="text-white/80 max-w-2xl mx-auto text-lg">
            FreshLens leverages cutting-edge AI and computer vision technologies 
            to deliver accurate and reliable freshness detection.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {technologies.map((tech, index) => (
            <AnimatedSection key={tech.title} delay={index * 0.15}>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-colors h-full">
                {/* Icon placeholder */}
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-6">
                  {/* PLACEHOLDER: Add technology icon here */}
                  <div className="w-8 h-8 bg-white/30 rounded-lg" />
                </div>

                <div className="mb-4">
                  <h3 className="text-2xl font-bold text-white mb-1">
                    {tech.title}
                  </h3>
                  <span className="text-primary/60 text-white/60 text-sm font-medium">
                    {tech.subtitle}
                  </span>
                </div>

                <p className="text-white/80 mb-6 leading-relaxed">
                  {tech.description}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/20">
                  {tech.stats.map((stat) => (
                    <div key={stat.label}>
                      <p className="text-2xl font-bold text-white">{stat.value}</p>
                      <p className="text-white/60 text-sm">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Additional tech info */}
        <AnimatedSection delay={0.4}>
          <div className="mt-16 bg-white/5 rounded-2xl p-8 border border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Model Architecture
                </h3>
                <p className="text-white/80 leading-relaxed mb-4">
                  Our system uses a fine-tuned YOLOv8 model specifically trained 
                  for vegetable freshness detection. The model processes images 
                  through multiple convolutional layers to extract features and 
                  classify freshness levels with high accuracy.
                </p>
                <ul className="space-y-2 text-white/70">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-white/50 rounded-full" />
                    Real-time inference on mobile devices
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-white/50 rounded-full" />
                    Optimized for Android deployment
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-white/50 rounded-full" />
                    Continuous model improvements
                  </li>
                </ul>
              </div>
              
              {/* Architecture diagram placeholder */}
              <div className="bg-white/10 rounded-xl h-64 flex items-center justify-center">
                {/* PLACEHOLDER: Add model architecture diagram here */}
                <div className="text-center text-white/50">
                  <div className="w-16 h-16 bg-white/20 rounded-lg mx-auto mb-4" />
                  <p className="font-medium">Architecture Diagram</p>
                  <p className="text-sm">Add your diagram asset here</p>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}

export default Technology
