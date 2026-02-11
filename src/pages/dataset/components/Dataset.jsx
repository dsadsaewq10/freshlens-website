import React, { useRef, useEffect, useState } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import Header from '../../landingpage/components/Header'

// Color palette
const COLORS = {
  primary: '#285A53',
  medium: '#3E6963',
  light: '#F5F5F5',
  darker: '#EDEDED',
  white: '#FFFFFF',
  dark: '#1B413B',
}

// Dataset information
const datasets = [
  {
    id: 'cabbage',
    name: 'Cabbage Dataset',
    description:
      'Annotated images of cabbages at various freshness stages, captured under controlled and natural lighting conditions. Each image is labeled with bounding boxes in YOLO format.',
    images: 2450,
    classes: ['Fresh', 'Mild Decay', 'Moderate Decay', 'Severe Decay', 'Spoiled'],
    format: 'YOLO Format (.txt)',
    resolution: '640 x 640',
    size: '~320 MB',
    thumbnail: '/assets/icons/cabbage.webp',
    sampleImages: ['/assets/icons/cabbage.webp'],
    downloadUrl: '#', // PLACEHOLDER: Add actual download URL
    lastUpdated: 'January 2026',
  },
  {
    id: 'tomato',
    name: 'Tomato Dataset',
    description:
      'A curated collection of tomato images classified into three freshness levels. Captured across different environments to ensure the model works well in real-world conditions.',
    images: 2800,
    classes: ['Fresh', 'Half Fresh', 'Spoiled'],
    format: 'YOLO Format (.txt)',
    resolution: '640 x 640',
    size: '~380 MB',
    thumbnail: '/assets/icons/tomato.png',
    sampleImages: ['/assets/icons/tomato.png'],
    downloadUrl: '#', // PLACEHOLDER: Add actual download URL
    lastUpdated: 'January 2026',
  },
  {
    id: 'carrot',
    name: 'Carrot Dataset',
    description:
      'Comprehensive carrot image dataset featuring four freshness categories. Images include whole carrots and cross-sections for thorough classification training.',
    images: 2100,
    classes: ['Fresh', 'Mild Decay', 'Moderate Decay', 'Spoiled'],
    format: 'YOLO Format (.txt)',
    resolution: '640 x 640',
    size: '~290 MB',
    thumbnail: '/assets/icons/carrot.png',
    sampleImages: ['/assets/icons/carrot.png'],
    downloadUrl: '#', // PLACEHOLDER: Add actual download URL
    lastUpdated: 'January 2026',
  },
  {
    id: 'pepper',
    name: 'Pepper Dataset',
    description:
      'Bell pepper images annotated with five distinct freshness levels. The dataset covers green, red, and yellow pepper varieties for comprehensive detection.',
    images: 2005,
    classes: ['Fresh', 'Mild Decay', 'Moderate Decay', 'Severe Decay', 'Spoiled'],
    format: 'YOLO Format (.txt)',
    resolution: '640 x 640',
    size: '~270 MB',
    thumbnail: '/assets/icons/pepper.png',
    sampleImages: ['/assets/icons/pepper.png'],
    downloadUrl: '#', // PLACEHOLDER: Add actual download URL
    lastUpdated: 'January 2026',
  },
]

// Aggregate stats
const totalImages = datasets.reduce((sum, d) => sum + d.images, 0)
const totalClasses = [...new Set(datasets.flatMap((d) => d.classes))].length
const totalVegetables = datasets.length

// Dataset preview modal
function DatasetModal({ dataset, isOpen, onClose }) {
  if (!dataset) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors z-10"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Header with thumbnail */}
            <div className="relative h-48 md:h-56 overflow-hidden rounded-t-2xl" style={{ background: COLORS.primary }}>
              <div className="absolute inset-0 flex items-center justify-center">
                <img
                  src={dataset.thumbnail}
                  alt={dataset.name}
                  className="w-28 h-28 object-contain drop-shadow-2xl"
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/40 to-transparent">
                <h2 className="text-2xl md:text-3xl font-bold text-white">{dataset.name}</h2>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 md:p-8">
              <p className="text-gray-600 leading-relaxed mb-5">{dataset.description}</p>

              {/* Stats grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {[
                  { value: dataset.images.toLocaleString(), label: 'Total Images' },
                  { value: dataset.classes.length, label: 'Classes' },
                  { value: dataset.resolution, label: 'Resolution' },
                  { value: dataset.size, label: 'Dataset Size' },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-xl p-3 text-center" style={{ background: COLORS.light }}>
                    <p className="text-xl font-bold" style={{ color: COLORS.primary }}>{stat.value}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Classes */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold uppercase tracking-wider mb-2.5" style={{ color: COLORS.medium }}>
                  Freshness Classes
                </h3>
                <div className="flex flex-wrap gap-2">
                  {dataset.classes.map((cls, i) => (
                    <span
                      key={cls}
                      className="px-3 py-1.5 rounded-lg text-sm font-medium"
                      style={{
                        background: i === 0 ? `${COLORS.primary}15` : i === dataset.classes.length - 1 ? '#fee2e2' : '#f3f4f6',
                        color: i === 0 ? COLORS.primary : i === dataset.classes.length - 1 ? '#dc2626' : '#374151',
                      }}
                    >
                      {cls}
                    </span>
                  ))}
                </div>
              </div>

              {/* Sample images */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold uppercase tracking-wider mb-2.5" style={{ color: COLORS.medium }}>
                  Sample Images
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="aspect-square rounded-xl overflow-hidden border border-gray-200 flex items-center justify-center"
                      style={{ background: COLORS.light }}
                    >
                      {dataset.sampleImages[i] ? (
                        <img
                          src={dataset.sampleImages[i]}
                          alt={`Sample ${i + 1}`}
                          className="w-full h-full object-contain p-4"
                        />
                      ) : (
                        <div className="text-center p-4">
                          <svg className="w-8 h-8 mx-auto mb-2 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                          </svg>
                          <p className="text-xs text-gray-400">Sample {i + 1}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Meta info */}
              <div className="flex flex-col sm:flex-row gap-3 mb-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Format: {dataset.format}
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Updated: {dataset.lastUpdated}
                </div>
              </div>

              {/* Download button */}
              <motion.a
                href={dataset.downloadUrl}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-3 w-full py-3.5 rounded-xl text-white font-bold text-lg shadow-lg hover:shadow-xl transition-shadow"
                style={{ background: COLORS.primary }}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Dataset
              </motion.a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Hero section (plays on mount only)
function HeroSection() {
  return (
    <section
      className="min-h-screen flex items-center justify-center relative overflow-hidden snap-start"
      style={{ background: COLORS.light }}
    >
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(${COLORS.primary} 1px, transparent 1px)`,
            backgroundSize: '30px 30px',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-20 pb-12 w-full relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-5"
            style={{ background: `${COLORS.primary}15`, color: COLORS.primary }}
          >
            Open Source Datasets
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5 leading-tight"
            style={{ color: COLORS.primary }}
          >
            Training Data for{' '}
            <span style={{ color: COLORS.medium }}>Freshness Detection</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-lg text-gray-600 mb-10 leading-relaxed"
          >
            Browse and download the annotated vegetable image datasets used to
            train FreshLens. All datasets are freely available for research and
            development purposes.
          </motion.p>

          {/* Aggregate stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="grid grid-cols-3 gap-6 max-w-lg mx-auto"
          >
            {[
              { value: `${totalImages.toLocaleString()}+`, label: 'Total Images' },
              { value: totalVegetables, label: 'Vegetables' },
              { value: totalClasses, label: 'Unique Classes' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl md:text-4xl font-bold" style={{ color: COLORS.primary }}>
                  {stat.value}
                </p>
                <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
        >
          <span className="text-xs font-medium" style={{ color: COLORS.medium }}>
            Scroll to explore
          </span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
            <svg className="w-5 h-5" style={{ color: COLORS.primary }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

// Dataset grid section — animations replay
function DatasetGridSection({ onSelectDataset }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.15 })

  return (
    <section
      ref={ref}
      className="min-h-screen flex items-center snap-start relative overflow-hidden"
      style={{ background: COLORS.darker }}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full" style={{ background: `${COLORS.primary}08` }} />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full" style={{ background: `${COLORS.primary}08` }} />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 w-full relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-4" style={{ background: `${COLORS.primary}15`, color: COLORS.primary }}>
            Available Datasets
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3" style={{ color: COLORS.primary }}>
            Choose a Dataset
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto text-lg">
            Click on any dataset card to preview sample images, view statistics,
            and download the full dataset.
          </p>
        </motion.div>

        {/* Dataset cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
          {datasets.map((dataset, i) => (
            <motion.div
              key={dataset.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ delay: 0.1 + i * 0.08, duration: 0.6 }}
              whileHover={{ scale: 1.03, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectDataset(dataset)}
              className="bg-white rounded-2xl p-5 border border-gray-200 cursor-pointer hover:shadow-lg transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl flex items-center justify-center shrink-0 overflow-hidden group-hover:scale-105 transition-transform" style={{ background: COLORS.light }}>
                  <img
                    src={dataset.thumbnail}
                    alt={dataset.name}
                    className="w-12 h-12 object-contain"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold mb-1" style={{ color: COLORS.primary }}>{dataset.name}</h3>
                  <p className="text-gray-500 text-sm line-clamp-2 mb-2.5">
                    {dataset.description}
                  </p>
                  <div className="flex flex-wrap gap-3 text-xs">
                    <span className="flex items-center gap-1 text-gray-500">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {dataset.images.toLocaleString()} images
                    </span>
                    <span className="flex items-center gap-1 text-gray-500">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      {dataset.classes.length} classes
                    </span>
                    <span className="flex items-center gap-1 text-gray-500">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                      </svg>
                      {dataset.size}
                    </span>
                  </div>
                </div>

                <div className="shrink-0 self-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg className="w-5 h-5" style={{ color: `${COLORS.primary}60` }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Dataset statistics section — animations replay
function StatsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.15 })

  const maxImages = Math.max(...datasets.map((d) => d.images))

  return (
    <section
      ref={ref}
      className="min-h-screen flex items-center snap-start relative overflow-hidden"
      style={{ background: COLORS.primary }}
    >
      <div className="max-w-7xl mx-auto px-6 py-16 w-full relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-4 bg-white/10 text-white/80">
            Dataset Analytics
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3">
            By the Numbers
          </h2>
          <p className="text-white/70 max-w-xl mx-auto text-lg">
            A visual breakdown of our dataset composition and distribution
            across vegetable types and freshness levels.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Bar chart */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-7 border border-white/10"
          >
            <h3 className="text-lg font-bold text-white mb-5">Image Distribution</h3>
            <div className="space-y-4">
              {datasets.map((d, i) => (
                <div key={d.id}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-white/80">{d.name.replace(' Dataset', '')}</span>
                    <span className="text-sm font-bold text-white">{d.images.toLocaleString()}</span>
                  </div>
                  <div className="h-3 rounded-full bg-white/10 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={isInView ? { width: `${(d.images / maxImages) * 100}%` } : { width: 0 }}
                      transition={{ delay: 0.3 + i * 0.12, duration: 0.8, ease: 'easeOut' }}
                      className="h-full rounded-full"
                      style={{ background: `rgba(255,255,255,${0.4 + i * 0.15})` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Classes per vegetable */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-7 border border-white/10"
          >
            <h3 className="text-lg font-bold text-white mb-5">Classes per Vegetable</h3>
            <div className="space-y-5">
              {datasets.map((dataset, i) => (
                <motion.div
                  key={dataset.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                  transition={{ delay: 0.3 + i * 0.08, duration: 0.5 }}
                >
                  <div className="flex items-center gap-3 mb-1.5">
                    <img
                      src={dataset.thumbnail}
                      alt={dataset.name}
                      className="w-7 h-7 object-contain"
                    />
                    <span className="text-sm font-semibold text-white">
                      {dataset.name.replace(' Dataset', '')}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 ml-10">
                    {dataset.classes.map((cls, ci) => (
                      <span
                        key={cls}
                        className="px-2.5 py-1 rounded text-xs font-medium"
                        style={{
                          background: `rgba(255,255,255,${0.08 + ci * 0.04})`,
                          color: ci === 0 ? '#86efac' : ci === dataset.classes.length - 1 ? '#fca5a5' : 'rgba(255,255,255,0.75)',
                        }}
                      >
                        {cls}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// Dataset format section — animations replay
function FormatSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.15 })

  const formatFeatures = [
    {
      title: 'YOLO Annotation Format',
      description:
        'Each image has a matching text file with bounding box coordinates. This tells the AI exactly where the vegetable is and what freshness level it has.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      title: 'Train / Val / Test Split',
      description:
        'Datasets are pre-divided into training (70%), validation (20%), and test (10%) sets so you can start working with them right away.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2z" />
        </svg>
      ),
    },
    {
      title: 'Consistent Resolution',
      description:
        'All images are resized to 640x640 pixels to match what the AI model expects. Original proportions are preserved with padding.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
        </svg>
      ),
    },
    {
      title: 'Augmentation Ready',
      description:
        'Base images can be enhanced with rotation, flipping, and brightness changes to create more training variations and improve model robustness.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
    },
  ]

  return (
    <section
      ref={ref}
      className="min-h-screen flex items-center snap-start relative overflow-hidden"
      style={{ background: COLORS.light }}
    >
      <div className="max-w-7xl mx-auto px-6 py-16 w-full relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <span
            className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-4"
            style={{ background: `${COLORS.primary}12`, color: COLORS.primary }}
          >
            Dataset Structure
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3" style={{ color: COLORS.primary }}>
            Ready-to-Use Format
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto text-lg">
            All datasets follow a standardized structure for seamless
            integration with YOLOv8 and other detection frameworks.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">
          {/* Feature cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {formatFeatures.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ delay: 0.15 + i * 0.08, duration: 0.5 }}
                className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-3"
                  style={{ background: `${COLORS.primary}10`, color: COLORS.primary }}
                >
                  {feature.icon}
                </div>
                <h3 className="font-bold text-sm mb-1.5" style={{ color: COLORS.primary }}>
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Directory structure preview */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm"
          >
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: COLORS.medium }}>
              Directory Structure
            </h3>
            <div
              className="font-mono text-sm leading-7 rounded-xl p-5"
              style={{ background: COLORS.primary, color: 'rgba(255,255,255,0.85)' }}
            >
              <div className="text-green-300">dataset/</div>
              <div className="ml-4">
                <span className="text-blue-300">train/</span>
                <div className="ml-4 text-white/60">
                  <div>images/</div>
                  <div className="ml-4 text-white/40">img_001.jpg</div>
                  <div className="ml-4 text-white/40">img_002.jpg</div>
                  <div>labels/</div>
                  <div className="ml-4 text-white/40">img_001.txt</div>
                  <div className="ml-4 text-white/40">img_002.txt</div>
                </div>
              </div>
              <div className="ml-4">
                <span className="text-blue-300">val/</span>
                <span className="text-white/40 ml-2">...</span>
              </div>
              <div className="ml-4">
                <span className="text-blue-300">test/</span>
                <span className="text-white/40 ml-2">...</span>
              </div>
              <div className="ml-4">
                <span className="text-yellow-300">data.yaml</span>
              </div>
            </div>
            <div className="mt-3 p-3.5 rounded-xl bg-gray-50 border border-gray-100">
              <p className="text-xs font-mono text-gray-500">
                <span className="text-gray-700 font-semibold">Annotation format:</span>{' '}
                &lt;class_id&gt; &lt;center_x&gt; &lt;center_y&gt; &lt;width&gt; &lt;height&gt;
              </p>
              <p className="text-xs font-mono text-gray-400 mt-1">
                Example: 0 0.512 0.487 0.324 0.418
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// Main Dataset Page
export default function DatasetPage() {
  const [selectedDataset, setSelectedDataset] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)

  const handleSelectDataset = (dataset) => {
    setSelectedDataset(dataset)
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setTimeout(() => setSelectedDataset(null), 300)
  }

  useEffect(() => {
    const html = document.documentElement
    html.style.scrollSnapType = 'y mandatory'
    html.style.overflowY = 'scroll'
    html.style.scrollBehavior = 'smooth'
    window.scrollTo(0, 0)
    return () => {
      html.style.scrollSnapType = ''
      html.style.overflowY = ''
      html.style.scrollBehavior = ''
    }
  }, [])

  return (
    <div className="bg-background">
      <Header currentPage="dataset" />
      <HeroSection />
      <DatasetGridSection onSelectDataset={handleSelectDataset} />
      <StatsSection />
      <FormatSection />
      <DatasetModal
        dataset={selectedDataset}
        isOpen={modalOpen}
        onClose={handleCloseModal}
      />
    </div>
  )
}
