import React from 'react'
import { motion } from 'framer-motion'
import PhoneMockup from './PhoneMockup'

function Hero({ isLoaded }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  }

  return (
    <section className="bg-background w-full flex items-center pt-20 overflow-hidden relative">
      {/* Background floating particles */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -20, 0],
            x: [0, i % 2 === 0 ? 10 : -10, 0],
            opacity: [0.04, 0.1, 0.04],
          }}
          transition={{
            duration: 5 + i * 1.5,
            repeat: Infinity,
            delay: i * 1.2,
            ease: 'easeInOut',
          }}
          className="absolute rounded-full bg-primary/5"
          style={{
            width: 80 + i * 40,
            height: 80 + i * 40,
            top: `${10 + i * 20}%`,
            right: `${5 + i * 12}%`,
          }}
        />
      ))}
      <div className="max-w-6xl mx-auto px-6 w-full relative z-10">
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
              className="inline-block bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium "
            >
              YOLOv8 Powered
            </motion.span>

            <motion.h1
              variants={itemVariants}
              className="text-4xl lg:text-5xl xl:text-6xl font-bold text-accent leading-tight mb-6"
            >
              Know Your{' '}
              <span className="text-primary">Vegetables'</span> Freshness Instantly
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-gray-600 text-lg lg:text-xl mb-8 max-w-lg"
            >
              Point your phone, get instant AI-powered freshness analysis. 
              FreshLens detects and classifies vegetable quality in real-time — 
              no internet needed.
            </motion.p>


            {/* CTA Buttons */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
              <a
                href="#features"
                className="bg-primary hover:bg-primary/90 text-white px-8 py-3.5 rounded-xl font-semibold transition-colors text-center flex items-center justify-center gap-2 group"
              >
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Explore Features
              </a>
              <a
                href="#how-it-works"
                className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-3.5 rounded-xl font-semibold transition-colors text-center"
              >
                See How It Works
              </a>
            </motion.div>
          </motion.div>

          {/* Phone Mockup */}
          <div className="order-1 lg:order-2">
            <PhoneMockup isVisible={isLoaded} />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero