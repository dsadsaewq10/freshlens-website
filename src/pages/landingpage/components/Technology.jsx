import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

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
    <section id="technology" className="bg-surface py-20 lg:py-28 min-h-screen flex items-center relative overflow-hidden">
      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -30, 0],
            x: [0, i % 2 === 0 ? 15 : -15, 0],
            opacity: [0.06, 0.15, 0.06],
          }}
          transition={{
            duration: 4 + i * 0.8,
            repeat: Infinity,
            delay: i * 0.7,
            ease: 'easeInOut',
          }}
          className="absolute w-2 h-2 bg-primary/20 rounded-full"
          style={{
            top: `${15 + i * 14}%`,
            left: `${8 + i * 16}%`,
          }}
        />
      ))}

      <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: '-80px' }}
          transition={{ duration: 0.6 }}
        >
          <div className="bg-white rounded-3xl p-10 lg:p-16 relative overflow-hidden border border-gray-100 shadow-sm">
            {/* Subtle gradient overlays */}
            <div className="absolute top-0 right-0 w-1/4 h-full bg-primary/3 rounded-l-full" />
            <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-primary/3 rounded-tr-full" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
              {/* Left - Text */}
              <div>
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-3xl lg:text-4xl font-bold text-accent mb-5"
                >
                  Powered by Advanced AI
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-gray-600 text-lg leading-relaxed mb-8"
                >
                  FreshLens uses a fine-tuned YOLOv8 model with TensorFlow Lite, 
                  trained on thousands of vegetable images for real-time 
                  freshness detection directly on mobile devices — no server required.
                </motion.p>

                <ul className="space-y-3 mb-10">
                  {highlights.map((item, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: false }}
                      transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
                      className="flex items-start gap-3"
                    >
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2.5 shrink-0" />
                      <span className="text-gray-500 leading-relaxed">{item}</span>
                    </motion.li>
                  ))}
                </ul>

                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="flex flex-wrap gap-3"
                >
                  <Link to="/technology" className="bg-primary text-white font-semibold px-7 py-3.5 rounded-full text-sm hover:bg-primary/90 hover:scale-105 transition-all">
                    Learn More
                  </Link>
                  <a href="https://github.com/dsadsaewq10/freshlens-website" target="_blank" rel="noopener noreferrer" className="border border-primary/30 text-primary font-semibold px-7 py-3.5 rounded-full text-sm hover:bg-primary/5 hover:scale-105 transition-all">
                    View on GitHub
                  </a>
                </motion.div>
              </div>

              {/* Right - Stats Grid */}
              <div className="grid grid-cols-2 gap-4 lg:mt-10">
                {stats.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 25, scale: 0.95 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: false }}
                    transition={{ duration: 0.4, delay: 0.15 + i * 0.07 }}
                    whileHover={{ scale: 1.05, borderColor: 'rgba(40,90,83,0.3)' }}
                    className="bg-primary/5 border border-primary/10 rounded-xl p-6 transition-all cursor-default"
                  >
                    <p className="text-gray-500 text-sm mb-2">{stat.label}</p>
                    <p className="text-accent font-bold text-xl">{stat.value}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Technology
