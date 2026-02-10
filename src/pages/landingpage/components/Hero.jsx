import React from 'react'
import { motion } from 'framer-motion'
import PhoneMockup from './PhoneMockup'

function Hero({ isLoaded }) {
  // Animation variants for staggered entrance after splash
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  }

  return (
    <section className="bg-background w-full flex items-center pt-20 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isLoaded ? 'visible' : 'hidden'}
            className="order-2 lg:order-1"
          >
            <motion.span
              variants={itemVariants}
              className="inline-block bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-6"
            >
              YOLOv8 Powered
            </motion.span>

            <motion.h1
              variants={itemVariants}
              className="text-4xl lg:text-5xl xl:text-6xl font-bold text-accent leading-tight mb-6"
            >
              Smart Vegetable{' '}
              <span className="text-primary">Freshness</span> Detection
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-gray-600 text-lg lg:text-xl mb-8 max-w-lg"
            >
              FreshLens uses advanced computer vision and YOLOv8 deep learning 
              to instantly classify vegetable freshness with high accuracy.
            </motion.p>


            {/* CTA Buttons */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
              <a
                href="#download"
                className="bg-primary hover:bg-primary/90 text-white px-8 py-3.5 rounded-xl font-semibold transition-colors text-center"
              >
                Download App
              </a>
              <a
                href="#how-it-works"
                className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-3.5 rounded-xl font-semibold transition-colors text-center"
              >
                Learn More
              </a>
            </motion.div>
          </motion.div>

          {/* Enhanced Phone Mockup with Advanced Animations */}
          <div className="order-1 lg:order-2">
            <PhoneMockup isVisible={isLoaded} />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero