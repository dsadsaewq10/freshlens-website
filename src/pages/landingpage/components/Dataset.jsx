import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

function Dataset() {
  // Dataset statistics - update these with actual values
  const stats = [
    { value: '9,355+', label: 'Total Images', description: 'Annotated samples' },
    { value: '4', label: 'Vegetable Types', description: 'Carrot, Tomato, Cabbage, Pepper' },
    { value: '3-5', label: 'Freshness Classes', description: 'Per vegetable type' },
    { value: '100%', label: 'Open Source', description: 'Free to use' }
  ]

  return (
    <section id="dataset" className="bg-background py-20 lg:py-28 min-h-screen flex items-center relative overflow-hidden">
      {/* Floating particles */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -25, 0],
            opacity: [0.05, 0.15, 0.05],
          }}
          transition={{
            duration: 5 + i,
            repeat: Infinity,
            delay: i * 0.9,
            ease: 'easeInOut',
          }}
          className="absolute w-3 h-3 bg-primary/10 rounded-full"
          style={{
            top: `${20 + i * 15}%`,
            right: `${5 + i * 18}%`,
          }}
        />
      ))}

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            Open Source
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold text-accent mb-4">
            Dataset Collection
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Access our curated vegetable freshness datasets for research, 
            education, and development. Completely free and open source.
          </p>
        </motion.div>


        {/* Open Source Banner */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: '-80px' }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="bg-primary rounded-2xl p-8 mb-16 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
            </div>

            <div className="relative grid md:grid-cols-2 gap-8 items-center">
              <div>
                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-2xl lg:text-3xl font-bold text-white mb-4"
                >
                  Free & Open Source
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="text-white/80 mb-6 leading-relaxed"
                >
                  We believe in open science. Our datasets are freely available 
                  for researchers, students, and developers. Use them to train 
                  your own models, validate research, or build innovative applications.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="flex flex-wrap gap-3"
                >
                  <Link
                    to="/dataset"
                    className="bg-white text-primary px-6 py-3 rounded-xl font-semibold hover:bg-white/90 hover:scale-105 transition-all inline-flex items-center gap-2"
                  >
                    <span>View Datasets</span>
                  </Link>
                  <a
                    href="#"
                    className="border-2 border-white text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/10 hover:scale-105 transition-all inline-flex items-center gap-2"
                  >
                    <span>View on GitHub</span>
                  </a>
                </motion.div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Total Images', value: '9,355+' },
                  { label: 'Format', value: 'YOLO / COCO' },
                  { label: 'Resolution', value: '640 x 640' },
                  { label: 'Last Updated', value: 'January 2026' },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: false }}
                    transition={{ duration: 0.4, delay: 0.25 + i * 0.08 }}
                    whileHover={{ scale: 1.05 }}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 cursor-default transition-all"
                  >
                    <p className="text-white/60 text-sm mb-1">{stat.label}</p>
                    <p className="text-white font-semibold">{stat.value}</p>
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

export default Dataset